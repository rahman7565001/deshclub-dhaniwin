<?php
// router.php for PHP built-in web server
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$docRoot = __DIR__;
$filePath = $docRoot . $uri;

// Helper to serve static file with proper MIME and CORS headers
function serve_static_file(string $path): void {
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $mimes = [
        'webp' => 'image/webp',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'avif' => 'image/avif',
        'mp4'  => 'video/mp4',
        'webm' => 'video/webm',
        'mp3'  => 'audio/mpeg',
        'wav'  => 'audio/wav',
        'ogg'  => 'audio/ogg',
        'css'  => 'text/css; charset=utf-8',
        'js'   => 'application/javascript; charset=utf-8',
        'mjs'  => 'application/javascript; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'woff2'=> 'font/woff2',
        'woff' => 'font/woff',
        'ttf'  => 'font/ttf',
        'otf'  => 'font/otf',
        'eot'  => 'application/vnd.ms-fontobject',
        'wasm' => 'application/wasm',
        'webmanifest' => 'application/manifest+json; charset=utf-8',
        'html' => 'text/html; charset=utf-8',
    ];
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
    header('Accept-Ranges: bytes');
    if (isset($mimes[$ext])) {
        header('Content-Type: ' . $mimes[$ext]);
    }
    $size = filesize($path);
    if (isset($_SERVER['HTTP_RANGE'])) {
        if (preg_match('/bytes=\s*(\d+)-(\d*)/i', $_SERVER['HTTP_RANGE'], $matches)) {
            $start = (int)$matches[1];
            $end = ($matches[2] !== '') ? (int)$matches[2] : ($size - 1);
            if ($start <= $end && $start < $size) {
                $len = $end - $start + 1;
                http_response_code(206);
                header("Content-Range: bytes $start-$end/$size");
                header('Content-Length: ' . $len);
                $fp = fopen($path, 'rb');
                fseek($fp, $start);
                echo fread($fp, $len);
                fclose($fp);
                exit;
            }
        }
    }
    header('Content-Length: ' . $size);
    readfile($path);
    exit;
}

// 1. Dynamic lottery draw router
// /webapi/kv/issue/... or /webapi/v/issue/...
if (preg_match('#^/webapi/(kv|v)/issue/(.+)$#i', $uri, $m)) {
    $_GET['gameCode'] = $m[2];
    require $docRoot . '/api/_draw_router.php';
    exit;
}

// /WinGo/...json, /K3/...json, etc.
if (preg_match('#^/(WinGo|K3|D5|MotoRace|TrxWinGo)/(.+\.json)$#i', $uri, $m)) {
    $_GET['path'] = $m[1] . '/' . $m[2];
    require $docRoot . '/api/_draw_router.php';
    exit;
}

// config fallback
if ($uri === '/webapi/v/config.js') {
    $uri = '/webapi/kv/config.js';
    $filePath = $docRoot . $uri;
}
if ($uri === '/webapi/v/firebaseConfig.js') {
    $uri = '/webapi/kv/firebaseConfig.js';
    $filePath = $docRoot . $uri;
}

// Official bKash and Nagad logo alias for legacy URLs
if (preg_match('#/bankLogo/(052326529|052328901)#i', $uri)) {
    serve_static($docRoot . '/img/6006/bankLogo/bkash.svg');
}
if (preg_match('#/bankLogo/(052212261|052214587)#i', $uri)) {
    serve_static($docRoot . '/img/6006/bankLogo/nagad.svg');
}

// 2. Direct API routes (Recharge, Withdraw, Activity, User, Home, Game, Lottery, ThirdGame, VipLevel, AgentRebate, WorkOrder)
if (preg_match('#^/(?:webapi/|api/)?(Recharge|Withdraw|Activity|User|Home|Game|Lottery|ThirdGame|VipLevel|AgentRebate|WorkOrder)/(.*)$#i', $uri, $m)) {
    if (file_exists($filePath) && !is_dir($filePath) && pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
        require $filePath;
        exit;
    }
    $_GET['path'] = $m[1] . '/' . $m[2];
    require $docRoot . '/api/_router.php';
    exit;
}

// 3. WebAPI fallback router (any /webapi/* API call not matching static /webapi/kv or /webapi/v)
if (preg_match('#^/webapi/(?!kv/|v/)(.*)$#i', $uri, $m)) {
    $_GET['path'] = $m[1];
    require $docRoot . '/api/_router.php';
    exit;
}

// 4. API router
if (preg_match('#^/api/(.*)$#i', $uri, $m)) {
    $sub = $m[1];
    if ($sub === '_router.php' || $sub === '_draw_router.php' || $sub === '_bootstrap.php' || $sub === 'config.php') {
        require $docRoot . '/api/' . $sub;
        exit;
    }
    $_GET['path'] = $sub;
    require $docRoot . '/api/_router.php';
    exit;
}

// 4. Admin routes
if (preg_match('#^/admin(/.*)?$#i', $uri, $m)) {
    if (is_dir($filePath)) {
        $indexFile = rtrim($filePath, '/\\') . '/index.php';
        if (file_exists($indexFile)) {
            require $indexFile;
            exit;
        }
    }
    if (file_exists($filePath) && !is_dir($filePath)) {
        if (pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
            require $filePath;
            exit;
        }
        serve_static_file($filePath);
    }
}

// 5. Image / Asset fallback checks
if (!file_exists($filePath) || is_dir($filePath)) {
    $candidates = [
        $docRoot . '/0' . $uri,
        $docRoot . '/6006' . $uri,
        $docRoot . '/pro-img.arsaaspub.com' . $uri,
        $docRoot . '/img' . $uri,
        $docRoot . '/assets' . $uri,
        $docRoot . '/images' . $uri,
        $docRoot . '/draw.ar-lottery01.com' . $uri,
    ];
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
    $baseName = basename($uri);
    $candidates[] = $docRoot . '/assets/' . $baseName;
    $candidates[] = $docRoot . '/images/' . $baseName;
    $candidates[] = $docRoot . '/img/' . $baseName;

    foreach ($candidates as $cand) {
        if (file_exists($cand) && !is_dir($cand)) {
            $filePath = $cand;
            break;
        }
    }
}

// 6. Physical static file exists
if (file_exists($filePath) && !is_dir($filePath)) {
    if (pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
        require $filePath;
        exit;
    }
    serve_static_file($filePath);
}

// 7. Directory index
if (is_dir($filePath)) {
    $indexPhp = rtrim($filePath, '/\\') . '/index.php';
    if (file_exists($indexPhp)) {
        require $indexPhp;
        exit;
    }
    $indexHtml = rtrim($filePath, '/\\') . '/index.html';
    if (file_exists($indexHtml)) {
        serve_static_file($indexHtml);
    }
}

// 8. SPA fallback
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
if ($ext === '' || $ext === 'html') {
    require $docRoot . '/index.php';
    exit;
}

if (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'], true)) {
    header('Content-Type: image/png');
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: public, max-age=86400');
    echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    exit;
}

if ($ext === 'css') {
    header('Content-Type: text/css; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: public, max-age=3600');
    echo "/* deshclub fallback css */";
    exit;
}

if ($ext === 'js' || $ext === 'mjs') {
    header('Content-Type: application/javascript; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: public, max-age=3600');
    echo "export default {}; export const N = {};";
    exit;
}

http_response_code(404);
echo "404 Not Found";
