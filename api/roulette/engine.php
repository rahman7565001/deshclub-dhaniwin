<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function roulette_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS roulette_spins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            spin_uuid VARCHAR(64) UNIQUE,
            winning_number INT NOT NULL,
            winning_color VARCHAR(10) NOT NULL,
            total_stake DECIMAL(18,4) NOT NULL,
            total_payout DECIMAL(18,4) NOT NULL,
            net_profit DECIMAL(18,4) NOT NULL,
            bets_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS roulette_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            winning_number INT NOT NULL,
            winning_color VARCHAR(10) NOT NULL,
            total_stake DECIMAL(18,4) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed realistic spin history if empty for vibrant analytics & hot/cold numbers
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM roulette_history")->fetchColumn();
        if ($cnt === 0) {
            $reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            $seeds = [
                ['user_name' => '017***5521', 'num' => 7,  'stake' => 100.0, 'payout' => 3600.0],
                ['user_name' => '018***8812', 'num' => 26, 'stake' => 50.0,  'payout' => 100.0],
                ['user_name' => '019***4439', 'num' => 0,  'stake' => 20.0,  'payout' => 720.0],
                ['user_name' => '016***9910', 'num' => 14, 'stake' => 200.0, 'payout' => 400.0],
                ['user_name' => '017***1147', 'num' => 32, 'stake' => 150.0, 'payout' => 450.0],
                ['user_name' => '013***3382', 'num' => 17, 'stake' => 500.0, 'payout' => 18000.0],
                ['user_name' => '018***7764', 'num' => 22, 'stake' => 80.0,  'payout' => 160.0],
                ['user_name' => '019***2255', 'num' => 9,  'stake' => 30.0,  'payout' => 90.0],
                ['user_name' => '015***6691', 'num' => 3,  'stake' => 100.0, 'payout' => 3600.0],
                ['user_name' => '017***4400', 'num' => 11, 'stake' => 60.0,  'payout' => 120.0],
            ];
            $stmt = $pdo->prepare("INSERT INTO roulette_history (user_id, user_name, winning_number, winning_color, total_stake, payout) VALUES (1, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $color = ($s['num'] === 0) ? 'green' : (in_array($s['num'], $reds, true) ? 'red' : 'black');
                $stmt->execute([$s['user_name'], $s['num'], $color, $s['stake'], $s['payout']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function roulette_red_numbers(): array
{
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
}

function roulette_black_numbers(): array
{
    return [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
}

function roulette_get_color(int $num): string
{
    if ($num === 0) return 'green';
    return in_array($num, roulette_red_numbers(), true) ? 'red' : 'black';
}

function roulette_get_balance(int $userId): float
{
    $db = roulette_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return 0.0;
    return max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));
}

function roulette_debit_balance(int $userId, float $amount): bool
{
    $db = roulette_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = CASE WHEN wallet_balance >= ? THEN wallet_balance - ? ELSE 0 END, 
        game_balance = CASE WHEN game_balance >= ? THEN game_balance - ? ELSE 0 END, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $amount, $amount, $userId]);
}

function roulette_credit_balance(int $userId, float $amount): bool
{
    $db = roulette_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = wallet_balance + ?, 
        game_balance = game_balance + ?, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $userId]);
}

/**
 * Evaluate single bet against winning number
 * Returns array: ['is_won' => bool, 'multiplier' => float, 'payout' => float]
 */
