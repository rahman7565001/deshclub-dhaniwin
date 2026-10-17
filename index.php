<?php
/**
 * Deshclub Universal Front-Controller & Asset Router
 * Compatible with ALL web hosts (cPanel, Hostinger, LiteSpeed, Apache, Nginx, VPS, Plesk)
 */

declare(strict_types=1);

if (file_exists(__DIR__ . '/api/_bootstrap.php')) {
    require_once __DIR__ . '/api/_bootstrap.php';
}

$docRoot = __DIR__;
$rawUri = $_SERVER['REQUEST_URI'] ?? '/';
$parsedPath = parse_url($rawUri, PHP_URL_PATH);
$uri = '/' . ltrim(urldecode($parsedPath ?: '/'), '/');

// -------------------------------------------------------------
// 1. CORS Preflight Handler
// -------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

// -------------------------------------------------------------
// Helper: Serve Static File with MIME, CORS & Range support
// -------------------------------------------------------------
function serve_static_asset(string $path, ?string $mime = null): void {
    if (!is_file($path)) {
        return;
    }

    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $mimes = [
        'webp'        => 'image/webp',
        'png'         => 'image/png',
        'jpg'         => 'image/jpeg',
        'jpeg'        => 'image/jpeg',
        'gif'         => 'image/gif',
        'svg'         => 'image/svg+xml',
        'ico'         => 'image/x-icon',
        'avif'        => 'image/avif',
        'mp4'         => 'video/mp4',
        'webm'        => 'video/webm',
        'mp3'         => 'audio/mpeg',
        'wav'         => 'audio/wav',
        'ogg'         => 'audio/ogg',
        'woff2'       => 'font/woff2',
        'woff'        => 'font/woff',
        'ttf'         => 'font/ttf',
        'otf'         => 'font/otf',
        'eot'         => 'application/vnd.ms-fontobject',
        'css'         => 'text/css; charset=utf-8',
        'js'          => 'application/javascript; charset=utf-8',
        'mjs'         => 'application/javascript; charset=utf-8',
        'json'        => 'application/json; charset=utf-8',
        'webmanifest' => 'application/manifest+json; charset=utf-8',
        'wasm'        => 'application/wasm',
        'html'        => 'text/html; charset=utf-8',
    ];

    $contentType = $mime ?: ($mimes[$ext] ?? 'application/octet-stream');

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
    header('Content-Type: ' . $contentType);

    $size = filesize($path);
    header('Accept-Ranges: bytes');

    $isCode = in_array($ext, ['html', 'php', 'json'], true);
    if ($isCode) {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
    } else {
        header('Cache-Control: public, max-age=2592000, immutable');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($path)) . ' GMT');
        $etag = '"' . md5($path . $size . filemtime($path)) . '"';
        header('ETag: ' . $etag);

        if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
            http_response_code(304);
            exit;
        }
    }

    // Support HTTP Range Requests (smooth video and audio streaming on iPhone/Android)
    if (isset($_SERVER['HTTP_RANGE'])) {
        $range = $_SERVER['HTTP_RANGE'];
        if (preg_match('/bytes=\s*(\d+)-(\d*)/i', $range, $matches)) {
            $start = (int) $matches[1];
            $end = ($matches[2] !== '') ? (int) $matches[2] : ($size - 1);
            if ($start > $end || $start >= $size) {
                http_response_code(416);
                header("Content-Range: bytes */$size");
                exit;
            }
            $length = $end - $start + 1;
            http_response_code(206);
            header("Content-Range: bytes $start-$end/$size");
            header('Content-Length: ' . $length);

            $fp = fopen($path, 'rb');
            fseek($fp, $start);
            $chunkSize = 16384;
            while (!feof($fp) && ($pos = ftell($fp)) <= $end) {
                if ($pos + $chunkSize > $end) {
                    $chunkSize = $end - $pos + 1;
                }
                echo fread($fp, $chunkSize);
                flush();
            }
            fclose($fp);
            exit;
        }
    }

    header('Content-Length: ' . $size);
    readfile($path);
    exit;
}

