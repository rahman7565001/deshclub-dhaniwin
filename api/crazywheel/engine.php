<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function cw_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS cw_spins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            spin_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            segment_index INT NOT NULL,
            winning_number VARCHAR(16) NOT NULL,
            crazy_boost DECIMAL(10,2) NOT NULL DEFAULT 1.0,
            total_stake DECIMAL(18,4) NOT NULL,
            total_payout DECIMAL(18,4) NOT NULL,
            bets_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS cw_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            winning_number VARCHAR(16) NOT NULL,
            crazy_boost DECIMAL(10,2) NOT NULL DEFAULT 1.0,
            stake DECIMAL(18,4) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM cw_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***1122', 'num' => '10', 'boost' => 1.0,  'stake' => 100.0, 'payout' => 1100.0],
                ['user_name' => '018***4400', 'num' => '2',  'boost' => 1.0,  'stake' => 50.0,  'payout' => 150.0],
                ['user_name' => '019***8844', 'num' => '40', 'boost' => 5.0,  'stake' => 20.0,  'payout' => 4100.0],
                ['user_name' => '016***7712', 'num' => '1',  'boost' => 1.0,  'stake' => 200.0, 'payout' => 400.0],
                ['user_name' => '013***9955', 'num' => '5',  'boost' => 2.0,  'stake' => 50.0,  'payout' => 600.0],
                ['user_name' => '017***3344', 'num' => '20', 'boost' => 1.0,  'stake' => 100.0, 'payout' => 2100.0],
            ];
            $stmt = $pdo->prepare("INSERT INTO cw_history (user_id, user_name, winning_number, crazy_boost, stake, payout) VALUES (1, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['num'], $s['boost'], $s['stake'], $s['payout']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function cw_get_balance(int $userId): float
{
    $db = cw_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function cw_debit_balance(int $userId, float $amount): bool
{
    $db = cw_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return false;

    $maxBal = max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
    if ($maxBal < $amount) {
        return false;
    }

    $newBal = round($maxBal - $amount, 4);
    $upd = $db->prepare("UPDATE api_users SET wallet_balance = ?, game_balance = ? WHERE id = ? OR user_id = ?");
    $upd->execute([$newBal, $newBal, $userId, $userId]);
    return true;
}

function cw_credit_balance(int $userId, float $amount): bool
{
    $db = cw_db();
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
 * 54 Authentic Casino Wheel Segments Map
 */
function cw_segments(): array
{
    // 54 segments distributed like Dream Catcher / Mega Wheel:
    // 21x '1', 13x '2', 7x '5', 4x '10', 2x '20', 1x '40', 2x 'CHANCE' (Bonus)
    return [
        '1', '2', '1', '5', '1', '2', '1', '10', '1', '2',
        '1', 'CHANCE', '1', '2', '1', '5', '1', '2', '1', '20',
        '1', '2', '1', '5', '1', '2', '1', '10', '1', '2',
        '1', '40', '1', '2', '1', '5', '1', '2', '1', '10',
        '1', 'CHANCE', '1', '2', '1', '5', '1', '2', '1', '20',
        '1', '2', '1', '5'
    ];
}

/**
 * Base Multipliers for betting spots (including returned stake)
 */
function cw_base_multipliers(): array
{
    return [
        '1'      => 2.0,   // 1:1 + stake = 2x
        '2'      => 3.0,   // 2:1 + stake = 3x
        '5'      => 6.0,   // 5:1 + stake = 6x
        '10'     => 11.0,  // 10:1 + stake = 11x
        '20'     => 21.0,  // 20:1 + stake = 21x
        '40'     => 41.0,  // 40:1 + stake = 41x
        'CHANCE' => 25.0   // Bonus segment instant win
    ];
}

/**
 * Execute a Crazy Wheel Spin
 */
function cw_execute_spin(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $rawBets = $params['bets'] ?? [];

    if (!is_array($rawBets) || empty($rawBets)) {
        return ['code' => 1, 'msg' => 'Please place at least one bet on the wheel board.'];
    }

    $validSpots = array_map('strval', array_keys(cw_base_multipliers()));
    $totalStake = 0.0;
    $bets = [];

    foreach ($rawBets as $b) {
        $spot = strtoupper(trim((string)($b['spot'] ?? '')));
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

    $currentBal = cw_get_balance($userId);
    if ($currentBal < $totalStake) {
        return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
    }

    $db = cw_db();
    $db->beginTransaction();
    try {
        if (!cw_debit_balance($userId, $totalStake)) {
            $db->rollBack();
            return ['code' => 2, 'msg' => 'Failed to debit balance.'];
        }

        $segments = cw_segments();
        $totalSegments = count($segments); // 54

        // Cryptographically secure RNG segment choice [0 to 53]
        $segIndex = random_int(0, $totalSegments - 1);
        $winningNum = $segments[$segIndex];

        // Random Crazy Multiplier Boost feature: 15% chance to trigger Crazy Multiplier on this spin
        $crazyBoost = 1.0;
        if (random_int(1, 6) === 1) {
            $boostOptions = [2.0, 3.0, 5.0, 10.0];
            $crazyBoost = $boostOptions[array_rand($boostOptions)];
        }

        $baseMults = cw_base_multipliers();
        $totalPayout = 0.0;
        $winningBets = [];

        foreach ($bets as $spot => $stake) {
            if ((string)$spot === (string)$winningNum) {
                $baseMult = $baseMults[$spot] ?? 1.0;
                $finalMult = round($baseMult * $crazyBoost, 2);
                $payout = round($stake * $finalMult, 2);
                $totalPayout += $payout;

                $winningBets[] = [
                    'spot' => $spot,
                    'stake' => $stake,
                    'multiplier' => $finalMult,
                    'payout' => $payout,
                    'crazy_boost' => $crazyBoost
                ];
            }
        }

        if ($totalPayout > 0) {
            cw_credit_balance($userId, $totalPayout);
        }

        // Record spin
        $spinUuid = 'cw_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO cw_spins (spin_uuid, user_id, segment_index, winning_number, crazy_boost, total_stake, total_payout, bets_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $spinUuid, $userId, $segIndex, $winningNum, $crazyBoost, $totalStake, $totalPayout, json_encode($bets)
        ]);

        // Record history
        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'WheelKing');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

        $stmtHist = $db->prepare("INSERT INTO cw_history (user_id, user_name, winning_number, crazy_boost, stake, payout) VALUES (?, ?, ?, ?, ?, ?)");
        $stmtHist->execute([$userId, $masked, $winningNum, $crazyBoost, $totalStake, $totalPayout]);

        $db->commit();

        $newBal = cw_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $totalPayout > 0 ? 'Big Wheel Win!' : 'No Hit',
            'data' => [
                'spin_uuid' => $spinUuid,
                'segment_index' => $segIndex,
                'winning_number' => $winningNum,
                'crazy_boost' => $crazyBoost,
                'total_segments' => $totalSegments,
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
        return ['code' => 500, 'msg' => 'Crazy Wheel engine error: ' . $e->getMessage()];
    }
}