function roulette_evaluate_bet(array $bet, int $winNum): array
{
    $type = (string)($bet['type'] ?? '');
    $target = $bet['target'] ?? null;
    $amount = (float)($bet['amount'] ?? 0);
    if ($amount <= 0) {
        return ['is_won' => false, 'multiplier' => 0.0, 'payout' => 0.0];
    }

    $color = roulette_get_color($winNum);
    $isWon = false;
    $multiplier = 0.0; // Payout multiplier including returned stake

    switch ($type) {
        case 'straight':
            // 35:1 profit -> 36x payout
            $n = (int)$target;
            if ($n === $winNum) {
                $isWon = true;
                $multiplier = 36.0;
            }
            break;

        case 'split':
            // 17:1 profit -> 18x payout
            $nums = is_array($target) ? $target : explode(',', (string)$target);
            $nums = array_map('intval', $nums);
            if (in_array($winNum, $nums, true)) {
                $isWon = true;
                $multiplier = 18.0;
            }
            break;

        case 'street':
            // 11:1 profit -> 12x payout
            $nums = is_array($target) ? $target : explode(',', (string)$target);
            $nums = array_map('intval', $nums);
            if (in_array($winNum, $nums, true)) {
                $isWon = true;
                $multiplier = 12.0;
            }
            break;

        case 'corner':
            // 8:1 profit -> 9x payout
            $nums = is_array($target) ? $target : explode(',', (string)$target);
            $nums = array_map('intval', $nums);
            if (in_array($winNum, $nums, true)) {
                $isWon = true;
                $multiplier = 9.0;
            }
            break;

        case 'sixline':
            // 5:1 profit -> 6x payout
            $nums = is_array($target) ? $target : explode(',', (string)$target);
            $nums = array_map('intval', $nums);
            if (in_array($winNum, $nums, true)) {
                $isWon = true;
                $multiplier = 6.0;
            }
            break;

        case 'red':
            if ($winNum > 0 && $color === 'red') {
                $isWon = true;
                $multiplier = 2.0;
            }
            break;

        case 'black':
            if ($winNum > 0 && $color === 'black') {
                $isWon = true;
                $multiplier = 2.0;
            }
            break;

        case 'even':
            if ($winNum > 0 && $winNum % 2 === 0) {
                $isWon = true;
                $multiplier = 2.0;
            }
            break;

        case 'odd':
            if ($winNum > 0 && $winNum % 2 === 1) {
                $isWon = true;
                $multiplier = 2.0;
            }
            break;

        case 'low': // 1-18
            if ($winNum >= 1 && $winNum <= 18) {
                $isWon = true;
                $multiplier = 2.0;
            }
            break;

        case 'high': // 19-36
            if ($winNum >= 19 && $winNum <= 36) {
                $isWon = true;
                $multiplier = 2.0;
            }
            break;

        case 'dozen1': // 1-12
            if ($winNum >= 1 && $winNum <= 12) {
                $isWon = true;
                $multiplier = 3.0;
            }
            break;

        case 'dozen2': // 13-24
            if ($winNum >= 13 && $winNum <= 24) {
                $isWon = true;
                $multiplier = 3.0;
            }
            break;

        case 'dozen3': // 25-36
            if ($winNum >= 25 && $winNum <= 36) {
                $isWon = true;
                $multiplier = 3.0;
            }
            break;

        case 'col1': // numbers where n % 3 === 1
            if ($winNum > 0 && $winNum % 3 === 1) {
                $isWon = true;
                $multiplier = 3.0;
            }
            break;

        case 'col2': // numbers where n % 3 === 2
            if ($winNum > 0 && $winNum % 3 === 2) {
                $isWon = true;
                $multiplier = 3.0;
            }
            break;

        case 'col3': // numbers where n % 3 === 0
            if ($winNum > 0 && $winNum % 3 === 0) {
                $isWon = true;
                $multiplier = 3.0;
            }
            break;
    }

    $payout = $isWon ? round($amount * $multiplier, 2) : 0.0;
    return [
        'is_won' => $isWon,
        'multiplier' => $multiplier,
        'payout' => $payout
    ];
}

/**
 * Execute a complete Roulette spin
 */
