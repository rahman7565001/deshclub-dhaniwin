<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Home/GetFrontdeskProtocol';
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
        'data' => '
<p><img src= "/pro-img.arsaaspub.com/6006/other/061954677-42721-file_20260521181953114.webp" style= "vertical-align: baseline"></p>',
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315439225,
    ];

api_refresh_times($payload);
api_emit($payload);
