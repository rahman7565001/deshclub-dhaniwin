<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$input = api_request_input();
$gameCode = (string)api_param($input, 'gameCode', api_param($input, 'game_code', ''));
$vendorCode = (string)api_param($input, 'vendorCode', '');
$gameId = (int)api_param($input, 'gameId', 0);

// Resolve user token from request headers, input, or primary user
$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = '';
if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $m)) {
    $token = $m[1];
} elseif (!empty($input['token'])) {
    $token = (string)$input['token'];
}

if ($token === '') {
    $user = api_primary_user();
    $token = (string)($user['token'] ?? '');
}

// Build dynamic absolute URL matching the client host & scheme
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    ? 'https' : 'http';
$host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
$baseUrl = $protocol . '://' . $host;

// 1. Check if Lottery / Color Trading (ARLottery)
$isLottery = ($vendorCode === 'ARLottery')
    || preg_match('/^(WinGo|K3|D5|5D|TrxWinGo|MotoRace|VideoWinGo)/i', $gameCode);

if ($isLottery) {
    $lottery = 'WinGo';
    if (stripos($gameCode, 'TrxWinGo') === 0) {
        $lottery = 'TrxWinGo';
    } elseif (stripos($gameCode, 'WinGo') === 0) {
        $lottery = 'WinGo';
    } elseif (stripos($gameCode, 'K3') === 0) {
        $lottery = 'K3';
    } elseif (stripos($gameCode, 'D5') === 0 || stripos($gameCode, '5D') === 0) {
        $lottery = 'D5';
    } elseif (stripos($gameCode, 'MotoRace') === 0) {
        $lottery = 'MotoRace';
    } elseif (stripos($gameCode, 'VideoWinGo') === 0) {
        $lottery = 'VideoWinGo';
    } else {
        $parts = explode('_', $gameCode);
        $lottery = $parts[0] ?: 'WinGo';
    }

    $gameUrl = $baseUrl . '/#/' . $lottery . '/' . urlencode($gameCode) . '?Token=' . urlencode($token) . '&token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 2. Check if Aviator
if ($gameCode === '804' || stripos($gameCode, 'aviator') !== false || $gameCode === 'Spribe_Aviator' || $gameId === 23604 || stripos($vendorCode, 'aviator') !== false) {
    $gameUrl = $baseUrl . '/aviator/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 3. Check if Chicken Road (1 or 2)
if ($gameCode === '123' || $gameCode === '121' || stripos($gameCode, 'chicken') !== false || $gameId === 23832 || $gameId === 23815) {
    $gameUrl = $baseUrl . '/chicken/index.php?token=' . urlencode($token) . '&version=' . ($gameCode === '121' ? '2' : '1');
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 4. Check if JDB Game (Dragon Fishing or Super Niubi Slot)
$isJdbGame = ($vendorCode === 'JDB')
    || (stripos($vendorCode, 'jdb') !== false)
    || in_array($gameCode, ['7001', '7002', '7003', '7004', '7005', '7006', '14036', '14045', '14006', '14027', '14080'], true)
    || stripos($gameCode, 'jdb') !== false;

if ($isJdbGame) {
    $isFishing = in_array($gameCode, ['7001', '7002', '7003', '7004', '7005', '7006'], true) || stripos($gameCode, 'fish') !== false;
    $gameUrl = $baseUrl . '/jdb/index.php?token=' . urlencode($token) . '&game=' . urlencode($gameCode) . '&mode=' . ($isFishing ? 'fishing' : 'slot');
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 5. Check if Mines (Diamond Mines Crash Game)
$isMinesGame = ($gameCode === '100' || $gameCode === '811' || $gameId === 20562 || $gameId === 21127 || stripos($gameCode, 'mines') !== false || stripos($vendorCode, 'mines') !== false);
if ($isMinesGame) {
    $gameUrl = $baseUrl . '/mines/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 6. Check if Card365 (Teen Patti, Andar Bahar, Dragon Tiger, 7 Up 7 Down)
$isCard365Game = ($vendorCode === 'Card365' || stripos($vendorCode, 'card365') !== false || in_array($gameCode, ['707', '710', '563', '561', '921', '918', '562', '701', '565', '564'], true) || stripos($gameCode, 'patti') !== false || stripos($gameCode, 'andar') !== false || stripos($gameCode, 'rummy') !== false);
if ($isCard365Game) {
    $gameUrl = $baseUrl . '/card365/index.php?token=' . urlencode($token) . '&game=' . urlencode($gameCode);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 7. Check if Jackpot Fishing (JILI Jackpot Fishing / Happy Fishing)
$isJackpotFishing = ($vendorCode === 'JILI' && ($gameCode === '32' || $gameCode === '82'))
    || ($gameId === 20108 || $gameId === 20111)
    || (stripos($gameCode, 'jackpot') !== false && stripos($gameCode, 'fish') !== false)
    || (stripos($gameCode, 'happy') !== false && stripos($gameCode, 'fish') !== false)
    || $gameCode === 'jackpot_fishing';
if ($isJackpotFishing) {
    $gameUrl = $baseUrl . '/jackpot_fishing/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 8. Check if Roulette (European / Royal Roulette)
$isRouletteGame = ($gameCode === 'roulette' || $gameCode === '104' || $gameId === 24099 || $gameId === 20566 || stripos($gameCode, 'roulette') !== false);
if ($isRouletteGame) {
    $gameUrl = $baseUrl . '/roulette/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 9. Check if Space Dice (Cosmic Dice)
$isSpaceDice = ($gameCode === 'space_dice' || $gameCode === 'dice' || $gameCode === '102' || stripos($gameCode, 'space_dice') !== false || stripos($gameCode, 'dice') !== false);
if ($isSpaceDice) {
    $gameUrl = $baseUrl . '/space_dice/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 10. Check if Plinko
$isPlinko = ($gameCode === 'plinko' || $gameCode === '812' || stripos($gameCode, 'plinko') !== false || stripos($vendorCode, 'plinko') !== false);
if ($isPlinko) {
    $gameUrl = $baseUrl . '/plinko/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 11. Check if Sic Bo
$isSicBo = ($gameCode === 'sicbo' || $gameCode === '103' || $gameCode === '813' || stripos($gameCode, 'sicbo') !== false || stripos($gameCode, 'sic_bo') !== false);
if ($isSicBo) {
    $gameUrl = $baseUrl . '/sicbo/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 12. Check if Limbo
$isLimbo = ($gameCode === 'limbo' || $gameCode === '105' || $gameCode === '814' || stripos($gameCode, 'limbo') !== false);
if ($isLimbo) {
    $gameUrl = $baseUrl . '/limbo/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 13. Check if Coin Flip
$isCoinFlip = ($gameCode === 'coinflip' || $gameCode === 'coin_flip' || $gameCode === '106' || $gameCode === '815' || stripos($gameCode, 'coinflip') !== false || stripos($gameCode, 'coin') !== false);
if ($isCoinFlip) {
    $gameUrl = $baseUrl . '/coinflip/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 14. Check if Crazy Wheel
$isCrazyWheel = ($gameCode === 'crazywheel' || $gameCode === 'crazy_wheel' || $gameCode === '107' || $gameCode === '816' || stripos($gameCode, 'crazywheel') !== false || stripos($gameCode, 'crazy') !== false || stripos($gameCode, 'wheel') !== false);
if ($isCrazyWheel) {
    $gameUrl = $baseUrl . '/crazywheel/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 15. Check if Tower Legend
$isTower = ($gameCode === 'tower' || $gameCode === 'tower_legend' || $gameCode === '108' || $gameCode === '817' || stripos($gameCode, 'tower') !== false);
if ($isTower) {
    $gameUrl = $baseUrl . '/tower/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 16. Check if Penalty Shootout
$isPenalty = ($gameCode === 'penalty' || $gameCode === 'penalty_shootout' || $gameCode === '109' || $gameCode === '818' || stripos($gameCode, 'penalty') !== false || stripos($gameCode, 'shootout') !== false);
if ($isPenalty) {
    $gameUrl = $baseUrl . '/penalty/index.php?token=' . urlencode($token);
    api_emit(api_success([
        'url' => $gameUrl,
        'returnType' => 1
    ]));
}

// 17. Fallback for all other Slot & Casino games
$gameUrl = $baseUrl . '/game/slot.php?game=' . urlencode($gameCode) . '&vendor=' . urlencode($vendorCode) . '&token=' . urlencode($token);
api_emit(api_success([
    'url' => $gameUrl,
    'returnType' => 1
]));


