<?php
// plinko/index.php - Plinko Casino Arcade
require_once dirname(__DIR__) . '/api/_bootstrap.php';

$token = trim((string)($_GET['token'] ?? $_GET['Token'] ?? ''));

$user = null;
if ($token !== '') {
    $db = api_pdo();
    $stmt = $db->prepare("SELECT * FROM api_users WHERE token = ? LIMIT 1");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}
if (!$user) {
    $user = api_primary_user();
    $token = (string)($user['token'] ?? '');
}

$balance = max((float)($user['wallet_balance'] ?? 0), (float)($user['game_balance'] ?? 0));
$currency = api_user_currency($user)['symbol'] ?? '৳';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Plinko - Neon Cyber Arcade</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="plinko.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="pk-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="pk-brand">
                <span class="brand-sub">CYBER ARCADE</span>
                <span class="brand-title">PLINKO</span>
            </div>
        </div>

        <div class="header-right">
            <div class="balance-card" id="balance-box" title="Click to refresh">
                <span class="cur-sym"><?= $currency ?></span>
                <span class="cur-val" id="user-balance"><?= number_format($balance, 2, '.', '') ?></span>
                <span class="refresh-icon" id="balance-spinner">↻</span>
            </div>
            <button class="btn-icon" id="btn-sound" title="Toggle Sound">🔊</button>
            <button class="btn-icon" id="btn-info" title="How to Play">ℹ️</button>
        </div>
    </header>

    <!-- Multiplier Live History Ribbon -->
    <div class="history-ribbon">
        <span class="hist-label">LATEST:</span>
        <div class="hist-scroll" id="hist-scroll">
            <span class="hist-chip gold">29x</span>
            <span class="hist-chip orange">4x</span>
            <span class="hist-chip purple">1.5x</span>
            <span class="hist-chip dark">0.3x</span>
            <span class="hist-chip cyan">110x</span>
            <span class="hist-chip gold">1000x</span>
        </div>
    </div>

    <!-- Main Container -->
    <main class="pk-main">
        <!-- Canvas Arena Container -->
        <div class="canvas-arena">
            <canvas id="plinko-canvas"></canvas>
            
            <!-- Multi-ball count overlay (shows when multiple balls are dropping) -->
            <div class="balls-active-badge" id="balls-active-badge" style="display: none;">
                <span class="dot"></span> <span id="balls-count">0</span> BALLS IN PLAY
            </div>
        </div>

        <!-- Controls Dock -->
        <div class="pk-controls">
            <!-- Row 1: Risk & Rows Selection -->
            <div class="settings-grid">
                <!-- Risk Selector -->
                <div class="setting-group">
                    <span class="setting-lbl">RISK LEVEL</span>
                    <div class="risk-pills">
                        <button class="btn-risk" data-risk="low" onclick="setRisk('low')">LOW</button>
                        <button class="btn-risk active" data-risk="medium" onclick="setRisk('medium')">MED</button>
                        <button class="btn-risk" data-risk="high" onclick="setRisk('high')">HIGH</button>
                    </div>
                </div>

                <!-- Rows Selector -->
                <div class="setting-group">
                    <span class="setting-lbl">ROWS</span>
                    <div class="rows-pills">
                        <button class="btn-row" data-rows="8" onclick="setRows(8)">8</button>
                        <button class="btn-row" data-rows="10" onclick="setRows(10)">10</button>
                        <button class="btn-row" data-rows="12" onclick="setRows(12)">12</button>
                        <button class="btn-row" data-rows="14" onclick="setRows(14)">14</button>
                        <button class="btn-row active" data-rows="16" onclick="setRows(16)">16</button>
                    </div>
                </div>
            </div>

            <!-- Row 2: Stake Stepper & Helpers -->
            <div class="stake-row">
                <div class="stepper-box">
                    <span class="lbl">BET:</span>
                    <button class="btn-step" onclick="changeStake(-10)">-</button>
                    <span class="stake-val"><span class="cur"><?= $currency ?></span><span id="display-stake">10</span></span>
                    <button class="btn-step" onclick="changeStake(10)">+</button>
                </div>
                <div class="quick-helpers">
                    <button class="btn-help" onclick="adjustStake('half')">1/2</button>
                    <button class="btn-help" onclick="adjustStake('double')">2X</button>
                    <button class="btn-help" onclick="adjustStake('max')">MAX</button>
                </div>
            </div>

            <!-- Row 3: Chips Tray -->
            <div class="chips-tray">
                <button class="chip active" onclick="setStake(10)">10</button>
                <button class="chip" onclick="setStake(20)">20</button>
                <button class="chip" onclick="setStake(50)">50</button>
                <button class="chip" onclick="setStake(100)">100</button>
                <button class="chip" onclick="setStake(200)">200</button>
                <button class="chip" onclick="setStake(500)">500</button>
                <button class="chip" onclick="setStake(1000)">1K</button>
            </div>

            <!-- Row 4: Big Action Buttons -->
            <div class="action-row">
                <button class="btn-drop" id="btn-drop" onclick="dropBall()">
                    <span class="ico">🟢</span>
                    <span class="txt">DROP BALL</span>
                </button>
                <button class="btn-auto" id="btn-auto" onclick="toggleAutoDrop()">
                    <span class="ico">⚡</span>
                    <span id="auto-txt">AUTO</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal (High Multipliers >= 10x) -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">MEGA JACKPOT HIT!</div>
            <div class="celebration-icon" id="celeb-icon">🎰</div>
            <div class="celebration-mult" id="celeb-mult">1000x</div>
            <div class="celebration-amount" id="celeb-amount">+৳10,000.00</div>
            <div class="celebration-subtitle">INSANE PLINKO MULTIPLIER!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ PLINKO HOW TO PLAY</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🎯 Objective:</strong> Drop balls through the peg pyramid into the buckets at the bottom. Each bucket contains a multiplier for your stake.</p>
                <p><strong>⚡ Risk Levels:</strong>
                    <br>• <strong>Low:</strong> Safer payouts with lower volatility.
                    <br>• <strong>Medium:</strong> Balanced multipliers with higher edge buckets.
                    <br>• <strong>High:</strong> Extreme volatility with massive outer buckets up to <strong>1000x</strong>!
                </p>
                <p><strong>📐 Rows:</strong> Adjust between 8 to 16 rows to expand the pyramid width and potential jackpot prizes.</p>
                <p><strong>🔥 Multi-Drop:</strong> Tap "DROP BALL" repeatedly to launch multiple balls simultaneously!</p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.PK_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="plinko.js?v=<?= time() ?>"></script>
</body>
</html>
