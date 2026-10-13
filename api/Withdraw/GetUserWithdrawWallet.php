<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Withdraw/GetUserWithdrawWallet';
$override = api_get_override($endpoint);
if ($override) {
    $decoded = api_json_decode_lenient((string) $override['content']);
    if ($decoded['ok']) {
        $payload = $decoded['data'];
        api_refresh_times($payload);
        api_emit($payload);
    }
}

$payload = [
        'data' => [],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315514852,
    ];

api_refresh_times($payload);
api_emit($payload);
