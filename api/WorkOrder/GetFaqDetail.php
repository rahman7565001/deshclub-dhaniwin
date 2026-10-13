<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'WorkOrder/GetFaqDetail';
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
            'id' => 20,
            'question' => 'Deposit not received',
            'answer' => '
<p>If you still encounter the problem of your deposit order still not arrived into your ID account after you resubmit a new deposit order and fill all the correct information from your previous payment, we highly recommend you for submit a deposit problem
    query to our self-service team by simply select “Deposit Not Receive” and follow the step-by-step below to resolve the issue : </p>
<p>1. Choose "Deposit Not Received"</p>
<p>2. Press "Submit UTR"</p>
<p>3.Fill "Deposit UTR Number"</p>
<p>4. Fill "Receiver UPI id"</p>
<p>5. Upload Receipt Photo</p>
<p>6. Press "Confirm"</p>
<p style= "text-indent: 0px;">If the recharge is delayed, don\'t worry, our professional team will conduct a manual checking, and will confirm and update your payment status to the bank side every 30 minutes to ensure that it will be helpful for speed up the arrival of your deposit
    payment into your ID account.</p>',
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315543965,
    ];

api_refresh_times($payload);
api_emit($payload);
