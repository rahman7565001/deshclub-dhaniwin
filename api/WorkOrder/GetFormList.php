<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'WorkOrder/GetFormList';
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
                'id' => 129,
                'workOrderTypeId' => 9,
                'workOrderTypeName' => '忘记会员账号',
                'displayName' => 'Retrieve Login ID Account',
                'sort' => 6,
                'icon' => '/img/6006/other/103155776-45562-file_20260528103155770.webp',
                'type' => 0,
                'outLink' => '',
            ],
            [
                'id' => 126,
                'workOrderTypeId' => 8,
                'workOrderTypeName' => '修改登录密码半自动',
                'displayName' => 'Reset
Password ( with ID )',
                'sort' => 5,
                'icon' => '/img/6006/other/103415570-45567-file_20260528103415561.webp',
                'type' => 0,
                'outLink' => '',
            ],
            [
                'id' => 159,
                'workOrderTypeId' => 3,
                'workOrderTypeName' => '其他问题',
                'displayName' => 'Reset Password ( without ID )',
                'sort' => 2,
                'icon' => '/img/6006/other/103436435-45569-file_20260528103436425.webp',
                'type' => 0,
                'outLink' => '',
            ],
            [
                'id' => 149,
                'workOrderTypeId' => 2,
                'workOrderTypeName' => '一对一客服',
                'displayName' => 'Game
Problems',
                'sort' => 1,
                'icon' => '/img/6006/other/103621059-45572-file_20260528103621055.webp',
                'type' => 0,
                'outLink' => '',
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315327510,
    ];

api_refresh_times($payload);
api_emit($payload);
