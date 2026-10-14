<?php
declare(strict_types=1);

require_once __DIR__ . '/engine.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    exit;
}

$token = trim((string)($_GET['token'] ?? $_GET['Token'] ?? ''));

$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if ($token === '' && preg_match('/Bearer\s+(\S+)/i', $authHeader, $m)) {
    $token = $m[1];
}

$db = tl_db();
$user = null;
if ($token !== '') {
    $tokenClean = trim(str_replace('Bearer ', '', $token));
    $stmt = $db->prepare("SELECT * FROM api_users WHERE token = ? LIMIT 1");
    $stmt->execute([$tokenClean]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}

if (!$user) {
    $user = api_primary_user();
}

$userId = (int)($user['id'] ?? $user['user_id'] ?? 1);
$balance = tl_get_balance($userId);
$currency = api_user_currency($user)['symbol'] ?? '৳';

$activeSession = tl_get_active_session($userId);
$sanitizedSession = $activeSession ? tl_sanitize_session($activeSession) : null;

// Recent history
$stmtHist = $db->query("SELECT user_name, difficulty, floors_cleared, stake, payout, multiplier, status, created_at FROM tl_history ORDER BY id DESC LIMIT 8");
$recent = $stmtHist->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'code' => 0,
    'msg' => 'Success',
    'data' => [
        'wallet_balance' => $balance,
        'currency' => $currency,
        'active_session' => $sanitizedSession,
        'difficulties' => tl_difficulties(),
        'recent' => $recent,
        'quick_stakes' => [10, 20, 50, 100, 200, 500, 1000]
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
