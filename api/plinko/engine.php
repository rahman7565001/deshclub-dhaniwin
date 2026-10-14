<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function plinko_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS plinko_drops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            drop_uuid VARCHAR(64) UNIQUE,
            stake_amount DECIMAL(18,4) NOT NULL,
            rows INT NOT NULL DEFAULT 16,
            risk VARCHAR(16) NOT NULL DEFAULT 'medium',
            path_json TEXT NOT NULL,
            slot_index INT NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout_amount DECIMAL(18,4) NOT NULL,
            is_win INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS plinko_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            rows INT NOT NULL,
            risk VARCHAR(16) NOT NULL,
            slot_index INT NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM plinko_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***4419', 'stake' => 50.0,  'rows' => 16, 'risk' => 'high',   'slot' => 16, 'mult' => 1000.0, 'payout' => 50000.0],
                ['user_name' => '018***9921', 'stake' => 100.0, 'rows' => 16, 'risk' => 'medium', 'slot' => 1,  'mult' => 41.0,   'payout' => 4100.0],
                ['user_name' => '019***1204', 'stake' => 20.0,  'rows' => 12, 'risk' => 'high',   'slot' => 0,  'mult' => 170.0,  'payout' => 3400.0],
                ['user_name' => '016***8832', 'stake' => 200.0, 'rows' => 14, 'risk' => 'low',    'slot' => 13, 'mult' => 4.0,    'payout' => 800.0],
                ['user_name' => '013***7711', 'stake' => 50.0,  'rows' => 16, 'risk' => 'high',   'slot' => 15, 'mult' => 130.0,  'payout' => 6500.0],
                ['user_name' => '015***3302', 'stake' => 100.0, 'rows' => 10, 'risk' => 'medium', 'slot' => 10, 'mult' => 22.0,   'payout' => 2200.0],
            ];
            $stmt = $pdo->prepare("INSERT INTO plinko_history (user_id, user_name, stake, rows, risk, slot_index, multiplier, payout) VALUES (1, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['stake'], $s['rows'], $s['risk'], $s['slot'], $s['mult'], $s['payout']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

/**
 * Authentic Plinko Multiplier Tables by Rows and Risk Level
 */
function plinko_multipliers(int $rows, string $risk): array
{
    $tables = [
        8 => [
            'low'    => [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6],
            'medium' => [13.0, 3.0, 1.3, 0.7, 0.4, 0.7, 1.3, 3.0, 13.0],
            'high'   => [29.0, 4.0, 1.5, 0.3, 0.2, 0.3, 1.5, 4.0, 29.0],
        ],
        10 => [
            'low'    => [8.9, 3.0, 1.4, 1.1, 1.0, 0.5, 1.0, 1.1, 1.4, 3.0, 8.9],
            'medium' => [22.0, 5.0, 2.0, 1.4, 0.6, 0.4, 0.6, 1.4, 2.0, 5.0, 22.0],
            'high'   => [76.0, 10.0, 3.0, 1.5, 0.3, 0.2, 0.3, 1.5, 3.0, 10.0, 76.0],
        ],
        12 => [
            'low'    => [10.0, 3.0, 1.6, 1.4, 1.1, 1.0, 0.5, 1.0, 1.1, 1.4, 1.6, 3.0, 10.0],
            'medium' => [33.0, 11.0, 4.0, 2.0, 1.1, 0.6, 0.3, 0.6, 1.1, 2.0, 4.0, 11.0, 33.0],
            'high'   => [170.0, 24.0, 8.1, 2.0, 0.7, 0.2, 0.2, 0.2, 0.7, 2.0, 8.1, 24.0, 170.0],
        ],
        14 => [
            'low'    => [15.0, 4.0, 1.9, 1.4, 1.3, 1.1, 1.0, 0.5, 1.0, 1.1, 1.3, 1.4, 1.9, 4.0, 15.0],
            'medium' => [58.0, 15.0, 7.0, 4.0, 1.9, 1.0, 0.5, 0.2, 0.5, 1.0, 1.9, 4.0, 7.0, 15.0, 58.0],
            'high'   => [420.0, 56.0, 18.0, 5.0, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5.0, 18.0, 56.0, 420.0],
        ],
        16 => [
            'low'    => [16.0, 9.0, 2.0, 1.4, 1.4, 1.2, 1.1, 1.0, 0.5, 1.0, 1.1, 1.2, 1.4, 1.4, 2.0, 9.0, 16.0],
            'medium' => [110.0, 41.0, 10.0, 5.0, 3.0, 1.5, 1.0, 0.5, 0.3, 0.5, 1.0, 1.5, 3.0, 5.0, 10.0, 41.0, 110.0],
            'high'   => [1000.0, 130.0, 26.0, 9.0, 4.0, 2.0, 0.2, 0.2, 0.2, 0.2, 0.2, 2.0, 4.0, 9.0, 26.0, 130.0, 1000.0],
        ]
    ];

    $r = in_array($rows, [8, 10, 12, 14, 16], true) ? $rows : 16;
    $k = in_array($risk, ['low', 'medium', 'high'], true) ? $risk : 'medium';

    return $tables[$r][$k];
}

function plinko_get_balance(int $userId): float
{
    $db = plinko_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function plinko_debit_balance(int $userId, float $amount): bool
{
    $db = plinko_db();
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

function plinko_credit_balance(int $userId, float $amount): bool
{
    $db = plinko_db();
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

function plinko_execute_drop(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $stake = round((float)($params['stake'] ?? 10.0), 2);
    $rows = (int)($params['rows'] ?? 16);
    $risk = strtolower(trim((string)($params['risk'] ?? 'medium')));

    if (!in_array($rows, [8, 10, 12, 14, 16], true)) {
        $rows = 16;
    }
    if (!in_array($risk, ['low', 'medium', 'high'], true)) {
        $risk = 'medium';
    }

    if ($stake < 10.0) {
        return ['code' => 1, 'msg' => 'Minimum stake is 10.00'];
    }
    if ($stake > 50000.0) {
        return ['code' => 1, 'msg' => 'Maximum stake is 50,000.00'];
    }

    $currentBalance = plinko_get_balance($userId);
    if ($currentBalance < $stake) {
        return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
    }

    $db = plinko_db();
    $db->beginTransaction();
    try {
        if (!plinko_debit_balance($userId, $stake)) {
            $db->rollBack();
            return ['code' => 2, 'msg' => 'Failed to deduct balance.'];
        }

        // Generate cryptographically secure bouncing path (0 = Left, 1 = Right)
        $path = [];
        $slotIndex = 0;
        for ($i = 0; $i < $rows; $i++) {
            $step = random_int(0, 1);
            $path[] = $step;
            $slotIndex += $step;
        }

        $multipliers = plinko_multipliers($rows, $risk);
        $multiplier = (float)($multipliers[$slotIndex] ?? 1.0);
        $payout = round($stake * $multiplier, 2);
        $isWin = ($payout > 0);

        if ($payout > 0) {
            plinko_credit_balance($userId, $payout);
        }

        $dropUuid = 'pk_' . bin2hex(random_bytes(8));
        $pathJson = json_encode($path);

        $stmt = $db->prepare("INSERT INTO plinko_drops (user_id, drop_uuid, stake_amount, rows, risk, path_json, slot_index, multiplier, payout_amount, is_win) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $dropUuid, $stake, $rows, $risk, $pathJson, $slotIndex, $multiplier, $payout, $isWin ? 1 : 0]);

        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'PlinkoMaster');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

        $stmtHist = $db->prepare("INSERT INTO plinko_history (user_id, user_name, stake, rows, risk, slot_index, multiplier, payout) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmtHist->execute([$userId, $masked, $stake, $rows, $risk, $slotIndex, $multiplier, $payout]);

        $db->commit();

        $newBal = plinko_get_balance($userId);

        return [
            'code' => 0,
            'msg' => 'Success',
            'data' => [
                'drop_uuid' => $dropUuid,
                'stake' => $stake,
                'rows' => $rows,
                'risk' => $risk,
                'path' => $path,
                'slot_index' => $slotIndex,
                'multiplier' => $multiplier,
                'payout' => $payout,
                'is_win' => $isWin,
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Plinko engine error: ' . $e->getMessage()];
    }
}
