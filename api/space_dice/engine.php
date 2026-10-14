<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function sd_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS sd_rolls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            roll_uuid VARCHAR(64) UNIQUE,
            mode VARCHAR(20) NOT NULL,
            stake_amount DECIMAL(18,4) NOT NULL,
            target_value VARCHAR(32) NOT NULL,
            condition VARCHAR(10) NOT NULL,
            roll_result VARCHAR(32) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout_amount DECIMAL(18,4) NOT NULL,
            is_win INT NOT NULL DEFAULT 0,
            is_supernova INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS sd_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            mode VARCHAR(20) NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            roll_val VARCHAR(20) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            is_supernova INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM sd_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***9921', 'mode' => 'slider', 'stake' => 100.0, 'roll' => '88.42', 'mult' => 19.5, 'payout' => 1950.0, 'nova' => 1],
                ['user_name' => '018***3419', 'mode' => 'twindice', 'stake' => 50.0,  'roll' => '6+6=12', 'mult' => 30.0, 'payout' => 1500.0, 'nova' => 0],
                ['user_name' => '019***7712', 'mode' => 'slider', 'stake' => 200.0, 'roll' => '24.15', 'mult' => 2.05, 'payout' => 410.0,  'nova' => 0],
                ['user_name' => '016***8844', 'mode' => 'twindice', 'stake' => 100.0, 'roll' => '3+4=7',  'mult' => 5.8,  'payout' => 580.0,  'nova' => 0],
                ['user_name' => '013***1102', 'mode' => 'slider', 'stake' => 50.0,  'roll' => '95.12', 'mult' => 49.0, 'payout' => 2450.0, 'nova' => 1],
                ['user_name' => '017***5566', 'mode' => 'twindice', 'stake' => 20.0,  'roll' => '1+1=2',  'mult' => 30.0, 'payout' => 600.0,  'nova' => 0],
            ];
            $stmt = $pdo->prepare("INSERT INTO sd_history (user_id, user_name, mode, stake, roll_val, multiplier, payout, is_supernova) VALUES (1, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['mode'], $s['stake'], $s['roll'], $s['mult'], $s['payout'], $s['nova']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function sd_get_balance(int $userId): float
{
    $db = sd_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return 0.0;
    return max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));
}

function sd_debit_balance(int $userId, float $amount): bool
{
    $db = sd_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = CASE WHEN wallet_balance >= ? THEN wallet_balance - ? ELSE 0 END, 
        game_balance = CASE WHEN game_balance >= ? THEN game_balance - ? ELSE 0 END, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $amount, $amount, $userId]);
}

function sd_credit_balance(int $userId, float $amount): bool
{
    $db = sd_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = wallet_balance + ?, 
        game_balance = game_balance + ?, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $userId]);
}

/**
 * Execute a Space Dice Roll
 */
