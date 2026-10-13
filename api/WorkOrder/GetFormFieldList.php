<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'WorkOrder/GetFormFieldList';
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
            'formFields' => [
                [
                    'id' => 505,
                    'workOrderFormConfigId' => 124,
                    'sort' => 0,
                    'fieldName' => 'Correct IFSC Code',
                    'typeCode' => 'IFSC',
                    'isRequired' => 1,
                ],
                [
                    'id' => 506,
                    'workOrderFormConfigId' => 124,
                    'sort' => 1,
                    'fieldName' => 'Bank Number ',
                    'typeCode' => 'BankAccountNumber',
                    'isRequired' => 1,
                ],
            ],
            'hasUserGuide' => 0,
            'displayName' => 'IFSC
Modification',
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315579297,
    ];

api_refresh_times($payload);
api_emit($payload);
