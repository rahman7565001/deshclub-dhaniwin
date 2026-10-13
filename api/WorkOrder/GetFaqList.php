<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'WorkOrder/GetFaqList';
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
                'moduleId' => 14,
                'moduleName' => 'DEPOSIT AND WITHDRAW PROBLEM',
                'questionTitle' => [
                    [
                        'id' => 20,
                        'title' => 'Deposit not received',
                    ],
                    [
                        'id' => 17,
                        'title' => 'AR Wallet Withdrawal Issue',
                    ],
                    [
                        'id' => 19,
                        'title' => 'AR Wallet Recharge Problem',
                    ],
                    [
                        'id' => 18,
                        'title' => 'Withdrawal problem',
                    ],
                ],
            ],
            [
                'moduleId' => 13,
                'moduleName' => 'BANK
PROBLEM',
                'questionTitle' => [
                    [
                        'id' => 21,
                        'title' => 'IFSC Modification',
                    ],
                    [
                        'id' => 22,
                        'title' => 'Delete Withdraw Bank and Rebind',
                    ],
                    [
                        'id' => 23,
                        'title' => 'Change bank name',
                    ],
                    [
                        'id' => 24,
                        'title' => 'Delete Old USDT Address and Rebind',
                    ],
                    [
                        'id' => 44,
                        'title' => 'Delete UPI',
                    ],
                    [
                        'id' => 42,
                        'title' => 'How
to Add UPI Account',
                    ],
                    [
                        'id' => 41,
                        'title' => 'How to Add USDT',
                    ],
                    [
                        'id' => 40,
                        'title' => 'How to Add Bank Account',
                    ],
                ],
            ],
            [
                'moduleId' => 12,
                'moduleName' => 'Bonus & Event',
                'questionTitle' => [
                    [
                        'id' => 32,
                        'title' => 'Super Jackpot',
                    ],
                    [
                        'id' => 29,
                        'title' => 'Daily & Weekly Task',
                    ],
                    [
                        'id' => 43,
                        'title' => 'Invite
Wheel',
                    ],
                    [
                        'id' => 36,
                        'title' => 'VIP BONUS',
                    ],
                    [
                        'id' => 35,
                        'title' => 'First Deposit Bonus',
                    ],
                    [
                        'id' => 34,
                        'title' => 'Lucky Wheel Spin',
                    ],
                    [
                        'id' => 33,
                        'title' => 'Attendance Bonus',
                    ],
                    [
                        'id' => 31,
                        'title' => ' Betting Rebate',
                    ],
                    [
                        'id' => 37,
                        'title' => 'Commission',
                    ],
                ],
            ],
            [
                'moduleId' => 11,
                'moduleName' => 'GAME
AND ACCOUNT PROBLEM',
                'questionTitle' => [
                    [
                        'id' => 26,
                        'title' => 'Change ID Login Password',
                    ],
                    [
                        'id' => 28,
                        'title' => 'Dhani.win Agents ',
                    ],
                    [
                        'id' => 25,
                        'title' => 'Retrieve Login ID Account',
                    ],
                    [
                        'id' => 27,
                        'title' => 'Game Problems',
                    ],
                    [
                        'id' => 39,
                        'title' => 'How to Register Game Account',
                    ],
                ],
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315542042,
    ];

api_refresh_times($payload);
api_emit($payload);
