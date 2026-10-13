<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Recharge/GetRechargeRecord';
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
            'list' => [
                [
                    'orderNo' => 'RC260529191523616nhmshEga4h',
                    'rechargeCategoryName' => 'PhonePe',
                    'rechargeCategoryId' => 400101,
                    'rechargeChannelId' => 10262,
                    'rechargeChannelName' => 'Paile-QR',
                    'originAmount' => 100,
                    'amount' => 100,
                    'actualAmount' => 100,
                    'giftAmount' => 0,
                    'coinToFiatRate' => 1,
                    'rechargeState' => 'Payed',
                    'rechargeType' => 'UPI',
                    'rechargeChannelType' => 'ThirdRecharge',
                    'createTime' => 1780082123616,
                    'lastUpdateTime' => 1780082154011,
                    'arOrderStatus' => 0,
                ],
                [
                    'orderNo' => 'RC260529191443324ngmshEga4h',
                    'rechargeCategoryName' => 'PhonePe',
                    'rechargeCategoryId' => 400101,
                    'rechargeChannelId' => 26001,
                    'rechargeChannelName' => 'ARUPI',
                    'originAmount' => 100,
                    'amount' => 100,
                    'actualAmount' => 100,
                    'giftAmount' => 0,
                    'coinToFiatRate' => 1,
                    'rechargeState' => 'Cancel',
                    'rechargeType' => 'UPI',
                    'rechargeChannelType' => 'ThirdRecharge',
                    'createTime' => 1780082083324,
                    'lastUpdateTime' => 1780082118476,
                    'arOrderStatus' => 0,
                ],
                [
                    'orderNo' => 'RC260529191403634ngmshEga4h',
                    'rechargeCategoryName' => 'PhonePe',
                    'rechargeCategoryId' => 400101,
                    'rechargeChannelId' => 26001,
                    'rechargeChannelName' => 'ARUPI',
                    'originAmount' => 100,
                    'amount' => 100,
                    'actualAmount' => 100,
                    'giftAmount' => 0,
                    'coinToFiatRate' => 1,
                    'rechargeState' => 'Cancel',
                    'rechargeType' => 'UPI',
                    'rechargeChannelType' => 'ThirdRecharge',
                    'createTime' => 1780082043634,
                    'lastUpdateTime' => 1780082081605,
                    'arOrderStatus' => 0,
                ],
            ],
            'pageNo' => 1,
            'totalPage' => 3,
            'totalCount' => 9,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315478508,
    ];

api_refresh_times($payload);
api_emit($payload);
