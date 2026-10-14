<?php
// keno/index.php - Instant Keno Vegas Digital Lottery Arcade
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
    <title>Instant Keno - Vegas Digital Lottery</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@600;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="keno.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="keno-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="keno-brand">
                <span class="brand-sub">VEGAS DIGITAL LOTTERY</span>
                <span class="brand-title">INSTANT KENO 🎱</span>
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

    <!-- 20-Ball Drawn Display Shelf -->
    <div class="draw-shelf-container">
        <div class="shelf-header">
            <span class="shelf-lbl">DRAWN BALLS (20)</span>
            <span class="shelf-status" id="shelf-status">SELECT 1 TO 10 NUMBERS</span>
        </div>
        <div class="draw-balls-grid" id="draw-balls-grid">
            <!-- 20 placeholder balls -->
            <?php for ($i = 1; $i <= 20; $i++): ?>
                <div class="drawn-ball empty" id="ball-slot-<?= $i ?>">?</div>
            <?php endfor; ?>
        </div>
    </div>

    <!-- Live Dynamic Paytable Bar -->
    <div class="paytable-bar" id="paytable-bar">
        <div class="paytable-scroll" id="paytable-scroll">
            <!-- Populated dynamically based on pick count -->
        </div>
    </div>

    <!-- Main Container -->
    <main class="keno-main">
        <!-- Quick Pick Toolbar -->
        <div class="picker-toolbar">
            <div class="picks-counter">
                <span class="lbl">SELECTED:</span>
                <span class="val" id="picks-val">0 / 10</span>
            </div>
            <div class="tools-btns">
                <button class="btn-tool" onclick="autoPick(5)">PICK 5</button>
                <button class="btn-tool" onclick="autoPick(10)">PICK 10</button>
                <button class="btn-tool btn-clear" onclick="clearPicks()">CLEAR ✕</button>
            </div>
        </div>

        <!-- 80-Number Keno Grid -->
        <div class="keno-grid" id="keno-grid">
            <?php for ($n = 1; $n <= 80; $n++): ?>
                <button class="keno-tile" data-num="<?= $n ?>" onclick="toggleNumber(<?= $n ?>)">
                    <span class="tile-num"><?= $n ?></span>
                </button>
            <?php endfor; ?>
        </div>

        <!-- Controls Dock -->
        <div class="keno-controls">
            <!-- Bet Input Box -->
            <div class="bet-input-box">
                <div class="input-header">
                    <span class="lbl">STAKE AMOUNT</span>
                    <span class="cur-tag"><?= $currency ?></span>
                </div>
                <div class="input-row">
                    <button class="btn-helper" id="btn-half">½</button>
                    <input type="number" id="stake-input" value="10" min="10" max="50000" step="10">
                    <button class="btn-helper" id="btn-double">2X</button>
                    <button class="btn-helper" id="btn-max">MAX</button>
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

            <!-- Action Buttons Row -->
            <div class="action-row">
                <button class="btn-play" id="btn-play" onclick="playKeno()">
                    <span class="play-ico">🎱</span>
                    <span class="play-txt" id="play-txt">PLAY DRAW</span>
                </button>
                <button class="btn-auto" id="btn-auto" onclick="toggleAutoPlay()">
                    <span class="auto-ico">⚡</span>
                    <span class="auto-txt" id="auto-txt">AUTO</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal (For Wins >= 10x) -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">BIG KENO HIT!</div>
            <div class="celebration-icon">🎱</div>
            <div class="celebration-mult" id="celeb-mult">300.00x</div>
            <div class="celebration-amount" id="celeb-amount">+৳3,000.00</div>
            <div class="celebration-subtitle">LUCKY NUMBERS STRUCK GOLD!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT PRIZE</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ HOW TO PLAY INSTANT KENO</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🎱 Objective:</strong> Select 1 to 10 lucky numbers on the 80-number grid. The game draws 20 winning lottery balls.</p>
                <p><strong>💎 Hits & Payouts:</strong>
                    <br>• The more of your selected numbers match the 20 drawn balls, the higher your payout!
                    <br>• Matching 10 out of 10 numbers wins the <strong>10,000x JACKPOT</strong>!
                </p>
                <p><strong>⚡ Quick Tools:</strong>
                    <br>• <strong>PICK 5 / PICK 10:</strong> Automatically selects random lucky numbers.
                    <br>• <strong>AUTO PLAY:</strong> Continuously plays fast lottery rounds.
                </p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.KENO_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="keno.js?v=<?= time() ?>"></script>
</body>
</html>
