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

$db = mines_db();
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
$activeRound = null;

if ($user) {
    $balance = mines_get_balance((int)$user['id']);

    // Check if user has an active playing round
    $stmt = $db->prepare("SELECT round_uuid, stake_amount, mines_count, revealed_json, current_step, current_multiplier, status FROM mines_rounds WHERE user_id = ? AND status = 'playing' ORDER BY id DESC LIMIT 1");
    $stmt->execute([(int)$user['id']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $step = (int)$row['current_step'];
        $mCount = (int)$row['mines_count'];
        $safeTotal = 25 - $mCount;
        $activeRound = [
            'round_uuid' => $row['round_uuid'],
            'stake' => (float)$row['stake_amount'],
            'mines_count' => $mCount,
            'revealed' => json_decode($row['revealed_json'], true) ?: [],
            'current_step' => $step,
            'current_multiplier' => (float)$row['current_multiplier'],
            'next_multiplier' => ($step < $safeTotal) ? mines_calculate_multiplier($mCount, $step + 1) : (float)$row['current_multiplier'],
            'current_payout' => round((float)$row['stake_amount'] * (float)$row['current_multiplier'], 2),
            'status' => 'playing'
        ];
    }
}

// Fetch latest history
$stmt = $db->query("SELECT user_name, mines_count, gems_found, multiplier, payout, created_at FROM mines_history ORDER BY id DESC LIMIT 10");
$history = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

echo json_encode([
    'code' => 0,
    'msg' => 'Success',
    'data' => [
        'wallet_balance' => $balance,
        'currency' => api_user_currency($user)['symbol'] ?? '৳',
        'active_round' => $activeRound,
        'history' => $history
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
