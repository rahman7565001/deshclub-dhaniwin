<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

function aviator_db(): PDO
{
    return api_pdo();
}

function aviator_now_ms(): int
{
    return (int) floor(microtime(true) * 1000);
}

function aviator_generate_multiplier(PDO $db): float
{
    // 1. Check if admin set a manual override
    try {
        $stmt = $db->prepare("SELECT value FROM aviator_settings WHERE key = 'next_crash_multiplier' LIMIT 1");
        $stmt->execute();
        $override = trim((string) $stmt->fetchColumn());
        if ($override !== '' && is_numeric($override) && (float)$override >= 1.0) {
            $db->exec("UPDATE aviator_settings SET value = '' WHERE key = 'next_crash_multiplier'");
            return round((float)$override, 2);
        }
    } catch (Throwable $e) {}

    // 2. Probabilistic crash generator with house edge
    // ~4% chance of instant crash at 1.00x
    $rand = mt_rand(1, 100);
    if ($rand <= 4) {
        return 1.00;
    }

    // Standard inverse distribution: multiplier = 0.96 / (1 - random)
    $u = mt_rand(1, 9999) / 10000.0;
    $mult = 0.96 / (1.0 - $u);

    // Limit maximum to 100x for regular play
    if ($mult > 100.0) {
        $mult = (float)mt_rand(50, 100);
    }

    return max(1.01, round($mult, 2));
}

function aviator_duration_for_multiplier(float $targetMult): float
{
    if ($targetMult <= 1.0) {
        return 0.2;
    }
    // Since mult = e^(0.06 * t), t = ln(mult) / 0.06
    return round(log($targetMult) / 0.06, 2);
}

function aviator_multiplier_at_time(float $elapsedSeconds): float
{
    if ($elapsedSeconds <= 0) {
        return 1.00;
    }
    return round(pow(M_E, 0.06 * $elapsedSeconds), 2);
}

function aviator_get_or_create_active_round(PDO $db): array
{
    $now = aviator_now_ms();

    // Check current active round
    $stmt = $db->query("SELECT * FROM aviator_rounds ORDER BY id DESC LIMIT 1");
    $round = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$round) {
        // Create first round
        $uuid = 'rnd_' . substr(md5((string) $now), 0, 12);
        $crash = aviator_generate_multiplier($db);
        $stmt = $db->prepare("INSERT INTO aviator_rounds (round_uuid, crash_multiplier, status, start_time, end_time) VALUES (?, ?, 'betting', ?, 0)");
        $stmt->execute([$uuid, $crash, $now]);
        $round = [
            'id' => (int) $db->lastInsertId(),
            'round_uuid' => $uuid,
            'crash_multiplier' => $crash,
            'status' => 'betting',
            'start_time' => $now,
            'end_time' => 0
        ];
    }

    $startTime = (int) $round['start_time'];
    $crashMult = (float) $round['crash_multiplier'];
    $flyDurationSec = aviator_duration_for_multiplier($crashMult);
    $flyDurationMs = (int) round($flyDurationSec * 1000);
    $bettingDurationMs = 5000; // 5s betting time
    $crashedDisplayMs = 3000;  // 3s crashed display time

    // Phase transition logic
    if ($round['status'] === 'betting') {
        $elapsedInBetting = $now - $startTime;
        if ($elapsedInBetting >= $bettingDurationMs) {
            // Transition to flying
            $flyStart = $startTime + $bettingDurationMs;
            $db->prepare("UPDATE aviator_rounds SET status = 'flying', start_time = ? WHERE id = ?")
               ->execute([$flyStart, $round['id']]);
            $round['status'] = 'flying';
            $round['start_time'] = $flyStart;
        }
    }

    if ($round['status'] === 'flying') {
        $flyStart = (int) $round['start_time'];
        $elapsedFlyingMs = $now - $flyStart;

        // Auto-cashout processing for active bets
        try {
            $currentMult = aviator_multiplier_at_time(max(0, $elapsedFlyingMs / 1000.0));
            $autoStmt = $db->prepare("SELECT * FROM aviator_bets WHERE round_uuid = ? AND status = 'active' AND auto_cashout IS NOT NULL AND auto_cashout <= ? AND auto_cashout <= ?");
            $autoStmt->execute([$round['round_uuid'], $currentMult, $crashMult]);
            $autoBets = $autoStmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($autoBets as $b) {
                $winMult = (float)$b['auto_cashout'];
                $payout = round((float)$b['stake_amount'] * $winMult, 2);
                $db->prepare("UPDATE aviator_bets SET status = 'won', cashed_out_at = ?, payout_amount = ? WHERE id = ?")
                   ->execute([$winMult, $payout, $b['id']]);
                $db->prepare("UPDATE api_users SET wallet_balance = wallet_balance + ? WHERE user_id = ?")
                   ->execute([$payout, $b['user_id']]);
            }
        } catch (Throwable $e) {}

        if ($elapsedFlyingMs >= $flyDurationMs) {
            // Crash now
            $crashTime = $flyStart + $flyDurationMs;
            $db->prepare("UPDATE aviator_rounds SET status = 'crashed', end_time = ? WHERE id = ?")
               ->execute([$crashTime, $round['id']]);

            // Settle all remaining active bets in this round as lost
            $db->prepare("UPDATE aviator_bets SET status = 'lost' WHERE round_uuid = ? AND status = 'active'")
               ->execute([$round['round_uuid']]);

            $round['status'] = 'crashed';
            $round['end_time'] = $crashTime;
        }
    }

    if ($round['status'] === 'crashed') {
        $crashTime = (int) $round['end_time'];
        if (($now - $crashTime) >= $crashedDisplayMs) {
            // Create next round in betting phase
            $uuid = 'rnd_' . substr(md5((string) $now), 0, 12);
            $crash = aviator_generate_multiplier($db);
            $db->prepare("INSERT INTO aviator_rounds (round_uuid, crash_multiplier, status, start_time, end_time) VALUES (?, ?, 'betting', ?, 0)")
               ->execute([$uuid, $crash, $now]);
            $round = [
                'id' => (int) $db->lastInsertId(),
                'round_uuid' => $uuid,
                'crash_multiplier' => $crash,
                'status' => 'betting',
                'start_time' => $now,
                'end_time' => 0
            ];
        }
    }

    return $round;
}
