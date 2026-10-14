<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function jf_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS jf_shots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            shot_uuid VARCHAR(64) UNIQUE,
            stake_amount DECIMAL(18,4) NOT NULL,
            fish_type VARCHAR(32) NOT NULL,
            multiplier DECIMAL(10,2) DEFAULT 0,
            payout_amount DECIMAL(18,4) DEFAULT 0,
            is_jackpot INT DEFAULT 0,
            jackpot_type VARCHAR(20) NULL,
            caught INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS jf_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            fish_name VARCHAR(64) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            jackpot_badge VARCHAR(20) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial jackpot catches ticker if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM jf_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***6621', 'fish_name' => 'Megalodon Dragon', 'multiplier' => 666.00, 'payout' => 6660.00, 'jackpot_badge' => 'GRAND'],
                ['user_name' => '018***3319', 'fish_name' => 'Golden Turtle', 'multiplier' => 250.00, 'payout' => 2500.00, 'jackpot_badge' => 'MAJOR'],
                ['user_name' => '019***8842', 'fish_name' => 'Treasure Box', 'multiplier' => 120.00, 'payout' => 2400.00, 'jackpot_badge' => 'MINI'],
                ['user_name' => '016***4471', 'fish_name' => 'Hammerhead Shark', 'multiplier' => 60.00, 'payout' => 1200.00, 'jackpot_badge' => ''],
                ['user_name' => '013***1198', 'fish_name' => 'Bomb Crab', 'multiplier' => 25.00, 'payout' => 500.00, 'jackpot_badge' => ''],
            ];
            $stmt = $pdo->prepare("INSERT INTO jf_history (user_id, user_name, fish_name, multiplier, payout, jackpot_badge) VALUES (1, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['fish_name'], $s['multiplier'], $s['payout'], $s['jackpot_badge']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

function jf_get_balance(int $userId): float
{
    $db = jf_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return 0.0;
    return max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));
}

function jf_debit_balance(int $userId, float $amount): bool
{
    $db = jf_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = CASE WHEN wallet_balance >= ? THEN wallet_balance - ? ELSE 0 END, 
        game_balance = CASE WHEN game_balance >= ? THEN game_balance - ? ELSE 0 END, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $amount, $amount, $userId]);
}

