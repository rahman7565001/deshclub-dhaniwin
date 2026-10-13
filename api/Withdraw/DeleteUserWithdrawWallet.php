<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$input = api_request_input();
$payload = api_delete_user_withdraw_wallet_payload($input);
api_emit($payload);
