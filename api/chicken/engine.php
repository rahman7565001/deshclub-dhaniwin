<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function chicken_db(): PDO
{
    $pdo = api_pdo();
    static $initialized = false;
    if (!$initialized) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS chicken_rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            round_uuid VARCHAR(64) UNIQUE,
            user_id INT NOT NULL,
            difficulty VARCHAR(20) DEFAULT 'medium',
            stake_amount DECIMAL(18,4) NOT NULL,
            current_step INT DEFAULT 0,
            current_multiplier DECIMAL(10,2) DEFAULT 1.00,
            traps_json TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'playing',
            cashout_multiplier DECIMAL(10,2) DEFAULT 0,
            payout_amount DECIMAL(18,4) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS chicken_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INT NOT NULL,
            user_name VARCHAR(64) NOT NULL,
            difficulty VARCHAR(20) NOT NULL,
            multiplier DECIMAL(10,2) NOT NULL,
            payout DECIMAL(18,4) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $initialized = true;
    }
    return $pdo;
}

function chicken_multipliers(string $difficulty): array
{
    switch ($difficulty) {
        case 'easy':
            // 20 steps, ~90% safe per step, low risk
            return [
                1 => 1.04, 2 => 1.09, 3 => 1.15, 4 => 1.22, 5 => 1.30,
                6 => 1.40, 7 => 1.52, 8 => 1.66, 9 => 1.83, 10 => 2.05,
                11 => 2.32, 12 => 2.68, 13 => 3.15, 14 => 3.80, 15 => 4.70,
                16 => 6.00, 17 => 8.00, 18 => 11.50, 19 => 18.00, 20 => 30.00
            ];
        case 'hard':
            // 16 steps, ~65% safe per step, high risk
            return [
                1 => 1.45, 2 => 2.15, 3 => 3.25, 4 => 5.00, 5 => 8.00,
                6 => 13.50, 7 => 23.50, 8 => 42.00, 9 => 80.00, 10 => 160.00,
                11 => 330.00, 12 => 700.00, 13 => 1600.00, 14 => 3800.00, 15 => 9500.00, 16 => 25000.00
            ];
        case 'daredevil':
            // 12 steps, ~50% safe per step, extreme risk
            return [
                1 => 1.90, 2 => 3.75, 3 => 7.50, 4 => 15.20, 5 => 32.00,
                6 => 70.00, 7 => 160.00, 8 => 380.00, 9 => 950.00, 10 => 2500.00,
                11 => 7000.00, 12 => 20000.00
            ];
        case 'medium':
        default:
            // 20 steps, ~80% safe per step, balanced risk
            return [
                1 => 1.15, 2 => 1.35, 3 => 1.62, 4 => 1.98, 5 => 2.45,
                6 => 3.10, 7 => 4.00, 8 => 5.30, 9 => 7.20, 10 => 10.00,
                11 => 14.50, 12 => 22.00, 13 => 35.00, 14 => 60.00, 15 => 110.00,
                16 => 220.00, 17 => 450.00, 18 => 900.00, 19 => 2000.00, 20 => 5000.00
            ];
    }
}

function chicken_safe_rate(string $difficulty): int
{
    switch ($difficulty) {
        case 'easy': return 90;
        case 'hard': return 65;
        case 'daredevil': return 50;
        case 'medium':
        default: return 80;
    }
}

function chicken_generate_traps(string $difficulty): array
{
    $mults = chicken_multipliers($difficulty);
    $totalSteps = count($mults);
    $safeRate = chicken_safe_rate($difficulty);

    $traps = [];
    for ($i = 1; $i <= $totalSteps; $i++) {
        // Step 1 has slightly higher safety to give exciting start
        $stepRate = ($i === 1) ? min(98, $safeRate + 8) : $safeRate;
        $isSafe = mt_rand(1, 100) <= $stepRate;
        // Lane choice 0, 1, or 2 (3-lane road)
        // If trapped, which lane has the car/fire trap?
        $trapLane = $isSafe ? -1 : mt_rand(0, 2);
        $traps[$i] = [
            'is_safe' => $isSafe,
            'trap_lane' => $trapLane,
            'safe_lane' => $isSafe ? mt_rand(0, 2) : -1
        ];
    }
    return $traps;
}

