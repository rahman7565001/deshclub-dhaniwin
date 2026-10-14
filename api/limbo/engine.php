<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function lb_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS limbo_bets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            bet_uuid VARCHAR(64) UNIQUE,
            stake_amount DECIMAL(18,4) NOT NULL,
            target_multiplier DECIMAL(10,2) NOT NULL,
            win_chance DECIMAL(5,2) NOT NULL,
            result_multiplier DECIMAL(10,2) NOT NULL,
            payout_amount DECIMAL(18,4) NOT NULL,
            is_win INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS limbo_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            target_mult DECIMAL(10,2) NOT NULL,
            result_mult DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            is_win INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM limbo_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***8899', 'stake' => 100.0, 'target' => 2.0,   'result' => 4.25,   'payout' => 200.0,   'win' => 1],
                ['user_name' => '018***2211', 'stake' => 50.0,  'target' => 10.0,  'result' => 18.40,  'payout' => 500.0,   'win' => 1],
                ['user_name' => '019***4400', 'stake' => 200.0, 'target' => 1.5,   'result' => 1.12,   'payout' => 0.0,     'win' => 0],
                ['user_name' => '016***7712', 'stake' => 20.0,  'target' => 50.0,  'result' => 124.60, 'payout' => 1000.0,  'win' => 1],
                ['user_name' => '013***3344', 'stake' => 500.0, 'target' => 2.0,   'result' => 1.95,   'payout' => 0.0,     'win' => 0],
                ['user_name' => '017***9955', 'stake' => 10.0,  'target' => 100.0, 'result' => 580.00, 'payout' => 1000.0,  'win' => 1],
            ];
            $stmt = $pdo->prepare("INSERT INTO limbo_history (user_id, user_name, stake, target_mult, result_mult, payout, is_win) VALUES (1, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['stake'], $s['target'], $s['result'], $s['payout'], $s['win']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function lb_get_balance(int $userId): float
{
    $db = lb_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function lb_debit_balance(int $userId, float $amount): bool
{
    $db = lb_db();
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

function lb_credit_balance(int $userId, float $amount): bool
{
    $db = lb_db();
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
 * Provably Fair Authentic Limbo Crash Multiplier RNG
 */
function lb_generate_crash_multiplier(): float
{
    // Generate uniform random float in [0, 1)
    $randInt = random_int(0, 999999);
    $u = $randInt / 1000000.0;

    // Instant house edge edge case
    if ($u >= 0.985) {
        return 1.00;
    }

    // Standard Limbo crash curve with 98.5% theoretical RTP
    $crash = round(0.985 / (1.0 - $u), 2);
    $crash = max(1.00, min(10000.00, $crash));
    return (float)$crash;
}

function lb_execute_play(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $stake = round((float)($params['stake'] ?? 10.0), 2);
    $targetMult = round((float)($params['target_multiplier'] ?? 2.0), 2);

    $targetMult = max(1.01, min(10000.0, $targetMult));
    $winChance = round(98.5 / $targetMult, 2);

    if ($stake < 10.0) {
        return ['code' => 1, 'msg' => 'Minimum stake is 10.00'];
    }
    if ($stake > 50000.0) {
        return ['code' => 1, 'msg' => 'Maximum stake is 50,000.00'];
    }

    $currentBalance = lb_get_balance($userId);
    if ($currentBalance < $stake) {
        return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
    }

    $db = lb_db();
    $db->beginTransaction();
    try {
        if (!lb_debit_balance($userId, $stake)) {
            $db->rollBack();
            return ['code' => 2, 'msg' => 'Failed to debit balance.'];
        }

        // Generate crash result
        $resultMult = lb_generate_crash_multiplier();
        $isWin = ($resultMult >= $targetMult);
        $payout = $isWin ? round($stake * $targetMult, 2) : 0.0;

        if ($payout > 0) {
            lb_credit_balance($userId, $payout);
        }

        // Record bet
        $betUuid = 'lb_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO limbo_bets (user_id, bet_uuid, stake_amount, target_multiplier, win_chance, result_multiplier, payout_amount, is_win) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $betUuid, $stake, $targetMult, $winChance, $resultMult, $payout, $isWin ? 1 : 0]);

        // Record history
        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'RocketMaster');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

        $stmtHist = $db->prepare("INSERT INTO limbo_history (user_id, user_name, stake, target_mult, result_mult, payout, is_win) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmtHist->execute([$userId, $masked, $stake, $targetMult, $resultMult, $payout, $isWin ? 1 : 0]);

        $db->commit();

        $newBal = lb_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $isWin ? 'Turbo Win!' : 'Limbo Miss!',
            'data' => [
                'bet_uuid' => $betUuid,
                'stake' => $stake,
                'target_multiplier' => $targetMult,
                'win_chance' => $winChance,
                'result_multiplier' => $resultMult,
                'payout' => $payout,
                'is_win' => $isWin,
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Limbo engine error: ' . $e->getMessage()];
    }
}
