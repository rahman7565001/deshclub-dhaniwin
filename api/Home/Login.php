<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Home/Login';
$override = api_get_override($endpoint);
if ($override) {
    $decoded = api_json_decode_lenient((string) $override['content']);
    if ($decoded['ok']) {
        $payload = $decoded['data'];
        api_refresh_times($payload);
        api_emit($payload);
    }
}

$input = api_request_input();
$payload = api_user_login($input);

api_refresh_times($payload);
api_emit($payload);
