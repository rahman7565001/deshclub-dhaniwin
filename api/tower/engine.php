<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function tl_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS tl_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            difficulty VARCHAR(16) NOT NULL DEFAULT 'medium',
            stake DECIMAL(18,4) NOT NULL,
            floors_json TEXT NOT NULL,
            picks_json TEXT NOT NULL,
            current_floor INT NOT NULL DEFAULT 0,
            current_multiplier DECIMAL(10,2) NOT NULL DEFAULT 1.0,
            status VARCHAR(16) NOT NULL DEFAULT 'active',
            total_payout DECIMAL(18,4) NOT NULL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS tl_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            difficulty VARCHAR(16) NOT NULL,
            floors_cleared INT NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            status VARCHAR(16) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM tl_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***5544', 'diff' => 'medium', 'floors' => 5, 'stake' => 100.0, 'payout' => 408.0,  'mult' => 4.08, 'status' => 'win'],
                ['user_name' => '018***9911', 'diff' => 'easy',   'floors' => 7, 'stake' => 50.0,  'payout' => 230.0,  'mult' => 4.60, 'status' => 'win'],
                ['user_name' => '019***3322', 'diff' => 'hard',   'floors' => 4, 'stake' => 200.0, 'payout' => 980.0,  'mult' => 4.90, 'status' => 'win'],
                ['user_name' => '016***8844', 'diff' => 'expert', 'floors' => 3, 'stake' => 50.0,  'payout' => 386.0,  'mult' => 7.72, 'status' => 'win'],
                ['user_name' => '013***1200', 'diff' => 'master', 'floors' => 2, 'stake' => 20.0,  'payout' => 173.6,  'mult' => 8.68, 'status' => 'win'],
                ['user_name' => '017***7766', 'diff' => 'medium', 'floors' => 4, 'stake' => 100.0, 'payout' => 306.0,  'mult' => 3.06, 'status' => 'win'],
            ];
            $stmt = $pdo->prepare("INSERT INTO tl_history (user_id, user_name, difficulty, floors_cleared, stake, payout, multiplier, status) VALUES (1, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['diff'], $s['floors'], $s['stake'], $s['payout'], $s['mult'], $s['status']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

/**
 * Tower Difficulty Configurations
 */
function tl_difficulties(): array
{
    return [
        'easy' => [
            'name' => 'Easy',
            'tiles' => 5,
            'skulls' => 1,
            'gems' => 4,
            'multipliers' => [1.20, 1.50, 1.88, 2.35, 2.94, 3.68, 4.60, 5.75, 7.20]
        ],
        'medium' => [
            'name' => 'Medium',
            'tiles' => 4,
            'skulls' => 1,
            'gems' => 3,
            'multipliers' => [1.29, 1.72, 2.29, 3.06, 4.08, 5.45, 7.26, 9.69, 12.92]
        ],
        'hard' => [
            'name' => 'Hard',
            'tiles' => 3,
            'skulls' => 1,
            'gems' => 2,
            'multipliers' => [1.45, 2.18, 3.26, 4.90, 7.35, 11.02, 16.53, 24.80, 37.20]
        ],
        'expert' => [
            'name' => 'Expert',
            'tiles' => 2,
            'skulls' => 1,
            'gems' => 1,
            'multipliers' => [1.93, 3.86, 7.72, 15.44, 30.88, 61.76, 123.52, 247.04, 494.08]
        ],
        'master' => [
            'name' => 'Master',
            'tiles' => 3,
            'skulls' => 2,
            'gems' => 1,
            'multipliers' => [2.89, 8.68, 26.06, 78.18, 234.54, 703.62, 2110.86, 6332.58, 18997.74]
        ]
    ];
}

function tl_get_balance(int $userId): float
{
    $db = tl_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function tl_debit_balance(int $userId, float $amount): bool
{
    $db = tl_db();
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

function tl_credit_balance(int $userId, float $amount): bool
{
    $db = tl_db();
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
 * Generate Tower Floors Board
 */
function tl_generate_floors(string $difficulty): array
{
    $configs = tl_difficulties();
    $cfg = $configs[$difficulty] ?? $configs['medium'];

    $totalFloors = count($cfg['multipliers']); // 9
    $tilesCount = $cfg['tiles'];
    $skullsCount = $cfg['skulls'];

    $floors = [];
    for ($f = 0; $f < $totalFloors; $f++) {
        // Floor row filled with gems and skulls
        $row = array_fill(0, $tilesCount, 'gem');
        // Pick random unique indices for skulls
        $skullPositions = [];
        while (count($skullPositions) < $skullsCount) {
            $pos = random_int(0, $tilesCount - 1);
            if (!in_array($pos, $skullPositions, true)) {
                $skullPositions[] = $pos;
                $row[$pos] = 'skull';
            }
        }
        $floors[] = $row;
    }

    return $floors;
}

/**
 * Get active session for user
 */
function tl_get_active_session(int $userId): ?array
{
    $db = tl_db();
    $stmt = $db->prepare("SELECT * FROM tl_sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

/**
 * Sanitize session data for client (hide unreached skulls while active)
 */
function tl_sanitize_session(array $session): array
{
    $status = $session['status'];
    $floors = json_decode($session['floors_json'], true) ?: [];
    $picks = json_decode($session['picks_json'], true) ?: [];
    $currentFloor = (int)$session['current_floor'];
    $difficulty = $session['difficulty'];
    $configs = tl_difficulties();
    $cfg = $configs[$difficulty] ?? $configs['medium'];

    $revealedFloors = [];
    foreach ($floors as $floorIdx => $row) {
        if ($status !== 'active') {
            // Game is over (cashed out or busted): reveal entire board!
            $revealedFloors[] = $row;
        } elseif ($floorIdx < $currentFloor) {
            // Already cleared floor: reveal picked tile and safe status
            $revealedFloors[] = $row;
        } else {
            // Active or future floor: hidden until picked!
            $revealedFloors[] = array_fill(0, count($row), 'hidden');
        }
    }

    return [
        'session_uuid' => $session['session_uuid'],
        'difficulty' => $difficulty,
        'stake' => (float)$session['stake'],
        'current_floor' => $currentFloor,
        'current_multiplier' => (float)$session['current_multiplier'],
        'current_win' => round((float)$session['stake'] * (float)$session['current_multiplier'], 2),
        'status' => $status,
        'total_payout' => (float)$session['total_payout'],
        'multipliers' => $cfg['multipliers'],
        'tiles_per_row' => $cfg['tiles'],
        'picks' => $picks,
        'floors' => $revealedFloors
    ];
}

/**
 * Start a new Tower Climb Game
 */
function tl_start_game(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $stake = round((float)($params['stake'] ?? 10.0), 2);
    $difficulty = strtolower(trim((string)($params['difficulty'] ?? 'medium')));

    $configs = tl_difficulties();
    if (!isset($configs[$difficulty])) {
        $difficulty = 'medium';
    }

    if ($stake < 10.0) {
        return ['code' => 1, 'msg' => 'Minimum bet is 10.00'];
    }
    if ($stake > 50000.0) {
        return ['code' => 1, 'msg' => 'Maximum bet is 50,000.00'];
    }

    // Check if user already has an active session
    $active = tl_get_active_session($userId);
    if ($active) {
        return [
            'code' => 0,
            'msg' => 'Active game resumed',
            'data' => tl_sanitize_session($active)
        ];
    }

    $currentBal = tl_get_balance($userId);
    if ($currentBal < $stake) {
        return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
    }

    $db = tl_db();
    $db->beginTransaction();
    try {
        if (!tl_debit_balance($userId, $stake)) {
            $db->rollBack();
            return ['code' => 2, 'msg' => 'Failed to debit bet amount.'];
        }

        $sessionUuid = 'tl_' . bin2hex(random_bytes(8));
        $floors = tl_generate_floors($difficulty);
        $picks = [];

        $stmt = $db->prepare("INSERT INTO tl_sessions (session_uuid, user_id, difficulty, stake, floors_json, picks_json, current_floor, current_multiplier, status, total_payout) VALUES (?, ?, ?, ?, ?, ?, 0, 1.0, 'active', 0.0)");
        $stmt->execute([
            $sessionUuid, $userId, $difficulty, $stake, json_encode($floors), json_encode($picks)
        ]);

        $db->commit();

        $session = [
            'session_uuid' => $sessionUuid,
            'difficulty' => $difficulty,
            'stake' => $stake,
            'floors_json' => json_encode($floors),
            'picks_json' => json_encode($picks),
            'current_floor' => 0,
            'current_multiplier' => 1.0,
            'status' => 'active',
            'total_payout' => 0.0
        ];

        return [
            'code' => 0,
            'msg' => 'Game started',
            'data' => array_merge(tl_sanitize_session($session), [
                'wallet_balance' => tl_get_balance($userId)
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
 * Step / Pick a Tile on the Current Floor
 */
function tl_step_game(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $sessionUuid = trim((string)($params['session_uuid'] ?? ''));
    $tileIndex = (int)($params['tile_index'] ?? 0);

    $db = tl_db();
    $stmt = $db->prepare("SELECT * FROM tl_sessions WHERE session_uuid = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$sessionUuid, $userId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        return ['code' => 1, 'msg' => 'Game session not found.'];
    }
    if ($session['status'] !== 'active') {
        return ['code' => 1, 'msg' => 'Game is already finished.', 'data' => tl_sanitize_session($session)];
    }

    $difficulty = $session['difficulty'];
    $configs = tl_difficulties();
    $cfg = $configs[$difficulty] ?? $configs['medium'];
    $multTable = $cfg['multipliers'];
    $totalFloors = count($multTable);

    $currentFloor = (int)$session['current_floor'];
    if ($currentFloor >= $totalFloors) {
        return ['code' => 1, 'msg' => 'Tower peak already reached!'];
    }

    $floors = json_decode($session['floors_json'], true) ?: [];
    $picks = json_decode($session['picks_json'], true) ?: [];

    if ($tileIndex < 0 || $tileIndex >= $cfg['tiles']) {
        return ['code' => 1, 'msg' => 'Invalid tile chosen.'];
    }

    $revealedType = $floors[$currentFloor][$tileIndex] ?? 'skull';
    $picks[] = [
        'floor' => $currentFloor,
        'tile' => $tileIndex,
        'result' => $revealedType
    ];

    $db->beginTransaction();
    try {
        if ($revealedType === 'skull') {
            // Busted! Player loses bet
            $session['status'] = 'busted';
            $session['picks_json'] = json_encode($picks);
            $session['total_payout'] = 0.0;

            $upd = $db->prepare("UPDATE tl_sessions SET status = 'busted', picks_json = ?, total_payout = 0.0, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $upd->execute([json_encode($picks), $session['id']]);

            // Record history
            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'TowerHero');
            $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
            $hist = $db->prepare("INSERT INTO tl_history (user_id, user_name, difficulty, floors_cleared, stake, payout, multiplier, status) VALUES (?, ?, ?, ?, ?, 0.0, 0.0, 'loss')");
            $hist->execute([$userId, $masked, $difficulty, $currentFloor, $session['stake']]);

            $db->commit();

            return [
                'code' => 0,
                'msg' => 'Skull triggered! Game Over.',
                'data' => array_merge(tl_sanitize_session($session), [
                    'step_result' => 'skull',
                    'revealed_type' => 'skull',
                    'wallet_balance' => tl_get_balance($userId)
                ])
            ];
        }

        // Hit a Gem! Advance floor
        $newFloor = $currentFloor + 1;
        $newMultiplier = $multTable[$currentFloor];
        $isPeak = ($newFloor >= $totalFloors);

        if ($isPeak) {
            // Reached Apex / Peak of the Tower! Auto-Cashout Maximum Jackpot!
            $payout = round((float)$session['stake'] * $newMultiplier, 2);
            tl_credit_balance($userId, $payout);

            $session['status'] = 'cashed_out';
            $session['current_floor'] = $newFloor;
            $session['current_multiplier'] = $newMultiplier;
            $session['picks_json'] = json_encode($picks);
            $session['total_payout'] = $payout;

            $upd = $db->prepare("UPDATE tl_sessions SET status = 'cashed_out', current_floor = ?, current_multiplier = ?, picks_json = ?, total_payout = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $upd->execute([$newFloor, $newMultiplier, json_encode($picks), $payout, $session['id']]);

            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'TowerHero');
            $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
            $hist = $db->prepare("INSERT INTO tl_history (user_id, user_name, difficulty, floors_cleared, stake, payout, multiplier, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'win')");
            $hist->execute([$userId, $masked, $difficulty, $newFloor, $session['stake'], $payout, $newMultiplier]);

            $db->commit();

            return [
                'code' => 0,
                'msg' => 'TOWER APEX CONQUERED! Super Jackpot Won!',
                'data' => array_merge(tl_sanitize_session($session), [
                    'step_result' => 'gem',
                    'is_apex' => true,
                    'wallet_balance' => tl_get_balance($userId)
                ])
            ];
        }

        // Normal gem clear: floor advanced, player can pick next or cash out
        $session['current_floor'] = $newFloor;
        $session['current_multiplier'] = $newMultiplier;
        $session['picks_json'] = json_encode($picks);

        $upd = $db->prepare("UPDATE tl_sessions SET current_floor = ?, current_multiplier = ?, picks_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $upd->execute([$newFloor, $newMultiplier, json_encode($picks), $session['id']]);

        $db->commit();

        return [
            'code' => 0,
            'msg' => 'Floor cleared! Next level unlocked.',
            'data' => array_merge(tl_sanitize_session($session), [
                'step_result' => 'gem',
                'is_apex' => false,
                'wallet_balance' => tl_get_balance($userId)
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
 * Cashout current winnings
 */
function tl_cashout_game(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $sessionUuid = trim((string)($params['session_uuid'] ?? ''));

    $db = tl_db();
    $stmt = $db->prepare("SELECT * FROM tl_sessions WHERE session_uuid = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$sessionUuid, $userId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        return ['code' => 1, 'msg' => 'Game session not found.'];
    }
    if ($session['status'] !== 'active') {
        return ['code' => 1, 'msg' => 'Game is not active.', 'data' => tl_sanitize_session($session)];
    }

    $currentFloor = (int)$session['current_floor'];
    if ($currentFloor <= 0) {
        return ['code' => 1, 'msg' => 'You must clear at least 1 floor before cashing out.'];
    }

    $multiplier = (float)$session['current_multiplier'];
    $stake = (float)$session['stake'];
    $payout = round($stake * $multiplier, 2);

    $db->beginTransaction();
    try {
        tl_credit_balance($userId, $payout);

        $session['status'] = 'cashed_out';
        $session['total_payout'] = $payout;

        $upd = $db->prepare("UPDATE tl_sessions SET status = 'cashed_out', total_payout = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $upd->execute([$payout, $session['id']]);

        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'TowerHero');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
        $hist = $db->prepare("INSERT INTO tl_history (user_id, user_name, difficulty, floors_cleared, stake, payout, multiplier, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'win')");
        $hist->execute([$userId, $masked, $session['difficulty'], $currentFloor, $stake, $payout, $multiplier]);

        $db->commit();

        return [
            'code' => 0,
            'msg' => 'Cashed out successfully!',
            'data' => array_merge(tl_sanitize_session($session), [
                'wallet_balance' => tl_get_balance($userId)
            ])
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Server error: ' . $e->getMessage()];
    }
}
