<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$input = api_request_input();
$payload = api_withdraw_submit_payload($input);
api_emit($payload);
