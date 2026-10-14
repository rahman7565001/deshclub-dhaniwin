<?php
// limbo/index.php - Limbo Turbo Cyber Crash Arcade
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
    <title>Limbo Turbo - Cyber Rocket Crash</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="limbo.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="lb-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="lb-brand">
                <span class="brand-sub">TURBO CRASH ARCADE</span>
                <span class="brand-title">LIMBO 🚀</span>
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

    <!-- Multiplier History Tape Ribbon -->
    <div class="history-ribbon">
        <span class="hist-label">RECENT:</span>
        <div class="hist-scroll" id="hist-scroll">
            <span class="hist-chip gold">124.60x</span>
            <span class="hist-chip green">4.25x</span>
            <span class="hist-chip red">1.12x</span>
            <span class="hist-chip gold">18.40x</span>
            <span class="hist-chip red">1.95x</span>
            <span class="hist-chip gold">580.00x</span>
        </div>
    </div>

    <!-- Main Game Arena -->
    <main class="lb-main">
        <!-- 60FPS Warp Canvas & Hologram Multiplier -->
        <div class="warp-stage">
            <canvas id="warp-canvas"></canvas>

            <!-- Holographic Display Readout -->
            <div class="counter-display">
                <div class="hud-status" id="hud-status">READY FOR LAUNCH</div>
                <div class="counter-val" id="counter-val">2.00x</div>
                <div class="payout-banner" id="payout-banner" style="display: none;">+৳20.00</div>
                <div class="target-sub" id="target-sub">TARGET: <span class="cyan">2.00x</span> • WIN CHANCE: <span class="gold">49.25%</span></div>
            </div>
        </div>

        <!-- Controls Dock -->
        <div class="lb-controls">
            <!-- Row 1: Stake Stepper & Helpers -->
            <div class="input-card">
                <div class="card-header">
                    <span class="card-lbl">BET AMOUNT</span>
                    <span class="est-win">EST. PROFIT: <strong class="green" id="est-profit"><?= $currency ?> 10.00</strong></span>
                </div>
                <div class="stepper-row">
                    <button class="btn-step" onclick="changeStake(-10)">-</button>
                    <div class="stake-display">
                        <span class="cur"><?= $currency ?></span>
                        <input type="number" id="input-stake" value="10" min="10" max="50000" onchange="onStakeInput(this.value)">
                    </div>
                    <button class="btn-step" onclick="changeStake(10)">+</button>
                    <div class="quick-helpers">
                        <button class="btn-help" onclick="adjustStake('half')">1/2</button>
                        <button class="btn-help" onclick="adjustStake('double')">2X</button>
                        <button class="btn-help" onclick="adjustStake('max')">MAX</button>
                    </div>
                </div>
            </div>

            <!-- Row 2: Chips Tray -->
            <div class="chips-tray">
                <button class="chip active" onclick="setStake(10)">10</button>
                <button class="chip" onclick="setStake(20)">20</button>
                <button class="chip" onclick="setStake(50)">50</button>
                <button class="chip" onclick="setStake(100)">100</button>
                <button class="chip" onclick="setStake(200)">200</button>
                <button class="chip" onclick="setStake(500)">500</button>
                <button class="chip" onclick="setStake(1000)">1K</button>
            </div>

            <!-- Row 3: Target Multiplier & Win Chance Linked Inputs -->
            <div class="dual-inputs-grid">
                <!-- Target Multiplier -->
                <div class="input-card mini">
                    <div class="card-header">
                        <span class="card-lbl">TARGET MULTIPLIER</span>
                    </div>
                    <div class="stepper-row">
                        <button class="btn-step" onclick="changeTarget(-0.1)">-</button>
                        <input type="number" id="input-target" class="num-input" value="2.00" step="0.1" min="1.01" max="10000" oninput="onTargetChange(this.value)">
                        <button class="btn-step" onclick="changeTarget(0.1)">+</button>
                    </div>
                </div>

                <!-- Win Chance -->
                <div class="input-card mini">
                    <div class="card-header">
                        <span class="card-lbl">WIN CHANCE (%)</span>
                    </div>
                    <div class="stepper-row">
                        <input type="number" id="input-chance" class="num-input" value="49.25" step="0.5" min="0.01" max="97.5" oninput="onChanceChange(this.value)">
                        <span class="pct-symbol">%</span>
                    </div>
                </div>
            </div>

            <!-- Row 4: Quick Multiplier Presets -->
            <div class="presets-tray">
                <button class="btn-preset active" data-preset="1.5" onclick="setPreset(1.5)">1.5x</button>
                <button class="btn-preset" data-preset="2.0" onclick="setPreset(2.0)">2x</button>
                <button class="btn-preset" data-preset="5.0" onclick="setPreset(5.0)">5x</button>
                <button class="btn-preset" data-preset="10.0" onclick="setPreset(10.0)">10x</button>
                <button class="btn-preset" data-preset="50.0" onclick="setPreset(50.0)">50x</button>
                <button class="btn-preset" data-preset="100.0" onclick="setPreset(100.0)">100x</button>
                <button class="btn-preset" data-preset="1000.0" onclick="setPreset(1000.0)">1000x</button>
            </div>

            <!-- Row 5: Action Row -->
            <div class="action-row">
                <button class="btn-launch" id="btn-launch" onclick="launchBet()">
                    <span class="ico">🚀</span>
                    <span class="txt">LAUNCH BET</span>
                </button>
                <button class="btn-auto" id="btn-auto" onclick="toggleAutoPlay()">
                    <span class="ico">⚡</span>
                    <span id="auto-txt">AUTO</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal (High Multipliers >= 10x) -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">MEGA LIMBO WIN!</div>
            <div class="celebration-icon">🚀</div>
            <div class="celebration-mult" id="celeb-mult">100.00x</div>
            <div class="celebration-amount" id="celeb-amount">+৳1,000.00</div>
            <div class="celebration-subtitle">WARP SPEED JACKPOT REACHED!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ LIMBO HOW TO PLAY</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🎯 Objective:</strong> Set your target multiplier anywhere between <strong>1.01x and 10,000.00x</strong>.</p>
                <p><strong>⚡ Win Condition:</strong> Hit <strong>LAUNCH BET</strong>. If the rolled multiplier is equal to or greater than your target multiplier, you win your stake multiplied by the target!</p>
                <p><strong>📊 Win Chance:</strong> The lower your target, the higher your chance to win (e.g. 1.50x has a 65.67% win chance, 2.00x has a 49.25% win chance).</p>
                <p><strong>🚀 Provably Fair:</strong> Every single multiplier is generated using cryptographically secure random distribution with 98.5% theoretical RTP.</p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.LB_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="limbo.js?v=<?= time() ?>"></script>
</body>
</html>
