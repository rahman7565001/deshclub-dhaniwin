<?php
// space_dice/index.php - Space Dice Cyber Cosmic Casino Arcade
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
    <title>Space Dice - Cosmic Cyber Arcade</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Montserrat:wght@500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="sd.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="sd-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="sd-brand">
                <span class="cosmic-badge">COSMIC</span>
                <span class="sd-title">SPACE DICE</span>
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

    <!-- Supernova Jackpot Pool Ribbon -->
    <div class="jackpot-ribbon">
        <span class="jp-tag">🌌 SUPERNOVA JACKPOT</span>
        <span class="jp-amount"><?= $currency ?> <strong id="jp-val">555,842.00</strong></span>
    </div>

    <!-- Mode Selector Tabs -->
    <div class="mode-tabs-bar">
        <button class="mode-tab active" id="tab-slider" onclick="switchGameMode('slider')">
            <span class="tab-ico">🪐</span>
            <span>COSMIC SLIDER</span>
        </button>
        <button class="mode-tab" id="tab-twindice" onclick="switchGameMode('twindice')">
            <span class="tab-ico">🎲</span>
            <span>TWIN PULSAR DICE</span>
        </button>
    </div>

    <!-- Main Game Container -->
    <main class="sd-main">
        <!-- Cosmic Canvas Stage -->
        <div class="cosmic-stage">
            <canvas id="space-canvas"></canvas>

            <!-- Holographic Roll Result Readout -->
            <div class="roll-result-hud">
                <div class="roll-label" id="roll-label">LAST ROLL</div>
                <div class="roll-number" id="roll-number">50.00</div>
                <div class="payout-badge" id="payout-badge">--</div>
            </div>

            <!-- Supernova Alert Flash -->
            <div class="supernova-banner" id="supernova-banner">
                <span class="nova-ico">💥</span>
                <span class="nova-txt">GALACTIC SUPERNOVA 2X SURGE!</span>
            </div>
        </div>

        <!-- Mode A: Cosmic Slider Controls -->
        <div class="mode-section" id="section-slider">
            <!-- Win Probability & Multiplier Meter Cards -->
            <div class="meters-cluster">
                <div class="meter-card">
                    <span class="m-lbl">WIN CHANCE</span>
                    <span class="m-val cyan" id="slider-chance">50.00%</span>
                </div>
                <div class="meter-card">
                    <span class="m-lbl">MULTIPLIER</span>
                    <span class="m-val gold" id="slider-mult">1.97x</span>
                </div>
                <div class="meter-card">
                    <span class="m-lbl">EST. WIN</span>
                    <span class="m-val green" id="slider-est-win"><?= $currency ?> 19.70</span>
                </div>
            </div>

            <!-- Interactive Slider Bar -->
            <div class="slider-wrapper">
                <div class="slider-track" id="slider-track">
                    <div class="slider-fill" id="slider-fill" style="width: 50%;"></div>
                    <div class="slider-thumb" id="slider-thumb" style="left: 50%;">
                        <span class="thumb-tip" id="thumb-tip">50</span>
                    </div>
                </div>
                <div class="slider-scale">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                </div>
            </div>

            <!-- Condition Toggle (Roll Under / Roll Over) -->
            <div class="condition-toggle-box">
                <button class="btn-cond active" id="btn-under" onclick="setCondition('under')">
                    <span>ROLL UNDER</span>
                    <strong id="cond-under-val">&lt; 50.00</strong>
                </button>
                <button class="btn-cond" id="btn-over" onclick="setCondition('over')">
                    <span>ROLL OVER</span>
                    <strong id="cond-over-val">&gt; 50.00</strong>
                </button>
            </div>
        </div>

        <!-- Mode B: Twin Pulsar Dice Controls -->
        <div class="mode-section" id="section-twindice" style="display: none;">
            <!-- Twin Dice Bet Targets Grid -->
            <div class="dice-bet-grid">
                <button class="btn-dice-bet active" data-bet="seven" onclick="setTwinBet('seven')">
                    <span class="d-title">LUCKY 7</span>
                    <span class="d-mult">5.80x</span>
                </button>
                <button class="btn-dice-bet" data-bet="low" onclick="setTwinBet('low')">
                    <span class="d-title">LOW (2-6)</span>
                    <span class="d-mult">2.30x</span>
                </button>
                <button class="btn-dice-bet" data-bet="high" onclick="setTwinBet('high')">
                    <span class="d-title">HIGH (8-12)</span>
                    <span class="d-mult">2.30x</span>
                </button>
                <button class="btn-dice-bet" data-bet="even" onclick="setTwinBet('even')">
                    <span class="d-title">EVEN</span>
                    <span class="d-mult">1.96x</span>
                </button>
                <button class="btn-dice-bet" data-bet="odd" onclick="setTwinBet('odd')">
                    <span class="d-title">ODD</span>
                    <span class="d-mult">1.96x</span>
                </button>
                <button class="btn-dice-bet" data-bet="pair" onclick="setTwinBet('pair')">
                    <span class="d-title">TWIN PAIR</span>
                    <span class="d-mult">5.80x</span>
                </button>
            </div>

            <!-- Exact Sum Grid (2 to 12) -->
            <div class="exact-sums-title">EXACT SUM SPECIALS:</div>
            <div class="exact-sums-tray">
                <button class="chip-sum" data-sum="2" onclick="setExactSum(2)"><span>2</span><small>30x</small></button>
                <button class="chip-sum" data-sum="3" onclick="setExactSum(3)"><span>3</span><small>16x</small></button>
                <button class="chip-sum" data-sum="4" onclick="setExactSum(4)"><span>4</span><small>11x</small></button>
                <button class="chip-sum" data-sum="5" onclick="setExactSum(5)"><span>5</span><small>8.5x</small></button>
                <button class="chip-sum" data-sum="6" onclick="setExactSum(6)"><span>6</span><small>6.8x</small></button>
                <button class="chip-sum" data-sum="8" onclick="setExactSum(8)"><span>8</span><small>6.8x</small></button>
                <button class="chip-sum" data-sum="9" onclick="setExactSum(9)"><span>9</span><small>8.5x</small></button>
                <button class="chip-sum" data-sum="10" onclick="setExactSum(10)"><span>10</span><small>11x</small></button>
                <button class="chip-sum" data-sum="11" onclick="setExactSum(11)"><span>11</span><small>16x</small></button>
                <button class="chip-sum" data-sum="12" onclick="setExactSum(12)"><span>12</span><small>30x</small></button>
            </div>
        </div>

        <!-- Bottom Controls & Action Bar -->
        <div class="sd-controls">
            <!-- Stake Row -->
            <div class="stake-row">
                <div class="stepper-box">
                    <span class="lbl">STAKE:</span>
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

            <!-- Chips Selector -->
            <div class="chips-tray">
                <button class="chip active" onclick="setStake(10)">10</button>
                <button class="chip" onclick="setStake(20)">20</button>
                <button class="chip" onclick="setStake(50)">50</button>
                <button class="chip" onclick="setStake(100)">100</button>
                <button class="chip" onclick="setStake(200)">200</button>
                <button class="chip" onclick="setStake(500)">500</button>
                <button class="chip" onclick="setStake(1000)">1K</button>
            </div>

            <!-- Big Launch Button -->
            <div class="launch-row">
                <button class="btn-launch" id="btn-launch" onclick="launchRoll()">
                    <span class="ico">🚀</span>
                    <span class="txt">LAUNCH ROLL</span>
                </button>
                <button class="btn-auto" id="btn-auto" onclick="toggleAutoRoll()">
                    <span class="ico">⚡</span>
                    <span id="auto-txt">AUTO</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">SUPERNOVA WIN!</div>
            <div class="celebration-icon" id="celeb-icon">🪐</div>
            <div class="celebration-amount" id="celeb-amount">+৳0.00</div>
            <div class="celebration-subtitle" id="celeb-sub">INTERSTELLAR JACKPOT!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ SPACE DICE RULES</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🪐 Cosmic Slider Mode:</strong> Choose Roll Under or Roll Over and adjust the target slider. Lower win chances pay massive interstellar multipliers up to 98.50x!</p>
                <p><strong>🎲 Twin Pulsar Dice Mode:</strong> Predict the sum of two cybernetic 6-sided dice. Low (2-6), Lucky 7 (5.8x), High (8-12), Even/Odd, Twin Pairs, or Exact Sums up to 30x!</p>
                <p><strong>💥 Galactic Supernova:</strong> Every winning roll has a chance to trigger a 2x bonus supernova payout surge!</p>
            </div>
        </div>
    </div>

    <!-- Init Config & Client JS -->
    <script>
        window.SD_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="sd.js?v=<?= time() ?>"></script>
</body>
</html>
