<?php
require __DIR__ . '/_bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    api_headers();
    exit;
}

api_pdo();

$endpoint = api_normalize_endpoint($_GET['path'] ?? null);
$input = api_request_input();

if ($endpoint === '') {
    api_emit(api_success([
        'name' => 'Deshclub local API',
        'status' => 'ok',
        'db' => api_db_driver(),
    ]));
}

// 1. Dynamic endpoints that adapt to authenticated user session, wallet, currency, and games
$dynamic = api_explicit_dynamic_response($endpoint, $input);
if ($dynamic !== null) {
    api_emit($dynamic);
}

// 2. Load and execute physical subfolder PHP endpoint files if they exist and are not router stubs
$phpFile = __DIR__ . '/' . $endpoint . '.php';
if (file_exists($phpFile)) {
    $content = file_get_contents($phpFile);
    if (strpos($content, '_router.php') === false) {
        require $phpFile;
        exit;
    }
}

// 3. User customized snapshot overrides from database
$override = api_get_override($endpoint);
if ($override) {
    $decoded = api_json_decode_lenient((string) $override['content']);
    if ($decoded['ok']) {
        $payload = $decoded['data'];
        api_refresh_times($payload);
        api_emit($payload);
    }
    api_emit(api_error('Saved override JSON is invalid: ' . $decoded['error'], 500));
}

$snapshot = api_read_snapshot_payload($endpoint);
if ($snapshot !== null) {
    api_emit($snapshot);
}

api_emit(api_fallback_response($endpoint, $input));
