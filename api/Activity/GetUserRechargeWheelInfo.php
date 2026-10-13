<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Activity/GetUserRechargeWheelInfo';
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
            'isOpen' => true,
            'currentValidDate' => null,
            'rechargeAmount' => 300,
            'rewardUpAmount' => 29999,
            'silverWheelInfo' => [
                'remainSpinCount' => 0,
                'taskList' => [
                    [
                        'id' => 2,
                        'rechargeAmount' => 500,
                        'spinCount' => 1,
                    ],
                    [
                        'id' => 3,
                        'rechargeAmount' => 3000,
                        'spinCount' => 1,
                    ],
                    [
                        'id' => 12,
                        'rechargeAmount' => 5000,
                        'spinCount' => 1,
                    ],
                ],
                'rewardList' => [
                    [
                        'id' => 4,
                        'rewardType' => 1,
                        'rewardAmount' => 6,
                        'icon' => '/img/6006/banner/065441660-36056-file_20260506065441659.webp',
                    ],
                    [
                        'id' => 5,
                        'rewardType' => 2,
                        'rewardAmount' => 1,
                        'icon' => '/img/6011/banner/040134583-28709-file_20260327040134582.webp',
                    ],
                    [
                        'id' => 6,
                        'rewardType' => 1,
                        'rewardAmount' => 16,
                        'icon' => '/img/6006/banner/080439978-36151-file_20260506080439977.webp',
                    ],
                    [
                        'id' => 7,
                        'rewardType' => 1,
                        'rewardAmount' => 1666,
                        'icon' => '/img/6006/banner/080450662-36152-file_20260506080450661.webp',
                    ],
                    [
                        'id' => 8,
                        'rewardType' => 1,
                        'rewardAmount' => 56,
                        'icon' => '/img/6006/banner/080507310-36153-file_20260506080507309.webp',
                    ],
                    [
                        'id' => 9,
                        'rewardType' => 1,
                        'rewardAmount' => 666,
                        'icon' => '/img/6006/banner/080519332-36155-file_20260506080519329.webp',
                    ],
                    [
                        'id' => 10,
                        'rewardType' => 1,
                        'rewardAmount' => 166,
                        'icon' => '/img/6006/banner/080531899-36156-file_20260506080531897.webp',
                    ],
                    [
                        'id' => 11,
                        'rewardType' => 1,
                        'rewardAmount' => 366,
                        'icon' => '/img/6006/banner/080542390-36157-file_20260506080542389.webp',
                    ],
                ],
            ],
            'goldWheelInfo' => [
                'remainSpinCount' => 0,
                'taskList' => [
                    [
                        'id' => 2,
                        'rechargeAmount' => 8000,
                        'spinCount' => 1,
                    ],
                    [
                        'id' => 3,
                        'rechargeAmount' => 20000,
                        'spinCount' => 1,
                    ],
                    [
                        'id' => 12,
                        'rechargeAmount' => 50000,
                        'spinCount' => 2,
                    ],
                ],
                'rewardList' => [
                    [
                        'id' => 4,
                        'rewardType' => 1,
                        'rewardAmount' => 17,
                        'icon' => '/img/6006/banner/064702207-36038-file_20260506064702202.webp',
                    ],
                    [
                        'id' => 5,
                        'rewardType' => 3,
                        'rewardAmount' => 1,
                        'icon' => '/img/6011/banner/040625217-28717-file_20260327040625216.webp',
                    ],
                    [
                        'id' => 6,
                        'rewardType' => 1,
                        'rewardAmount' => 37,
                        'icon' => '/img/6006/banner/080741373-36159-file_20260506080741368.webp',
                    ],
                    [
                        'id' => 7,
                        'rewardType' => 1,
                        'rewardAmount' => 1777,
                        'icon' => '/img/6006/banner/080755165-36160-file_20260506080755164.webp',
                    ],
                    [
                        'id' => 8,
                        'rewardType' => 1,
                        'rewardAmount' => 77,
                        'icon' => '/img/6006/banner/080814433-36161-file_20260506080814432.webp',
                    ],
                    [
                        'id' => 9,
                        'rewardType' => 1,
                        'rewardAmount' => 3777,
                        'icon' => '/img/6006/banner/080823985-36162-file_20260506080823984.webp',
                    ],
                    [
                        'id' => 10,
                        'rewardType' => 1,
                        'rewardAmount' => 377,
                        'icon' => '/img/6006/banner/080844039-36163-file_20260506080844038.webp',
                    ],
                    [
                        'id' => 11,
                        'rewardType' => 1,
                        'rewardAmount' => 777,
                        'icon' => '/img/6006/banner/080855074-36164-file_20260506080855073.webp',
                    ],
                ],
            ],
            'diamondWheelInfo' => [
                'remainSpinCount' => 0,
                'taskList' => [
                    [
                        'id' => 2,
                        'rechargeAmount' => 80000,
                        'spinCount' => 1,
                    ],
                    [
                        'id' => 3,
                        'rechargeAmount' => 150000,
                        'spinCount' => 2,
                    ],
                    [
                        'id' => 12,
                        'rechargeAmount' => 300000,
                        'spinCount' => 2,
                    ],
                ],
                'rewardList' => [
                    [
                        'id' => 4,
                        'rewardType' => 1,
                        'rewardAmount' => 38,
                        'icon' => '/img/6006/banner/071126614-36084-file_20260506071126518.webp',
                    ],
                    [
                        'id' => 5,
                        'rewardType' => 4,
                        'rewardAmount' => 2,
                        'icon' => '/img/6011/banner/041049576-28725-file_20260327041049575.webp',
                    ],
                    [
                        'id' => 6,
                        'rewardType' => 1,
                        'rewardAmount' => 3888,
                        'icon' => '/img/6006/banner/081032074-36165-file_20260506081032073.webp',
                    ],
                    [
                        'id' => 7,
                        'rewardType' => 1,
                        'rewardAmount' => 88,
                        'icon' => '/img/6006/banner/071211330-36085-file_20260506071211327.webp',
                    ],
                    [
                        'id' => 8,
                        'rewardType' => 1,
                        'rewardAmount' => 8888,
                        'icon' => '/img/6006/banner/081055887-36166-file_20260506081055885.webp',
                    ],
                    [
                        'id' => 9,
                        'rewardType' => 1,
                        'rewardAmount' => 188,
                        'icon' => '/img/6006/banner/071250283-36087-file_20260506071250187.webp',
                    ],
                    [
                        'id' => 10,
                        'rewardType' => 1,
                        'rewardAmount' => 888,
                        'icon' => '/img/6006/banner/071313073-36089-file_20260506071313071.webp',
                    ],
                    [
                        'id' => 11,
                        'rewardType' => 1,
                        'rewardAmount' => 2888,
                        'icon' => '/img/6006/banner/081145643-36169-file_20260506081145642.webp',
                    ],
                ],
            ],
            'specialWheelInfo' => [
                'remainSpinCount' => 0,
                'taskList' => [
                    [
                        'id' => 2,
                        'rechargeAmount' => 50000,
                        'spinCount' => 1,
                    ],
                ],
                'rewardList' => [
                    [
                        'id' => 3,
                        'rewardType' => 1,
                        'rewardAmount' => 99,
                        'icon' => '/img/6006/banner/072320237-36096-file_20260506072320234.webp',
                    ],
                    [
                        'id' => 4,
                        'rewardType' => 4,
                        'rewardAmount' => 1,
                        'icon' => '/img/6006/banner/072342256-36098-file_20260506072342253.webp',
                    ],
                    [
                        'id' => 5,
                        'rewardType' => 1,
                        'rewardAmount' => 19999,
                        'icon' => '/img/6006/banner/081326119-36170-file_20260506081326108.webp',
                    ],
                    [
                        'id' => 6,
                        'rewardType' => 1,
                        'rewardAmount' => 299,
                        'icon' => '/img/6006/banner/081339009-36172-file_20260506081339008.webp',
                    ],
                    [
                        'id' => 7,
                        'rewardType' => 1,
                        'rewardAmount' => 2999,
                        'icon' => '/img/6006/banner/081414172-36173-file_20260506081414162.webp',
                    ],
                    [
                        'id' => 8,
                        'rewardType' => 3,
                        'rewardAmount' => 2,
                        'icon' => '/img/6006/banner/081440394-36175-file_20260506081440393.webp',
                    ],
                    [
                        'id' => 9,
                        'rewardType' => 1,
                        'rewardAmount' => 999,
                        'icon' => '/img/6006/banner/081500198-36176-file_20260506081500197.webp',
                    ],
                    [
                        'id' => 10,
                        'rewardType' => 1,
                        'rewardAmount' => 9999,
                        'icon' => '/img/6006/banner/081520824-36178-file_20260506081520823.webp',
                    ],
                    [
                        'id' => 2,
                        'rewardType' => 2,
                        'rewardAmount' => 3,
                        'icon' => '/img/6006/banner/081541192-36180-file_20260506081541191.webp',
                    ],
                    [
                        'id' => 11,
                        'rewardType' => 1,
                        'rewardAmount' => 29999,
                        'icon' => '/img/6006/banner/081600127-36181-file_20260506081600126.webp',
                    ],
                ],
            ],
            'isSpecialWheelUnlock' => false,
            'specialWheelUnlockAmount' => 300000,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315914691,
    ];

api_refresh_times($payload);
api_emit($payload);
