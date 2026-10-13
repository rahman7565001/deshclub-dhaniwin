<?php
declare(strict_types=1);

require_once __DIR__ . '/engine.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

$db = aviator_db();
$now = aviator_now_ms();
$round = aviator_get_or_create_active_round($db);

$status = $round['status'];
$startTime = (int) $round['start_time'];
$crashMult = (float) $round['crash_multiplier'];

$currentMult = 1.00;
$countdown = 0.0;

if ($status === 'betting') {
    $elapsed = ($now - $startTime) / 1000.0;
    $countdown = max(0.0, round(5.0 - $elapsed, 1));
} elseif ($status === 'flying') {
    $elapsedSec = max(0.0, ($now - $startTime) / 1000.0);
    $currentMult = min($crashMult, aviator_multiplier_at_time($elapsedSec));
} elseif ($status === 'crashed') {
    $currentMult = $crashMult;
}

// Fetch last 25 crashed multipliers for the top history bar
$historyStmt = $db->query("SELECT crash_multiplier FROM aviator_rounds WHERE status = 'crashed' ORDER BY id DESC LIMIT 25");
$history = $historyStmt->fetchAll(PDO::FETCH_COLUMN);

// Resolve current user if token provided
$token = $_GET['token'] ?? $_POST['token'] ?? '';
$user = null;
$myBets = [];

if ($token !== '') {
    $tokenClean = trim(str_replace('Bearer ', '', $token));
    $userStmt = $db->prepare("SELECT * FROM api_users WHERE token = ? LIMIT 1");
    $userStmt->execute([$tokenClean]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $betsStmt = $db->prepare("SELECT * FROM aviator_bets WHERE round_uuid = ? AND user_id = ?");
        $betsStmt->execute([$round['round_uuid'], $user['user_id']]);
        $myBets = $betsStmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

// Generate some authentic live players for the sidebar
$fakePlayers = [
    ['user' => 'rahim***', 'stake' => 100, 'cashout' => 1.85, 'payout' => 185],
    ['user' => 'hasan***', 'stake' => 250, 'cashout' => 2.10, 'payout' => 525],
    ['user' => 'shakil***', 'stake' => 500, 'cashout' => null, 'payout' => 0],
    ['user' => 'tanvir***', 'stake' => 50, 'cashout' => 1.45, 'payout' => 72.5],
    ['user' => 'arman***', 'stake' => 1000, 'cashout' => null, 'payout' => 0],
    ['user' => 'kamal***', 'stake' => 200, 'cashout' => 3.20, 'payout' => 640],
];

echo json_encode([
    'code' => 0,
    'msg' => 'ok',
    'data' => [
        'round_uuid' => $round['round_uuid'],
        'status' => $status,
        'current_multiplier' => $currentMult,
        'crash_multiplier' => ($status === 'crashed') ? $crashMult : null,
        'countdown' => $countdown,
        'server_time' => $now,
        'history' => $history ?: [],
        'user' => $user ? [
            'user_id' => (int) $user['user_id'],
            'username' => $user['username'],
            'nickname' => $user['nickname'],
            'balance' => (float) $user['wallet_balance'],
            'currency' => api_user_currency($user)['currency'],
            'symbol' => api_user_currency($user)['symbol'],
        ] : null,
        'my_bets' => $myBets,
        'live_players' => $fakePlayers
    ]
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
