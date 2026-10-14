<?php
// coinflip/index.php - Coin Flip Cyber Streak Arcade
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
    <title>Coin Flip - Cyber Streak Arcade</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@600;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="coinflip.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="cf-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="cf-brand">
                <span class="brand-sub">GOLDEN STREAK ARCADE</span>
                <span class="brand-title">COIN FLIP 🪙</span>
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

    <!-- Streak Multipliers Ladder Ribbon -->
    <div class="ladder-ribbon">
        <span class="ladder-lbl">STREAK:</span>
        <div class="ladder-scroll" id="ladder-scroll">
            <div class="ladder-step" data-step="1"><span class="step-num">1</span><span class="step-mult">1.96x</span></div>
            <div class="ladder-step" data-step="2"><span class="step-num">2</span><span class="step-mult">3.84x</span></div>
            <div class="ladder-step" data-step="3"><span class="step-num">3</span><span class="step-mult">7.53x</span></div>
            <div class="ladder-step" data-step="4"><span class="step-num">4</span><span class="step-mult">14.8x</span></div>
            <div class="ladder-step" data-step="5"><span class="step-num">5</span><span class="step-mult">28.9x</span></div>
            <div class="ladder-step" data-step="6"><span class="step-num">6</span><span class="step-mult">56.7x</span></div>
            <div class="ladder-step" data-step="7"><span class="step-num">7</span><span class="step-mult">111x</span></div>
            <div class="ladder-step" data-step="8"><span class="step-num">8</span><span class="step-mult">218x</span></div>
            <div class="ladder-step" data-step="9"><span class="step-num">9</span><span class="step-mult">427x</span></div>
            <div class="ladder-step" data-step="10"><span class="step-num">10</span><span class="step-mult">837x</span></div>
        </div>
    </div>

    <!-- Main Game Arena -->
    <main class="cf-main">
        <!-- 3D Coin Canvas Stage -->
        <div class="coin-stage">
            <canvas id="coin-canvas"></canvas>

            <!-- Holographic Outcome Badge -->
            <div class="outcome-hud" id="outcome-hud">
                <div class="coin-face-name" id="coin-face-name">HEADS 👑</div>
                <div class="streak-status-badge" id="streak-status-badge">CHOOSE A SIDE TO BEGIN</div>
            </div>
        </div>

        <!-- Controls Dock -->
        <div class="cf-controls">
            <!-- Active Cashout Banner (Only shows when in an active winning streak) -->
            <div class="cashout-banner" id="cashout-banner" style="display: none;">
                <div class="cashout-info">
                    <span class="streak-tag" id="active-streak-tag">STREAK: 1 • 1.96x</span>
                    <span class="current-win-val" id="active-payout-val">+৳19.60</span>
                </div>
                <button class="btn-cashout" id="btn-cashout" onclick="cashOut()">
                    <span class="ico">💰</span>
                    <span>CASH OUT</span>
                </button>
            </div>

            <!-- Stake Stepper & Helpers (Disabled during active streak) -->
            <div class="stake-card" id="stake-card">
                <div class="stepper-row">
                    <span class="card-lbl">BET:</span>
                    <button class="btn-step" onclick="changeStake(-10)">-</button>
                    <div class="stake-display">
                        <span class="cur"><?= $currency ?></span>
                        <span id="display-stake">10</span>
                    </div>
                    <button class="btn-step" onclick="changeStake(10)">+</button>
                    <div class="quick-helpers">
                        <button class="btn-help" onclick="adjustStake('half')">1/2</button>
                        <button class="btn-help" onclick="adjustStake('double')">2X</button>
                        <button class="btn-help" onclick="adjustStake('max')">MAX</button>
                    </div>
                </div>

                <!-- Chips Tray -->
                <div class="chips-tray">
                    <button class="chip active" onclick="setStake(10)">10</button>
                    <button class="chip" onclick="setStake(20)">20</button>
                    <button class="chip" onclick="setStake(50)">50</button>
                    <button class="chip" onclick="setStake(100)">100</button>
                    <button class="chip" onclick="setStake(200)">200</button>
                    <button class="chip" onclick="setStake(500)">500</button>
                    <button class="chip" onclick="setStake(1000)">1K</button>
                </div>
            </div>

            <!-- Big Flip Buttons: HEADS vs TAILS -->
            <div class="flip-buttons-row">
                <button class="btn-side btn-heads" id="btn-heads" onclick="flipCoin('heads')">
                    <div class="side-ico">👑</div>
                    <div class="side-title">HEADS</div>
                    <div class="side-mult" id="mult-heads">1.96x</div>
                </button>

                <button class="btn-side btn-tails" id="btn-tails" onclick="flipCoin('tails')">
                    <div class="side-ico">🦅</div>
                    <div class="side-title">TAILS</div>
                    <div class="side-mult" id="mult-tails">1.96x</div>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal (Cashout Win >= 5x) -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">GOLDEN STREAK WIN!</div>
            <div class="celebration-icon">🪙</div>
            <div class="celebration-mult" id="celeb-mult">14.76x</div>
            <div class="celebration-amount" id="celeb-amount">+৳147.60</div>
            <div class="celebration-subtitle">CASHED OUT TO WALLET!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ COIN FLIP HOW TO PLAY</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🎯 Objective:</strong> Guess whether the coin will land on <strong>HEADS 👑</strong> or <strong>TAILS 🦅</strong>.</p>
                <p><strong>🔥 Streak Multipliers:</strong> Each consecutive correct guess doubles your multiplier along the golden streak:
                    <br>• 1 Streak: <strong>1.96x</strong>
                    <br>• 2 Streaks: <strong>3.84x</strong>
                    <br>• 3 Streaks: <strong>7.53x</strong>
                    <br>• 5 Streaks: <strong>28.93x</strong>
                    <br>• 10 Streaks: <strong>836.78x</strong>!
                </p>
                <p><strong>💰 Cash Out Anytime:</strong> After every winning flip, you can tap <strong>CASH OUT</strong> to instantly lock in your winnings, or keep flipping for massive fortunes!</p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.CF_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="coinflip.js?v=<?= time() ?>"></script>
</body>
</html>
