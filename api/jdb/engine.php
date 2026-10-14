<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function jdb_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS jdb_shots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            shot_uuid VARCHAR(64) UNIQUE,
            stake_amount DECIMAL(18,4) NOT NULL,
            fish_type VARCHAR(32) NOT NULL,
            multiplier DECIMAL(10,2) DEFAULT 0,
            payout_amount DECIMAL(18,4) DEFAULT 0,
            caught INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS jdb_slot_spins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            bet_amount DECIMAL(18,4) NOT NULL,
            reels_json TEXT NOT NULL,
            win_amount DECIMAL(18,4) DEFAULT 0,
            is_jackpot INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS jdb_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            game_type VARCHAR(20) NOT NULL,
            item_name VARCHAR(32) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed some initial exciting history ticker items if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM jdb_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***4821', 'game_type' => 'fishing', 'item_name' => 'Golden Dragon', 'multiplier' => 150.00, 'payout' => 3000.00],
                ['user_name' => '018***9923', 'game_type' => 'slot', 'item_name' => 'Super Niubi Bull', 'multiplier' => 200.00, 'payout' => 4000.00],
                ['user_name' => '019***1204', 'game_type' => 'fishing', 'item_name' => 'Cai Shen', 'multiplier' => 388.00, 'payout' => 7760.00],
                ['user_name' => '016***5519', 'game_type' => 'fishing', 'item_name' => 'Great White Shark', 'multiplier' => 50.00, 'payout' => 1000.00],
                ['user_name' => '013***3341', 'game_type' => 'slot', 'item_name' => 'Sycee Ingot', 'multiplier' => 50.00, 'payout' => 2500.00],
            ];
            $stmt = $pdo->prepare("INSERT INTO jdb_history (user_id, user_name, game_type, item_name, multiplier, payout) VALUES (1, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['game_type'], $s['item_name'], $s['multiplier'], $s['payout']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function jdb_get_balance(int $userId): float
{
    $db = jdb_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return 0.0;
    return max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));
}

function jdb_debit_balance(int $userId, float $amount): bool
{
    $db = jdb_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = CASE WHEN wallet_balance >= ? THEN wallet_balance - ? ELSE 0 END, 
        game_balance = CASE WHEN game_balance >= ? THEN game_balance - ? ELSE 0 END, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $amount, $amount, $userId]);
}

function jdb_credit_balance(int $userId, float $amount): bool
{
    $db = jdb_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = wallet_balance + ?, 
        game_balance = game_balance + ?, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $userId]);
}

/**
 * JDB Fishing Specifications
 */
function jdb_fish_types(): array
{
    return [
        'clownfish' => [
            'name' => 'Clownfish',
            'multiplier' => 2.0,
            'base_rate' => 48, // 48% catch rate
            'icon' => '🐠',
            'color' => '#ff793f',
            'size' => 38,
            'speed' => 2.2
        ],
        'butterfly' => [
            'name' => 'Butterfly Fish',
            'multiplier' => 3.0,
            'base_rate' => 32, // 32%
            'icon' => '🐟',
            'color' => '#fbc531',
            'size' => 44,
            'speed' => 2.0
        ],
        'puffer' => [
            'name' => 'Pufferfish',
            'multiplier' => 5.0,
            'base_rate' => 19, // 19%
            'icon' => '🐡',
            'color' => '#e1b12c',
            'size' => 52,
            'speed' => 1.8
        ],
        'turtle' => [
            'name' => 'Sea Turtle',
            'multiplier' => 10.0,
            'base_rate' => 9.5, // 9.5%
            'icon' => '🐢',
            'color' => '#4cd137',
            'size' => 64,
            'speed' => 1.4
        ],
        'jellyfish' => [
            'name' => 'Electric Jellyfish',
            'multiplier' => 20.0,
            'base_rate' => 4.8, // 4.8%
            'icon' => '🪼',
            'color' => '#9c88ff',
            'size' => 70,
            'speed' => 1.2
        ],
        'shark' => [
            'name' => 'Great White Shark',
            'multiplier' => 50.0,
            'base_rate' => 1.9, // 1.9%
            'icon' => '🦈',
            'color' => '#00a8ff',
            'size' => 96,
            'speed' => 1.6
        ],
        'dragon' => [
            'name' => 'Golden Dragon King',
            'multiplier' => 150.0,
            'base_rate' => 0.64, // 0.64%
            'icon' => '🐲',
            'color' => '#f1c40f',
            'size' => 125,
            'speed' => 1.0
        ],
        'caishen' => [
            'name' => 'Cai Shen God of Wealth',
            'multiplier' => 388.0,
            'base_rate' => 0.25, // 0.25% Mega Boss
            'icon' => '🧧',
            'color' => '#e74c3c',
            'size' => 140,
            'speed' => 0.8
        ]
    ];
}

