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
$stake = (float)($input['stake_amount'] ?? 0);
$panel = (int)($input['bet_panel'] ?? 1);
$autoCashout = isset($input['auto_cashout']) && is_numeric($input['auto_cashout']) ? (float)$input['auto_cashout'] : null;

if ($token === '') {
    http_response_code(401);
    echo json_encode(['code' => 401, 'msg' => 'Please login to play.']);
    exit;
}

if ($stake <= 0) {
    echo json_encode(['code' => 400, 'msg' => 'Invalid bet amount.']);
    exit;
}

$db = aviator_db();
$tokenClean = trim(str_replace('Bearer ', '', $token));
$userStmt = $db->prepare("SELECT * FROM api_users WHERE token = ? LIMIT 1");
$userStmt->execute([$tokenClean]);
$user = $userStmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['code' => 401, 'msg' => 'Invalid session. Please login again.']);
    exit;
}

if ((float)$user['wallet_balance'] < $stake) {
    echo json_encode(['code' => 400, 'msg' => 'Insufficient wallet balance.']);
    exit;
}

$round = aviator_get_or_create_active_round($db);
if ($round['status'] !== 'betting') {
    echo json_encode(['code' => 400, 'msg' => 'Betting phase has ended for this round.']);
    exit;
}

// Check if bet already placed on this panel for this round
$existStmt = $db->prepare("SELECT id FROM aviator_bets WHERE round_uuid = ? AND user_id = ? AND bet_panel = ? LIMIT 1");
$existStmt->execute([$round['round_uuid'], $user['user_id'], $panel]);
if ($existStmt->fetch()) {
    echo json_encode(['code' => 400, 'msg' => 'Bet already placed on Panel ' . $panel]);
    exit;
}

// Deduct balance and insert bet inside transaction
try {
    $db->beginTransaction();

    $newBal = (float)$user['wallet_balance'] - $stake;
    $db->prepare("UPDATE api_users SET wallet_balance = ? WHERE id = ?")
       ->execute([$newBal, $user['id']]);

    $insStmt = $db->prepare("INSERT INTO aviator_bets (user_id, round_uuid, bet_panel, stake_amount, auto_cashout, status) VALUES (?, ?, ?, ?, ?, 'active')");
    $insStmt->execute([$user['user_id'], $round['round_uuid'], $panel, $stake, $autoCashout]);
    $betId = (int)$db->lastInsertId();

    $db->commit();

    echo json_encode([
        'code' => 0,
        'msg' => 'Bet placed successfully',
        'data' => [
            'bet_id' => $betId,
            'bet_panel' => $panel,
            'stake_amount' => $stake,
            'auto_cashout' => $autoCashout,
            'wallet_balance' => $newBal
        ]
    ]);
} catch (Throwable $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(['code' => 500, 'msg' => 'Failed to place bet: ' . $e->getMessage()]);
}
