<?php
// chicken/index.php - Chicken Road 1 Interactive Crash / Crossing Game
require_once dirname(__DIR__) . '/api/_bootstrap.php';

$token = (string)($_GET['token'] ?? '');
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

$balance = (float)($user['wallet_balance'] ?? 0);
$currency = '৳';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Chicken Road 1 - Deshclub</title>
    <link rel="stylesheet" href="chicken.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700;800&family=Roboto:wght@500;700;900&display=swap" rel="stylesheet">
</head>
<body>
    <div id="chicken-game-app">
        <!-- Top Navigation Bar -->
        <header class="game-header">
            <div class="header-left">
                <a href="/" class="btn-back" onclick="exitChicken(event)" title="Back to Lobby">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    <span>Lobby</span>
                </a>
                <div class="brand-badge">
                    <span class="chicken-icon">🐔</span>
                    <span class="brand-name">CHICKEN ROAD</span>
                </div>
            </div>

            <div class="header-right">
                <button id="sound-btn" class="icon-toggle-btn" title="Toggle Sound" onclick="toggleSound()">
                    <span id="sound-icon">🔊</span>
                </button>
                <div class="wallet-badge">
                    <span class="curr-sign"><?= $currency ?></span>
                    <span id="wallet-balance-val" class="curr-val"><?= number_format($balance, 2, '.', '') ?></span>
                    <button class="btn-refresh-balance" onclick="refreshWalletBalance()" title="Refresh">
                        <svg viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- Live Cashout History Ticker -->
        <div class="history-bar">
            <div class="history-title">RECENT:</div>
            <div class="history-list" id="history-pills-list">
                <!-- Dynamically loaded -->
            </div>
        </div>

        <!-- Main Road Stage -->
        <main class="road-stage-container" id="road-stage">
            <!-- Road Track with scrolling perspective -->
            <div class="road-track" id="road-track">
                <!-- Finish Line / Golden Egg Safe Haven at Top -->
                <div class="road-lane finish-lane" id="finish-lane">
                    <div class="finish-banner">
                        <span class="finish-star">⭐</span>
                        <span>GOLDEN HEAVEN</span>
                        <span class="finish-star">⭐</span>
                    </div>
                </div>

                <!-- Lanes 20 down to 1 injected dynamically -->
                <div id="lanes-wrapper" class="lanes-wrapper"></div>

                <!-- Start Crosswalk Area -->
                <div class="road-lane start-lane" id="start-lane">
                    <div class="start-crosswalk">
                        <span>START CROSSING</span>
                    </div>
                </div>

                <!-- Chicken Sprite (Absolute position over lanes) -->
                <div class="chicken-character" id="chicken-char">
                    <div class="chicken-body-wrap">
                        <svg class="chicken-svg" viewBox="0 0 100 100">
                            <!-- Chicken Shadow -->
                            <ellipse cx="50" cy="92" rx="30" ry="8" fill="rgba(0,0,0,0.35)"/>
                            <!-- Feet -->
                            <path d="M40 82 L34 94 M40 82 L40 94 M40 82 L46 94" stroke="#ff9800" stroke-width="4" stroke-linecap="round"/>
                            <path d="M60 82 L54 94 M60 82 L60 94 M60 82 L66 94" stroke="#ff9800" stroke-width="4" stroke-linecap="round"/>
                            <!-- Body -->
                            <ellipse cx="50" cy="55" rx="32" ry="28" fill="#ffffff" stroke="#e0e0e0" stroke-width="2"/>
                            <!-- Wing -->
                            <ellipse id="chicken-wing" cx="42" cy="58" rx="14" ry="18" fill="#f5f5f5" stroke="#d5d5d5" stroke-width="2" transform="rotate(-15 42 58)"/>
                            <!-- Tail Feathers -->
                            <path d="M20 50 Q12 40 22 34 Q16 48 26 52 Z" fill="#ff5722"/>
                            <!-- Comb (Crown) -->
                            <path d="M46 22 C42 12 50 10 52 18 C56 8 64 12 62 22 C68 15 72 24 66 26 Z" fill="#e53935"/>
                            <!-- Head -->
                            <circle cx="62" cy="34" r="16" fill="#ffffff" stroke="#e0e0e0" stroke-width="2"/>
                            <!-- Beak -->
                            <polygon points="76,34 90,38 76,44" fill="#ffb300"/>
                            <!-- Wattle -->
                            <ellipse cx="74" cy="46" rx="4" ry="7" fill="#e53935"/>
                            <!-- Eye -->
                            <circle cx="68" cy="30" r="4.5" fill="#212121"/>
                            <circle cx="70" cy="28.5" r="1.5" fill="#ffffff"/>
                        </svg>
                        <div class="feather-burst" id="feather-burst"></div>
                    </div>
                </div>

                <!-- Roasted Overlay Animation -->
                <div class="roasted-overlay" id="roasted-overlay">
                    <div class="roasted-content">
                        <div class="roasted-flames">🔥 🍗 🔥</div>
                        <div class="roasted-text">ROASTED!</div>
                        <div class="roasted-sub">Trapped by fire! Better luck next time!</div>
                    </div>
                </div>

                <!-- Big Win Cashout Overlay -->
                <div class="win-celebration-overlay" id="win-overlay">
                    <div class="win-card">
                        <div class="win-trophy">🏆</div>
                        <div class="win-title">CASHED OUT!</div>
                        <div class="win-mult" id="win-mult-text">2.45x</div>
                        <div class="win-amount" id="win-amount-text">৳ 245.00</div>
                        <button class="btn-win-continue" onclick="dismissWinOverlay()">CONTINUE</button>
                    </div>
                </div>
            </div>

            <!-- Floating Multiplier Progress Float -->
            <div class="live-multiplier-strip" id="live-mult-strip">
                <span class="live-label">CURRENT:</span>
                <span class="live-val" id="live-current-mult">1.00x</span>
                <span class="live-divider">➔</span>
                <span class="live-next-label">NEXT:</span>
                <span class="live-next-val" id="live-next-mult">1.15x</span>
            </div>
        </main>

        <!-- Bottom Controls & Betting Panel -->
        <footer class="game-controls-panel">
            <!-- Difficulty Selector -->
            <div class="difficulty-row">
                <span class="section-label">DIFFICULTY:</span>
                <div class="difficulty-pills" id="difficulty-selector">
                    <button class="diff-btn" data-diff="easy" onclick="setDifficulty('easy')">
                        <span class="diff-name">EASY</span>
                        <span class="diff-tag">30x</span>
                    </button>
                    <button class="diff-btn active" data-diff="medium" onclick="setDifficulty('medium')">
                        <span class="diff-name">MEDIUM</span>
                        <span class="diff-tag">5000x</span>
                    </button>
                    <button class="diff-btn" data-diff="hard" onclick="setDifficulty('hard')">
                        <span class="diff-name">HARD</span>
                        <span class="diff-tag">25000x</span>
                    </button>
                    <button class="diff-btn" data-diff="daredevil" onclick="setDifficulty('daredevil')">
                        <span class="diff-name">DAREDEVIL</span>
                        <span class="diff-tag">20000x</span>
                    </button>
                </div>
            </div>

            <!-- Bet Stepper & Quick Chips -->
            <div class="bet-input-row">
                <div class="stepper-wrap">
                    <button class="btn-step" onclick="adjustStake(-10)">−</button>
                    <div class="input-display">
                        <span class="input-curr"><?= $currency ?></span>
                        <input type="number" id="stake-input" value="100" min="10" step="10" onchange="onStakeInputChange()">
                    </div>
                    <button class="btn-step" onclick="adjustStake(10)">+</button>
                </div>

                <div class="chips-list">
                    <button class="chip-btn" onclick="setStake(20)">20</button>
                    <button class="chip-btn" onclick="setStake(50)">50</button>
                    <button class="chip-btn active" onclick="setStake(100)">100</button>
                    <button class="chip-btn" onclick="setStake(200)">200</button>
                    <button class="chip-btn" onclick="setStake(500)">500</button>
                    <button class="chip-btn" onclick="setStake(1000)">1000</button>
                </div>
            </div>

            <!-- Primary Action Buttons Row -->
            <div class="action-buttons-row">
                <!-- Idle: Start Game Button -->
                <button id="btn-start-game" class="btn-primary-action btn-start" onclick="handleStartGame()">
                    <span class="btn-main-text">START GAME</span>
                    <span class="btn-sub-text" id="btn-start-sub">৳ 100.00</span>
                </button>

                <!-- Playing: Step Forward & Cash Out Buttons -->
                <div id="playing-actions" class="playing-actions-group" style="display: none;">
                    <button id="btn-step-forward" class="btn-action-step" onclick="handleStepForward()">
                        <span class="step-icon">🐾</span>
                        <span class="step-text">STEP (➔)</span>
                        <span class="step-sub" id="btn-step-sub">Next: 1.15x</span>
                    </button>

                    <button id="btn-cashout" class="btn-action-cashout" onclick="handleCashout()" disabled>
                        <span class="cashout-icon">💰</span>
                        <span class="cashout-text">CASH OUT</span>
                        <span class="cashout-sub" id="btn-cashout-sub">৳ 0.00</span>
                    </button>
                </div>
            </div>
        </footer>

        <!-- Toast notification -->
        <div id="game-toast" class="game-toast"></div>
    </div>

    <script>
        window.CHICKEN_TOKEN = "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>";
        window.CURRENCY_SYMBOL = "<?= $currency ?>";
        function exitChicken(e) {
            if (e) e.preventDefault();
            if (window.parent && window.parent !== window) {
                window.parent.postMessage('game', '*');
                try { window.top.location.href = '/'; } catch(err) {}
            } else {
                window.location.href = '/';
            }
        }
    </script>
    <script src="chicken.js"></script>
</body>
</html>
