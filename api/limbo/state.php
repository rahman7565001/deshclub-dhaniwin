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

$db = lb_db();
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
$balance = lb_get_balance($userId);
$currency = api_user_currency($user)['symbol'] ?? '৳';

// Fetch recent 10 history
$hist = $db->query("SELECT user_name, stake, target_mult, result_mult, payout, is_win, created_at FROM limbo_history ORDER BY id DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'code' => 0,
    'msg' => 'Success',
    'data' => [
        'wallet_balance' => $balance,
        'currency' => $currency,
        'recent' => $hist,
        'presets' => [1.5, 2.0, 5.0, 10.0, 50.0, 100.0, 1000.0],
        'chips' => [10, 20, 50, 100, 200, 500, 1000]
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
