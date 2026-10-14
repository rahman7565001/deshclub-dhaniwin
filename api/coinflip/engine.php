<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function cf_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS cf_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            stake_amount DECIMAL(18,4) NOT NULL,
            streak_count INT NOT NULL DEFAULT 0,
            current_multiplier DECIMAL(10,2) NOT NULL DEFAULT 1.0,
            current_payout DECIMAL(18,4) NOT NULL DEFAULT 0.0,
            status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'cashed_out', 'lost'
            flips_json TEXT NOT NULL DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS cf_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            streak_count INT NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            status VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM cf_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***5544', 'stake' => 100.0, 'streak' => 4, 'mult' => 14.76, 'payout' => 1476.0, 'status' => 'cashed_out'],
                ['user_name' => '018***9921', 'stake' => 50.0,  'streak' => 2, 'mult' => 3.84,  'payout' => 192.0,  'status' => 'cashed_out'],
                ['user_name' => '019***1200', 'stake' => 200.0, 'streak' => 1, 'mult' => 1.96,  'payout' => 392.0,  'status' => 'cashed_out'],
                ['user_name' => '016***8833', 'stake' => 50.0,  'streak' => 6, 'mult' => 56.70, 'payout' => 2835.0, 'status' => 'cashed_out'],
                ['user_name' => '013***7711', 'stake' => 20.0,  'streak' => 8, 'mult' => 217.82,'payout' => 4356.4, 'status' => 'cashed_out'],
                ['user_name' => '015***3302', 'stake' => 500.0, 'streak' => 3, 'mult' => 7.53,  'payout' => 3765.0, 'status' => 'cashed_out'],
            ];
            $stmt = $pdo->prepare("INSERT INTO cf_history (user_id, user_name, stake, streak_count, multiplier, payout, status) VALUES (1, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['stake'], $s['streak'], $s['mult'], $s['payout'], $s['status']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function cf_get_balance(int $userId): float
{
    $db = cf_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function cf_debit_balance(int $userId, float $amount): bool
{
    $db = cf_db();
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

function cf_credit_balance(int $userId, float $amount): bool
{
    $db = cf_db();
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
 * Multiplier ladder by streak (up to 10 streaks)
 */
function cf_streak_multiplier(int $streak): float
{
    $ladder = [
        1  => 1.96,
        2  => 3.84,
        3  => 7.53,
        4  => 14.76,
        5  => 28.93,
        6  => 56.70,
        7  => 111.13,
        8  => 217.82,
        9  => 426.93,
        10 => 836.78
    ];
    return $ladder[$streak] ?? round(pow(1.96, $streak), 2);
}

/**
 * Process a Coin Flip action
 */
function cf_execute_flip(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $choice = strtolower(trim((string)($params['choice'] ?? 'heads'))); // 'heads' or 'tails'
    if (!in_array($choice, ['heads', 'tails'], true)) {
        $choice = 'heads';
    }

    $db = cf_db();

    // Check for active session
    $stmt = $db->prepare("SELECT * FROM cf_sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1");
    $stmt->execute([$userId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    $db->beginTransaction();
    try {
        if (!$session) {
            // New round: debit stake
            $stake = round((float)($params['stake'] ?? 10.0), 2);
            if ($stake < 10.0) {
                $db->rollBack();
                return ['code' => 1, 'msg' => 'Minimum stake is 10.00'];
            }
            if ($stake > 50000.0) {
                $db->rollBack();
                return ['code' => 1, 'msg' => 'Maximum stake is 50,000.00'];
            }

            $currentBal = cf_get_balance($userId);
            if ($currentBal < $stake) {
                $db->rollBack();
                return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
            }

            if (!cf_debit_balance($userId, $stake)) {
                $db->rollBack();
                return ['code' => 2, 'msg' => 'Failed to debit balance.'];
            }

            $sessionUuid = 'cf_' . bin2hex(random_bytes(8));
            $streak = 0;
            $flips = [];
        } else {
            // Continuing active session
            $sessionUuid = (string)$session['session_uuid'];
            $stake = (float)$session['stake_amount'];
            $streak = (int)$session['streak_count'];
            $flips = json_decode((string)$session['flips_json'], true) ?: [];
        }

        // Cryptographically secure 50/50 RNG
        $flipOutcome = (random_int(0, 1) === 0) ? 'heads' : 'tails';
        $isWin = ($choice === $flipOutcome);

        $flips[] = [
            'choice' => $choice,
            'outcome' => $flipOutcome,
            'is_win' => $isWin,
            'time' => time()
        ];

        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'CoinMaster');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

        if ($isWin) {
            $streak++;
            $multiplier = cf_streak_multiplier($streak);
            $payout = round($stake * $multiplier, 2);
            $status = ($streak >= 10) ? 'cashed_out' : 'active';

            // Auto cashout on maximum 10-streak
            if ($streak >= 10) {
                cf_credit_balance($userId, $payout);
                $stmtHist = $db->prepare("INSERT INTO cf_history (user_id, user_name, stake, streak_count, multiplier, payout, status) VALUES (?, ?, ?, ?, ?, ?, 'cashed_out')");
                $stmtHist->execute([$userId, $masked, $stake, $streak, $multiplier, $payout]);
            }

            if (!$session) {
                $ins = $db->prepare("INSERT INTO cf_sessions (session_uuid, user_id, stake_amount, streak_count, current_multiplier, current_payout, status, flips_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $ins->execute([$sessionUuid, $userId, $stake, $streak, $multiplier, $payout, $status, json_encode($flips)]);
            } else {
                $upd = $db->prepare("UPDATE cf_sessions SET streak_count = ?, current_multiplier = ?, current_payout = ?, status = ?, flips_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $upd->execute([$streak, $multiplier, $payout, $status, json_encode($flips), $session['id']]);
            }
        } else {
            // Player lost the flip
            $multiplier = 0.0;
            $payout = 0.0;
            $status = 'lost';

            if (!$session) {
                $ins = $db->prepare("INSERT INTO cf_sessions (session_uuid, user_id, stake_amount, streak_count, current_multiplier, current_payout, status, flips_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $ins->execute([$sessionUuid, $userId, $stake, 0, 0, 0, 'lost', json_encode($flips)]);
            } else {
                $upd = $db->prepare("UPDATE cf_sessions SET status = 'lost', flips_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $upd->execute([json_encode($flips), $session['id']]);
            }

            // Log loss in history
            $stmtHist = $db->prepare("INSERT INTO cf_history (user_id, user_name, stake, streak_count, multiplier, payout, status) VALUES (?, ?, ?, ?, ?, ?, 'lost')");
            $stmtHist->execute([$userId, $masked, $stake, $streak, 0, 0]);
        }

        $db->commit();

        $newBal = cf_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $isWin ? 'Correct Flip!' : 'Coin Missed!',
            'data' => [
                'session_uuid' => $sessionUuid,
                'choice' => $choice,
                'outcome' => $flipOutcome,
                'is_win' => $isWin,
                'streak' => $streak,
                'multiplier' => $multiplier,
                'payout' => $payout,
                'can_cashout' => ($isWin && $status === 'active'),
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Coin Flip engine error: ' . $e->getMessage()];
    }
}

/**
 * Cash out active streak
 */
function cf_execute_cashout(array $user): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $db = cf_db();

    $stmt = $db->prepare("SELECT * FROM cf_sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1");
    $stmt->execute([$userId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        return ['code' => 1, 'msg' => 'No active round to cash out.'];
    }

    $payout = (float)$session['current_payout'];
    $stake = (float)$session['stake_amount'];
    $streak = (int)$session['streak_count'];
    $mult = (float)$session['current_multiplier'];

    if ($payout <= 0) {
        return ['code' => 1, 'msg' => 'Nothing to cash out.'];
    }

    $db->beginTransaction();
    try {
        cf_credit_balance($userId, $payout);

        $upd = $db->prepare("UPDATE cf_sessions SET status = 'cashed_out', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $upd->execute([$session['id']]);

        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'CoinMaster');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

        $stmtHist = $db->prepare("INSERT INTO cf_history (user_id, user_name, stake, streak_count, multiplier, payout, status) VALUES (?, ?, ?, ?, ?, ?, 'cashed_out')");
        $stmtHist->execute([$userId, $masked, $stake, $streak, $mult, $payout]);

        $db->commit();

        $newBal = cf_get_balance($userId);

        return [
            'code' => 0,
            'msg' => 'Cashed Out Successfully!',
            'data' => [
                'payout' => $payout,
                'streak' => $streak,
                'multiplier' => $mult,
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Cashout error: ' . $e->getMessage()];
    }
}
