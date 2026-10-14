<?php
// jackpot_fishing/index.php - JILI Jackpot Fishing Master Arcade
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
    <title>Jackpot Fishing - JILI Marine Arcade</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Montserrat:wght@500;700;900&family=Noto+Sans+Bengali:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="jf.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="jf-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="jf-brand">
                <span class="jili-badge">JILI</span>
                <span class="jf-title">JACKPOT FISHING</span>
            </div>
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

    <!-- 3 Live Progressive Jackpot Banners -->
    <div class="jackpot-meters-bar">
        <div class="jp-box grand-jp">
            <div class="jp-title">🌟 GRAND</div>
            <div class="jp-amount"><?= $currency ?> <span id="jp-grand">888,888.00</span></div>
        </div>
        <div class="jp-box major-jp">
            <div class="jp-title">💎 MAJOR</div>
            <div class="jp-amount"><?= $currency ?> <span id="jp-major">88,888.00</span></div>
        </div>
        <div class="jp-box mini-jp">
            <div class="jp-title">🪙 MINI</div>
            <div class="jp-amount"><?= $currency ?> <span id="jp-mini">8,888.00</span></div>
        </div>
    </div>

    <!-- Live Winners Ticker Bar -->
    <div class="ticker-bar">
        <span class="ticker-tag">🔥 JACKPOT CATCHES</span>
        <div class="ticker-track">
            <div class="ticker-marquee" id="ticker-marquee">
                <span class="ticker-item">017***6621 hit Megalodon Dragon <strong class="gold">+৳6,660.00</strong> [GRAND JACKPOT]</span>
                <span class="ticker-item">018***3319 caught Golden Turtle <strong class="gold">+৳2,500.00</strong> [MAJOR]</span>
                <span class="ticker-item">019***8842 opened Treasure Box <strong class="gold">+৳2,400.00</strong> [MINI]</span>
                <span class="ticker-item">016***4471 caught Hammerhead Shark <strong class="gold">+৳1,200.00</strong> (60x)</span>
            </div>
        </div>
    </div>

    <!-- Main Canvas Arena -->
    <main class="jf-main">
        <div class="canvas-wrapper" id="canvas-wrapper">
            <canvas id="game-canvas"></canvas>

            <!-- Frozen Skill Ice Overlay -->
            <div class="ice-freeze-overlay" id="ice-overlay"></div>

            <!-- Boss Alert Header Banner -->
            <div class="boss-alert-banner" id="boss-alert">
                <span class="alert-ico">⚠️</span>
                <span class="alert-txt" id="boss-alert-text">MEGALODON DRAGON KING APPEARED! (666x)</span>
            </div>

            <!-- Target Crosshair -->
            <div class="target-crosshair" id="crosshair"></div>
        </div>

        <!-- Tactical Skills & Bottom Controls -->
        <div class="jf-controls">
            <!-- Row 1: Tactical Skills & Quick Features -->
            <div class="skills-row">
                <button class="skill-btn" id="btn-freeze" onclick="triggerFreezeSkill()">
                    <span class="ico">❄️</span>
                    <span class="name">FREEZE</span>
                </button>
                <button class="skill-btn" id="btn-torpedo" onclick="triggerTorpedoSkill()">
                    <span class="ico">🚀</span>
                    <span class="name">TORPEDO</span>
                </button>
                <button class="skill-btn toggle-btn" id="btn-lock" onclick="toggleLockTarget()">
                    <span class="ico">🎯</span>
                    <span class="name">LOCK BOSS</span>
                </button>
                <button class="skill-btn toggle-btn" id="btn-auto" onclick="toggleAutoFire()">
                    <span class="ico">⚡</span>
                    <span class="name">AUTO FIRE</span>
                </button>
            </div>

            <!-- Row 2: Stake Selection & Stepper -->
            <div class="stake-cluster-row">
                <div class="stepper-box">
                    <span class="lbl">CANNON STAKE:</span>
                    <button class="btn-step" onclick="changeStake(-1)">-</button>
                    <span class="stake-val"><span class="cur"><?= $currency ?></span><span id="display-stake">10</span></span>
                    <button class="btn-step" onclick="changeStake(1)">+</button>
                </div>

                <div class="chips-tray" id="chips-tray">
                    <button class="chip" onclick="setStake(2)">2</button>
                    <button class="chip" onclick="setStake(5)">5</button>
                    <button class="chip active" onclick="setStake(10)">10</button>
                    <button class="chip" onclick="setStake(20)">20</button>
                    <button class="chip" onclick="setStake(50)">50</button>
                    <button class="chip" onclick="setStake(100)">100</button>
                    <button class="chip" onclick="setStake(200)">200</button>
                </div>
            </div>
        </div>
    </main>

    <!-- Celebration Modal -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">GRAND JACKPOT!</div>
            <div class="celebration-icon" id="celeb-icon">🐲</div>
            <div class="celebration-amount" id="celeb-amount">+৳0.00</div>
            <div class="celebration-subtitle" id="celeb-sub">LEGENDARY CATCH!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Script Init -->
    <script>
        window.JF_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="jf.js?v=<?= time() ?>"></script>
</body>
</html>
