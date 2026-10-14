<?php
// roulette/index.php - Royal European Roulette 3D
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
    <title>Royal Roulette - European 3D Casino</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Montserrat:wght@500;600;700;900&family=Noto+Sans+Bengali:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="roulette.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Bar -->
    <header class="rlt-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="rlt-brand">
                <span class="royal-badge">ROYAL</span>
                <span class="rlt-title">ROULETTE</span>
            </div>
        </div>

        <div class="header-right">
            <div class="balance-card" id="balance-box" title="Click to refresh">
                <span class="cur-sym"><?= $currency ?></span>
                <span class="cur-val" id="user-balance"><?= number_format($balance, 2, '.', '') ?></span>
                <span class="refresh-icon" id="balance-spinner">↻</span>
            </div>
            <button class="btn-icon" id="btn-sound" title="Toggle Sound">🔊</button>
            <button class="btn-icon" id="btn-stats" title="Statistics & Hot/Cold Numbers">📊</button>
            <button class="btn-icon" id="btn-info" title="Paytable & Rules">ℹ️</button>
        </div>
    </header>

    <!-- Recent Numbers Ticker & Statistics Strip -->
    <div class="history-bar">
        <div class="history-label">RECENT:</div>
        <div class="history-scroll" id="history-scroll">
            <!-- Populated via JS -->
            <span class="badge-num red">32</span>
            <span class="badge-num black">15</span>
            <span class="badge-num red">19</span>
            <span class="badge-num green">0</span>
            <span class="badge-num red">7</span>
            <span class="badge-num black">28</span>
            <span class="badge-num red">3</span>
            <span class="badge-num black">26</span>
        </div>
    </div>

    <!-- Main Game Container -->
    <main class="rlt-main">
        <!-- Wheel Arena Section -->
        <div class="wheel-stage">
            <div class="wheel-wrapper" id="wheel-wrapper">
                <canvas id="wheel-canvas" width="400" height="400"></canvas>
                <!-- Center Turret Brass Cone Cap -->
                <div class="wheel-center-cap"></div>
            </div>

            <!-- Result Announcement Banner -->
            <div class="wheel-status-bar" id="wheel-status">
                <span id="status-text">PLACE YOUR BETS</span>
                <div class="win-spotlight" id="win-spotlight">
                    <span class="win-circle" id="spotlight-circle">--</span>
                    <span class="win-desc" id="spotlight-desc">--</span>
                </div>
            </div>
        </div>

        <!-- Betting Felt Arena (European Layout) -->
        <div class="felt-stage">
            <div class="felt-table-scroll">
                <div class="felt-table" id="felt-table">
                    <!-- Column 0 (Green Zero) -->
                    <div class="felt-cell zero-cell" data-type="straight" data-target="0">
                        <span class="cell-num">0</span>
                        <div class="chip-stack" id="chip-straight-0"></div>
                    </div>

                    <!-- 3x12 Numbers Grid & Outside Bets -->
                    <div class="felt-grid-wrapper">
                        <!-- Numbers 1 to 36 Grid -->
                        <div class="numbers-grid" id="numbers-grid">
                            <!-- Populated dynamically / structurally by JS -->
                        </div>

                        <!-- 2 to 1 Columns -->
                        <div class="columns-col">
                            <div class="felt-cell col-cell" data-type="col3" data-target="col3">
                                <span>2:1</span>
                                <div class="chip-stack" id="chip-col3"></div>
                            </div>
                            <div class="felt-cell col-cell" data-type="col2" data-target="col2">
                                <span>2:1</span>
                                <div class="chip-stack" id="chip-col2"></div>
                            </div>
                            <div class="felt-cell col-cell" data-type="col1" data-target="col1">
                                <span>2:1</span>
                                <div class="chip-stack" id="chip-col1"></div>
                            </div>
                        </div>

                        <!-- Dozens Row (1st 12, 2nd 12, 3rd 12) -->
                        <div class="dozens-row">
                            <div class="felt-cell dozen-cell" data-type="dozen1" data-target="dozen1">
                                <span>1st 12</span>
                                <div class="chip-stack" id="chip-dozen1"></div>
                            </div>
                            <div class="felt-cell dozen-cell" data-type="dozen2" data-target="dozen2">
                                <span>2nd 12</span>
                                <div class="chip-stack" id="chip-dozen2"></div>
                            </div>
                            <div class="felt-cell dozen-cell" data-type="dozen3" data-target="dozen3">
                                <span>3rd 12</span>
                                <div class="chip-stack" id="chip-dozen3"></div>
                            </div>
                        </div>

                        <!-- Even-Money Bets (1-18, EVEN, RED, BLACK, ODD, 19-36) -->
                        <div class="outside-row">
                            <div class="felt-cell outside-cell" data-type="low" data-target="1-18">
                                <span>1 to 18</span>
                                <div class="chip-stack" id="chip-low"></div>
                            </div>
                            <div class="felt-cell outside-cell" data-type="even" data-target="even">
                                <span>EVEN</span>
                                <div class="chip-stack" id="chip-even"></div>
                            </div>
                            <div class="felt-cell outside-cell red-cell" data-type="red" data-target="red">
                                <span class="diamond red">♦</span>
                                <span>RED</span>
                                <div class="chip-stack" id="chip-red"></div>
                            </div>
                            <div class="felt-cell outside-cell black-cell" data-type="black" data-target="black">
                                <span class="diamond black">♠</span>
                                <span>BLACK</span>
                                <div class="chip-stack" id="chip-black"></div>
                            </div>
                            <div class="felt-cell outside-cell" data-type="odd" data-target="odd">
                                <span>ODD</span>
                                <div class="chip-stack" id="chip-odd"></div>
                            </div>
                            <div class="felt-cell outside-cell" data-type="high" data-target="19-36">
                                <span>19 to 36</span>
                                <div class="chip-stack" id="chip-high"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Betting Console & Controls -->
        <div class="rlt-console">
            <!-- Bet Summary -->
            <div class="console-summary">
                <div class="summary-box">
                    <span class="lbl">TOTAL BET:</span>
                    <span class="val" id="total-bet-val"><?= $currency ?> 0.00</span>
                </div>
                <div class="summary-box">
                    <span class="lbl">LAST WIN:</span>
                    <span class="val win" id="last-win-val"><?= $currency ?> 0.00</span>
                </div>
            </div>

            <!-- Chips Selector Tray -->
            <div class="chips-tray" id="chips-tray">
                <button class="chip chip-1" data-val="1">1</button>
                <button class="chip chip-5" data-val="5">5</button>
                <button class="chip chip-10 active" data-val="10">10</button>
                <button class="chip chip-50" data-val="50">50</button>
                <button class="chip chip-100" data-val="100">100</button>
                <button class="chip chip-500" data-val="500">500</button>
                <button class="chip chip-1000" data-val="1000">1K</button>
            </div>

            <!-- Action Buttons Row -->
            <div class="action-buttons-row">
                <button class="btn-act btn-undo" id="btn-undo" onclick="undoLastBet()">
                    <span class="ico">↩️</span>
                    <span>UNDO</span>
                </button>
                <button class="btn-act btn-clear" id="btn-clear" onclick="clearAllBets()">
                    <span class="ico">🗑️</span>
                    <span>CLEAR</span>
                </button>
                <button class="btn-act btn-double" id="btn-double" onclick="doubleAllBets()">
                    <span class="ico">✖️2</span>
                    <span>DOUBLE</span>
                </button>
                <button class="btn-act btn-rebet" id="btn-rebet" onclick="rebetPrevious()">
                    <span class="ico">🔁</span>
                    <span>REBET</span>
                </button>
                <button class="btn-spin" id="btn-spin" onclick="startSpin()">
                    <span class="spin-icon">🎡</span>
                    <span class="spin-text">SPIN</span>
                </button>
                <button class="btn-act btn-auto" id="btn-auto" onclick="toggleAutoSpin()">
                    <span class="ico">⚡</span>
                    <span id="auto-spin-txt">AUTO</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Statistics Modal -->
    <div class="modal-overlay" id="stats-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>📊 ROULETTE STATISTICS</h3>
                <button class="btn-close-modal" onclick="closeModal('stats-modal')">✕</button>
            </div>
            <div class="modal-body">
                <!-- Percentages Breakdown -->
                <div class="stats-meters">
                    <div class="meter-col">
                        <span class="m-lbl">RED / BLACK / ZERO</span>
                        <div class="multi-progress">
                            <div class="bar red" id="bar-red" style="width: 50%;">50%</div>
                            <div class="bar black" id="bar-black" style="width: 40%;">40%</div>
                            <div class="bar green" id="bar-green" style="width: 10%;">10%</div>
                        </div>
                    </div>
                    <div class="meter-col">
                        <span class="m-lbl">EVEN / ODD</span>
                        <div class="multi-progress">
                            <div class="bar even" id="bar-even" style="width: 50%;">EVEN 50%</div>
                            <div class="bar odd" id="bar-odd" style="width: 50%;">ODD 50%</div>
                        </div>
                    </div>
                </div>

                <!-- Hot & Cold Numbers -->
                <div class="hot-cold-row">
                    <div class="hc-box">
                        <div class="hc-title hot">🔥 HOT NUMBERS</div>
                        <div class="hc-list" id="hot-list">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                    <div class="hc-box">
                        <div class="hc-title cold">❄️ COLD NUMBERS</div>
                        <div class="hc-list" id="cold-list">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Paytable & Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ PAYTABLE & RULES</h3>
                <button class="btn-close-modal" onclick="closeModal('rules-modal')">✕</button>
            </div>
            <div class="modal-body rules-body">
                <table class="rules-table">
                    <thead>
                        <tr>
                            <th>BET TYPE</th>
                            <th>COVERS</th>
                            <th>PAYOUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Straight Up</td><td>1 Number</td><td><strong>35 : 1</strong></td></tr>
                        <tr><td>Split</td><td>2 Numbers</td><td><strong>17 : 1</strong></td></tr>
                        <tr><td>Street</td><td>3 Numbers (Row)</td><td><strong>11 : 1</strong></td></tr>
                        <tr><td>Corner</td><td>4 Numbers</td><td><strong>8 : 1</strong></td></tr>
                        <tr><td>Six Line</td><td>6 Numbers (2 Rows)</td><td><strong>5 : 1</strong></td></tr>
                        <tr><td>Column</td><td>12 Numbers (Col)</td><td><strong>2 : 1</strong></td></tr>
                        <tr><td>Dozen</td><td>1-12, 13-24, 25-36</td><td><strong>2 : 1</strong></td></tr>
                        <tr><td>Red / Black</td><td>18 Numbers</td><td><strong>1 : 1</strong></td></tr>
                        <tr><td>Even / Odd</td><td>18 Numbers</td><td><strong>1 : 1</strong></td></tr>
                        <tr><td>1-18 / 19-36</td><td>18 Numbers</td><td><strong>1 : 1</strong></td></tr>
                    </tbody>
                </table>
                <div class="rules-note">
                    * Single zero European Roulette features 37 pockets (0-36) with standard 97.30% RTP.
                </div>
            </div>
        </div>
    </div>

    <!-- Big Win Celebration Modal -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">BIG WIN!</div>
            <div class="win-number-display" id="celeb-number">7</div>
            <div class="celebration-amount" id="celeb-amount">+৳0.00</div>
            <div class="celebration-subtitle" id="celeb-sub">ROYAL HIT!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Initial Config & Scripts -->
    <script>
        window.RLT_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="roulette.js?v=<?= time() ?>"></script>
</body>
</html>
