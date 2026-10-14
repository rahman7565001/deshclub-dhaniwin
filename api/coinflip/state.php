<?php
declare(strict_types=1);

require_once __DIR__ . '/engine.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    exit;
}

$token = trim((string)($_GET['token'] ?? ''));
$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if ($token === '' && preg_match('/Bearer\s+(\S+)/i', $authHeader, $m)) {
    $token = $m[1];
}

$db = cf_db();
$user = null;
if ($token !== '') {
    $stmt = $db->prepare("SELECT * FROM api_users WHERE token = ? LIMIT 1");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}

if (!$user) {
    $user = api_primary_user();
}

$userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
$balance = cf_get_balance($userId);
$currency = api_user_currency($user)['symbol'] ?? '৳';

// Check for active session
$stmt = $db->prepare("SELECT * FROM cf_sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1");
$stmt->execute([$userId]);
$activeSession = $stmt->fetch(PDO::FETCH_ASSOC);

// Streak ladder definition
$ladder = [];
for ($i = 1; $i <= 10; $i++) {
    $ladder[$i] = cf_streak_multiplier($i);
}

// Fetch recent 10 history
$hist = $db->query("SELECT user_name, stake, streak_count, multiplier, payout, status, created_at FROM cf_history ORDER BY id DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'code' => 0,
    'msg' => 'Success',
    'data' => [
        'wallet_balance' => $balance,
        'currency' => $currency,
        'active_session' => $activeSession ? [
            'session_uuid' => $activeSession['session_uuid'],
            'stake' => (float)$activeSession['stake_amount'],
            'streak' => (int)$activeSession['streak_count'],
            'multiplier' => (float)$activeSession['current_multiplier'],
            'payout' => (float)$activeSession['current_payout'],
            'can_cashout' => true
        ] : null,
        'ladder' => $ladder,
        'recent' => $hist,
        'chips' => [10, 20, 50, 100, 200, 500, 1000]
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
