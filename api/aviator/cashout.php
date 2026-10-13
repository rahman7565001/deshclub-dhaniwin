<?php
declare(strict_types=1);

require_once __DIR__ . '/engine.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$token = trim((string)($input['token'] ?? ''));
$panel = (int)($input['bet_panel'] ?? 1);

if ($token === '') {
    echo json_encode(['code' => 401, 'msg' => 'Please login.']);
    exit;
}

$db = aviator_db();
$tokenClean = trim(str_replace('Bearer ', '', $token));
$userStmt = $db->prepare("SELECT * FROM api_users WHERE token = ? LIMIT 1");
$userStmt->execute([$tokenClean]);
$user = $userStmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['code' => 401, 'msg' => 'Invalid session.']);
    exit;
}

$now = aviator_now_ms();
$round = aviator_get_or_create_active_round($db);

if ($round['status'] !== 'flying') {
    echo json_encode(['code' => 400, 'msg' => 'Plane is not currently flying.']);
    exit;
}

$flyStart = (int)$round['start_time'];
$elapsedSec = max(0.0, ($now - $flyStart) / 1000.0);
$currentMult = aviator_multiplier_at_time($elapsedSec);
$crashMult = (float)$round['crash_multiplier'];

if ($currentMult >= $crashMult) {
    echo json_encode(['code' => 400, 'msg' => 'Flew away before cash out!']);
    exit;
}

// Find user's active bet on this panel
$betStmt = $db->prepare("SELECT * FROM aviator_bets WHERE round_uuid = ? AND user_id = ? AND bet_panel = ? AND status = 'active' LIMIT 1");
$betStmt->execute([$round['round_uuid'], $user['user_id'], $panel]);
$bet = $betStmt->fetch(PDO::FETCH_ASSOC);

if (!$bet) {
    echo json_encode(['code' => 400, 'msg' => 'No active bet to cash out.']);
    exit;
}

// Calculate win payout
$stake = (float)$bet['stake_amount'];
$winMult = $currentMult;
$payout = round($stake * $winMult, 2);

try {
    $db->beginTransaction();

    $db->prepare("UPDATE aviator_bets SET status = 'won', cashed_out_at = ?, payout_amount = ? WHERE id = ?")
       ->execute([$winMult, $payout, $bet['id']]);

    $newBal = (float)$user['wallet_balance'] + $payout;
    $db->prepare("UPDATE api_users SET wallet_balance = ? WHERE id = ?")
       ->execute([$newBal, $user['id']]);

    $db->commit();

    echo json_encode([
        'code' => 0,
        'msg' => 'Cashed out successfully!',
        'data' => [
            'bet_id' => $bet['id'],
            'bet_panel' => $panel,
            'multiplier' => $winMult,
            'payout_amount' => $payout,
            'wallet_balance' => $newBal
        ]
    ]);
} catch (Throwable $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(['code' => 500, 'msg' => 'Cashout error: ' . $e->getMessage()]);
}
