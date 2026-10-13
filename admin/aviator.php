<?php
// admin/aviator.php - Admin Aviator Control Panel
require_once dirname(__DIR__) . '/api/_bootstrap.php';
$db = api_pdo();

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'set_multiplier') {
        $val = trim((string)($_POST['next_multiplier'] ?? ''));
        if ($val !== '' && is_numeric($val) && (float)$val >= 1.0) {
            $db->prepare("INSERT OR REPLACE INTO aviator_settings (key, value) VALUES ('next_crash_multiplier', ?)")
               ->execute([round((float)$val, 2)]);
            $msg = "Next round crash point set to <strong>{$val}x</strong> successfully!";
        } else {
            $db->exec("UPDATE aviator_settings SET value = '' WHERE key = 'next_crash_multiplier'");
            $msg = "Next round crash point reset to <strong>Automatic (RNG)</strong> mode.";
        }
    }
}

// Fetch stats
$totalBets = (int)$db->query("SELECT COUNT(*) FROM aviator_bets")->fetchColumn();
$totalStakes = (float)$db->query("SELECT SUM(stake_amount) FROM aviator_bets")->fetchColumn();
$totalPayouts = (float)$db->query("SELECT SUM(payout_amount) FROM aviator_bets WHERE status = 'won'")->fetchColumn();
$profit = $totalStakes - $totalPayouts;

$nextOverride = $db->query("SELECT value FROM aviator_settings WHERE key = 'next_crash_multiplier'")->fetchColumn();
if (!$nextOverride) $nextOverride = 'Automatic (RNG)';

$recentRounds = $db->query("SELECT * FROM aviator_rounds ORDER BY id DESC LIMIT 15")->fetchAll(PDO::FETCH_ASSOC);
$recentBets = $db->query("SELECT * FROM aviator_bets ORDER BY id DESC LIMIT 15")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aviator Game Control - Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: #0f111a; color: #e2e8f0; padding: 24px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        h1 { font-size: 24px; color: #ffffff; }
        .btn-link { background: #e53935; color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #1a1d2d; border: 1px solid #282c44; border-radius: 10px; padding: 18px; }
        .card .title { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
        .card .value { font-size: 26px; font-weight: 700; color: #ffffff; }
        .card .value.profit { color: #10b981; }
        .control-box { background: #1a1d2d; border: 1px solid #282c44; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
        .control-box h2 { font-size: 18px; margin-bottom: 12px; }
        .form-row { display: flex; gap: 12px; align-items: center; margin-top: 12px; }
        .input-text { background: #0f111a; border: 1px solid #333954; color: #ffffff; padding: 10px 14px; border-radius: 6px; font-size: 15px; width: 220px; }
        .btn-save { background: #3b82f6; color: #ffffff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .btn-reset { background: #475569; color: #ffffff; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .alert { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #242940; }
        th { color: #94a3b8; font-weight: 600; background: #131624; }
        .mult-badge { padding: 2px 8px; border-radius: 12px; font-weight: 700; font-size: 12px; }
        .mult-badge.low { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .mult-badge.mid { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        .mult-badge.high { background: rgba(236, 72, 153, 0.2); color: #ec4899; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✈️ Aviator Game Engine Control</h1>
        <div>
            <a href="/aviator/" target="_blank" class="btn-link">Play Game ↗</a>
            <a href="/admin/" style="margin-left: 8px; color: #94a3b8; text-decoration: none; font-size: 13px;">← Admin Home</a>
        </div>
    </div>

    <?php if ($msg): ?>
        <div class="alert"><?= $msg ?></div>
    <?php endif; ?>

    <div class="grid">
        <div class="card">
            <div class="title">Total Bets</div>
            <div class="value"><?= number_format($totalBets) ?></div>
        </div>
        <div class="card">
            <div class="title">Total Stakes</div>
            <div class="value">₹<?= number_format($totalStakes, 2) ?></div>
        </div>
        <div class="card">
            <div class="title">Total Payouts</div>
            <div class="value">₹<?= number_format($totalPayouts, 2) ?></div>
        </div>
        <div class="card">
            <div class="title">House Net Profit</div>
            <div class="value profit">₹<?= number_format($profit, 2) ?></div>
        </div>
    </div>

    <!-- Manual Control Box -->
    <div class="control-box">
        <h2>🎯 Manual Crash Multiplier Control</h2>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            You can dictate the exact crash multiplier for the <strong>very next round</strong>. When set, the plane will climb and crash exactly at this point! After that round, it reverts to automatic RNG.
        </p>

        <form method="POST" class="form-row">
            <input type="hidden" name="action" value="set_multiplier">
            <label style="font-size: 13px; font-weight: 600;">Next Crash Target:</label>
            <input type="number" step="0.01" min="1.00" max="1000.00" name="next_multiplier" class="input-text" placeholder="e.g. 1.20 or 5.00" value="<?= is_numeric($nextOverride) ? $nextOverride : '' ?>">
            <button type="submit" class="btn-save">Set Multiplier</button>
            <button type="button" class="btn-reset" onclick="document.querySelector('input[name=next_multiplier]').value=''; this.form.submit();">Reset to Auto</button>
            <span style="margin-left: 12px; font-size: 13px; color: #38bdf8;">Current setting: <strong><?= htmlspecialchars($nextOverride) ?></strong></span>
        </form>
    </div>

    <!-- Recent Rounds -->
    <div class="control-box">
        <h2>📜 Recent Crash Rounds</h2>
        <table>
            <thead>
                <tr>
                    <th>Round ID</th>
                    <th>Crash Multiplier</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($recentRounds as $r): 
                    $m = (float)$r['crash_multiplier'];
                    $cls = $m < 2.0 ? 'low' : ($m < 10.0 ? 'mid' : 'high');
                ?>
                <tr>
                    <td><code><?= htmlspecialchars($r['round_uuid']) ?></code></td>
                    <td><span class="mult-badge <?= $cls ?>"><?= number_format($m, 2) ?>x</span></td>
                    <td style="text-transform: capitalize;"><?= htmlspecialchars($r['status']) ?></td>
                    <td><?= htmlspecialchars($r['created_at']) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