function jf_credit_balance(int $userId, float $amount): bool
{
    $db = jf_db();
    $amount = round($amount, 2);
    $stmt = $db->prepare("UPDATE api_users SET 
        wallet_balance = wallet_balance + ?, 
        game_balance = game_balance + ?, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?");
    return $stmt->execute([$amount, $amount, $userId]);
}

/**
 * Fish configs and mathematics for Jackpot Fishing
 */
function jf_fish_types(): array
{
    return [
        'clownfish' => [
            'name' => 'Clownfish',
            'multiplier' => 2.0,
            'base_rate' => 48.0,
            'icon' => '🐠',
            'color' => '#ff793f',
            'size' => 38,
            'speed' => 2.2,
            'is_boss' => false
        ],
        'flyingfish' => [
            'name' => 'Flying Fish',
            'multiplier' => 3.0,
            'base_rate' => 32.0,
            'icon' => '🐟',
            'color' => '#00d2d3',
            'size' => 42,
            'speed' => 2.0,
            'is_boss' => false
        ],
        'angelfish' => [
            'name' => 'Golden Angelfish',
            'multiplier' => 5.0,
            'base_rate' => 19.0,
            'icon' => '🐡',
            'color' => '#fbc531',
            'size' => 48,
            'speed' => 1.7,
            'is_boss' => false
        ],
        'pufferfish' => [
            'name' => 'Spiky Pufferfish',
            'multiplier' => 8.0,
            'base_rate' => 12.0,
            'icon' => '🐡',
            'color' => '#4cd137',
            'size' => 54,
            'speed' => 1.4,
            'is_boss' => false
        ],
        'electric_ray' => [
            'name' => 'Electric Manta Ray',
            'multiplier' => 15.0,
            'base_rate' => 6.4,
            'icon' => '🪼',
            'color' => '#9c88ff',
            'size' => 66,
            'speed' => 1.2,
            'is_boss' => false
        ],
        'bomb_crab' => [
            'name' => 'Armored Bomb Crab',
            'multiplier' => 25.0,
            'base_rate' => 3.8,
            'icon' => '🦀',
            'color' => '#e84118',
            'size' => 74,
            'speed' => 1.1,
            'is_boss' => false
        ],
        'hammerhead' => [
            'name' => 'Hammerhead Shark',
            'multiplier' => 60.0,
            'base_rate' => 1.6,
            'icon' => '🦈',
            'color' => '#00a8ff',
            'size' => 96,
            'speed' => 1.5,
            'is_boss' => true
        ],
        'treasure_box' => [
            'name' => 'Sunken Treasure Chest',
            'multiplier' => 120.0,
            'base_rate' => 0.8,
            'icon' => '📦',
            'color' => '#ffd700',
            'size' => 88,
            'speed' => 0.9,
            'is_boss' => true
        ],
        'golden_turtle' => [
            'name' => 'Jackpot Golden Turtle',
            'multiplier' => 250.0,
            'base_rate' => 0.38,
            'icon' => '🐢',
            'color' => '#e1b12c',
            'size' => 110,
            'speed' => 0.8,
            'is_boss' => true
        ],
        'megalodon_dragon' => [
            'name' => 'Megalodon Dragon King',
            'multiplier' => 666.0,
            'base_rate' => 0.14,
            'icon' => '🐲',
            'color' => '#e74c3c',
            'size' => 135,
            'speed' => 0.7,
            'is_boss' => true
        ]
    ];
}

/**
 * Execute a Jackpot Fishing Shot
 */
function jf_execute_shot(array $user, float $stake, string $fishType, bool $isSkill = false): array
{
    $db = jf_db();
    $userId = (int)$user['id'];
    $stake = max(1.0, round($stake, 2));

    $fishList = jf_fish_types();
    if (!isset($fishList[$fishType])) {
        $fishType = 'clownfish';
    }
    $fish = $fishList[$fishType];

    $balance = jf_get_balance($userId);
    if ($balance < $stake) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    $db->beginTransaction();
    try {
        jf_debit_balance($userId, $stake);

        // Calculate catch probability with RNG
        $baseRate = (float)$fish['base_rate'];
        if ($isSkill) {
            $baseRate *= 1.5; // Skill increases catch chance
        }

        $rand = mt_rand(1, 10000) / 100.0;
        $isCaught = ($rand <= $baseRate);

        $multiplier = 0.0;
        $payout = 0.0;
        $jackpotType = '';
        $isJackpot = false;

        if ($isCaught) {
            $multiplier = (float)$fish['multiplier'];

            // Chance for special jackpot bonus on high bosses
            if ($fishType === 'megalodon_dragon') {
                $isJackpot = true;
                $jackpotType = (mt_rand(1, 10) === 1) ? 'GRAND' : 'MAJOR';
                if ($jackpotType === 'GRAND') $multiplier += 200.0;
            } elseif ($fishType === 'golden_turtle') {
                $isJackpot = true;
                $jackpotType = 'MINI';
                $multiplier += 50.0;
            }

            $payout = round($stake * $multiplier, 2);
            jf_credit_balance($userId, $payout);

            // Log big catches into history ticker
            $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'Player');
            $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;

            $stmt = $db->prepare("INSERT INTO jf_history (user_id, user_name, fish_name, multiplier, payout, jackpot_badge) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $masked, $fish['name'], $multiplier, $payout, $jackpotType]);
        }

        $shotUuid = 'jf_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO jf_shots (user_id, shot_uuid, stake_amount, fish_type, multiplier, payout_amount, is_jackpot, jackpot_type, caught) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $shotUuid, $stake, $fishType, $multiplier, $payout, $isJackpot ? 1 : 0, $jackpotType, $isCaught ? 1 : 0]);

        $db->commit();

        $newBal = jf_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $isCaught ? 'Fish caught!' : 'Shot registered',
            'data' => [
                'shot_uuid' => $shotUuid,
                'stake' => $stake,
                'fish_type' => $fishType,
                'fish_name' => $fish['name'],
                'is_caught' => $isCaught,
                'multiplier' => $multiplier,
                'payout' => $payout,
                'is_jackpot' => $isJackpot,
                'jackpot_type' => $jackpotType,
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Shot error: ' . $e->getMessage()];
    }
}
