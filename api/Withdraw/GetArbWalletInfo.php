<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Withdraw/GetArbWalletInfo';
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
        'data' => [
            'merchantCode' => 'AR0063',
            'memberId' => null,
            'walletActivationStatus' => 0,
            'balance' => 0,
            'walletAddress' => null,
            'withdrawalRewardRatio' => null,
            'minimumWithdrawalAmount' => null,
            'maximumWithdrawalAmount' => null,
            'timestamp' => null,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315501340,
    ];

api_refresh_times($payload);
api_emit($payload);
