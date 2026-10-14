<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function mines_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS mines_rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            round_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            stake_amount DECIMAL(18,4) NOT NULL,
            mines_count INT NOT NULL,
            mines_json TEXT NOT NULL,
            revealed_json TEXT NOT NULL,
            current_step INT DEFAULT 0,
            current_multiplier DECIMAL(10,2) DEFAULT 1.00,
            status VARCHAR(20) DEFAULT 'playing',
            payout_amount DECIMAL(18,4) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS mines_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            mines_count INT NOT NULL,
            gems_found INT NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed some exciting history ticker rows if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM mines_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***9912', 'mines_count' => 3, 'gems_found' => 8, 'multiplier' => 3.25, 'payout' => 650.00],
                ['user_name' => '018***4321', 'mines_count' => 5, 'gems_found' => 6, 'multiplier' => 5.80, 'payout' => 1160.00],
                ['user_name' => '019***7789', 'mines_count' => 10, 'gems_found' => 4, 'multiplier' => 8.90, 'payout' => 890.00],
                ['user_name' => '016***1124', 'mines_count' => 3, 'gems_found' => 12, 'multiplier' => 11.20, 'payout' => 2240.00],
                ['user_name' => '013***8850', 'mines_count' => 1, 'gems_found' => 18, 'multiplier' => 3.65, 'payout' => 1825.00],
            ];
            $stmt = $pdo->prepare("INSERT INTO mines_history (user_id, user_name, mines_count, gems_found, multiplier, payout) VALUES (1, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['mines_count'], $s['gems_found'], $s['multiplier'], $s['payout']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function mines_get_balance(int $userId): float
{
    $db = mines_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return 0.0;
    return max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));
}

function mines_debit_balance(int $userId, float $amount): bool
{
    $db = mines_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = CASE WHEN wallet_balance >= ? THEN wallet_balance - ? ELSE 0 END, 
        game_balance = CASE WHEN game_balance >= ? THEN game_balance - ? ELSE 0 END, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $amount, $amount, $userId]);
}

function mines_credit_balance(int $userId, float $amount): bool
{
    $db = mines_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = wallet_balance + ?, 
        game_balance = game_balance + ?, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $userId]);
}

/**
 * Multiplier Calculation for Mines Game
 * Total tiles: 25.
 * Step: number of gems successfully revealed (1-indexed).
 */
function mines_calculate_multiplier(int $minesCount, int $step): float
{
    if ($step <= 0) return 1.00;
    $totalTiles = 25;
    $safeTiles = $totalTiles - $minesCount;
    if ($step > $safeTiles) $step = $safeTiles;

    $prob = 1.0;
    for ($i = 0; $i < $step; $i++) {
        $prob *= ($safeTiles - $i) / ($totalTiles - $i);
    }

    if ($prob <= 0) return 1.00;
    $houseEdge = 0.97; // 97% Fair RTP
    $mult = $houseEdge / $prob;
    return max(1.01, round($mult, 2));
}

/**
 * Generate randomly distributed mine locations on 5x5 grid (0 to 24)
 */
function mines_generate_locations(int $minesCount): array
{
    $allTiles = range(0, 24);
    shuffle($allTiles);
    $mines = array_slice($allTiles, 0, $minesCount);
    sort($mines);
    return $mines;
}

/**
 * Start a new Mines round
 */
