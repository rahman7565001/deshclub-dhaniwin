<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function keno_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS keno_draws (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            draw_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            picks_json TEXT NOT NULL,
            picks_count INT NOT NULL,
            drawn_balls_json TEXT NOT NULL,
            hits_json TEXT NOT NULL,
            hits_count INT NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL DEFAULT 0.0,
            payout DECIMAL(18,4) NOT NULL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS keno_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            picks_count INT NOT NULL,
            hits_count INT NOT NULL,
            stake DECIMAL(18,4) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Seed initial history if empty
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM keno_history")->fetchColumn();
        if ($cnt === 0) {
            $seeds = [
                ['user_name' => '017***3311', 'picks' => 5,  'hits' => 4,  'stake' => 100.0, 'payout' => 1200.0, 'mult' => 12.0],
                ['user_name' => '018***6622', 'picks' => 3,  'hits' => 3,  'stake' => 50.0,  'payout' => 2300.0, 'mult' => 46.0],
                ['user_name' => '019***8844', 'picks' => 8,  'hits' => 6,  'stake' => 20.0,  'payout' => 1200.0, 'mult' => 60.0],
                ['user_name' => '016***5500', 'picks' => 10, 'hits' => 7,  'stake' => 50.0,  'payout' => 3000.0, 'mult' => 60.0],
                ['user_name' => '013***1199', 'picks' => 2,  'hits' => 2,  'stake' => 100.0, 'payout' => 900.0,  'mult' => 9.0],
                ['user_name' => '017***7733', 'picks' => 6,  'hits' => 5,  'stake' => 50.0,  'payout' => 2500.0, 'mult' => 50.0],
            ];
            $stmt = $pdo->prepare("INSERT INTO keno_history (user_id, user_name, picks_count, hits_count, stake, payout, multiplier) VALUES (1, ?, ?, ?, ?, ?, ?)");
            foreach ($seeds as $s) {
                $stmt->execute([$s['user_name'], $s['picks'], $s['hits'], $s['stake'], $s['payout'], $s['mult']]);
            }
        }

        $initialized = true;
    }
    return $pdo;
}

/**
 * Authentic Vegas Keno Paytables for Picks 1 to 10
 */
function keno_paytables(): array
{
    return [
        1 => [1 => 3.84],
        2 => [1 => 1.0, 2 => 9.0],
        3 => [2 => 2.5, 3 => 46.0],
        4 => [2 => 1.5, 3 => 8.0, 4 => 90.0],
        5 => [3 => 3.0, 4 => 12.0, 5 => 300.0],
        6 => [3 => 2.0, 4 => 6.0, 5 => 50.0, 6 => 800.0],
        7 => [3 => 1.5, 4 => 3.5, 5 => 15.0, 6 => 120.0, 7 => 2000.0],
        8 => [4 => 2.5, 5 => 8.0, 6 => 60.0, 7 => 400.0, 8 => 5000.0],
        9 => [4 => 2.0, 5 => 5.0, 6 => 25.0, 7 => 150.0, 8 => 1000.0, 9 => 8000.0],
        10 => [4 => 1.5, 5 => 4.0, 6 => 15.0, 7 => 60.0, 8 => 300.0, 9 => 2000.0, 10 => 10000.0]
    ];
}

function keno_get_balance(int $userId): float
{
    $db = keno_db();
    $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ? OR user_id = ? LIMIT 1");
    $stmt->execute([$userId, $userId]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) return 0.0;
    return max((float)($u['wallet_balance'] ?? 0), (float)($u['game_balance'] ?? 0));
}

