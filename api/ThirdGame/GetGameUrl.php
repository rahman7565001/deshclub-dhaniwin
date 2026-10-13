<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$input = api_request_input();
$gameCode = (string)api_param($input, 'gameCode', api_param($input, 'game_code', ''));
$vendorCode = (string)api_param($input, 'vendorCode', '');

// Resolve user token from request headers or input
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
$token = '';
if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $m)) {
    $token = $m[1];
} elseif (!empty($input['token'])) {
    $token = (string)$input['token'];
}

// Check if Aviator
if ($gameCode === '804' || stripos($gameCode, 'aviator') !== false || $gameCode === 'Spribe_Aviator') {
    $gameUrl = '/aviator/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// Fallback for other third games
$gameUrl = '/aviator/index.php?token=' . urlencode($token) . '&game=' . urlencode($gameCode);
api_emit(api_success([
    'url' => $gameUrl,
    'returnType' => 1
]));
