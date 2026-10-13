<?php
$indexFile = __DIR__ . '/index.html';

if (is_file($indexFile)) {
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    readfile($indexFile);
    exit;
}

http_response_code(404);
echo 'index.html not found';
