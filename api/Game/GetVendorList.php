<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Game/GetVendorList';
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
            [
                'vendorCode' => 'ARLottery',
                'vendorName' => 'ARLottery',
                'displayName' => 'AR',
                'lotteryNameDict' => [
                    '100' => 'WinGo',
                    '101' => 'K3',
                    '102' => '5D',
                    '103' => 'TrxWinGo',
                    '104' => 'VideoWinGo',
                    '105' => 'MotoRace',
                    '106' => 'LuckyWinGo',
                ],
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315656069,
    ];

api_refresh_times($payload);
api_emit($payload);