function sd_execute_roll(array $user, array $params): array
{
    $db = sd_db();
    $userId = (int)$user['id'];
    $stake = max(1.0, round((float)($params['stake'] ?? 10.0), 2));
    $mode = (string)($params['mode'] ?? 'slider'); // 'slider' or 'twindice'

    $balance = sd_get_balance($userId);
    if ($balance < $stake) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    $db->beginTransaction();
    try {
        sd_debit_balance($userId, $stake);

        $isWin = false;
        $multiplier = 0.0;
        $rollDisplay = '';
        $isSupernova = false;

        if ($mode === 'slider') {
            // Mode A: Cosmic Slider (Roll Under / Roll Over 0.00 - 99.99)
            $condition = (string)($params['condition'] ?? 'under'); // 'under' or 'over'
            $target = round((float)($params['target'] ?? 50.0), 2);
            $target = max(1.0, min(98.0, $target));

            // Calculate Win Chance & Multiplier
            $winChance = ($condition === 'under') ? $target : (100.0 - $target);
            $winChance = max(1.0, min(98.0, $winChance));
            $baseMult = round(98.5 / $winChance, 2);

            // Cryptographically secure RNG roll: 0.00 to 99.99
            $rollInt = random_int(0, 9999);
            $rollFloat = $rollInt / 100.0;
            $rollDisplay = number_format($rollFloat, 2, '.', '');

            if ($condition === 'under') {
                $isWin = ($rollFloat < $target);
            } else {
                $isWin = ($rollFloat > $target);
            }

            if ($isWin) {
                $multiplier = $baseMult;
                // Chance of Galactic Supernova surge on high rolls
                if (random_int(1, 40) === 1) {
                    $isSupernova = true;
                    $multiplier = round($multiplier * 1.5, 2);
                }
            }

            $targetDisplay = $condition . ' ' . $target;
        } else {
            // Mode B: Twin Pulsar Dice (2x 6-sided dice)
            $betType = (string)($params['bet_type'] ?? 'seven'); // 'low', 'seven', 'high', 'even', 'odd', 'pair', 'exact'
            $exactTarget = (int)($params['exact_target'] ?? 7);

            $d1 = random_int(1, 6);
            $d2 = random_int(1, 6);
            $sum = $d1 + $d2;
            $rollDisplay = $d1 . '+' . $d2 . '=' . $sum;
            $condition = $betType;
            $targetDisplay = $betType . ($betType === 'exact' ? " ($exactTarget)" : '');

            switch ($betType) {
                case 'low': // 2-6
                    if ($sum >= 2 && $sum <= 6) {
                        $isWin = true;
                        $multiplier = 2.30;
                    }
                    break;
                case 'high': // 8-12
                    if ($sum >= 8 && $sum <= 12) {
                        $isWin = true;
                        $multiplier = 2.30;
                    }
                    break;
                case 'seven': // 7
                    if ($sum === 7) {
                        $isWin = true;
                        $multiplier = 5.80;
                    }
                    break;
                case 'even':
                    if ($sum % 2 === 0) {
                        $isWin = true;
                        $multiplier = 1.96;
                    }
                    break;
                case 'odd':
                    if ($sum % 2 === 1) {
                        $isWin = true;
                        $multiplier = 1.96;
                    }
                    break;
                case 'pair':
                    if ($d1 === $d2) {
                        $isWin = true;
                        $multiplier = 5.80;
                    }
                    break;
                case 'exact':
                    if ($sum === $exactTarget) {
                        $isWin = true;
                        // Payout according to standard 2D6 combinatorial probability
                        $odds = [
                            2 => 30.0, 12 => 30.0,
                            3 => 16.0, 11 => 16.0,
                            4 => 11.0, 10 => 11.0,
                            5 => 8.5,  9 => 8.5,
                            6 => 6.8,  8 => 6.8,
                            7 => 5.8
                        ];
                        $multiplier = $odds[$exactTarget] ?? 5.8;
                    }
                    break;
            }

            if ($isWin && random_int(1, 35) === 1) {
                $isSupernova = true;
                $multiplier = round($multiplier * 2.0, 2);
            }
        }

        $payout = $isWin ? round($stake * $multiplier, 2) : 0.0;
        if ($payout > 0) {
            sd_credit_balance($userId, $payout);
        }

        // Record roll
        $rollUuid = 'sd_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO sd_rolls (user_id, roll_uuid, mode, stake_amount, target_value, condition, roll_result, multiplier, payout_amount, is_win, is_supernova) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $rollUuid, $mode, $stake, $targetDisplay, $condition, $rollDisplay, $multiplier, $payout, $isWin ? 1 : 0, $isSupernova ? 1 : 0]);

        // Record history
        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Cosmonaut');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

        $stmtHist = $db->prepare("INSERT INTO sd_history (user_id, user_name, mode, stake, roll_val, multiplier, payout, is_supernova) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmtHist->execute([$userId, $masked, $mode, $stake, $rollDisplay, $multiplier, $payout, $isSupernova ? 1 : 0]);

        $db->commit();

        $newBal = sd_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $isWin ? 'Cosmic Win!' : 'Cosmic Miss!',
            'data' => [
                'roll_uuid' => $rollUuid,
                'mode' => $mode,
                'stake' => $stake,
                'roll_result' => $rollDisplay,
                'is_win' => $isWin,
                'multiplier' => $multiplier,
                'payout' => $payout,
                'is_supernova' => $isSupernova,
                'dices' => ($mode === 'twindice') ? [$d1 ?? 1, $d2 ?? 1] : null,
                'slider_roll' => ($mode === 'slider') ? (float)$rollDisplay : null,
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Space Dice roll error: ' . $e->getMessage()];
    }
}

function sd_get_stats(): array
{
    $db = sd_db();
    $stmt = $db->query("SELECT user_name, mode, roll_val, multiplier, payout, is_supernova, created_at FROM sd_history ORDER BY id DESC LIMIT 15");
    $recent = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    return [
        'recent' => $recent,
        'jackpot_pool' => round(555555.00 + ((time() % 86400) * 0.8), 2)
    ];
}
