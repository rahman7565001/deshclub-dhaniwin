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

$db = jf_db();
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

$balance = 0.0;
if ($user) {
    $balance = jf_get_balance((int)$user['id']);
}

// Progressive Jackpot simulated counters
$timeFactor = time() % 86400;
$grandJackpot = 888888.00 + ($timeFactor * 1.5);
$majorJackpot = 88888.00 + ($timeFactor * 0.4);
$miniJackpot = 8888.00 + ($timeFactor * 0.1);

// Fetch latest history
$stmt = $db->query("SELECT user_name, fish_name, multiplier, payout, jackpot_badge, created_at FROM jf_history ORDER BY id DESC LIMIT 10");
$history = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

echo json_encode([
    'code' => 0,
    'msg' => 'Success',
    'data' => [
        'wallet_balance' => $balance,
        'currency' => api_user_currency($user)['symbol'] ?? '৳',
        'jackpots' => [
            'grand' => round($grandJackpot, 2),
            'major' => round($majorJackpot, 2),
            'mini' => round($miniJackpot, 2)
        ],
        'fish_types' => jf_fish_types(),
        'history' => $history
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
