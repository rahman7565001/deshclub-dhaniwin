<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'VipLevel/GetUserVipInfo';
$override = api_get_override($endpoint);
if ($override) {
    $decoded = api_json_decode_lenient((string) $override['content']);
    if ($decoded['ok']) {
        $payload = $decoded['data'];
        api_refresh_times($payload);
        api_emit($payload);
    }
}

$user = api_primary_user();
$payload = [
        'data' => [
            'userId' => (int) $user['user_id'],
            'vipLevel' => (int) ($user['vipLevel'] ?? 0),
            'daysLeft' => 29,
            'upLevelBetAmount' => 934.28,
            'upLevelRechargeAmount' => 300,
            'weekBetAmount' => 0,
            'weekRechargeAmount' => 0,
            'weekRewardState' => true,
            'monthBetAmount' => 0,
            'monthRechargeAmount' => 0,
            'monthRewardState' => true,
            'receivedLevels' => '',
            'vipAmountOfCode' => 1,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315425703,
    ];

api_refresh_times($payload);
api_emit($payload);
