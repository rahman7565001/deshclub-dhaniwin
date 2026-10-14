<?php
// mines/index.php - Mines (Diamond Mines Crash Game)
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
    <title>Mines - Diamond Hunt</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Montserrat:wght@500;700;900&family=Noto+Sans+Bengali:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="mines.css?v=<?= time() ?>">
</head>
<body>
    <!-- Header -->
    <header class="mines-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="brand-badge">
                <span class="gem-ico">💎</span>
                <span class="brand-name">MINES</span>
            </div>
        </div>

        <div class="header-center">
            <div class="provably-fair" title="100% Provably Fair">
                <span class="shield-ico">🛡️</span>
                <span>FAIR</span>
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

    <!-- Live Ticker Ribbon -->
    <div class="ticker-bar">
        <span class="ticker-tag">🔥 BIG CASHOUTS</span>
        <div class="ticker-marquee-track">
            <div class="ticker-marquee" id="ticker-marquee">
                <span class="ticker-item">017***9912 cashed out <strong>+৳650.00</strong> (3.25x)</span>
                <span class="ticker-item">018***4321 cashed out <strong>+৳1,160.00</strong> (5.80x)</span>
                <span class="ticker-item">019***7789 hit 10 Mines <strong>+৳890.00</strong> (8.90x)</span>
                <span class="ticker-item">016***1124 found 12 gems <strong>+৳2,240.00</strong> (11.20x)</span>
            </div>
        </div>
    </div>

    <!-- Main Game Stage -->
    <main class="mines-main">
        <!-- Live Round HUD Status -->
        <div class="round-status-bar">
            <div class="status-pill mines-stat">
                <span class="ico">💣</span>
                <span class="lbl">MINES:</span>
                <span class="val" id="hud-mines-count">3</span>
            </div>
            <div class="status-pill gems-stat">
                <span class="ico">💎</span>
                <span class="lbl">GEMS:</span>
                <span class="val" id="hud-gems-count">0/22</span>
            </div>
            <div class="status-pill mult-stat">
                <span class="lbl">NEXT:</span>
                <span class="val highlight" id="hud-next-mult">1.10x</span>
            </div>
        </div>

        <!-- 5x5 Minefield Grid -->
        <div class="minefield-wrapper">
            <div class="minefield-grid" id="minefield-grid">
                <?php for ($i = 0; $i < 25; $i++): ?>
                    <button class="mine-tile" data-index="<?= $i ?>" onclick="onTileClick(<?= $i ?>)">
                        <div class="tile-inner">
                            <div class="tile-front">
                                <span class="hex-dot"></span>
                            </div>
                            <div class="tile-back" id="tile-back-<?= $i ?>">
                                <!-- Revealed Gem or Bomb inserted by JS -->
                            </div>
                        </div>
                    </button>
                <?php endfor; ?>
            </div>
        </div>

        <!-- Controls & Betting Panel -->
        <div class="mines-controls">
            <!-- Row 1: Mines Count Selection -->
            <div class="control-row">
                <div class="row-label">
                    <span>NUMBER OF MINES</span>
                    <span class="badge-hint" id="mines-hint">22 GEMS HIDDEN</span>
                </div>
                <div class="mines-selector" id="mines-pills">
                    <button class="pill" data-mines="1" onclick="selectMines(1)">1</button>
                    <button class="pill active" data-mines="3" onclick="selectMines(3)">3</button>
                    <button class="pill" data-mines="5" onclick="selectMines(5)">5</button>
                    <button class="pill" data-mines="10" onclick="selectMines(10)">10</button>
                    <button class="pill" data-mines="15" onclick="selectMines(15)">15</button>
                    <button class="pill" data-mines="20" onclick="selectMines(20)">20</button>
                </div>
            </div>

            <!-- Row 2: Stake Selection -->
            <div class="control-row">
                <div class="stake-adjuster">
                    <span class="ctrl-label">BET AMOUNT</span>
                    <div class="stepper-box">
                        <button class="btn-step" onclick="changeStake(-10)">-</button>
                        <div class="stake-input-wrap">
                            <span class="cur"><?= $currency ?></span>
                            <input type="number" id="stake-input" value="50" min="1" step="10">
                        </div>
                        <button class="btn-step" onclick="changeStake(10)">+</button>
                    </div>
                </div>

                <div class="quick-chips">
                    <button class="chip" onclick="setStake(10)">10</button>
                    <button class="chip" onclick="setStake(20)">20</button>
                    <button class="chip active" onclick="setStake(50)">50</button>
                    <button class="chip" onclick="setStake(100)">100</button>
                    <button class="chip" onclick="setStake(500)">500</button>
                    <button class="chip half" onclick="multiplyStake(0.5)">½</button>
                    <button class="chip double" onclick="multiplyStake(2)">2X</button>
                </div>
            </div>

            <!-- Row 3: Action Buttons -->
            <div class="action-buttons-row">
                <button class="btn-random" id="btn-random" onclick="pickRandomTile()" disabled>
                    <span class="ico">🎲</span>
                    <span>RANDOM</span>
                </button>
                <button class="btn-main-action btn-start" id="btn-main-action" onclick="handleMainAction()">
                    <span class="btn-action-text" id="action-text">BET ৳50.00</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">MEGA CASHOUT</div>
            <div class="celebration-icon" id="celeb-icon">💎</div>
            <div class="celebration-amount" id="celeb-amount">+৳0.00</div>
            <div class="celebration-subtitle" id="celeb-sub">DIAMOND MASTER!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Pass configuration to JS -->
    <script>
        window.MINES_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="mines.js?v=<?= time() ?>"></script>
</body>
</html>
