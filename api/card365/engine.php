<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function card365_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS card365_rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            round_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            game_mode VARCHAR(32) NOT NULL,
            bet_choice VARCHAR(32) NOT NULL,
            stake_amount DECIMAL(18,4) NOT NULL,
            result_json TEXT NOT NULL,
            win_amount DECIMAL(18,4) DEFAULT 0,
            multiplier DECIMAL(10,2) DEFAULT 0,
            status VARCHAR(20) DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS card365_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            game_mode VARCHAR(32) NOT NULL,
            bet_choice VARCHAR(32) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed some history ticker rows if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM card365_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***5541', 'game_mode' => 'teenpatti', 'bet_choice' => 'Player Trail', 'multiplier' => 30.00, 'payout' => 3000.00],
                ['user_name' => '018***1120', 'game_mode' => 'andarbahar', 'bet_choice' => 'Andar', 'multiplier' => 1.95, 'payout' => 975.00],
                ['user_name' => '019***4439', 'game_mode' => 'dragontiger', 'bet_choice' => 'Dragon', 'multiplier' => 1.98, 'payout' => 1980.00],
                ['user_name' => '016***8823', 'game_mode' => 'sevenup', 'bet_choice' => 'Lucky 7', 'multiplier' => 5.00, 'payout' => 1000.00],
                ['user_name' => '013***6618', 'game_mode' => 'teenpatti', 'bet_choice' => 'Player Win', 'multiplier' => 1.95, 'payout' => 585.00],
            ];
            $stmt = $pdo->prepare("INSERT INTO card365_history (user_id, user_name, game_mode, bet_choice, multiplier, payout) VALUES (1, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['game_mode'], $s['bet_choice'], $s['multiplier'], $s['payout']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function card365_get_balance(int $userId): float
{
    $db = card365_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return 0.0;
    return max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));
}

function card365_debit_balance(int $userId, float $amount): bool
{
    $db = card365_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = CASE WHEN wallet_balance >= ? THEN wallet_balance - ? ELSE 0 END, 
        game_balance = CASE WHEN game_balance >= ? THEN game_balance - ? ELSE 0 END, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $amount, $amount, $userId]);
}

function card365_credit_balance(int $userId, float $amount): bool
{
    $db = card365_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = wallet_balance + ?, 
        game_balance = game_balance + ?, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $userId]);
}

/**
 * Standard 52-card Deck Generator
 */
function card365_new_deck(): array
{
    $suits = ['♠', '♥', '♦', '♣'];
    $ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    $values = ['2' => 2, '3' => 3, '4' => 4, '5' => 5, '6' => 6, '7' => 7, '8' => 8, '9' => 9, '10' => 10, 'J' => 11, 'Q' => 12, 'K' => 13, 'A' => 14];

    $deck = [];
    foreach ($suits as $s) {
        $color = ($s === '♥' || $s === '♦') ? 'red' : 'black';
        foreach ($ranks as $r) {
            $deck[] = [
                'suit' => $s,
                'rank' => $r,
                'value' => $values[$r],
                'color' => $color,
                'code' => $r . $s
            ];
        }
    }
    shuffle($deck);
    return $deck;
}

/**
 * Evaluate Teen Patti Hand Rank
 * 6: Trail (Three of a Kind)
 * 5: Pure Sequence (Straight Flush)
 * 4: Sequence (Straight)
 * 3: Color (Flush)
 * 2: Pair
 * 1: High Card
 */
function card365_eval_teen_patti(array $cards): array
{
    usort($cards, fn($a, $b) => $b['value'] <=> $a['value']);

    $v = [$cards[0]['value'], $cards[1]['value'], $cards[2]['value']];
    $s = [$cards[0]['suit'], $cards[1]['suit'], $cards[2]['suit']];

    $isFlush = ($s[0] === $s[1] && $s[1] === $s[2]);

    // Check Sequence (including A-2-3 and A-K-Q)
    $isSeq = false;
    if ($v[0] - $v[1] === 1 && $v[1] - $v[2] === 1) {
        $isSeq = true;
    } elseif ($v[0] === 14 && $v[1] === 3 && $v[2] === 2) {
        $isSeq = true; // A-3-2 low straight
    }

    if ($v[0] === $v[1] && $v[1] === $v[2]) {
        return ['tier' => 6, 'name' => 'Trail (Trio)', 'score' => 60000 + $v[0]];
    }
    if ($isFlush && $isSeq) {
        return ['tier' => 5, 'name' => 'Pure Sequence', 'score' => 50000 + $v[0]];
    }
    if ($isSeq) {
        return ['tier' => 4, 'name' => 'Sequence', 'score' => 40000 + $v[0]];
    }
    if ($isFlush) {
        return ['tier' => 3, 'name' => 'Color (Flush)', 'score' => 30000 + ($v[0]*100 + $v[1]*10 + $v[2])];
    }
    if ($v[0] === $v[1] || $v[1] === $v[2] || $v[0] === $v[2]) {
        $pairVal = ($v[0] === $v[1]) ? $v[0] : (($v[1] === $v[2]) ? $v[1] : $v[0]);
        $kicker = ($v[0] === $v[1]) ? $v[2] : (($v[1] === $v[2]) ? $v[0] : $v[1]);
        return ['tier' => 2, 'name' => 'Pair', 'score' => 20000 + ($pairVal * 100 + $kicker)];
    }
    return ['tier' => 1, 'name' => 'High Card (' . $cards[0]['rank'] . ')', 'score' => 10000 + ($v[0]*100 + $v[1]*10 + $v[2])];
}