function roulette_execute_spin(array $user, array $bets): array
{
    $db = roulette_db();
    $userId = (int)$user['id'];

    if (empty($bets)) {
        return ['code' => 400, 'msg' => 'Please place at least one bet on the roulette table.'];
    }

    $totalStake = 0.0;
    $validBets = [];
    foreach ($bets as $b) {
        $amt = round((float)($b['amount'] ?? 0), 2);
        if ($amt > 0) {
            $totalStake += $amt;
            $validBets[] = [
                'type' => (string)($b['type'] ?? 'straight'),
                'target' => $b['target'] ?? 0,
                'amount' => $amt
            ];
        }
    }

    $totalStake = round($totalStake, 2);
    if ($totalStake <= 0 || empty($validBets)) {
        return ['code' => 400, 'msg' => 'Invalid bet amount.'];
    }

    $currentBalance = roulette_get_balance($userId);
    if ($currentBalance < $totalStake) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    $db->beginTransaction();
    try {
        roulette_debit_balance($userId, $totalStake);

        // Cryptographically secure RNG spin 0 to 36
        $winningNumber = random_int(0, 36);
        $winningColor = roulette_get_color($winningNumber);

        $totalPayout = 0.0;
        $evaluatedBets = [];

        foreach ($validBets as $b) {
            $eval = roulette_evaluate_bet($b, $winningNumber);
            $evaluatedBets[] = array_merge($b, $eval);
            $totalPayout += $eval['payout'];
        }

        $totalPayout = round($totalPayout, 2);
        $netProfit = round($totalPayout - $totalStake, 2);

        if ($totalPayout > 0) {
            roulette_credit_balance($userId, $totalPayout);
        }

        // Record Spin
        $spinUuid = 'rlt_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO roulette_spins (user_id, spin_uuid, winning_number, winning_color, total_stake, total_payout, net_profit, bets_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $userId,
            $spinUuid,
            $winningNumber,
            $winningColor,
            $totalStake,
            $totalPayout,
            $netProfit,
            json_encode($evaluatedBets, JSON_UNESCAPED_UNICODE)
        ]);

        // Record into history
        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Player');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

        $stmtHist = $db->prepare("INSERT INTO roulette_history (user_id, user_name, winning_number, winning_color, total_stake, payout) VALUES (?, ?, ?, ?, ?, ?)");
        $stmtHist->execute([$userId, $masked, $winningNumber, $winningColor, $totalStake, $totalPayout]);

        $db->commit();

        $newBalance = roulette_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $totalPayout > 0 ? 'Congratulations! You won!' : 'Better luck next spin!',
            'data' => [
                'spin_uuid' => $spinUuid,
                'winning_number' => $winningNumber,
                'winning_color' => $winningColor,
                'total_stake' => $totalStake,
                'total_payout' => $totalPayout,
                'net_profit' => $netProfit,
                'is_win' => ($totalPayout > 0),
                'bets' => $evaluatedBets,
                'wallet_balance' => $newBalance
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Spin transaction error: ' . $e->getMessage()];
    }
}

/**
 * Fetch hot & cold numbers and stats from past history
 */
function roulette_get_stats(): array
{
    $db = roulette_db();
    $stmt = $db->query("SELECT winning_number, winning_color FROM roulette_history ORDER BY id DESC LIMIT 50");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    $recent = [];
    $freq = array_fill(0, 37, 0);
    $redCount = 0;
    $blackCount = 0;
    $greenCount = 0;
    $evenCount = 0;
    $oddCount = 0;

    foreach ($rows as $r) {
        $num = (int)$r['winning_number'];
        $recent[] = [
            'number' => $num,
            'color' => $r['winning_color']
        ];
        if (isset($freq[$num])) {
            $freq[$num]++;
        }
        if ($num === 0) {
            $greenCount++;
        } else {
            if ($r['winning_color'] === 'red') $redCount++;
            else $blackCount++;

            if ($num % 2 === 0) $evenCount++;
            else $oddCount++;
        }
    }

    // Sort to find hot and cold numbers
    arsort($freq);
    $hot = [];
    $i = 0;
    foreach ($freq as $num => $count) {
        if ($i++ < 5) {
            $hot[] = ['number' => $num, 'color' => roulette_get_color($num), 'hits' => $count];
        }
    }

    asort($freq);
    $cold = [];
    $j = 0;
    foreach ($freq as $num => $count) {
        if ($j++ < 5) {
            $cold[] = ['number' => $num, 'color' => roulette_get_color($num), 'hits' => $count];
        }
    }

    $totalSample = max(1, count($rows));
    return [
        'recent' => array_slice($recent, 0, 15),
        'hot' => $hot,
        'cold' => $cold,
        'percentages' => [
            'red' => round(($redCount / $totalSample) * 100, 1),
            'black' => round(($blackCount / $totalSample) * 100, 1),
            'green' => round(($greenCount / $totalSample) * 100, 1),
            'even' => round(($evenCount / $totalSample) * 100, 1),
            'odd' => round(($oddCount / $totalSample) * 100, 1),
        ]
    ];
}
