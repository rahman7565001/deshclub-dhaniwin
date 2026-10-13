<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'AgentRebate/GetRebateLevelRateList';
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
            'electronicList' => [
                [
                    'rebateLv' => 0,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.5,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.15,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.067,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.022,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.007,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.002,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 1,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.6,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.201,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.083,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.029,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.01,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.003,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 2,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.65,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.238,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.111,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.043,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.016,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.006,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 3,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.7,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.27,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.128,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.0512,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.02048,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.008192,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 4,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.75,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.32,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.161,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.07,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.03,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.013,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 5,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.8,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.359,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.186,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.085,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.038,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.017,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 6,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.9,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.45,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.25,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.125,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.063,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.031,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 7,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 1,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.551,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.34,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.189,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.105,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.058,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 8,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 1.1,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.657,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.441,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.267,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.162,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.098,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 9,
                    'type' => 0,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 1.2,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.929,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.685,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.4,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.2,
                        ],
                    ],
                ],
            ],
            'videoList' => [
                [
                    'rebateLv' => 0,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.1,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.033,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.011,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.004,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.001,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 1,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.35,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.121,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.042,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.014,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.005,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.002,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 2,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.4,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.154,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.059,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.023,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.009,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.003,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 3,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.45,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.18,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.072,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.029,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.012,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.005,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 4,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.5,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.217,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.095,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.041,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.018,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.008,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 5,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.55,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.25,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.114,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.052,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.023,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.011,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 6,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.6,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.15,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.075,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.038,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.019,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 7,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.65,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.361,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.201,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.111,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.062,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.034,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 8,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.7,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.424,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.257,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.156,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.094,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.057,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 9,
                    'type' => 1,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.75,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.524,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.367,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.256,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.179,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.125,
                        ],
                    ],
                ],
            ],
            'sportList' => [
                [
                    'rebateLv' => 0,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.1,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.033,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.011,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.004,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.001,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 1,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.35,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.121,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.042,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.014,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.005,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.002,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 2,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.4,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.154,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.059,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.023,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.009,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.003,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 3,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.45,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.18,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.072,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.029,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.012,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.005,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 4,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.5,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.217,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.095,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.041,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.018,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.008,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 5,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.55,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.25,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.114,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.052,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.023,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.011,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 6,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.6,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.15,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.075,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.038,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.019,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 7,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.65,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.361,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.201,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.111,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.062,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.034,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 8,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.7,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.424,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.257,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.156,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.094,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.057,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 9,
                    'type' => 2,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.75,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.524,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.367,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.256,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.179,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.125,
                        ],
                    ],
                ],
            ],
            'lotteryList' => [
                [
                    'rebateLv' => 0,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.5,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.15,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.067,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.022,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.007,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.002,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 1,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.6,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.201,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.083,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.029,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.01,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.003,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 2,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.65,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.238,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.111,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.043,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.016,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.006,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 3,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.7,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.27,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.128,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.0512,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.02048,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.008192,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 4,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.75,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.32,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.161,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.07,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.03,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.013,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 5,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.8,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.359,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.186,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.085,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.038,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.017,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 6,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.9,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.45,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.25,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.125,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.063,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.031,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 7,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 1,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.551,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.34,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.189,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.105,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.058,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 8,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 1.1,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.657,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.441,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.267,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.162,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.098,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 9,
                    'type' => 3,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 1.2,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.929,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.685,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.4,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.2,
                        ],
                    ],
                ],
            ],
            'chessCardList' => [
                [
                    'rebateLv' => 0,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.1,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.033,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.011,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.004,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.001,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 1,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.35,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.121,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.042,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.014,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.005,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.002,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 2,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.4,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.154,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.059,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.023,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.009,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.003,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 3,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.45,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.18,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.072,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.029,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.012,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.005,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 4,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.5,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.217,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.095,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.041,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.018,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.008,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 5,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.55,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.25,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.114,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.052,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.023,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.011,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 6,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.6,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.3,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.15,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.075,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.038,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.019,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 7,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.65,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.361,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.201,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.111,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.062,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.034,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 8,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.7,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.424,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.257,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.156,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.094,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.057,
                        ],
                    ],
                ],
                [
                    'rebateLv' => 9,
                    'type' => 4,
                    'rebateRateList' => [
                        [
                            'hierarchy' => 1,
                            'rebateRate' => 0.75,
                        ],
                        [
                            'hierarchy' => 2,
                            'rebateRate' => 0.524,
                        ],
                        [
                            'hierarchy' => 3,
                            'rebateRate' => 0.367,
                        ],
                        [
                            'hierarchy' => 4,
                            'rebateRate' => 0.256,
                        ],
                        [
                            'hierarchy' => 5,
                            'rebateRate' => 0.179,
                        ],
                        [
                            'hierarchy' => 6,
                            'rebateRate' => 0.125,
                        ],
                    ],
                ],
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315799122,
    ];

api_refresh_times($payload);
api_emit($payload);