/**
 * Play a round of Teen Patti
 */
function card365_play_teen_patti(array $user, float $stake, string $betChoice): array
{
    $deck = card365_new_deck();
    $playerCards = [array_pop($deck), array_pop($deck), array_pop($deck)];
    $dealerCards = [array_pop($deck), array_pop($deck), array_pop($deck)];

    $playerHand = card365_eval_teen_patti($playerCards);
    $dealerHand = card365_eval_teen_patti($dealerCards);

    $isPlayerWin = ($playerHand['score'] > $dealerHand['score']);
    $isTie = ($playerHand['score'] === $dealerHand['score']);

    $mult = 0.0;
    $isWin = false;

    // Normal Bet: Player Win
    if ($betChoice === 'player') {
        if ($isPlayerWin) {
            $isWin = true;
            $mult = 1.95;
        } elseif ($isTie) {
            $isWin = true;
            $mult = 1.00; // refund on tie
        }
    } elseif ($betChoice === 'dealer') {
        if (!$isPlayerWin && !$isTie) {
            $isWin = true;
            $mult = 1.95;
        } elseif ($isTie) {
            $isWin = true;
            $mult = 1.00;
        }
    } elseif ($betChoice === 'pair_plus') {
        // Side bet on Player having Pair or better!
        if ($playerHand['tier'] >= 6) { $isWin = true; $mult = 30.0; } // Trail 30x
        elseif ($playerHand['tier'] >= 5) { $isWin = true; $mult = 15.0; } // Pure Seq 15x
        elseif ($playerHand['tier'] >= 4) { $isWin = true; $mult = 6.0; }  // Seq 6x
        elseif ($playerHand['tier'] >= 3) { $isWin = true; $mult = 3.0; }  // Color 3x
        elseif ($playerHand['tier'] >= 2) { $isWin = true; $mult = 2.0; }  // Pair 2x
    }

    $winAmount = $isWin ? round($stake * $mult, 2) : 0.0;

    return [
        'mode' => 'teenpatti',
        'player_cards' => $playerCards,
        'dealer_cards' => $dealerCards,
        'player_hand' => $playerHand,
        'dealer_hand' => $dealerHand,
        'winner' => $isPlayerWin ? 'player' : ($isTie ? 'tie' : 'dealer'),
        'bet_choice' => $betChoice,
        'is_win' => $isWin,
        'multiplier' => $mult,
        'win_amount' => $winAmount
    ];
}

/**
 * Play a round of Andar Bahar
 */
function card365_play_andar_bahar(array $user, float $stake, string $betChoice): array
{
    $deck = card365_new_deck();
    $jokerCard = array_pop($deck);
    $jokerRank = $jokerCard['rank'];

    $andarCards = [];
    $baharCards = [];

    $winner = '';
    $winningCard = null;
    $turn = 'andar'; // Andar gets dealt first

    while (!empty($deck)) {
        $c = array_pop($deck);
        if ($turn === 'andar') {
            $andarCards[] = $c;
            if ($c['rank'] === $jokerRank) {
                $winner = 'andar';
                $winningCard = $c;
                break;
            }
            $turn = 'bahar';
        } else {
            $baharCards[] = $c;
            if ($c['rank'] === $jokerRank) {
                $winner = 'bahar';
                $winningCard = $c;
                break;
            }
            $turn = 'andar';
        }
    }

    $isWin = ($betChoice === $winner);
    $mult = 0.0;
    if ($isWin) {
        $mult = ($winner === 'andar') ? 1.95 : 2.00;
    }
    $winAmount = $isWin ? round($stake * $mult, 2) : 0.0;

    return [
        'mode' => 'andarbahar',
        'joker' => $jokerCard,
        'andar_cards' => $andarCards,
        'bahar_cards' => $baharCards,
        'winner' => $winner,
        'winning_card' => $winningCard,
        'total_cards_dealt' => count($andarCards) + count($baharCards),
        'bet_choice' => $betChoice,
        'is_win' => $isWin,
        'multiplier' => $mult,
        'win_amount' => $winAmount
    ];
}

