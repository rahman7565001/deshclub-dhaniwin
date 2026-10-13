<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'WorkOrder/GetOutLinkList';
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
            'formTitle' => 'Online Customer Services',
            'outLinkList' => [
                [
                    'text' => 'Live support',
                    'outLink' => 'https://t.me/dhaniwinbot',
                ],
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315624147,
    ];

api_refresh_times($payload);
api_emit($payload);