function mines_start_round(array $user, float $stake, int $minesCount): array
{
    $db = mines_db();
    $userId = (int)$user['id'];
    $stake = max(1.0, round($stake, 2));

    if ($minesCount < 1) $minesCount = 1;
    if ($minesCount > 24) $minesCount = 24;

    $balance = mines_get_balance($userId);
    if ($balance < $stake) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    // Cancel any old active round for user
    $db->prepare("UPDATE mines_rounds SET status = 'crashed', updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = 'playing'")->execute([$userId]);

    $db->beginTransaction();
    try {
        mines_debit_balance($userId, $stake);

        $roundUuid = 'min_' . bin2hex(random_bytes(10));
        $mines = mines_generate_locations($minesCount);

        $stmt = $db->prepare("INSERT INTO mines_rounds 
            (round_uuid, user_id, stake_amount, mines_count, mines_json, revealed_json, current_step, current_multiplier, status) 
            VALUES (?, ?, ?, ?, ?, '[]', 0, 1.00, 'playing')");
        $stmt->execute([$roundUuid, $userId, $stake, $minesCount, json_encode($mines)]);

        $db->commit();

        $newBal = mines_get_balance($userId);
        $nextMult = mines_calculate_multiplier($minesCount, 1);

        return [
            'code' => 0,
            'msg' => 'Round started',
            'data' => [
                'round_uuid' => $roundUuid,
                'stake' => $stake,
                'mines_count' => $minesCount,
                'safe_tiles' => 25 - $minesCount,
                'current_step' => 0,
                'current_multiplier' => 1.00,
                'next_multiplier' => $nextMult,
                'wallet_balance' => $newBal,
                'status' => 'playing'
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Server error: ' . $e->getMessage()];
    }
}

/**
 * Pick/Reveal a tile in active round
 */
function mines_reveal_tile(array $user, string $roundUuid, int $tileIndex): array
{
    $db = mines_db();
    $userId = (int)$user['id'];

    if ($tileIndex < 0 || $tileIndex > 24) {
        return ['code' => 400, 'msg' => 'Invalid tile selection.'];
    }

    $stmt = $db->prepare("SELECT * FROM mines_rounds WHERE round_uuid = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$roundUuid, $userId]);
    $round = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$round) {
        return ['code' => 404, 'msg' => 'Game round not found.'];
    }

    if ($round['status'] !== 'playing') {
        return ['code' => 400, 'msg' => 'Round is already closed.'];
    }

    $mines = json_decode($round['mines_json'], true) ?: [];
    $revealed = json_decode($round['revealed_json'], true) ?: [];

    if (in_array($tileIndex, $revealed, true)) {
        return ['code' => 400, 'msg' => 'Tile already revealed.'];
    }

    $stake = (float)$round['stake_amount'];
    $minesCount = (int)$round['mines_count'];
    $safeTotal = 25 - $minesCount;

    // Check if tile is a Mine
    if (in_array($tileIndex, $mines, true)) {
        // BOOM! Crashed!
        $db->prepare("UPDATE mines_rounds SET status = 'crashed', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
           ->execute([(int)$round['id']]);

        return [
            'code' => 0,
            'msg' => 'BOOM! Hit a mine!',
            'data' => [
                'round_uuid' => $roundUuid,
                'tile' => $tileIndex,
                'is_mine' => true,
                'status' => 'crashed',
                'all_mines' => $mines,
                'revealed' => $revealed,
                'payout' => 0.0,
                'wallet_balance' => mines_get_balance($userId)
            ]
        ];
    }

    // Safe Gem!
    $revealed[] = $tileIndex;
    $newStep = (int)$round['current_step'] + 1;
    $newMult = mines_calculate_multiplier($minesCount, $newStep);
    $nextMult = ($newStep < $safeTotal) ? mines_calculate_multiplier($minesCount, $newStep + 1) : $newMult;
    $currentPayout = round($stake * $newMult, 2);

    $isAllCleared = ($newStep >= $safeTotal);

    $db->beginTransaction();
    try {
        if ($isAllCleared) {
            // Auto jackpot cashout when all gems found!
            mines_credit_balance($userId, $currentPayout);
            $stmt = $db->prepare("UPDATE mines_rounds SET 
                revealed_json = ?, current_step = ?, current_multiplier = ?, status = 'cashed_out', payout_amount = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?");
            $stmt->execute([json_encode($revealed), $newStep, $newMult, $currentPayout, (int)$round['id']]);

            // Log to history
            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Player');
            $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
            $db->prepare("INSERT INTO mines_history (user_id, user_name, mines_count, gems_found, multiplier, payout) VALUES (?, ?, ?, ?, ?, ?)")
               ->execute([$userId, $masked, $minesCount, $newStep, $newMult, $currentPayout]);
        } else {
            $stmt = $db->prepare("UPDATE mines_rounds SET 
                revealed_json = ?, current_step = ?, current_multiplier = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?");
            $stmt->execute([json_encode($revealed), $newStep, $newMult, (int)$round['id']]);
        }

        $db->commit();

        $balance = mines_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $isAllCleared ? 'Jackpot! All gems cleared!' : 'Gem revealed!',
            'data' => [
                'round_uuid' => $roundUuid,
                'tile' => $tileIndex,
                'is_mine' => false,
                'current_step' => $newStep,
                'current_multiplier' => $newMult,
                'next_multiplier' => $nextMult,
                'current_payout' => $currentPayout,
                'status' => $isAllCleared ? 'cashed_out' : 'playing',
                'is_all_cleared' => $isAllCleared,
                'all_mines' => $isAllCleared ? $mines : [],
                'revealed' => $revealed,
                'wallet_balance' => $balance
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Reveal error: ' . $e->getMessage()];
    }
}

/**
 * Cash out the accumulated winnings
 */
function mines_cashout(array $user, string $roundUuid): array
{
    $db = mines_db();
    $userId = (int)$user['id'];

    $stmt = $db->prepare("SELECT * FROM mines_rounds WHERE round_uuid = ? AND user_id = ? LIMIT 1");
    $stmt->execute([$roundUuid, $userId]);
    $round = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$round) {
        return ['code' => 404, 'msg' => 'Round not found.'];
    }

    if ($round['status'] !== 'playing') {
        return ['code' => 400, 'msg' => 'Round cannot be cashed out (status: ' . $round['status'] . ').'];
    }

    $step = (int)$round['current_step'];
    if ($step < 1) {
        return ['code' => 400, 'msg' => 'Must reveal at least 1 diamond before cashing out.'];
    }

    $stake = (float)$round['stake_amount'];
    $mult = (float)$round['current_multiplier'];
    $payout = round($stake * $mult, 2);
    $mines = json_decode($round['mines_json'], true) ?: [];
    $minesCount = (int)$round['mines_count'];

    $db->beginTransaction();
    try {
        mines_credit_balance($userId, $payout);

        $stmt = $db->prepare("UPDATE mines_rounds SET status = 'cashed_out', payout_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$payout, (int)$round['id']]);

        // History entry
        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Player');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
        $db->prepare("INSERT INTO mines_history (user_id, user_name, mines_count, gems_found, multiplier, payout) VALUES (?, ?, ?, ?, ?, ?)")
           ->execute([$userId, $masked, $minesCount, $step, $mult, $payout]);

        $db->commit();

        $balance = mines_get_balance($userId);

        return [
            'code' => 0,
            'msg' => 'Cashed out successfully!',
            'data' => [
                'round_uuid' => $roundUuid,
                'status' => 'cashed_out',
                'gems_found' => $step,
                'multiplier' => $mult,
                'payout' => $payout,
                'all_mines' => $mines,
                'wallet_balance' => $balance
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Cashout error: ' . $e->getMessage()];
    }
}
