<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'WorkOrder/GetHomePageConfigs';
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
            'isEnabledFaq' => true,
            'faqIcon' => '/img/6006/other/103015014-45559-file_20260528103015009.webp',
            'bannerUrl' => '/img/6006/other/044039290-42273-file_20260520164039095.webp',
            'kindTipsText' => '',
            'hasDepositForm' => true,
            'hasWithdrawalForm' => true,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315327516,
    ];

api_refresh_times($payload);
api_emit($payload);
