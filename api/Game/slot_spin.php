<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$token = trim((string)($input['token'] ?? ''));
$betAmount = (float)($input['bet_amount'] ?? 10);
$gameCode = (string)($input['game_code'] ?? 'slot');
$vendorCode = (string)($input['vendor_code'] ?? 'JILI');

if ($betAmount < 1) {
    $betAmount = 10.0;
}

$db = api_pdo();
$user = null;

if ($token !== '') {
    $tokenClean = trim(str_replace('Bearer ', '', $token));
    $stmt = $db->prepare("SELECT * FROM api_users WHERE token = ? LIMIT 1");
    $stmt->execute([$tokenClean]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}

if (!$user) {
    $user = api_primary_user();
}

if (!$user) {
    echo json_encode(['code' => 401, 'msg' => 'Please login to play.']);
    exit;
}

if ((float)$user['wallet_balance'] < $betAmount) {
    echo json_encode(['code' => 400, 'msg' => 'Insufficient wallet balance. Please recharge.']);
    exit;
}

// Slot Symbols & Payout Multipliers (for 3 matching symbols on a payline)
// 0: 🍒 Cherry (2x), 1: ⭐ Star (3x), 2: 🔔 Bell (5x), 3: 💰 Gold (10x), 4: 👑 Crown (15x), 5: 7️⃣ Seven (25x), 6: 💎 Diamond (50x)
$symbolWeights = [
    0 => 35, // Cherry
    1 => 25, // Star
    2 => 18, // Bell
    3 => 10, // Gold
    4 => 6,  // Crown
    5 => 4,  // Seven
    6 => 2   // Diamond
];

function getRandomSymbol(array $weights): int {
    $rand = mt_rand(1, 100);
    $cumulative = 0;
    foreach ($weights as $sym => $w) {
        $cumulative += $w;
        if ($rand <= $cumulative) {
            return $sym;
        }
    }
    return 0;
}

// Generate 3x3 reel grid: [row0, row1, row2] where each row has 3 columns
$reels = [
    [getRandomSymbol($symbolWeights), getRandomSymbol($symbolWeights), getRandomSymbol($symbolWeights)],
    [getRandomSymbol($symbolWeights), getRandomSymbol($symbolWeights), getRandomSymbol($symbolWeights)],
    [getRandomSymbol($symbolWeights), getRandomSymbol($symbolWeights), getRandomSymbol($symbolWeights)]
];

// Payline Multipliers
$multipliers = [
    0 => 2.0,  // Cherry
    1 => 3.0,  // Star
    2 => 5.0,  // Bell
    3 => 10.0, // Gold
    4 => 15.0, // Crown
    5 => 25.0, // Seven
    6 => 50.0  // Diamond
];

// 5 Paylines to evaluate:
// Line 0: Middle row [1,0], [1,1], [1,2]
// Line 1: Top row [0,0], [0,1], [0,2]
// Line 2: Bottom row [2,0], [2,1], [2,2]
// Line 3: Diagonal top-left to bottom-right [0,0], [1,1], [2,2]
// Line 4: Diagonal bottom-left to top-right [2,0], [1,1], [0,2]
$paylines = [
    0 => [[1,0], [1,1], [1,2]],
    1 => [[0,0], [0,1], [0,2]],
    2 => [[2,0], [2,1], [2,2]],
    3 => [[0,0], [1,1], [2,2]],
    4 => [[2,0], [1,1], [0,2]],
];

$winLines = [];
$totalMultiplier = 0.0;

foreach ($paylines as $lineIdx => $coords) {
    $s0 = $reels[$coords[0][0]][$coords[0][1]];
    $s1 = $reels[$coords[1][0]][$coords[1][1]];
    $s2 = $reels[$coords[2][0]][$coords[2][1]];

    if ($s0 === $s1 && $s1 === $s2) {
        $mult = $multipliers[$s0];
        $totalMultiplier += $mult;
        $winLines[] = [
            'line' => $lineIdx,
            'symbol' => $s0,
            'multiplier' => $mult,
            'coords' => $coords
        ];
    }
}

// Calculate win amount
$winAmount = round(($betAmount / 5.0) * $totalMultiplier, 2);

try {
    $db->beginTransaction();

    $newBalance = (float)$user['wallet_balance'] - $betAmount + $winAmount;
    $db->prepare("UPDATE api_users SET wallet_balance = ? WHERE id = ?")
       ->execute([$newBalance, $user['id']]);

    $db->commit();

    echo json_encode([
        'code' => 0,
        'msg' => 'Spin completed',
        'data' => [
            'reels' => $reels,
            'win_lines' => $winLines,
            'win_amount' => $winAmount,
            'is_win' => $winAmount > 0,
            'wallet_balance' => $newBalance,
            'bet_amount' => $betAmount
        ]
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(['code' => 500, 'msg' => 'Spin failed: ' . $e->getMessage()]);
}
