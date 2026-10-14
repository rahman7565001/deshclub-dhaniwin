<?php
// tower/index.php - Tower Legend Casino Climb Arcade
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
    <title>Tower Legend - Castle Climb Casino</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@600;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="tower.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Bar -->
    <header class="tl-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="tl-brand">
                <span class="brand-sub">MYTHIC CASTLE CLIMB</span>
                <span class="brand-title">TOWER LEGEND 🏰</span>
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

    <!-- Difficulty Ribbon Selector -->
    <div class="diff-ribbon" id="diff-ribbon">
        <button class="btn-diff" data-diff="easy">
            <span class="diff-name">EASY</span>
            <span class="diff-meta">4/5 Gems</span>
        </button>
        <button class="btn-diff active" data-diff="medium">
            <span class="diff-name">MEDIUM</span>
            <span class="diff-meta">3/4 Gems</span>
        </button>
        <button class="btn-diff" data-diff="hard">
            <span class="diff-name">HARD</span>
            <span class="diff-meta">2/3 Gems</span>
        </button>
        <button class="btn-diff" data-diff="expert">
            <span class="diff-name">EXPERT</span>
            <span class="diff-meta">1/2 Gems</span>
        </button>
        <button class="btn-diff" data-diff="master">
            <span class="diff-name">MASTER</span>
            <span class="diff-meta">1/3 Gems</span>
        </button>
    </div>

    <!-- Main Game Container -->
    <main class="tl-main">
        <!-- Live Status Bar -->
        <div class="status-bar" id="status-bar">
            <div class="status-col">
                <span class="status-lbl">CURRENT MULTIPLIER</span>
                <span class="status-val highlight" id="hud-mult">1.00x</span>
            </div>
            <div class="status-col text-right">
                <span class="status-lbl">WIN AMOUNT</span>
                <span class="status-val win" id="hud-win"><?= $currency ?>0.00</span>
            </div>
        </div>

        <!-- The Tower Castle Stage -->
        <div class="tower-stage" id="tower-stage">
            <div class="castle-decor castle-roof">
                <span class="torch left">🔥</span>
                <div class="apex-crown">👑 APEX TREASURE</div>
                <span class="torch right">🔥</span>
            </div>

            <!-- Floors Grid (Rendered via JS, Floor 9 at top to Floor 1 at bottom) -->
            <div class="floors-container" id="floors-container">
                <!-- Injected dynamically -->
            </div>

            <div class="castle-decor castle-base">
                <span>🏰 DUNGEON ENTRANCE 🏰</span>
            </div>
        </div>

        <!-- Controls Dock -->
        <div class="tl-controls">
            <!-- Bet Input & Multipliers Helper -->
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

            <!-- Quick Chips Tray -->
            <div class="chips-tray">
                <button class="chip active" onclick="setStake(10)">10</button>
                <button class="chip" onclick="setStake(20)">20</button>
                <button class="chip" onclick="setStake(50)">50</button>
                <button class="chip" onclick="setStake(100)">100</button>
                <button class="chip" onclick="setStake(200)">200</button>
                <button class="chip" onclick="setStake(500)">500</button>
                <button class="chip" onclick="setStake(1000)">1K</button>
            </div>

            <!-- Big Action Button (Climb / Cash Out) -->
            <button class="btn-action btn-climb" id="btn-action" onclick="handleActionButton()">
                <span class="action-icon" id="action-ico">🏰</span>
                <span class="action-text" id="action-txt">START CLIMB</span>
                <span class="action-sub" id="action-sub">Min Bet ৳10</span>
            </button>
        </div>
    </main>

    <!-- Celebration Modal -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">TOWER CONQUERED!</div>
            <div class="celebration-icon">🏆</div>
            <div class="celebration-mult" id="celeb-mult">12.92x</div>
            <div class="celebration-amount" id="celeb-amount">+৳129.20</div>
            <div class="celebration-subtitle">TREASURE SUCCESSFULLY SECURED!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT REWARD</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ HOW TO PLAY TOWER LEGEND</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🏰 Objective:</strong> Climb the 9-floor mythical castle by choosing safe stone tiles and collecting gems.</p>
                <p><strong>💎 Gems & Skulls:</strong>
                    <br>• <strong>Gem 💎:</strong> Reveals emerald crystal, multiplies your payout, and unlocks the next floor!
                    <br>• <strong>Skull 💀:</strong> Triggers dungeon trap and ends the game.
                </p>
                <p><strong>💰 Cash Out Anytime:</strong> At each cleared floor, you can either take your accumulated winnings by clicking <strong>CASHOUT</strong> or risk it on the next floor for even bigger multipliers!</p>
                <p><strong>⚡ Difficulties:</strong>
                    <br>• <strong>Easy:</strong> 4 Gems / 1 Skull (Up to 7.20x)
                    <br>• <strong>Medium:</strong> 3 Gems / 1 Skull (Up to 12.92x)
                    <br>• <strong>Hard:</strong> 2 Gems / 1 Skull (Up to 37.20x)
                    <br>• <strong>Expert:</strong> 1 Gem / 1 Skull (Up to 494.08x)
                    <br>• <strong>Master:</strong> 1 Gem / 2 Skulls (Up to 18,997x!)
                </p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.TL_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="tower.js?v=<?= time() ?>"></script>
</body>
</html>
