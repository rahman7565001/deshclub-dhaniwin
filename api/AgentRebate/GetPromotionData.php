<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'AgentRebate/GetPromotionData';
$override = api_get_override($endpoint);
if ($override) {
    $decoded = api_json_decode_lenient((string) $override['content']);
    if ($decoded['ok']) {
        $payload = $decoded['data'];
        api_refresh_times($payload);
        api_emit($payload);
    }
}

$payload = api_agent_promotion_payload();
api_refresh_times($payload);
api_emit($payload);
