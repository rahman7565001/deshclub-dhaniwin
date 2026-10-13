<?php
require __DIR__ . '/_bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    api_headers();
    exit;
}

$path = trim((string) ($_GET['path'] ?? ''), "/ \t\n\r\0\x0B");
$gameCode = (string) ($_GET['gameCode'] ?? '');

if ($path !== '') {
    $path = str_replace('\\', '/', urldecode($path));
    $path = preg_replace('#\.\./#', '', $path);
    if (preg_match('#^([^/]+)/([^/]+)/GetHistoryIssuePage\.json$#i', $path, $m)) {
        $payload = api_draw_file_payload($m[1], $m[2]);
        api_emit($payload ?: api_lottery_history_payload($m[2], ['params' => ['lotteryCode' => $m[1], 'gameCode' => $m[2]]]));
    }
    if (preg_match('#^([^/]+)/([^/]+)\.json$#i', $path, $m)) {
        api_emit(api_lottery_issue_payload($m[2]));
    }
}

if ($gameCode === '') {
    $gameCode = 'WinGo_30S';
}

api_emit(api_lottery_issue_payload($gameCode));
