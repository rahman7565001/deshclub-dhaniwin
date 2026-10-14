<?php
declare(strict_types=1);

require_once __DIR__ . '/engine.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$token = trim((string)($input['token'] ?? ''));
$roundUuid = trim((string)($input['round_uuid'] ?? ''));

$db = chicken_db();
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

if (!$user) {
    echo json_encode(['code' => 401, 'msg' => 'Please login to play.']);
    exit;
}

$result = chicken_cashout($user, $roundUuid);
echo json_encode($result);
