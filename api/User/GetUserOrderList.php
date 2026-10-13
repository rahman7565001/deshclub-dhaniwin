<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'User/GetUserOrderList';
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
            'list' => [],
            'pageNo' => 1,
            'totalPage' => 0,
            'totalCount' => 0,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315655934,
    ];

api_refresh_times($payload);
api_emit($payload);
