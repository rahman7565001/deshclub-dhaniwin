<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function ps_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS ps_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            team VARCHAR(32) NOT NULL DEFAULT 'ARG',
            stake DECIMAL(18,4) NOT NULL,
            goalkeeper_dives_json TEXT NOT NULL,
            kicks_json TEXT NOT NULL,
            current_goal INT NOT NULL DEFAULT 0,
            current_multiplier DECIMAL(10,2) NOT NULL DEFAULT 1.0,
            status VARCHAR(16) NOT NULL DEFAULT 'active',
            total_payout DECIMAL(18,4) NOT NULL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS ps_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            team VARCHAR(32) NOT NULL,
            goals_scored INT NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            status VARCHAR(16) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM ps_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***9900', 'team' => 'ARG', 'goals' => 3, 'stake' => 100.0, 'payout' => 768.0,   'mult' => 7.68,  'status' => 'win'],
                ['user_name' => '018***3322', 'team' => 'BRA', 'goals' => 2, 'stake' => 50.0,  'payout' => 192.0,   'mult' => 3.84,  'status' => 'win'],
                ['user_name' => '019***7711', 'team' => 'BD',  'goals' => 5, 'stake' => 50.0,  'payout' => 1536.0,  'mult' => 30.72, 'status' => 'win'],
                ['user_name' => '016***4455', 'team' => 'POR', 'goals' => 1, 'stake' => 200.0, 'payout' => 384.0,   'mult' => 1.92,  'status' => 'win'],
                ['user_name' => '013***8899', 'team' => 'FRA', 'goals' => 4, 'stake' => 100.0, 'payout' => 1536.0,  'mult' => 15.36, 'status' => 'win'],
                ['user_name' => '017***1144', 'team' => 'ARG', 'goals' => 3, 'stake' => 50.0,  'payout' => 384.0,   'mult' => 7.68,  'status' => 'win'],
            ];
            $stmt = $pdo->prepare("INSERT INTO ps_history (user_id, user_name, team, goals_scored, stake, payout, multiplier, status) VALUES (1, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['team'], $s['goals'], $s['stake'], $s['payout'], $s['mult'], $s['status']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

/**
 * Multiplier Ladder for 5 Consecutive Goals
 */
function ps_multipliers(): array
{
    return [1.92, 3.84, 7.68, 15.36, 30.72];
}

/**
 * 5 Allowed Kick Target Spots
 */
function ps_targets(): array
{
    return ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'center'];
}

/**
 * Team list with national flags
 */
