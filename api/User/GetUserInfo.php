<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'User/GetUserInfo';
$override = api_get_override($endpoint);
if ($override) {
    $decoded = api_json_decode_lenient((string) $override['content']);
    if ($decoded['ok']) {
        $payload = $decoded['data'];
        api_refresh_times($payload);
        api_emit($payload);
    }
}

$payload = api_success(api_user_info_data());
api_refresh_times($payload);
api_emit($payload);
