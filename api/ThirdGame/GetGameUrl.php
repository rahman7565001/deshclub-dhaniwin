<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$input = api_request_input();
$gameCode = (string)api_param($input, 'gameCode', api_param($input, 'game_code', ''));
$vendorCode = (string)api_param($input, 'vendorCode', '');
$gameId = (int)api_param($input, 'gameId', 0);

// Resolve user token from request headers, input, or primary user
$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = '';
if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $m)) {
    $token = $m[1];
} elseif (!empty($input['token'])) {
    $token = (string)$input['token'];
}

if ($token === '') {
    $user = api_primary_user();
    $token = (string)($user['token'] ?? '');
}

// Build dynamic absolute URL matching the client host & scheme
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    ? 'https' : 'http';
$host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
$baseUrl = $protocol . '://' . $host;

// Check if Aviator
if ($gameCode === '804' || stripos($gameCode, 'aviator') !== false || $gameCode === 'Spribe_Aviator' || $gameId === 23604 || stripos($vendorCode, 'aviator') !== false) {
    $gameUrl = $baseUrl . '/aviator/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// Fallback for other third games
$gameUrl = $baseUrl . '/aviator/index.php?token=' . urlencode($token) . '&game=' . urlencode($gameCode);
api_emit(api_success([
    'url' => $gameUrl,
    'returnType' => 1
]));

