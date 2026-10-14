<?php
// sicbo/index.php - Super Sic Bo 3-Dice Casino Arcade
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
    <title>Super Sic Bo - Royal 3-Dice Casino</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@600;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="sicbo.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="sb-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="sb-brand">
                <span class="brand-sub">ROYAL MACAU CASINO</span>
                <span class="brand-title">SUPER SIC BO</span>
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

    <!-- Lightning Multipliers Live Ribbon -->
    <div class="lightning-ribbon" id="lightning-ribbon">
        <span class="bolt-ico">⚡</span>
        <span class="lt-title">LIGHTNING MULTIPLIERS:</span>
        <div class="lt-chips" id="lt-chips">
            <span class="lt-chip">ANY TRIPLE <strong>88x</strong></span>
            <span class="lt-chip">SUM 4 <strong>200x</strong></span>
            <span class="lt-chip">TRIPLE 6 <strong>500x</strong></span>
        </div>
    </div>

    <!-- Main Game Container -->
    <main class="sb-main">
        <!-- 3D Electric Dice Shaker Arena -->
        <div class="shaker-arena">
            <canvas id="shaker-canvas"></canvas>

            <!-- Holographic Roll Result Readout -->
            <div class="result-hud" id="result-hud">
                <div class="dice-icons" id="dice-icons">
                    <span class="die-badge" id="die-1">4</span>
                    <span class="die-badge" id="die-2">5</span>
                    <span class="die-badge" id="die-3">6</span>
                </div>
                <div class="sum-badge" id="sum-badge">SUM 15 • BIG</div>
                <div class="win-payout-badge" id="win-payout-badge" style="display: none;">+৳0.00</div>
            </div>
        </div>

        <!-- Sic Bo Betting Table -->
        <div class="bet-table">
            <!-- Tier 1: BIG / ANY TRIPLE / SMALL -->
            <div class="row-major">
                <div class="bet-spot spot-big" data-spot="small" onclick="placeChip('small')">
                    <div class="spot-title">SMALL</div>
                    <div class="spot-sub">4 - 10</div>
                    <div class="spot-mult">1:1</div>
                    <div class="chip-stack" id="chip-small"></div>
                </div>

                <div class="bet-spot spot-triple" data-spot="any_triple" onclick="placeChip('any_triple')">
                    <div class="spot-title">ANY TRIPLE</div>
                    <div class="spot-sub">111 - 666</div>
                    <div class="spot-mult gold" id="mult-any_triple">31x</div>
                    <div class="chip-stack" id="chip-any_triple"></div>
                </div>

                <div class="bet-spot spot-big" data-spot="big" onclick="placeChip('big')">
                    <div class="spot-title">BIG</div>
                    <div class="spot-sub">11 - 17</div>
                    <div class="spot-mult">1:1</div>
                    <div class="chip-stack" id="chip-big"></div>
                </div>
            </div>

            <!-- Tier 2: EVEN / ODD -->
            <div class="row-evenodd">
                <div class="bet-spot" data-spot="even" onclick="placeChip('even')">
                    <div class="spot-title">EVEN</div>
                    <div class="spot-mult">1.98x</div>
                    <div class="chip-stack" id="chip-even"></div>
                </div>
                <div class="bet-spot" data-spot="odd" onclick="placeChip('odd')">
                    <div class="spot-title">ODD</div>
                    <div class="spot-mult">1.98x</div>
                    <div class="chip-stack" id="chip-odd"></div>
                </div>
            </div>

            <!-- Tier 3: Specific Triples (181x - 500x) -->
            <div class="table-section-title">SPECIFIC TRIPLES (UP TO 500x):</div>
            <div class="row-triples">
                <?php for ($i = 1; $i <= 6; $i++): ?>
                <div class="bet-spot spot-mini" data-spot="triple_<?= $i ?>" onclick="placeChip('triple_<?= $i ?>')">
                    <div class="dice-mini-icons"><?= str_repeat("🎲", 3) ?></div>
                    <div class="spot-num"><?= str_repeat((string)$i, 3) ?></div>
                    <div class="spot-mult gold" id="mult-triple_<?= $i ?>">181x</div>
                    <div class="chip-stack" id="chip-triple_<?= $i ?>"></div>
                </div>
                <?php endfor; ?>
            </div>

            <!-- Tier 4: Specific Doubles (11x - 25x) -->
            <div class="table-section-title">SPECIFIC DOUBLES (UP TO 25x):</div>
            <div class="row-doubles">
                <?php for ($i = 1; $i <= 6; $i++): ?>
                <div class="bet-spot spot-mini" data-spot="double_<?= $i ?>" onclick="placeChip('double_<?= $i ?>')">
                    <div class="dice-mini-icons"><?= str_repeat("🎲", 2) ?></div>
                    <div class="spot-num"><?= str_repeat((string)$i, 2) ?></div>
                    <div class="spot-mult cyan" id="mult-double_<?= $i ?>">11x</div>
                    <div class="chip-stack" id="chip-double_<?= $i ?>"></div>
                </div>
                <?php endfor; ?>
            </div>

            <!-- Tier 5: Total Sums (4 to 17) -->
            <div class="table-section-title">TOTAL SUMS (6x - 200x):</div>
            <div class="grid-sums">
                <?php
                $sumOdds = [
                    4 => '61x', 5 => '31x', 6 => '19x', 7 => '13x',
                    8 => '9x', 9 => '7.5x', 10 => '7x', 11 => '7x',
                    12 => '7.5x', 13 => '9x', 14 => '13x', 15 => '19x',
                    16 => '31x', 17 => '61x'
                ];
                foreach ($sumOdds as $sumVal => $odd):
                ?>
                <div class="bet-spot spot-sum" data-spot="sum_<?= $sumVal ?>" onclick="placeChip('sum_<?= $sumVal ?>')">
                    <div class="sum-num"><?= $sumVal ?></div>
                    <div class="sum-odd" id="mult-sum_<?= $sumVal ?>"><?= $odd ?></div>
                    <div class="chip-stack" id="chip-sum_<?= $sumVal ?>"></div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Tier 6: Single Dice (1 to 6) -->
            <div class="table-section-title">SINGLE NUMBER (1x / 2x / 3x):</div>
            <div class="row-singles">
                <?php for ($i = 1; $i <= 6; $i++): ?>
                <div class="bet-spot spot-single" data-spot="single_<?= $i ?>" onclick="placeChip('single_<?= $i ?>')">
                    <div class="single-die-icon">🎲 <?= $i ?></div>
                    <div class="single-mult">1x - 3x</div>
                    <div class="chip-stack" id="chip-single_<?= $i ?>"></div>
                </div>
                <?php endfor; ?>
            </div>
        </div>

        <!-- Bottom Controls Dock -->
        <div class="sb-controls">
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

            <!-- Bet Summary & Helpers -->
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
                <button class="btn-shake" id="btn-shake" onclick="shakeAndRoll()">
                    <span class="ico">🎲</span>
                    <span class="txt">SHAKE & ROLL</span>
                </button>
                <button class="btn-auto" id="btn-auto" onclick="toggleAutoRoll()">
                    <span class="ico">⚡</span>
                    <span id="auto-txt">AUTO</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal (High Multipliers >= 10x) -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">ROYAL SIC BO WIN!</div>
            <div class="celebration-icon" id="celeb-icon">👑</div>
            <div class="celebration-amount" id="celeb-amount">+৳0.00</div>
            <div class="celebration-subtitle" id="celeb-sub">LIGHTNING MULTIPLIER UNLOCKED!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ SUPER SIC BO RULES</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>🎲 Objective:</strong> Predict the outcome of 3 shaken dice. You can place chips on multiple spots!</p>
                <p><strong>⚡ Lightning Multipliers:</strong> Before every shake, random spots are struck by lightning, boosting payouts up to <strong>500x</strong>!</p>
                <p><strong>🎯 Betting Options:</strong>
                    <br>• <strong>Small (4-10):</strong> 1:1 payout (losses on triples).
                    <br>• <strong>Big (11-17):</strong> 1:1 payout (losses on triples).
                    <br>• <strong>Any Triple:</strong> 31x base (boosted up to 88x).
                    <br>• <strong>Specific Triple (e.g. 666):</strong> 181x base (boosted up to 500x).
                    <br>• <strong>Exact Sums (4 to 17):</strong> Payouts from 6x up to 200x.
                    <br>• <strong>Single Dice:</strong> 1x for 1 match, 2x for 2 matches, 3x for 3 matches.
                </p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.SB_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="sicbo.js?v=<?= time() ?>"></script>
</body>
</html>
