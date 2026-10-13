<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

api_emit(api_recharge_category_payload());

$payload = [
        'data' => [
            [
                'id' => 400101,
                'name' => 'PhonePe',
                'rechargeType' => 'UPI',
                'state' => 1,
                'sort' => 4,
                'iconUrl' => '/img/6006/bankLogo/051830120-34793-file_20260502171830107.webp',
                'selectedIconUrl' => '/img/6006/bankLogo/051832502-34794-file_20260502171832499.webp',
                'rate' => 1,
                'minAmount' => 100,
                'maxAmount' => 50000,
                'rechargeGiftRatio' => [
                    'giftRatioType' => 3,
                    'scaleType' => 1,
                    'uniformRatioData' => null,
                    'intervalRatioList' => null,
                ],
                'quickConfigList' => [
                    [
                        'rechargeAmount' => 100,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 200,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 300,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 500,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 1000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 2000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 3000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 5000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 10000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 20000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 30000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 50000,
                        'giftAmount' => 0,
                    ],
                ],
                'giftRatioType' => 0,
                'giftAmount' => 0,
                'isUsedArUpiRechargeAmount' => false,
            ],
            [
                'id' => 400103,
                'name' => 'UPIQR',
                'rechargeType' => 'UPI',
                'state' => 1,
                'sort' => 3,
                'iconUrl' => '/img/6006/bankLogo/052326529-34807-file_20260502172326518.webp',
                'selectedIconUrl' => '/img/6006/bankLogo/052328901-34808-file_20260502172328900.webp',
                'rate' => 1,
                'minAmount' => 100,
                'maxAmount' => 50000,
                'rechargeGiftRatio' => [
                    'giftRatioType' => 3,
                    'scaleType' => 0,
                    'uniformRatioData' => null,
                    'intervalRatioList' => null,
                ],
                'quickConfigList' => [
                    [
                        'rechargeAmount' => 100,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 200,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 300,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 500,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 1000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 2000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 3000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 5000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 10000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 20000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 30000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 50000,
                        'giftAmount' => 0,
                    ],
                ],
                'giftRatioType' => 0,
                'giftAmount' => 0,
                'isUsedArUpiRechargeAmount' => false,
            ],
            [
                'id' => 400102,
                'name' => 'PayTM',
                'rechargeType' => 'UPI',
                'state' => 1,
                'sort' => 2,
                'iconUrl' => '/img/6006/bankLogo/052212261-34803-file_20260502172212259.webp',
                'selectedIconUrl' => '/img/6006/bankLogo/052214587-34804-file_20260502172214586.webp',
                'rate' => 1,
                'minAmount' => 100,
                'maxAmount' => 50000,
                'rechargeGiftRatio' => [
                    'giftRatioType' => 3,
                    'scaleType' => 0,
                    'uniformRatioData' => null,
                    'intervalRatioList' => null,
                ],
                'quickConfigList' => [
                    [
                        'rechargeAmount' => 100,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 200,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 300,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 500,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 1000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 2000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 3000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 5000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 10000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 20000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 30000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 50000,
                        'giftAmount' => 0,
                    ],
                ],
                'giftRatioType' => 0,
                'giftAmount' => 0,
                'isUsedArUpiRechargeAmount' => false,
            ],
            [
                'id' => 400104,
                'name' => 'USDT',
                'rechargeType' => 'USDT',
                'state' => 1,
                'sort' => 1,
                'iconUrl' => '/img/6006/bankLogo/063148668-38140-file_20260510063148667.webp',
                'selectedIconUrl' => '/img/6006/bankLogo/063150656-38141-file_20260510063150655.webp',
                'rate' => 97,
                'minAmount' => 10,
                'maxAmount' => 100000,
                'rechargeGiftRatio' => [
                    'giftRatioType' => 3,
                    'scaleType' => 0,
                    'uniformRatioData' => null,
                    'intervalRatioList' => null,
                ],
                'quickConfigList' => [
                    [
                        'rechargeAmount' => 10,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 20,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 50,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 100,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 200,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 500,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 1000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 2000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 5000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 10000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 50000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 100000,
                        'giftAmount' => 0,
                    ],
                ],
                'giftRatioType' => 0,
                'giftAmount' => 0,
                'isUsedArUpiRechargeAmount' => false,
            ],
            [
                'id' => 400106,
                'name' => 'ARPay',
                'rechargeType' => 'ARPay',
                'state' => 1,
                'sort' => 0,
                'iconUrl' => '/img/6006/bankLogo/104545975-43514-file_20260523104545974.webp',
                'selectedIconUrl' => '/img/6006/bankLogo/104546587-43515-file_20260523104546586.webp',
                'rate' => 1,
                'minAmount' => 100,
                'maxAmount' => 50000,
                'rechargeGiftRatio' => [
                    'giftRatioType' => 3,
                    'scaleType' => 0,
                    'uniformRatioData' => null,
                    'intervalRatioList' => null,
                ],
                'quickConfigList' => [
                    [
                        'rechargeAmount' => 100,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 300,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 500,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 1000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 2000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 3000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 5000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 10000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 20000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 30000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 40000,
                        'giftAmount' => 0,
                    ],
                    [
                        'rechargeAmount' => 50000,
                        'giftAmount' => 0,
                    ],
                ],
                'giftRatioType' => 0,
                'giftAmount' => 0,
                'isUsedArUpiRechargeAmount' => false,
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315478305,
    ];

api_refresh_times($payload);
api_emit($payload);