function keno_debit_balance(int $userId, float $amount): bool
{
    $db = keno_db();
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

function keno_credit_balance(int $userId, float $amount): bool
{
    $db = keno_db();
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
 * Draw 20 Unique Balls from 1 to 80 (Cryptographically Secure)
 */
function keno_draw_20_balls(): array
{
    $pool = range(1, 80);
    $drawn = [];
    for ($i = 0; $i < 20; $i++) {
        $idx = random_int(0, count($pool) - 1);
        $drawn[] = $pool[$idx];
        array_splice($pool, $idx, 1);
    }
    return $drawn;
}

/**
 * Execute Keno Draw Round
 */
function keno_execute_draw(array $user, array $params): array
{
    $userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
    $stake = round((float)($params['stake'] ?? 10.0), 2);
    $rawPicks = $params['picks'] ?? [];

    if (!is_array($rawPicks)) {
        return ['code' => 1, 'msg' => 'Invalid numbers selected.'];
    }

    // Clean & unique picks between 1 and 80
    $picks = [];
    foreach ($rawPicks as $p) {
        $num = (int)$p;
        if ($num >= 1 && $num <= 80 && !in_array($num, $picks, true)) {
            $picks[] = $num;
        }
    }
    sort($picks);

    $picksCount = count($picks);
    if ($picksCount < 1 || $picksCount > 10) {
        return ['code' => 1, 'msg' => 'Please select between 1 and 10 lucky numbers.'];
    }

    if ($stake < 10.0) {
        return ['code' => 1, 'msg' => 'Minimum bet is 10.00'];
    }
    if ($stake > 50000.0) {
        return ['code' => 1, 'msg' => 'Maximum bet is 50,000.00'];
    }

    $currentBal = keno_get_balance($userId);
    if ($currentBal < $stake) {
        return ['code' => 2, 'msg' => 'Insufficient balance. Please recharge.'];
    }

    $db = keno_db();
    $db->beginTransaction();
    try {
        if (!keno_debit_balance($userId, $stake)) {
            $db->rollBack();
            return ['code' => 2, 'msg' => 'Failed to debit bet amount.'];
        }

        // Draw 20 balls
        $drawnBalls = keno_draw_20_balls();

        // Calculate hits
        $hits = array_values(array_intersect($picks, $drawnBalls));
        $hitsCount = count($hits);

        // Calculate multiplier and payout
        $paytables = keno_paytables();
        $multiplier = (float)($paytables[$picksCount][$hitsCount] ?? 0.0);
        $payout = round($stake * $multiplier, 2);

        if ($payout > 0) {
            keno_credit_balance($userId, $payout);
        }

        // Record draw
        $drawUuid = 'keno_' . bin2hex(random_bytes(8));
        $stmt = $db->prepare("INSERT INTO keno_draws (draw_uuid, user_id, stake, picks_json, picks_count, drawn_balls_json, hits_json, hits_count, multiplier, payout) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $drawUuid, $userId, $stake, json_encode($picks), $picksCount, json_encode($drawnBalls), json_encode($hits), $hitsCount, $multiplier, $payout
        ]);

        // Record history
        $userName = (string)($user['mobile'] ?? $user['user_name'] ?? 'KenoMaster');
        $masked = strlen($userName) > 6 ? substr($userName, 0, 3) . '***' . substr($userName, -4) : $userName;
        $hist = $db->prepare("INSERT INTO keno_history (user_id, user_name, picks_count, hits_count, stake, payout, multiplier) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $hist->execute([$userId, $masked, $picksCount, $hitsCount, $stake, $payout, $multiplier]);

        $db->commit();

        $newBal = keno_get_balance($userId);

        return [
            'code' => 0,
            'msg' => $payout > 0 ? "You matched {$hitsCount} numbers and won {$multiplier}x!" : "You matched {$hitsCount} numbers.",
            'data' => [
                'draw_uuid' => $drawUuid,
                'picks' => $picks,
                'picks_count' => $picksCount,
                'drawn_balls' => $drawnBalls,
                'hits' => $hits,
                'hits_count' => $hitsCount,
                'multiplier' => $multiplier,
                'stake' => $stake,
                'payout' => $payout,
                'wallet_balance' => $newBal
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        return ['code' => 500, 'msg' => 'Server error: ' . $e->getMessage()];
    }
}