function ps_teams(): array
{
    return [
        ['code' => 'BD',  'name' => 'Bangladesh', 'flag' => '🇧🇩', 'color' => '#006a4e'],
        ['code' => 'ARG', 'name' => 'Argentina',  'flag' => '🇦🇷', 'color' => '#75aadb'],
        ['code' => 'BRA', 'name' => 'Brazil',     'flag' => '🇧🇷', 'color' => '#ffdf00'],
        ['code' => 'POR', 'name' => 'Portugal',   'flag' => '🇵🇹', 'color' => '#de3831'],
        ['code' => 'GER', 'name' => 'Germany',    'flag' => '🇩🇪', 'color' => '#000000'],
        ['code' => 'FRA', 'name' => 'France',     'flag' => '🇫🇷', 'color' => '#002654'],
        ['code' => 'ENG', 'name' => 'England',    'flag' => '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'color' => '#cf081f'],
        ['code' => 'ESP', 'name' => 'Spain',      'flag' => '🇪🇸', 'color' => '#c60b1e']
    ];
}

function ps_get_balance(int $userId): float
{
    $db = ps_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function ps_debit_balance(int $userId, float $amount): bool
{
    $db = ps_db();
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

function ps_credit_balance(int $userId, float $amount): bool
{
    $db = ps_db();
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

function ps_generate_dives(): array
{
    $targets = ps_targets();
    $dives = [];
    for ($i = 0; $i < 5; $i++) {
        $dives[] = $targets[random_int(0, count($targets) - 1)];
    }
    return $dives;
}

function ps_get_active_session(int $userId): ?array
{
    $db = ps_db();
    $stmt = $db->prepare("SELECT * FROM ps_sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

function ps_sanitize_session(array $session): array
{
    $status = $session['status'];
    $kicks = json_decode($session['kicks_json'], true) ?: [];
    $dives = json_decode($session['goalkeeper_dives_json'], true) ?: [];
    $currentGoal = (int)$session['current_goal'];
    $multLadder = ps_multipliers();

    // While match is active, do not leak upcoming goalkeeper dives
    $revealedDives = [];
    if ($status === 'active') {
        for ($i = 0; $i < count($kicks); $i++) {
            $revealedDives[] = $dives[$i] ?? null;
        }
    } else {
        $revealedDives = $dives; // game over: show full sequence
    }

    return [
        'session_uuid' => $session['session_uuid'],
        'team' => $session['team'],
        'stake' => (float)$session['stake'],
        'current_goal' => $currentGoal,
        'current_multiplier' => (float)$session['current_multiplier'],
        'current_win' => round((float)$session['stake'] * (float)$session['current_multiplier'], 2),
        'status' => $status,
        'total_payout' => (float)$session['total_payout'],
        'multipliers' => $multLadder,
        'kicks' => $kicks,
        'dives' => $revealedDives
    ];
}

/**
 * Start Match
 */
function ps_start_match(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $stake = round((float)($params['stake'] ?? 10.0), 2);
    $team = strtoupper(trim((string)($params['team'] ?? 'ARG')));

    $validTeams = array_column(ps_teams(), 'code');
    if (!in_array($team, $validTeams, true)) {
        $team = 'ARG';
    }

    if ($stake < 10.0) {
        return ['code' => 1, 'msg' => 'Minimum stake is 10.00'];
    }
    if ($stake > 50000.0) {
        return ['code' => 1, 'msg' => 'Maximum stake is 50,000.00'];
    }

    // Check if user already has an active session
    $active = ps_get_active_session($userId);
    if ($active) {
        return [
            'code' => 0,
            'msg' => 'Active match resumed',
            'data' => ps_sanitize_session($active)
        ];
    }

    $currentBal = ps_get_balance($userId);
    if ($currentBal < $stake) {
        return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
    }

    $db = ps_db();
    $db->beginTransaction();
    try {
        if (!ps_debit_balance($userId, $stake)) {
            $db->rollBack();
            return ['code' => 2, 'msg' => 'Failed to debit balance.'];
        }

        $sessionUuid = 'ps_' . bin2hex(random_bytes(8));
        $dives = ps_generate_dives();
        $kicks = [];

        $stmt = $db->prepare("INSERT INTO ps_sessions (session_uuid, user_id, team, stake, goalkeeper_dives_json, kicks_json, current_goal, current_multiplier, status, total_payout) VALUES (?, ?, ?, ?, ?, ?, 0, 1.0, 'active', 0.0)");
        $stmt->execute([
            $sessionUuid, $userId, $team, $stake, json_encode($dives), json_encode($kicks)
        ]);

        $db->commit();

        $session = [
            'session_uuid' => $sessionUuid,
            'team' => $team,
            'stake' => $stake,
            'goalkeeper_dives_json' => json_encode($dives),
            'kicks_json' => json_encode($kicks),
            'current_goal' => 0,
            'current_multiplier' => 1.0,
            'status' => 'active',
            'total_payout' => 0.0
        ];

        return [
            'code' => 0,
            'msg' => 'Match started! Take your shot.',
            'data' => array_merge(ps_sanitize_session($session), [
                'wallet_balance' => ps_get_balance($userId)
            ])
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Server error: ' . $e->getMessage()];
    }
}

/**
 * Execute a Shot
 */
function ps_shoot(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $sessionUuid = trim((string)($params['session_uuid'] ?? ''));
    $target = strtolower(trim((string)($params['target'] ?? '')));

    $validTargets = ps_targets();
    if (!in_array($target, $validTargets, true)) {
        return ['code' => 1, 'msg' => 'Invalid shot target.'];
    }

    $db = ps_db();
    $stmt = $db->prepare("SELECT * FROM ps_sessions WHERE session_uuid = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$sessionUuid, $userId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        return ['code' => 1, 'msg' => 'Match session not found.'];
    }
    if ($session['status'] !== 'active') {
        return ['code' => 1, 'msg' => 'Match already completed.', 'data' => ps_sanitize_session($session)];
    }

    $currentGoal = (int)$session['current_goal'];
    $dives = json_decode($session['goalkeeper_dives_json'], true) ?: [];
    $kicks = json_decode($session['kicks_json'], true) ?: [];
    $multLadder = ps_multipliers();

    if ($currentGoal >= count($multLadder)) {
        return ['code' => 1, 'msg' => 'All penalty kicks completed!'];
    }

    $keeperDive = $dives[$currentGoal] ?? 'center';
    $isGoal = ($target !== $keeperDive);

    $db->beginTransaction();
    try {
        if (!$isGoal) {
            // SAVED! Goalkeeper blocked the shot
            $kicks[] = [
                'shot_num' => $currentGoal + 1,
                'target' => $target,
                'keeper_dive' => $keeperDive,
                'result' => 'saved'
            ];

            $session['status'] = 'saved';
            $session['kicks_json'] = json_encode($kicks);
            $session['total_payout'] = 0.0;

            $upd = $db->prepare("UPDATE ps_sessions SET status = 'saved', kicks_json = ?, total_payout = 0.0, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $upd->execute([json_encode($kicks), $session['id']]);

            // Record history
            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Striker');
            $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
            $hist = $db->prepare("INSERT INTO ps_history (user_id, user_name, team, goals_scored, stake, payout, multiplier, status) VALUES (?, ?, ?, ?, ?, 0.0, 0.0, 'loss')");
            $hist->execute([$userId, $masked, $session['team'], $currentGoal, $session['stake']]);

            $db->commit();

            return [
                'code' => 0,
                'msg' => 'SAVED! Goalkeeper deflected the shot!',
                'data' => array_merge(ps_sanitize_session($session), [
                    'shot_result' => 'saved',
                    'target' => $target,
                    'keeper_dive' => $keeperDive,
                    'wallet_balance' => ps_get_balance($userId)
                ])
            ];
        }

        // GOAL! Scored!
        $newGoal = $currentGoal + 1;
        $newMultiplier = $multLadder[$currentGoal];
        $isChampion = ($newGoal >= count($multLadder)); // 5th goal!

        $kicks[] = [
            'shot_num' => $newGoal,
            'target' => $target,
            'keeper_dive' => $keeperDive,
            'result' => 'goal',
            'multiplier' => $newMultiplier
        ];

        if ($isChampion) {
            // 5th Goal: Conquered Championship! Auto-Cashout 30.72x
            $payout = round((float)$session['stake'] * $newMultiplier, 2);
            ps_credit_balance($userId, $payout);

            $session['status'] = 'cashed_out';
            $session['current_goal'] = $newGoal;
            $session['current_multiplier'] = $newMultiplier;
            $session['kicks_json'] = json_encode($kicks);
            $session['total_payout'] = $payout;

            $upd = $db->prepare("UPDATE ps_sessions SET status = 'cashed_out', current_goal = ?, current_multiplier = ?, kicks_json = ?, total_payout = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $upd->execute([$newGoal, $newMultiplier, json_encode($kicks), $payout, $session['id']]);

            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Striker');
            $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
            $hist = $db->prepare("INSERT INTO ps_history (user_id, user_name, team, goals_scored, stake, payout, multiplier, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'win')");
            $hist->execute([$userId, $masked, $session['team'], $newGoal, $session['stake'], $payout, $newMultiplier]);

            $db->commit();

            return [
                'code' => 0,
                'msg' => 'CHAMPIONSHIP VICTORY! 5 Consecutive Goals Scored!',
                'data' => array_merge(ps_sanitize_session($session), [
                    'shot_result' => 'goal',
                    'target' => $target,
                    'keeper_dive' => $keeperDive,
                    'is_champion' => true,
                    'wallet_balance' => ps_get_balance($userId)
                ])
            ];
        }

        // Normal goal advance
        $session['current_goal'] = $newGoal;
        $session['current_multiplier'] = $newMultiplier;
        $session['kicks_json'] = json_encode($kicks);

        $upd = $db->prepare("UPDATE ps_sessions SET current_goal = ?, current_multiplier = ?, kicks_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $upd->execute([$newGoal, $newMultiplier, json_encode($kicks), $session['id']]);

        $db->commit();

        return [
            'code' => 0,
            'msg' => 'GOOOAL! Target scored!',
            'data' => array_merge(ps_sanitize_session($session), [
                'shot_result' => 'goal',
                'target' => $target,
                'keeper_dive' => $keeperDive,
                'is_champion' => false,
                'wallet_balance' => ps_get_balance($userId)
            ])
        ];

    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Server error: ' . $e->getMessage()];
    }
}

/**
 * Cashout Match
 */
function ps_cashout(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $sessionUuid = trim((string)($params['session_uuid'] ?? ''));

    $db = ps_db();
    $stmt = $db->prepare("SELECT * FROM ps_sessions WHERE session_uuid = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$sessionUuid, $userId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        return ['code' => 1, 'msg' => 'Session not found.'];
    }
    if ($session['status'] !== 'active') {
        return ['code' => 1, 'msg' => 'Match is not active.', 'data' => ps_sanitize_session($session)];
    }

    $currentGoal = (int)$session['current_goal'];
    if ($currentGoal <= 0) {
        return ['code' => 1, 'msg' => 'Score at least 1 goal before cashing out.'];
    }

    $multiplier = (float)$session['current_multiplier'];
    $stake = (float)$session['stake'];
    $payout = round($stake * $multiplier, 2);

    $db->beginTransaction();
    try {
        ps_credit_balance($userId, $payout);

        $session['status'] = 'cashed_out';
        $session['total_payout'] = $payout;

        $upd = $db->prepare("UPDATE ps_sessions SET status = 'cashed_out', total_payout = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $upd->execute([$payout, $session['id']]);

        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Striker');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
        $hist = $db->prepare("INSERT INTO ps_history (user_id, user_name, team, goals_scored, stake, payout, multiplier, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'win')");
        $hist->execute([$userId, $masked, $session['team'], $currentGoal, $stake, $payout, $multiplier]);

        $db->commit();

        return [
            'code' => 0,
            'msg' => 'Match cashed out successfully!',
            'data' => array_merge(ps_sanitize_session($session), [
                'wallet_balance' => ps_get_balance($userId)
            ])
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Server error: ' . $e->getMessage()];
    }
}
