<?php
declare(strict_types=1);

require_once __DIR__ . '/engine.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$db = aviator_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $nextMult = trim((string)($input['next_crash_multiplier'] ?? ''));

    if ($nextMult !== '' && is_numeric($nextMult) && (float)$nextMult >= 1.0) {
        $db->prepare("INSERT OR REPLACE INTO aviator_settings (key, value) VALUES ('next_crash_multiplier', ?)")
           ->execute([round((float)$nextMult, 2)]);
        echo json_encode(['code' => 0, 'msg' => 'Next crash multiplier set to ' . $nextMult . 'x']);
        exit;
    }
}

// Stats
$totalBets = (int)$db->query("SELECT COUNT(*) FROM aviator_bets")->fetchColumn();
$totalStakes = (float)$db->query("SELECT SUM(stake_amount) FROM aviator_bets")->fetchColumn();
$totalPayouts = (float)$db->query("SELECT SUM(payout_amount) FROM aviator_bets WHERE status = 'won'")->fetchColumn();
$profit = $totalStakes - $totalPayouts;

$nextSetting = $db->query("SELECT value FROM aviator_settings WHERE key = 'next_crash_multiplier'")->fetchColumn();

echo json_encode([
    'code' => 0,
    'data' => [
        'total_bets' => $totalBets,
        'total_stakes' => round($totalStakes, 2),
        'total_payouts' => round($totalPayouts, 2),
        'house_profit' => round($profit, 2),
        'next_crash_override' => $nextSetting ?: 'Automatic (RNG)',
    ]
]);
