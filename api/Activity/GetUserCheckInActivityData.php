<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Activity/GetUserCheckInActivityData';
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
            'userId' => 60060000132257,
            'activityId' => 28,
            'activityName' => 'checkin-vip0',
            'statisticsType' => 0,
            'activityType' => 1,
            'status' => 1,
            'lastDayStatus' => 0,
            'currentCheckInDays' => 1,
            'rewardDetail' => [
                [
                    'status' => 1,
                    'dayIndex' => 1,
                    'rechargeAmount' => 100,
                    'rewardType' => 0,
                    'rewardAmount' => 1,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 2,
                    'rechargeAmount' => 100,
                    'rewardType' => 0,
                    'rewardAmount' => 2,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 3,
                    'rechargeAmount' => 200,
                    'rewardType' => 0,
                    'rewardAmount' => 2,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 4,
                    'rechargeAmount' => 300,
                    'rewardType' => 0,
                    'rewardAmount' => 3,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 5,
                    'rechargeAmount' => 500,
                    'rewardType' => 0,
                    'rewardAmount' => 4,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 6,
                    'rechargeAmount' => 600,
                    'rewardType' => 0,
                    'rewardAmount' => 5,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 7,
                    'rechargeAmount' => 1000,
                    'rewardType' => 1,
                    'rewardAmount' => 20,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 8,
                    'rechargeAmount' => 1500,
                    'rewardType' => 0,
                    'rewardAmount' => 11,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 9,
                    'rechargeAmount' => 2000,
                    'rewardType' => 0,
                    'rewardAmount' => 15,
                ],
                [
                    'status' => 1,
                    'dayIndex' => 10,
                    'rechargeAmount' => 3000,
                    'rewardType' => 0,
                    'rewardAmount' => 25,
                ],
            ],
            'translateData' => '
<p>🎁 Daily Check-in Reward Rules</p>
<ol>
    <li data-list= "ordered"><span class= "ql-ui"></span>Complete the required daily deposit amount to qualify for check-in and receive the reward</li>
    <li data-list= "ordered"><span class= "ql-ui"></span>The check-in cycle is 10 days. After completing Day 10, it resets to Day 1. If any day is missed, it will be considered a break in the streak, and the cycle will restart from Day 1, with rewards reverting to the initial
        level</li>
    <li data-list= "ordered"><span class= "ql-ui"></span><strong style= "color: rgb(222, 60, 54);">All rewards require 1x valid turnover before withdrawal</strong></li>
    <li data-list= "ordered"><span class= "ql-ui"></span><strong style= "color: rgb(222, 60, 54);">Different VIP levels receive different rewards. Higher VIP levels enjoy higher bonuses; current rewards follow the VIP0(new members) standard, while other VIP levels are subject to system display</strong></li>
    <li
        data-list= "ordered"><span class= "ql-ui"></span>The platform reserves the final right of interpretation and may adjust rewards and rules without prior notice</li>
</ol>
<p><br></p>',
            'codingMultiple' => 1,
            'rechargeAmount' => 0,
            'picturesUrl' => '/img/6006/other/030318103-34761-file_20260502150318090.webp',
            'checkInUserRewardList' => [
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGGEOFJ',
                    'receiveTime' => '2026-06-01 12:11:04',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGIDF1L',
                    'receiveTime' => '2026-06-01
12:10:51',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGH4XNE',
                    'receiveTime' => '2026-06-01 12:10:31',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGHDG6J',
                    'receiveTime' => '2026-06-01 12:09:56',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGJ0I5Q',
                    'receiveTime' => '2026-06-01
12:09:44',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGSMKZM',
                    'receiveTime' => '2026-06-01 12:09:40',
                    'rewardAmount' => 2,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGA55QD',
                    'receiveTime' => '2026-06-01 12:09:40',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNG1M7XQ',
                    'receiveTime' => '2026-06-01
12:08:52',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGYY4KY',
                    'receiveTime' => '2026-06-01 12:08:48',
                    'rewardAmount' => 1,
                ],
                [
                    'userId' => 0,
                    'userName' => 'MemberNNGFKURE',
                    'receiveTime' => '2026-06-01 12:11:35',
                    'rewardAmount' => 1,
                ],
            ],
            'needCheckInDays' => 1,
            'reward' => 1,
            'checkInDate' => '2026-06-01
00:00:00',
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315897194,
    ];

api_refresh_times($payload);
api_emit($payload);
