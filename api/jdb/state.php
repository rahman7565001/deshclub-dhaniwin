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

$db = jdb_db();
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
    $balance = jdb_get_balance((int)$user['id']);
}

// Fetch latest 10 big wins / catches for live ticker
$stmt = $db->query("SELECT user_name, game_type, item_name, multiplier, payout, created_at FROM jdb_history ORDER BY id DESC LIMIT 10");
$history = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

echo json_encode([
    'code' => 0,
    'msg' => 'Success',
    'data' => [
        'wallet_balance' => $balance,
        'currency' => api_user_currency($user)['symbol'] ?? '৳',
        'fish_types' => jdb_fish_types(),
        'slot_symbols' => jdb_slot_symbols(),
        'history' => $history
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