/**
 * Play a round of Dragon Tiger
 */
function card365_play_dragon_tiger(array $user, float $stake, string $betChoice): array
{
    $deck = card365_new_deck();
    $dragonCard = array_pop($deck);
    $tigerCard = array_pop($deck);

    $winner = '';
    if ($dragonCard['value'] > $tigerCard['value']) {
        $winner = 'dragon';
    } elseif ($tigerCard['value'] > $dragonCard['value']) {
        $winner = 'tiger';
    } else {
        $winner = 'tie';
    }

    $isWin = false;
    $mult = 0.0;

    if ($betChoice === $winner) {
        $isWin = true;
        if ($winner === 'tie') {
            $mult = 9.0;
        } else {
            $mult = 1.98;
        }
    } elseif ($winner === 'tie' && ($betChoice === 'dragon' || $betChoice === 'tiger')) {
        // Return 50% on tie
        $isWin = true;
        $mult = 0.50;
    }

    $winAmount = $isWin ? round($stake * $mult, 2) : 0.0;

    return [
        'mode' => 'dragontiger',
        'dragon_card' => $dragonCard,
        'tiger_card' => $tigerCard,
        'winner' => $winner,
        'bet_choice' => $betChoice,
        'is_win' => $isWin,
        'multiplier' => $mult,
        'win_amount' => $winAmount
    ];
}

/**
 * Play a round of 7 Up 7 Down
 */
function card365_play_seven_up(array $user, float $stake, string $betChoice): array
{
    $die1 = mt_rand(1, 6);
    $die2 = mt_rand(1, 6);
    $sum = $die1 + $die2;

    $outcome = '';
    if ($sum < 7) {
        $outcome = 'down';
    } elseif ($sum > 7) {
        $outcome = 'up';
    } else {
        $outcome = 'seven';
    }

    $isWin = ($betChoice === $outcome);
    $mult = 0.0;

    if ($isWin) {
        $mult = ($outcome === 'seven') ? 5.00 : 2.00;
    }

    $winAmount = $isWin ? round($stake * $mult, 2) : 0.0;

    return [
        'mode' => 'sevenup',
        'dice' => [$die1, $die2],
        'sum' => $sum,
        'outcome' => $outcome,
        'bet_choice' => $betChoice,
        'is_win' => $isWin,
        'multiplier' => $mult,
        'win_amount' => $winAmount
    ];
}

/**
 * Main Game Controller
 */
function card365_execute_bet(array $user, string $mode, string $betChoice, float $stake): array
{
    $db = card365_db();
    $userId = (int)$user['id'];
    $stake = max(1.0, round($stake, 2));

    $balance = card365_get_balance($userId);
    if ($balance < $stake) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    $validModes = ['teenpatti', 'andarbahar', 'dragontiger', 'sevenup'];
    if (!in_array($mode, $validModes, true)) {
        $mode = 'teenpatti';
    }

    $db->beginTransaction();
    try {
        card365_debit_balance($userId, $stake);

        $result = match($mode) {
            'andarbahar' => card365_play_andar_bahar($user, $stake, $betChoice),
            'dragontiger' => card365_play_dragon_tiger($user, $stake, $betChoice),
            'sevenup' => card365_play_seven_up($user, $stake, $betChoice),
            default => card365_play_teen_patti($user, $stake, $betChoice)
        };

        $winAmount = (float)($result['win_amount'] ?? 0);
        $mult = (float)($result['multiplier'] ?? 0);

        if ($winAmount > 0) {
            card365_credit_balance($userId, $winAmount);

            // Log to public winners history
            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Player');
            $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
            $stmt = $db->prepare("INSERT INTO card365_history (user_id, user_name, game_mode, bet_choice, multiplier, payout) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $masked, $mode, $betChoice, $mult, $winAmount]);
        }

        $roundUuid = 'c365_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO card365_rounds (round_uuid, user_id, game_mode, bet_choice, stake_amount, result_json, win_amount, multiplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$roundUuid, $userId, $mode, $betChoice, $stake, json_encode($result), $winAmount, $mult]);

        $db->commit();

        $newBal = card365_get_balance($userId);

        return [
            'code' => 0,
            'msg' => 'Bet processed',
            'data' => array_merge($result, [
                'round_uuid' => $roundUuid,
                'stake' => $stake,
                'wallet_balance' => $newBal
            ])
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Game error: ' . $e->getMessage()];
    }
}