/**
 * Process a Fishing shot
 */
function jdb_fishing_shoot(array $user, float $stake, string $fishType): array
{
    $db = jdb_db();
    $userId = (int)$user['id'];
    $stake = max(1.0, round($stake, 2));

    $fishList = jdb_fish_types();
    if (!isset($fishList[$fishType])) {
        $fishType = 'clownfish';
    }
    $fish = $fishList[$fishType];

    $balance = jdb_get_balance($userId);
    if ($balance < $stake) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    $db->beginTransaction();
    try {
        // Debit shot cost
        jdb_debit_balance($userId, $stake);

        // RNG calculation for fish catch
        // Multiplier * probability ~ 0.96 (RTP 96%)
        $rand = mt_rand(1, 10000) / 100.0;
        $isCaught = ($rand <= $fish['base_rate']);

        $payout = 0.0;
        $multiplier = 0.0;

        if ($isCaught) {
            $multiplier = (float)$fish['multiplier'];
            $payout = round($stake * $multiplier, 2);
            jdb_credit_balance($userId, $payout);

            // Log high multiplier catches into public history
            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Player');
            if (strlen($userName) > 6) {
                $masked = substr($userName, 0, 3) . '***' . substr($userName, -4);
            } else {
                $masked = $userName;
            }

            $stmt = $db->prepare("INSERT INTO jdb_history (user_id, user_name, game_type, item_name, multiplier, payout) VALUES (?, ?, 'fishing', ?, ?, ?)");
            $stmt->execute([$userId, $masked, $fish['name'], $multiplier, $payout]);
        }

        $shotUuid = 'sht_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO jdb_shots (user_id, shot_uuid, stake_amount, fish_type, multiplier, payout_amount, caught) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $shotUuid, $stake, $fishType, $multiplier, $payout, $isCaught ? 1 : 0]);

        $db->commit();

        $newBalance = jdb_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $isCaught ? 'Caught!' : 'Shot registered',
            'data' => [
                'shot_uuid' => $shotUuid,
                'stake' => $stake,
                'fish_type' => $fishType,
                'fish_name' => $fish['name'],
                'is_caught' => $isCaught,
                'multiplier' => $multiplier,
                'payout' => $payout,
                'wallet_balance' => $newBalance
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Shoot error: ' . $e->getMessage()];
    }
}

/**
 * Super Niubi Slot Specifications & Spin
 */
function jdb_slot_symbols(): array
{
    return [
        0 => ['name' => 'Firecracker', 'icon' => '🧨', 'mult' => 2.0, 'weight' => 34],
        1 => ['name' => 'Red Envelope', 'icon' => '🧧', 'mult' => 5.0, 'weight' => 26],
        2 => ['name' => 'Silk Lantern', 'icon' => '🏮', 'mult' => 10.0, 'weight' => 18],
        3 => ['name' => 'Ancient Coins', 'icon' => '🪙', 'mult' => 25.0, 'weight' => 11],
        4 => ['name' => 'Golden Ingot', 'icon' => '💰', 'mult' => 50.0, 'weight' => 6],
        5 => ['name' => 'Golden Bull', 'icon' => '🐂', 'mult' => 150.0, 'weight' => 3],
        6 => ['name' => 'Wild Thunder Bull', 'icon' => '⚡', 'mult' => 388.0, 'weight' => 2], // Wild & Jackpot
    ];
}

function jdb_slot_spin(array $user, float $betAmount): array
{
    $db = jdb_db();
    $userId = (int)$user['id'];
    $betAmount = max(1.0, round($betAmount, 2));

    $balance = jdb_get_balance($userId);
    if ($balance < $betAmount) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    $symbols = jdb_slot_symbols();

    // Reel RNG
    $weights = [];
    foreach ($symbols as $id => $s) {
        $weights[$id] = $s['weight'];
    }

    $getRandomSymbol = function() use ($weights): int {
        $r = mt_rand(1, 100);
        $curr = 0;
        foreach ($weights as $symId => $w) {
            $curr += $w;
            if ($r <= $curr) return $symId;
        }
        return 0;
    };

    // 3x3 Grid: 3 rows, 3 columns
    $grid = [
        [$getRandomSymbol(), $getRandomSymbol(), $getRandomSymbol()],
        [$getRandomSymbol(), $getRandomSymbol(), $getRandomSymbol()],
        [$getRandomSymbol(), $getRandomSymbol(), $getRandomSymbol()],
    ];

    // 5 Paylines:
    // Line 0: Middle row [1,0], [1,1], [1,2]
    // Line 1: Top row [0,0], [0,1], [0,2]
    // Line 2: Bottom row [2,0], [2,1], [2,2]
    // Line 3: Diagonal top-left to bottom-right [0,0], [1,1], [2,2]
    // Line 4: Diagonal bottom-left to top-right [2,0], [1,1], [0,2]
    $paylines = [
        0 => ['name' => 'Middle Row', 'coords' => [[1,0], [1,1], [1,2]]],
        1 => ['name' => 'Top Row', 'coords' => [[0,0], [0,1], [0,2]]],
        2 => ['name' => 'Bottom Row', 'coords' => [[2,0], [2,1], [2,2]]],
        3 => ['name' => 'Diagonal ↘', 'coords' => [[0,0], [1,1], [2,2]]],
        4 => ['name' => 'Diagonal ↗', 'coords' => [[2,0], [1,1], [0,2]]],
    ];

    $winLines = [];
    $totalMultiplier = 0.0;
    $isJackpot = false;

    foreach ($paylines as $lineIdx => $lineDef) {
        $c = $lineDef['coords'];
        $s0 = $grid[$c[0][0]][$c[0][1]];
        $s1 = $grid[$c[1][0]][$c[1][1]];
        $s2 = $grid[$c[2][0]][$c[2][1]];

        // Symbol 6 is WILD (substitutes for any symbol)
        $match = false;
        $evalSym = -1;

        if ($s0 === $s1 && $s1 === $s2) {
            $match = true;
            $evalSym = $s0;
        } elseif ($s0 === 6 && $s1 === $s2) {
            $match = true;
            $evalSym = $s1;
        } elseif ($s1 === 6 && $s0 === $s2) {
            $match = true;
            $evalSym = $s0;
        } elseif ($s2 === 6 && $s0 === $s1) {
            $match = true;
            $evalSym = $s0;
        } elseif (($s0 === 6 && $s1 === 6) || ($s1 === 6 && $s2 === 6) || ($s0 === 6 && $s2 === 6)) {
            $match = true;
            $evalSym = ($s0 !== 6) ? $s0 : (($s1 !== 6) ? $s1 : $s2);
        }

        if ($match) {
            $symData = $symbols[$evalSym] ?? $symbols[0];
            $mult = (float)$symData['mult'];
            if ($evalSym === 6 || $evalSym === 5) {
                $isJackpot = true;
            }
            $totalMultiplier += $mult;
            $winLines[] = [
                'line' => $lineIdx,
                'name' => $lineDef['name'],
                'symbol_id' => $evalSym,
                'symbol_name' => $symData['name'],
                'symbol_icon' => $symData['icon'],
                'multiplier' => $mult,
                'coords' => $c
            ];
        }
    }

    $winAmount = round(($betAmount / 5.0) * $totalMultiplier, 2);

    $db->beginTransaction();
    try {
        jdb_debit_balance($userId, $betAmount);
        if ($winAmount > 0) {
            jdb_credit_balance($userId, $winAmount);

            // Log big wins to history
            if ($winAmount >= $betAmount * 5) {
                $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Player');
                if (strlen($userName) > 6) {
                    $masked = substr($userName, 0, 3) . '***' . substr($userName, -4);
                } else {
                    $masked = $userName;
                }
                $bestSym = $winLines[0]['symbol_name'] ?? 'Super Niubi';
                $stmt = $db->prepare("INSERT INTO jdb_history (user_id, user_name, game_type, item_name, multiplier, payout) VALUES (?, ?, 'slot', ?, ?, ?)");
                $stmt->execute([$userId, $masked, $bestSym, $totalMultiplier, $winAmount]);
            }
        }

        $stmt = $db->prepare("INSERT INTO jdb_slot_spins (user_id, bet_amount, reels_json, win_amount, is_jackpot) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $betAmount, json_encode($grid), $winAmount, $isJackpot ? 1 : 0]);

        $db->commit();

        $newBalance = jdb_get_balance($userId);

        return [
            'code' => 0,
            'msg' => 'Spin completed',
            'data' => [
                'reels' => $grid,
                'win_lines' => $winLines,
                'total_multiplier' => $totalMultiplier,
                'win_amount' => $winAmount,
                'is_win' => $winAmount > 0,
                'is_jackpot' => $isJackpot,
                'wallet_balance' => $newBalance,
                'bet_amount' => $betAmount
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Spin error: ' . $e->getMessage()];
    }
}