// -------------------------------------------------------------
// 2. Dynamic Lottery Issue & Results Router
// -------------------------------------------------------------
if (preg_match('#^/webapi/(kv|v)/issue/([^/]+)$#i', $uri, $m)) {
    $_GET['gameCode'] = $m[2];
    require $docRoot . '/api/_draw_router.php';
    exit;
}

if (preg_match('#^/(WinGo|K3|D5|MotoRace|TrxWinGo)/(.+\.json)$#i', $uri, $m)) {
    $_GET['path'] = $m[1] . '/' . $m[2];
    require $docRoot . '/api/_draw_router.php';
    exit;
}

// -------------------------------------------------------------
// 3. WebAPI / Config Fallbacks & Dynamic Runtime Branding
// -------------------------------------------------------------
if ($uri === '/webapi/kv/config.js' || $uri === '/webapi/v/config.js') {
    $configPath = $docRoot . '/webapi/kv/config.js';
    if (file_exists($configPath)) {
        header('Content-Type: application/javascript; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        $content = (string)file_get_contents($configPath);
        if (function_exists('api_setting')) {
            $siteName = api_setting('site_name', '');
            if ($siteName !== '') {
                $siteNameEscaped = str_replace(['\\', '"'], ['\\\\', '\"'], $siteName);
                $content = preg_replace('/"webSiteName":\s*"[^"]*"/', '"webSiteName": "' . $siteNameEscaped . '"', $content);
                $content = preg_replace('/"seoHomeTitle":\s*"[^"]*"/', '"seoHomeTitle": "' . $siteNameEscaped . '"', $content);
            }
            $siteDesc = api_setting('site_description', '');
            if ($siteDesc !== '') {
                $descEscaped = str_replace(['\\', '"', "\r", "\n"], ['\\\\', '\"', '', '\n'], $siteDesc);
                $content = preg_replace('/"seoHomeDescription":\s*"[^"]*"/', '"seoHomeDescription": "' . $descEscaped . '"', $content);
            }
            $telegram = api_setting('telegram_url', '');
            if ($telegram !== '') {
                $tgEscaped = str_replace(['\\', '"'], ['\\\\', '\"'], $telegram);
                $content = preg_replace('/("jumpUrl":\s*")https:\/\/t\.me\/[^"]*(")/', '${1}' . $tgEscaped . '${2}', $content);
            }
        }
        echo $content;
        exit;
    }
}
if ($uri === '/webapi/v/firebaseConfig.js') {
    serve_static_asset($docRoot . '/webapi/kv/firebaseConfig.js');
}

// -------------------------------------------------------------
// 4. Manual Cashier Payment Gateway
// -------------------------------------------------------------
if (preg_match('#^/pay(/.*)?$#i', $uri)) {
    $payIndex = $docRoot . '/pay/index.php';
    if (file_exists($payIndex)) {
        require $payIndex;
        exit;
    }
}

// -------------------------------------------------------------
// 5. Admin Panel Router
// -------------------------------------------------------------
if (preg_match('#^/admin(/.*)?$#i', $uri, $m)) {
    $adminFile = $docRoot . $uri;
    if (is_dir($adminFile)) {
        $adminFile = rtrim($adminFile, '/\\') . '/index.php';
    }
    if (is_file($adminFile)) {
        if (pathinfo($adminFile, PATHINFO_EXTENSION) === 'php') {
            require $adminFile;
            exit;
        }
        serve_static_asset($adminFile);
    }
    $defaultAdmin = $docRoot . '/admin/index.php';
    if (file_exists($defaultAdmin)) {
        require $defaultAdmin;
        exit;
    }
}

// -------------------------------------------------------------
// 6. Direct Core API Routes & WebAPI
// -------------------------------------------------------------
if (preg_match('#^/(?:webapi/|api/)?(Recharge|Withdraw|Activity|User|Home|Game|Lottery|ThirdGame|VipLevel|AgentRebate|WorkOrder)(/.*)?$#i', $uri, $m)) {
    $_GET['path'] = $m[1] . ($m[2] ?? '');
    require $docRoot . '/api/_router.php';
    exit;
}

if (preg_match('#^/webapi/(?!kv/|v/)(.*)$#i', $uri, $m)) {
    $_GET['path'] = $m[1];
    require $docRoot . '/api/_router.php';
    exit;
}

if (preg_match('#^/api/(.*)$#i', $uri, $m)) {
    $sub = $m[1];
    if (in_array($sub, ['_router.php', '_draw_router.php', '_bootstrap.php', 'config.php'], true)) {
        require $docRoot . '/api/' . $sub;
        exit;
    }
    $_GET['path'] = $sub;
    require $docRoot . '/api/_router.php';
    exit;
}

// -------------------------------------------------------------
// 7. Universal Static Asset Resolver (Images, Videos, Audio, Fonts, JS, CSS)
// -------------------------------------------------------------
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
$assetExtensions = [
    'webp', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'avif',
    'mp4', 'webm', 'mp3', 'wav', 'ogg',
    'woff2', 'woff', 'ttf', 'otf', 'eot',
    'css', 'js', 'mjs', 'json', 'webmanifest', 'wasm'
];

if (in_array($ext, $assetExtensions, true)) {
    // 1. Check exact requested path
    if (is_file($docRoot . $uri)) {
        serve_static_asset($docRoot . $uri);
    }

    // 2. Check candidate folders
    $candidates = [
        $docRoot . '/img' . $uri,
        $docRoot . '/assets' . $uri,
        $docRoot . '/images' . $uri,
        $docRoot . '/pro-img.arsaaspub.com' . $uri,
        $docRoot . '/0' . $uri,
        $docRoot . '/6006' . $uri,
        $docRoot . '/draw.ar-lottery01.com' . $uri,
    ];

    // 3. Strip directory prefixes and check alternate locations
    $strippedUri = preg_replace('#^/(?:img|images|assets|pro-img\.arsaaspub\.com|0|6006)/#i', '/', $uri);
    if ($strippedUri !== $uri) {
        $candidates[] = $docRoot . $strippedUri;
        $candidates[] = $docRoot . '/img' . $strippedUri;
        $candidates[] = $docRoot . '/assets' . $strippedUri;
        $candidates[] = $docRoot . '/images' . $strippedUri;
        $candidates[] = $docRoot . '/pro-img.arsaaspub.com' . $strippedUri;
        $candidates[] = $docRoot . '/0' . $strippedUri;
        $candidates[] = $docRoot . '/6006' . $strippedUri;
    }

    // 4. Basename lookup in main asset folders
    $baseName = basename($uri);
    $candidates[] = $docRoot . '/assets/' . $baseName;
    $candidates[] = $docRoot . '/images/' . $baseName;
    $candidates[] = $docRoot . '/img/' . $baseName;

    foreach ($candidates as $candidate) {
        if (is_file($candidate)) {
            serve_static_asset($candidate);
        }
    }

    // If an image was requested but not found anywhere on disk, return a 1x1 transparent PNG
    // instead of breaking the page with HTML or raw text!
    if (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'], true)) {
        header('Content-Type: image/png');
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: public, max-age=86400');
        // 1x1 transparent PNG byte stream
        echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        exit;
    }

    // For other assets, return 404
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Asset not found: ' . htmlspecialchars($uri, ENT_QUOTES, 'UTF-8');
    exit;
}

// -------------------------------------------------------------
// 8. Single Page Application (SPA) Fallback -> index.html
// -------------------------------------------------------------
$indexHtml = $docRoot . '/index.html';
if (is_file($indexHtml)) {
    header('Content-Type: text/html; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    $html = (string)file_get_contents($indexHtml);
    if (function_exists('api_setting')) {
        $siteName = api_setting('site_name', '');
        if ($siteName !== '') {
            $safeName = htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8');
            $html = preg_replace('/<title>.*?<\/title>/i', '<title>' . $safeName . '</title>', $html);
            $html = preg_replace('/(<meta\s+property=["\']og:title["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $safeName . '$2', $html);
            $html = preg_replace('/(<meta\s+property=["\']og:site_name["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $safeName . '$2', $html);
            $html = preg_replace('/(<meta\s+name=["\']twitter:title["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $safeName . '$2', $html);
            $html = preg_replace('/(<meta\s+name=["\']keywords["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $safeName . '$2', $html);
        }
    }
    echo $html;
    exit;
}

http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Platform: index.html not found';

