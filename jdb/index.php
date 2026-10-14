<?php
// jdb/index.php - JDB Gaming Master Suite (Dragon Fishing & Super Niubi Slot)
require_once dirname(__DIR__) . '/api/_bootstrap.php';

$token = trim((string)($_GET['token'] ?? $_GET['Token'] ?? ''));
$gameCode = trim((string)($_GET['game'] ?? $_GET['gameCode'] ?? '7001'));
$initialMode = trim((string)($_GET['mode'] ?? ''));

// If mode not specified, check gameCode: 7001-7006 are fishing, others are slot
if ($initialMode === '') {
    $fishingCodes = ['7001', '7002', '7003', '7004', '7005', '7006'];
    $initialMode = in_array($gameCode, $fishingCodes, true) ? 'fishing' : 'slot';
}

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
    <title>JDB Gaming - Dragon Fishing & Super Niubi</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Montserrat:wght@500;700;900&family=Noto+Sans+Bengali:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="jdb.css?v=<?= time() ?>">
</head>
<body data-mode="<?= htmlspecialchars($initialMode) ?>">
    <!-- Top Global Header -->
    <header class="jdb-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="jdb-brand">
                <span class="jdb-badge">JDB</span>
                <span class="jdb-brand-text">JUST DO BEST</span>
            </div>
        </div>

        <!-- Mode Switcher -->
        <div class="mode-switcher">
            <button class="mode-tab <?= $initialMode === 'fishing' ? 'active' : '' ?>" id="tab-fishing" onclick="switchMode('fishing')">
                <span class="mode-icon">🌊</span>
                <span class="mode-name">Dragon Fishing</span>
            </button>
            <button class="mode-tab <?= $initialMode === 'slot' ? 'active' : '' ?>" id="tab-slot" onclick="switchMode('slot')">
                <span class="mode-icon">🐂</span>
                <span class="mode-name">Super Niubi</span>
            </button>
        </div>

        <div class="header-right">
            <div class="balance-card" id="balance-box" title="Click to refresh">
                <span class="cur-sym"><?= $currency ?></span>
                <span class="cur-val" id="user-balance"><?= number_format($balance, 2, '.', '') ?></span>
                <span class="refresh-icon" id="balance-spinner">↻</span>
            </div>
            <button class="btn-icon" id="btn-sound" title="Toggle Sound">🔊</button>
        </div>
    </header>

    <!-- Live Big Wins Ticker Bar -->
    <div class="ticker-bar">
        <span class="ticker-label">🔥 MEGA WINS</span>
        <div class="ticker-marquee-track">
            <div class="ticker-marquee" id="ticker-marquee">
                <span class="ticker-item">017***4821 caught Golden Dragon <strong>+৳3,000</strong> (150x)</span>
                <span class="ticker-item">018***9923 hit Super Niubi Bull <strong>+৳4,000</strong> (200x)</span>
                <span class="ticker-item">019***1204 caught Cai Shen <strong>+৳7,760</strong> (388x)</span>
                <span class="ticker-item">016***5519 caught Great White Shark <strong>+৳1,000</strong> (50x)</span>
            </div>
        </div>
    </div>

    <!-- MAIN GAME CONTAINERS -->
    <main class="jdb-main">

        <!-- ==================== MODE 1: DRAGON FISHING ==================== -->
        <section class="game-view <?= $initialMode === 'fishing' ? 'active' : '' ?>" id="view-fishing">
            <div class="fishing-stage-wrapper" id="fishing-wrapper">
                <canvas id="fishing-canvas"></canvas>

                <!-- In-Game Fishing HUD -->
                <div class="fishing-hud-top">
                    <div class="boss-banner" id="boss-banner">
                        <span class="boss-tag">BOSS ALERT</span>
                        <span class="boss-desc" id="boss-banner-text">🐲 Golden Dragon King Approaches! (150x)</span>
                    </div>
                </div>

                <!-- Fishing Floating Target Marker -->
                <div class="crosshair" id="crosshair"></div>

                <!-- Laser Meter Indicator -->
                <div class="laser-meter-container" id="laser-meter-box">
                    <div class="laser-label">LASER CANNON</div>
                    <div class="laser-bar-bg">
                        <div class="laser-bar-fill" id="laser-fill" style="width: 35%;"></div>
                    </div>
                    <button class="btn-laser-trigger" id="btn-laser" disabled>FIRE</button>
                </div>
            </div>

            <!-- Fishing Bottom Controls Panel -->
            <div class="fishing-controls">
                <div class="ctrl-subrow">
                    <!-- Quick Bet / Stake -->
                    <div class="stake-cluster">
                        <span class="ctrl-title">CANNON STAKE</span>
                        <div class="stake-stepper">
                            <button class="btn-step" onclick="fishingChangeStake(-1)">-</button>
                            <span class="stake-display"><span class="cur"><?= $currency ?></span><span id="fish-stake-val">10</span></span>
                            <button class="btn-step" onclick="fishingChangeStake(1)">+</button>
                        </div>
                    </div>

                    <div class="quick-chips" id="fish-chips">
                        <button class="chip" onclick="setFishingStake(2)">2</button>
                        <button class="chip" onclick="setFishingStake(5)">5</button>
                        <button class="chip active" onclick="setFishingStake(10)">10</button>
                        <button class="chip" onclick="setFishingStake(20)">20</button>
                        <button class="chip" onclick="setFishingStake(50)">50</button>
                        <button class="chip" onclick="setFishingStake(100)">100</button>
                        <button class="chip" onclick="setFishingStake(200)">200</button>
                    </div>

                    <!-- Auto & Lock Toggles -->
                    <div class="tactical-cluster">
                        <button class="btn-toggle" id="btn-autofire" onclick="toggleAutoFire()">
                            <span class="btn-icon">⚡</span>
                            <span>AUTO FIRE</span>
                        </button>
                        <button class="btn-toggle" id="btn-lockboss" onclick="toggleLockBoss()">
                            <span class="btn-icon">🎯</span>
                            <span>LOCK BOSS</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== MODE 2: SUPER NIUBI SLOT ==================== -->
        <section class="game-view <?= $initialMode === 'slot' ? 'active' : '' ?>" id="view-slot">
            <div class="slot-stage-wrapper">
                <!-- Temple Jackpot Header -->
                <div class="slot-jackpot-header">
                    <div class="jackpot-glow-ring"></div>
                    <div class="jackpot-caption">SUPER NIUBI GRAND JACKPOT</div>
                    <div class="jackpot-number"><?= $currency ?> <span id="jackpot-counter">888,888.00</span></div>
                </div>

                <!-- 3x3 Temple Frame -->
                <div class="slot-frame">
                    <div class="temple-dragon left-dragon"></div>
                    <div class="temple-dragon right-dragon"></div>

                    <!-- SVG Paylines Overlay -->
                    <svg class="payline-svg" id="payline-svg" viewBox="0 0 360 270">
                        <line id="line-0" x1="10" y1="135" x2="350" y2="135" stroke="#FFD700" stroke-width="4" stroke-dasharray="6,4" class="line-hide" />
                        <line id="line-1" x1="10" y1="45" x2="350" y2="45" stroke="#00FFCC" stroke-width="4" stroke-dasharray="6,4" class="line-hide" />
                        <line id="line-2" x1="10" y1="225" x2="350" y2="225" stroke="#FF0055" stroke-width="4" stroke-dasharray="6,4" class="line-hide" />
                        <line id="line-3" x1="10" y1="45" x2="350" y2="225" stroke="#FFAA00" stroke-width="4" stroke-dasharray="6,4" class="line-hide" />
                        <line id="line-4" x1="10" y1="225" x2="350" y2="45" stroke="#AA00FF" stroke-width="4" stroke-dasharray="6,4" class="line-hide" />
                    </svg>

                    <div class="reels-grid">
                        <div class="reel-column" id="slot-col-0">
                            <div class="reel-ribbon" id="ribbon-0"></div>
                        </div>
                        <div class="reel-column" id="slot-col-1">
                            <div class="reel-ribbon" id="ribbon-1"></div>
                        </div>
                        <div class="reel-column" id="slot-col-2">
                            <div class="reel-ribbon" id="ribbon-2"></div>
                        </div>
                    </div>

                    <!-- Win Notification Strip -->
                    <div class="slot-win-strip" id="slot-win-strip">
                        SPIN TO UNLEASH THE GOLDEN BULL
                    </div>
                </div>

                <!-- Slot Controls -->
                <div class="slot-controls">
                    <div class="bet-selector-row">
                        <span class="ctrl-title">BET PER SPIN</span>
                        <div class="stake-stepper">
                            <button class="btn-step" onclick="slotChangeBet(-10)">-</button>
                            <span class="stake-display"><span class="cur"><?= $currency ?></span><span id="slot-bet-val">50</span></span>
                            <button class="btn-step" onclick="slotChangeBet(10)">+</button>
                        </div>
                        <div class="quick-chips">
                            <button class="chip" onclick="setSlotBet(10)">10</button>
                            <button class="chip" onclick="setSlotBet(20)">20</button>
                            <button class="chip active" onclick="setSlotBet(50)">50</button>
                            <button class="chip" onclick="setSlotBet(100)">100</button>
                            <button class="chip" onclick="setSlotBet(200)">200</button>
                            <button class="chip" onclick="setSlotBet(500)">500</button>
                        </div>
                    </div>

                    <div class="spin-action-row">
                        <button class="btn-turbo" id="btn-turbo" onclick="toggleTurbo()">
                            <span class="ico">⚡</span>
                            <span>TURBO</span>
                        </button>
                        <button class="btn-autospin" id="btn-autospin" onclick="toggleSlotAuto()">
                            <span class="ico">🔄</span>
                            <span id="autospin-label">AUTO</span>
                        </button>
                        <button class="btn-spin-main" id="btn-spin-main" onclick="handleSlotSpin()">
                            <span>SPIN</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Big Win Celebration Modal -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-sparkles"></div>
            <div class="celebration-badge" id="celeb-badge">MEGA WIN</div>
            <div class="celebration-icon" id="celeb-icon">🐂</div>
            <div class="celebration-amount" id="celeb-amount">+৳0.00</div>
            <div class="celebration-subtitle" id="celeb-sub">SUPER NIUBI BLESSING!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Scripts -->
    <script>
        window.JDB_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>,
            initialMode: "<?= htmlspecialchars($initialMode, ENT_QUOTES, 'UTF-8') ?>"
        };
    </script>
    <script src="jdb.js?v=<?= time() ?>"></script>
</body>
</html>
