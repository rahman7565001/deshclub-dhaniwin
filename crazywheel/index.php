<?php
// crazywheel/index.php - Crazy Wheel Casino Money Wheel Arcade
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
    <title>Crazy Wheel - Vegas Money Wheel Casino</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@600;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="crazywheel.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="cw-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="cw-brand">
                <span class="brand-sub">VEGAS LIVE ARCADE</span>
                <span class="brand-title">CRAZY WHEEL 🎡</span>
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

    <!-- Crazy Boost Multiplier Ribbon -->
    <div class="boost-ribbon" id="boost-ribbon">
        <span class="boost-ico">💥</span>
        <span class="boost-txt" id="boost-txt">CRAZY MULTIPLIERS READY • UP TO 50X BOOST!</span>
    </div>

    <!-- Main Game Arena -->
    <main class="cw-main">
        <!-- 60FPS Money Wheel Stage -->
        <div class="wheel-stage">
            <canvas id="wheel-canvas"></canvas>

            <!-- Top Flapper Pointer -->
            <div class="wheel-pointer" id="wheel-pointer">▼</div>

            <!-- Result Readout HUD -->
            <div class="result-hud" id="result-hud">
                <div class="winning-seg-badge" id="winning-seg-badge">SPIN TO WIN</div>
                <div class="win-payout-badge" id="win-payout-badge" style="display: none;">+৳0.00</div>
            </div>
        </div>

        <!-- Betting Table Grid -->
        <div class="bet-table">
            <div class="table-lbl">PLACE YOUR BETS:</div>
            <div class="grid-numbers">
                <!-- 1 -->
                <div class="bet-spot spot-1" data-spot="1" onclick="placeChip('1')">
                    <div class="spot-num">1</div>
                    <div class="spot-mult">2x</div>
                    <div class="chip-stack" id="chip-1"></div>
                </div>

                <!-- 2 -->
                <div class="bet-spot spot-2" data-spot="2" onclick="placeChip('2')">
                    <div class="spot-num">2</div>
                    <div class="spot-mult">3x</div>
                    <div class="chip-stack" id="chip-2"></div>
                </div>

                <!-- 5 -->
                <div class="bet-spot spot-5" data-spot="5" onclick="placeChip('5')">
                    <div class="spot-num">5</div>
                    <div class="spot-mult">6x</div>
                    <div class="chip-stack" id="chip-5"></div>
                </div>

                <!-- 10 -->
                <div class="bet-spot spot-10" data-spot="10" onclick="placeChip('10')">
                    <div class="spot-num">10</div>
                    <div class="spot-mult">11x</div>
                    <div class="chip-stack" id="chip-10"></div>
                </div>

                <!-- 20 -->
                <div class="bet-spot spot-20" data-spot="20" onclick="placeChip('20')">
                    <div class="spot-num">20</div>
                    <div class="spot-mult">21x</div>
                    <div class="chip-stack" id="chip-20"></div>
                </div>

                <!-- 40 -->
                <div class="bet-spot spot-40" data-spot="40" onclick="placeChip('40')">
                    <div class="spot-num">40</div>
                    <div class="spot-mult">41x</div>
                    <div class="chip-stack" id="chip-40"></div>
                </div>

                <!-- CHANCE (Bonus) -->
                <div class="bet-spot spot-chance" data-spot="CHANCE" onclick="placeChip('CHANCE')">
                    <div class="spot-num">🎁 CHANCE</div>
                    <div class="spot-mult">25x</div>
                    <div class="chip-stack" id="chip-CHANCE"></div>
                </div>
            </div>
        </div>

        <!-- Controls Dock -->
        <div class="cw-controls">
            <!-- Chips Tray -->
            <div class="chips-tray">
                <button class="chip active" onclick="selectChip(10)">10</button>
                <button class="chip" onclick="selectChip(20)">20</button>
                <button class="chip" onclick="selectChip(50)">50</button>
                <button class="chip" onclick="selectChip(100)">100</button>
                <button class="chip" onclick="selectChip(200)">200</button>
                <button class="chip" onclick="selectChip(500)">500</button>
                <button class="chip" onclick="selectChip(1000)">1K</button>
            </div>

            <!-- Bet Summary Bar -->
            <div class="bet-summary-bar">
                <div class="total-bet-box">
                    <span class="lbl">TOTAL BET:</span>
                    <span class="val"><span class="cur"><?= $currency ?></span><span id="total-bet-val">0</span></span>
                </div>
                <div class="quick-helpers">
                    <button class="btn-tool" onclick="clearBets()">CLEAR</button>
                    <button class="btn-tool" onclick="doubleBets()">2X</button>
                    <button class="btn-tool" onclick="rebet()">REBET</button>
                </div>
            </div>

            <!-- Big Action Row -->
            <div class="action-row">
                <button class="btn-spin" id="btn-spin" onclick="spinWheel()">
                    <span class="ico">🎡</span>
                    <span class="txt">SPIN WHEEL</span>
                </button>
                <button class="btn-auto" id="btn-auto" onclick="toggleAutoSpin()">
                    <span class="ico">⚡</span>
                    <span id="auto-txt">AUTO</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal (Wins >= 5x) -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">CRAZY WHEEL WIN!</div>
            <div class="celebration-icon">🎡</div>
            <div class="celebration-mult" id="celeb-mult">41.00x</div>
            <div class="celebration-amount" id="celeb-amount">+৳410.00</div>
            <div class="celebration-subtitle">MASSIVE FORTUNE UNLOCKED!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ CRAZY WHEEL HOW TO PLAY</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🎯 Objective:</strong> Predict which number or segment the giant 54-segment Money Wheel will stop on.</p>
                <p><strong>🔢 Wheel Segments:</strong>
                    <br>• <strong>1:</strong> 2x Payout (Most frequent)
                    <br>• <strong>2:</strong> 3x Payout
                    <br>• <strong>5:</strong> 6x Payout
                    <br>• <strong>10:</strong> 11x Payout
                    <br>• <strong>20:</strong> 21x Payout
                    <br>• <strong>40:</strong> 41x Payout (Jackpot segment)
                    <br>• <strong>CHANCE:</strong> 25x Bonus Payout
                </p>
                <p><strong>💥 Crazy Multipliers:</strong> Random spins trigger a 2x to 10x Crazy Boost, supercharging winning payouts up to <strong>410x</strong>!</p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.CW_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="crazywheel.js?v=<?= time() ?>"></script>
</body>
</html>