function chicken_start_round(array $user, float $stake, string $difficulty): array
{
    $db = chicken_db();
    $userId = (int)$user['id'];
    $stake = max(1.0, round($stake, 2));
    $validDiffs = ['easy', 'medium', 'hard', 'daredevil'];
    if (!in_array($difficulty, $validDiffs, true)) {
        $difficulty = 'medium';
    }

    $bal = max((float)$user['wallet_balance'], (float)$user['game_balance']);
    if ($bal < $stake) {
        return ['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.'];
    }

    // Cancel any older active round for user
    $db->prepare("UPDATE chicken_rounds SET status = 'crashed', updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = 'playing'")->execute([$userId]);

    // Atomic balance deduction
    $db->beginTransaction();
    try {
        $stmt = $db->prepare("UPDATE api_users SET wallet_balance = CASE WHEN wallet_balance >= ? THEN wallet_balance - ? ELSE 0 END, game_balance = CASE WHEN game_balance >= ? THEN game_balance - ? ELSE 0 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$stake, $stake, $stake, $stake, $userId]);

        $roundUuid = 'chk_' . bin2hex(random_bytes(10));
        $traps = chicken_generate_traps($difficulty);

        $stmt = $db->prepare("INSERT INTO chicken_rounds (round_uuid, user_id, difficulty, stake_amount, current_step, current_multiplier, traps_json, status) VALUES (?, ?, ?, ?, 0, 1.00, ?, 'playing')");
        $stmt->execute([$roundUuid, $userId, $difficulty, $stake, json_encode($traps)]);

        $db->commit();

        // Refresh user balance
        $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ?");
        $stmt->execute([$userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $newBal = max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));

        $mults = chicken_multipliers($difficulty);

        return [
            'code' => 0,
            'msg' => 'Game started',
            'data' => [
                'round_uuid' => $roundUuid,
                'difficulty' => $difficulty,
                'stake' => $stake,
                'current_step' => 0,
                'current_multiplier' => 1.00,
                'next_multiplier' => $mults[1] ?? 1.15,
                'total_steps' => count($mults),
                'multipliers' => $mults,
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

function chicken_step(array $user, string $roundUuid, int $lane = 1): array
{
    $db = chicken_db();
    $userId = (int)$user['id'];

    $stmt = $db->prepare("SELECT * FROM chicken_rounds WHERE round_uuid = ? AND user_id = ? AND status = 'playing' LIMIT 1");
    $stmt->execute([$roundUuid, $userId]);
    $round = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$round) {
        return ['code' => 404, 'msg' => 'No active game found.'];
    }

    $traps = json_decode((string)$round['traps_json'], true) ?: [];
    $mults = chicken_multipliers((string)$round['difficulty']);
    $totalSteps = count($mults);

    $nextStep = (int)$round['current_step'] + 1;
    if ($nextStep > $totalSteps) {
        return ['code' => 400, 'msg' => 'Max steps reached. Please cash out.'];
    }

    $stepConfig = $traps[$nextStep] ?? ['is_safe' => true, 'trap_lane' => -1, 'safe_lane' => 1];
    $isSafe = !empty($stepConfig['is_safe']);

    if (!$isSafe) {
        // Crashed! Chicken roasted!
        $db->prepare("UPDATE chicken_rounds SET status = 'crashed', current_step = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$nextStep, $round['id']]);

        return [
            'code' => 0,
            'msg' => 'Chicken roasted!',
            'data' => [
                'round_uuid' => $roundUuid,
                'step' => $nextStep,
                'status' => 'crashed',
                'is_safe' => false,
                'trap_lane' => $stepConfig['trap_lane'],
                'multiplier' => 0,
                'payout' => 0
            ]
        ];
    }

    // Safe! Advance multiplier
    $newMult = $mults[$nextStep] ?? 1.00;
    $isFinished = ($nextStep >= $totalSteps);

    if ($isFinished) {
        // Automatically cash out on final step
        $stake = (float)$round['stake_amount'];
        $payout = round($stake * $newMult, 2);

        $db->beginTransaction();
        try {
            $db->prepare("UPDATE api_users SET wallet_balance = wallet_balance + ?, game_balance = game_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$payout, $payout, $userId]);
            $db->prepare("UPDATE chicken_rounds SET status = 'cashed_out', current_step = ?, current_multiplier = ?, cashout_multiplier = ?, payout_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$nextStep, $newMult, $newMult, $payout, $round['id']]);

            $userName = (string)($user['user_name'] ?? $user['phone'] ?? 'Player');
            $db->prepare("INSERT INTO chicken_history (user_id, user_name, difficulty, multiplier, payout) VALUES (?, ?, ?, ?, ?)")->execute([$userId, $userName, $round['difficulty'], $newMult, $payout]);

            $db->commit();

            $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ?");
            $stmt->execute([$userId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $newBal = max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));

            return [
                'code' => 0,
                'msg' => 'Jackpot! Reached the other side!',
                'data' => [
                    'round_uuid' => $roundUuid,
                    'step' => $nextStep,
                    'status' => 'cashed_out',
                    'is_safe' => true,
                    'multiplier' => $newMult,
                    'payout' => $payout,
                    'is_finished' => true,
                    'wallet_balance' => $newBal
                ]
            ];
        } catch (Throwable $e) {
            if ($db->inTransaction()) $db->rollBack();
            return ['code' => 500, 'msg' => 'Payout error'];
        }
    }

    // Standard safe step
    $db->prepare("UPDATE chicken_rounds SET current_step = ?, current_multiplier = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$nextStep, $newMult, $round['id']]);

    $stake = (float)$round['stake_amount'];
    $currentCashout = round($stake * $newMult, 2);
    $nextMult = $mults[$nextStep + 1] ?? $newMult;

    return [
        'code' => 0,
        'msg' => 'Safe jump!',
        'data' => [
            'round_uuid' => $roundUuid,
            'step' => $nextStep,
            'status' => 'playing',
            'is_safe' => true,
            'multiplier' => $newMult,
            'cashout_amount' => $currentCashout,
            'next_multiplier' => $nextMult,
            'total_steps' => $totalSteps
        ]
    ];
}

function chicken_cashout(array $user, string $roundUuid): array
{
    $db = chicken_db();
    $userId = (int)$user['id'];

    $stmt = $db->prepare("SELECT * FROM chicken_rounds WHERE round_uuid = ? AND user_id = ? AND status = 'playing' LIMIT 1");
    $stmt->execute([$roundUuid, $userId]);
    $round = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$round) {
        return ['code' => 404, 'msg' => 'No active game to cash out.'];
    }

    $currentStep = (int)$round['current_step'];
    if ($currentStep <= 0) {
        return ['code' => 400, 'msg' => 'Make at least one step before cashing out.'];
    }

    $mult = (float)$round['current_multiplier'];
    $stake = (float)$round['stake_amount'];
    $payout = round($stake * $mult, 2);

    $db->beginTransaction();
    try {
        $db->prepare("UPDATE api_users SET wallet_balance = wallet_balance + ?, game_balance = game_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$payout, $payout, $userId]);
        $db->prepare("UPDATE chicken_rounds SET status = 'cashed_out', cashout_multiplier = ?, payout_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$mult, $payout, $round['id']]);

        $userName = (string)($user['user_name'] ?? $user['phone'] ?? 'Player');
        $db->prepare("INSERT INTO chicken_history (user_id, user_name, difficulty, multiplier, payout) VALUES (?, ?, ?, ?, ?)")->execute([$userId, $userName, $round['difficulty'], $mult, $payout]);

        $db->commit();

        $stmt = $db->prepare("SELECT wallet_balance, game_balance FROM api_users WHERE id = ?");
        $stmt->execute([$userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $newBal = max((float)($row['wallet_balance'] ?? 0), (float)($row['game_balance'] ?? 0));

        return [
            'code' => 0,
            'msg' => 'Cashed out successfully!',
            'data' => [
                'round_uuid' => $roundUuid,
                'multiplier' => $mult,
                'payout' => $payout,
                'wallet_balance' => $newBal,
                'status' => 'cashed_out'
            ]
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) $db->rollBack();
        return ['code' => 500, 'msg' => 'Cashout error: ' . $e->getMessage()];
    }
}

function chicken_state(array $user): array
{
    $db = chicken_db();
    $userId = (int)$user['id'];

    // Active round
    $stmt = $db->prepare("SELECT * FROM chicken_rounds WHERE user_id = ? AND status = 'playing' ORDER BY id DESC LIMIT 1");
    $stmt->execute([$userId]);
    $activeRound = $stmt->fetch(PDO::FETCH_ASSOC);

    $roundData = null;
    if ($activeRound) {
        $diff = (string)$activeRound['difficulty'];
        $mults = chicken_multipliers($diff);
        $curStep = (int)$activeRound['current_step'];
        $roundData = [
            'round_uuid' => $activeRound['round_uuid'],
            'difficulty' => $diff,
            'stake' => (float)$activeRound['stake_amount'],
            'current_step' => $curStep,
            'current_multiplier' => (float)$activeRound['current_multiplier'],
            'next_multiplier' => $mults[$curStep + 1] ?? (float)$activeRound['current_multiplier'],
            'cashout_amount' => round((float)$activeRound['stake_amount'] * (float)$activeRound['current_multiplier'], 2),
            'total_steps' => count($mults),
            'multipliers' => $mults,
            'status' => 'playing'
        ];
    }

    // Recent top history
    $stmt = $db->query("SELECT multiplier, payout, created_at FROM chicken_history ORDER BY id DESC LIMIT 15");
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($history)) {
        // Seed default exciting multipliers if history is brand new
        $history = [
            ['multiplier' => 2.45, 'payout' => 245.00],
            ['multiplier' => 1.62, 'payout' => 162.00],
            ['multiplier' => 5.30, 'payout' => 530.00],
            ['multiplier' => 1.35, 'payout' => 135.00],
            ['multiplier' => 14.50, 'payout' => 1450.00],
            ['multiplier' => 3.10, 'payout' => 310.00],
            ['multiplier' => 1.98, 'payout' => 198.00],
            ['multiplier' => 7.20, 'payout' => 720.00],
        ];
    }

    return [
        'code' => 0,
        'msg' => 'State loaded',
        'data' => [
            'wallet_balance' => max((float)($user['wallet_balance'] ?? 0), (float)($user['game_balance'] ?? 0)),
            'currency' => '৳',
            'active_round' => $roundData,
            'history' => $history,
            'difficulties' => [
                'easy' => ['label' => 'Easy', 'steps' => 20, 'max' => '30x', 'desc' => 'High win rate (~90% safe)'],
                'medium' => ['label' => 'Medium', 'steps' => 20, 'max' => '5000x', 'desc' => 'Balanced risk (~80% safe)'],
                'hard' => ['label' => 'Hard', 'steps' => 16, 'max' => '25000x', 'desc' => 'High volatility (~65% safe)'],
                'daredevil' => ['label' => 'Daredevil', 'steps' => 12, 'max' => '20000x', 'desc' => 'Extreme thrill (~50% safe)']
            ]
        ]
    ];
}
