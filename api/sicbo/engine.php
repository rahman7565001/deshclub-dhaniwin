<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function sb_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS sb_rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            round_uuid VARCHAR(64) UNIQUE,
            dice_1 INT NOT NULL,
            dice_2 INT NOT NULL,
            dice_3 INT NOT NULL,
            sum_total INT NOT NULL,
            is_triple INT NOT NULL DEFAULT 0,
            total_stake DECIMAL(18,4) NOT NULL,
            total_payout DECIMAL(18,4) NOT NULL,
            bets_json TEXT NOT NULL,
            lightning_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS sb_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            dice_result VARCHAR(20) NOT NULL,
            sum_total INT NOT NULL,
            outcome_type VARCHAR(20) NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM sb_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***1102', 'dice' => '4,5,6', 'sum' => 15, 'outcome' => 'BIG',    'stake' => 100.0, 'payout' => 200.0],
                ['user_name' => '018***4433', 'dice' => '2,2,2', 'sum' => 6,  'outcome' => 'TRIPLE', 'stake' => 20.0,  'payout' => 3600.0],
                ['user_name' => '019***9921', 'dice' => '1,3,4', 'sum' => 8,  'outcome' => 'SMALL',  'stake' => 50.0,  'payout' => 100.0],
                ['user_name' => '016***5588', 'dice' => '3,4,4', 'sum' => 11, 'outcome' => 'BIG',    'stake' => 200.0, 'payout' => 400.0],
                ['user_name' => '013***8844', 'dice' => '5,5,6', 'sum' => 16, 'outcome' => 'SUM 16', 'stake' => 50.0,  'payout' => 1500.0],
                ['user_name' => '017***7765', 'dice' => '1,2,5', 'sum' => 8,  'outcome' => 'EVEN',   'stake' => 100.0, 'payout' => 198.0],
            ];
            $stmt = $pdo->prepare("INSERT INTO sb_history (user_id, user_name, dice_result, sum_total, outcome_type, stake, payout) VALUES (1, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['dice'], $s['sum'], $s['outcome'], $s['stake'], $s['payout']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function sb_get_balance(int $userId): float
{
    $db = sb_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function sb_debit_balance(int $userId, float $amount): bool
{
    $db = sb_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return false;

    $wb = (float)($u['wallet_balance'] ?? 0);
    $gb = (float)($u['game_balance'] ?? 0);
    $maxBal = max($wb, $gb);

    if ($maxBal < $amount) {
        return false;
    }

    $newBal = round($maxBal - $amount, 4);
    $upd = $db->prepare("UPDATE api_users SET wallet_balance = ?, game_balance = ? WHERE id = ? OR user_id = ?");
    $upd->execute([$newBal, $newBal, $userId, $userId]);
    return true;
}

function sb_credit_balance(int $userId, float $amount): bool
{
    $db = sb_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return false;

    $maxBal = max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
    $newBal = round($maxBal + $amount, 4);

    $upd = $db->prepare("UPDATE api_users SET wallet_balance = ?, game_balance = ? WHERE id = ? OR user_id = ?");
    $upd->execute([$newBal, $newBal, $userId, $userId]);
    return true;
}

/**
 * Standard Sic Bo Base Multipliers
 */
function sb_base_odds(): array
{
    return [
        'small'       => 2.0,   // Sum 4-10 (loss if triple)
        'big'         => 2.0,   // Sum 11-17 (loss if triple)
        'even'        => 1.98,  // Sum is even (loss if triple)
        'odd'         => 1.98,  // Sum is odd (loss if triple)
        'any_triple'  => 31.0,  // Any triple 1-6
        'triple_1'    => 181.0, 'triple_2' => 181.0, 'triple_3' => 181.0,
        'triple_4'    => 181.0, 'triple_5' => 181.0, 'triple_6' => 181.0,
        'double_1'    => 11.0,  'double_2' => 11.0,  'double_3' => 11.0,
        'double_4'    => 11.0,  'double_5' => 11.0,  'double_6' => 11.0,
        'sum_4'       => 61.0,  'sum_17'   => 61.0,
        'sum_5'       => 31.0,  'sum_16'   => 31.0,
        'sum_6'       => 19.0,  'sum_15'   => 19.0,
        'sum_7'       => 13.0,  'sum_14'   => 13.0,
        'sum_8'       => 9.0,   'sum_13'   => 9.0,
        'sum_9'       => 7.5,   'sum_12'   => 7.5,
        'sum_10'      => 7.0,   'sum_11'   => 7.0,
        'single_1'    => 2.0,   'single_2' => 2.0,   'single_3' => 2.0,
        'single_4'    => 2.0,   'single_5' => 2.0,   'single_6' => 2.0
    ];
}

/**
 * Generate Lightning Multiplier Surges (Super Sic Bo Feature)
 */
function sb_generate_lightning(): array
{
    $candidates = [
        'any_triple' => [50.0, 88.0],
        'triple_1' => [250.0, 500.0], 'triple_2' => [250.0, 500.0], 'triple_3' => [250.0, 500.0],
        'triple_4' => [250.0, 500.0], 'triple_5' => [250.0, 500.0], 'triple_6' => [250.0, 500.0],
        'sum_4' => [100.0, 200.0],    'sum_17' => [100.0, 200.0],
        'sum_5' => [50.0, 80.0],      'sum_16' => [50.0, 80.0],
        'sum_6' => [25.0, 40.0],      'sum_15' => [25.0, 40.0],
        'double_1' => [15.0, 25.0],   'double_6' => [15.0, 25.0],
    ];

    $lightning = [];
    $keys = array_keys($candidates);
    shuffle($keys);
    // Pick 1 to 3 spots to supercharge
    $count = random_int(1, 3);
    for ($i = 0; $i < $count; $i++) {
        $spot = $keys[$i];
        $boostOptions = $candidates[$spot];
        $boostVal = $boostOptions[array_rand($boostOptions)];
        $lightning[$spot] = $boostVal;
    }

    return $lightning;
}

/**
 * Execute Sic Bo Round
 */
function sb_execute_round(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $rawBets = $params['bets'] ?? [];

    if (!is_array($rawBets) || empty($rawBets)) {
        return ['code' => 1, 'msg' => 'Please place at least one bet.'];
    }

    $validSpots = array_keys(sb_base_odds());
    $totalStake = 0.0;
    $bets = [];

    foreach ($rawBets as $b) {
        $spot = strtolower(trim((string)($b['spot'] ?? '')));
        $amt = round((float)($b['amount'] ?? 0), 2);
        if ($amt >= 10.0 && in_array($spot, $validSpots, true)) {
            $bets[$spot] = ($bets[$spot] ?? 0.0) + $amt;
            $totalStake += $amt;
        }
    }

    if (empty($bets) || $totalStake < 10.0) {
        return ['code' => 1, 'msg' => 'Minimum total bet is 10.00'];
    }
    if ($totalStake > 100000.0) {
        return ['code' => 1, 'msg' => 'Maximum total bet is 100,000.00'];
    }

    $currentBalance = sb_get_balance($userId);
    if ($currentBalance < $totalStake) {
        return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
    }

    $db = sb_db();
    $db->beginTransaction();
    try {
        if (!sb_debit_balance($userId, $totalStake)) {
            $db->rollBack();
            return ['code' => 2, 'msg' => 'Failed to debit balance.'];
        }

        // Cryptographically secure RNG for 3 dice (1 to 6)
        $d1 = random_int(1, 6);
        $d2 = random_int(1, 6);
        $d3 = random_int(1, 6);
        $sum = $d1 + $d2 + $d3;

        $isTriple = ($d1 === $d2 && $d2 === $d3);
        $counts = array_count_values([$d1, $d2, $d3]); // e.g. [4 => 2, 6 => 1]

        // Super Sic Bo Lightning Multipliers
        $lightning = sb_generate_lightning();
        $baseOdds = sb_base_odds();

        // Calculate winning spots and payouts
        $winningBets = [];
        $totalPayout = 0.0;

        foreach ($bets as $spot => $stake) {
            $isWin = false;
            $mult = $baseOdds[$spot] ?? 1.0;

            // Apply lightning boost if hit
            if (isset($lightning[$spot])) {
                $mult = $lightning[$spot];
            }

            // Evaluation logic
            if ($spot === 'small') {
                if ($sum >= 4 && $sum <= 10 && !$isTriple) {
                    $isWin = true;
                }
            } elseif ($spot === 'big') {
                if ($sum >= 11 && $sum <= 17 && !$isTriple) {
                    $isWin = true;
                }
            } elseif ($spot === 'even') {
                if ($sum % 2 === 0 && !$isTriple) {
                    $isWin = true;
                }
            } elseif ($spot === 'odd') {
                if ($sum % 2 === 1 && !$isTriple) {
                    $isWin = true;
                }
            } elseif ($spot === 'any_triple') {
                if ($isTriple) {
                    $isWin = true;
                }
            } elseif (str_starts_with($spot, 'triple_')) {
                $val = (int)str_replace('triple_', '', $spot);
                if ($isTriple && $d1 === $val) {
                    $isWin = true;
                }
            } elseif (str_starts_with($spot, 'double_')) {
                $val = (int)str_replace('double_', '', $spot);
                if (($counts[$val] ?? 0) >= 2) {
                    $isWin = true;
                }
            } elseif (str_starts_with($spot, 'sum_')) {
                $val = (int)str_replace('sum_', '', $spot);
                if ($sum === $val) {
                    $isWin = true;
                }
            } elseif (str_starts_with($spot, 'single_')) {
                $val = (int)str_replace('single_', '', $spot);
                $c = $counts[$val] ?? 0;
                if ($c > 0) {
                    $isWin = true;
                    // Standard single dice payout: 1 match = 1:1, 2 matches = 2:1, 3 matches = 3:1
                    $mult = (float)($c + 1);
                }
            }

            if ($isWin) {
                $payout = round($stake * $mult, 2);
                $totalPayout += $payout;
                $winningBets[] = [
                    'spot' => $spot,
                    'stake' => $stake,
                    'multiplier' => $mult,
                    'payout' => $payout,
                    'lightning' => isset($lightning[$spot])
                ];
            }
        }

        if ($totalPayout > 0) {
            sb_credit_balance($userId, $totalPayout);
        }

        // Record round
        $roundUuid = 'sb_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO sb_rounds (user_id, round_uuid, dice_1, dice_2, dice_3, sum_total, is_triple, total_stake, total_payout, bets_json, lightning_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $userId, $roundUuid, $d1, $d2, $d3, $sum, $isTriple ? 1 : 0, $totalStake, $totalPayout,
            json_encode($bets), json_encode($lightning)
        ]);

        // Record history
        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'SicBoMaster');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
        $outcomeType = $isTriple ? 'TRIPLE' : ($sum >= 11 ? 'BIG' : 'SMALL');

        $stmtHist = $db->prepare("INSERT INTO sb_history (user_id, user_name, dice_result, sum_total, outcome_type, stake, payout) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmtHist->execute([$userId, $masked, "$d1,$d2,$d3", $sum, $outcomeType, $totalStake, $totalPayout]);

        $db->commit();

        $newBal = sb_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $totalPayout > 0 ? 'You Won!' : 'No Win',
            'data' => [
                'round_uuid' => $roundUuid,
                'dice' => [$d1, $d2, $d3],
                'sum' => $sum,
                'is_triple' => $isTriple,
                'outcome' => $outcomeType,
                'lightning' => $lightning,
                'winning_bets' => $winningBets,
                'total_stake' => $totalStake,
                'total_payout' => $totalPayout,
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Sic Bo engine error: ' . $e->getMessage()];
    }
}
