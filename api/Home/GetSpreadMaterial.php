<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Home/GetSpreadMaterial';
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
                'id' => 200075,
                'materialUrl' => '/img/6006/other/071319138-41431-file_20260518071318963.webp',
                'qrCodeInfo' => '{"top": 69, "left": 48, "width": 25}',
                'materialType' => 0,
                'platformType' => 0,
                'state' => 1,
                'sysLanguage' => 'en',
                'creator' => 'admin00',
                'createTime' => 1779088405826,
                'lastUpdateMan' => 'admin00',
                'lastUpdateTime' => 1779088405826,
                'tenantId' => 6006,
            ],
            [
                'id' => 200078,
                'materialUrl' => '/img/6006/other/083038720-41465-file_20260518083038703.webp',
                'qrCodeInfo' => '{"top":
69, "left": 62, "width": 25}',
                'materialType' => 0,
                'platformType' => 0,
                'state' => 1,
                'sysLanguage' => 'en',
                'creator' => 'admin00',
                'createTime' => 1779093048254,
                'lastUpdateMan' => 'admin00',
                'lastUpdateTime' => 1779093048254,
                'tenantId' => 6006,
            ],
            [
                'id' => 200079,
                'materialUrl' => '/img/6006/other/083148635-41466-file_20260518083148615.webp',
                'qrCodeInfo' => '{"top":
63, "left": 72, "width": 25}',
                'materialType' => 0,
                'platformType' => 0,
                'state' => 1,
                'sysLanguage' => 'en',
                'creator' => 'admin00',
                'createTime' => 1779093117650,
                'lastUpdateMan' => 'admin00',
                'lastUpdateTime' => 1779093117650,
                'tenantId' => 6006,
            ],
            [
                'id' => 200074,
                'materialUrl' => '/img/6006/other/071237197-41430-file_20260518071237017.webp',
                'qrCodeInfo' => '{"top":
69, "left": 48, "width": 25}',
                'materialType' => 0,
                'platformType' => 0,
                'state' => 1,
                'sysLanguage' => 'hi',
                'creator' => 'admin00',
                'createTime' => 1779088366558,
                'lastUpdateMan' => 'admin00',
                'lastUpdateTime' => 1779088366558,
                'tenantId' => 6006,
            ],
            [
                'id' => 200077,
                'materialUrl' => '/img/6006/other/083015797-41464-file_20260518083015777.webp',
                'qrCodeInfo' => '{"top":
67, "left": 60, "width": 25}',
                'materialType' => 0,
                'platformType' => 0,
                'state' => 1,
                'sysLanguage' => 'hi',
                'creator' => 'admin00',
                'createTime' => 1779093024025,
                'lastUpdateMan' => 'admin00',
                'lastUpdateTime' => 1779093024025,
                'tenantId' => 6006,
            ],
            [
                'id' => 200080,
                'materialUrl' => '/img/6006/other/083217524-41467-file_20260518083217485.webp',
                'qrCodeInfo' => '{"top":
65, "left": 69, "width": 25}',
                'materialType' => 0,
                'platformType' => 0,
                'state' => 1,
                'sysLanguage' => 'hi',
                'creator' => 'admin00',
                'createTime' => 1779093146328,
                'lastUpdateMan' => 'admin00',
                'lastUpdateTime' => 1779093146328,
                'tenantId' => 6006,
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315698554,
    ];

api_refresh_times($payload);
api_emit($payload);
