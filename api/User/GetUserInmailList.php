<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'User/GetUserInmailList';
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
                    'inmailId' => 201680,
                    'title' => 'Mystery Bonus Activated!',
                    'content' => '
<p><strong>Your mystery bonus has been activated.</strong></p>
<p><br></p>
<p>Make one deposit now to boost your base bonus and unlock an even bigger reward. If it does not appear immediately, simply tap refresh and your bonus will show up.</p>',
                    'thumbnail' => '',
                    'isHasReward' => false,
                    'state' => 0,
                    'createTime' => 1780291657823,
                ],
            ],
            'pageNo' => 1,
            'totalPage' => 1,
            'totalCount' => 1,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315633868,
    ];

api_refresh_times($payload);
api_emit($payload);
