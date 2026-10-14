<?php
// card365/index.php - Card365 Live Casino Suite
require_once dirname(__DIR__) . '/api/_bootstrap.php';

$token = trim((string)($_GET['token'] ?? $_GET['Token'] ?? ''));
$gameCode = trim((string)($_GET['game'] ?? $_GET['gameCode'] ?? '707'));
$initialMode = trim((string)($_GET['mode'] ?? ''));

// Map gameCode to initial mode if not given
if ($initialMode === '') {
    if ($gameCode === '921' || stripos($gameCode, 'andar') !== false) {
        $initialMode = 'andarbahar';
    } elseif ($gameCode === '562' || stripos($gameCode, 'dragon') !== false || stripos($gameCode, 'tiger') !== false) {
        $initialMode = 'dragontiger';
    } elseif ($gameCode === '564' || stripos($gameCode, 'seven') !== false) {
        $initialMode = 'sevenup';
    } else {
        $initialMode = 'teenpatti'; // Default to 3 Patti Classic (707)
    }
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
    <title>Card365 - VIP Live Casino</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Montserrat:wght@500;700;900&family=Noto+Sans+Bengali:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="card365.css?v=<?= time() ?>">
</head>
<body data-mode="<?= htmlspecialchars($initialMode) ?>">
    <!-- Top Header -->
    <header class="c365-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="c365-brand">
                <span class="crown-ico">👑</span>
                <span class="c365-title">CARD365</span>
            </div>
        </div>

        <!-- Mode Switcher Tabs -->
        <div class="mode-tabs">
            <button class="mode-tab <?= $initialMode === 'teenpatti' ? 'active' : '' ?>" data-mode="teenpatti" onclick="switchMode('teenpatti')">
                <span class="tab-ico">♠</span>
                <span>3 Patti</span>
            </button>
            <button class="mode-tab <?= $initialMode === 'andarbahar' ? 'active' : '' ?>" data-mode="andarbahar" onclick="switchMode('andarbahar')">
                <span class="tab-ico">🎴</span>
                <span>Andar Bahar</span>
            </button>
            <button class="mode-tab <?= $initialMode === 'dragontiger' ? 'active' : '' ?>" data-mode="dragontiger" onclick="switchMode('dragontiger')">
                <span class="tab-ico">🐉</span>
                <span>Dragon Tiger</span>
            </button>
            <button class="mode-tab <?= $initialMode === 'sevenup' ? 'active' : '' ?>" data-mode="sevenup" onclick="switchMode('sevenup')">
                <span class="tab-ico">🎲</span>
                <span>7 Up 7 Down</span>
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

    <!-- Ticker Bar -->
    <div class="ticker-bar">
        <span class="ticker-tag">🔥 RECENT WINS</span>
        <div class="ticker-track">
            <div class="ticker-marquee" id="ticker-marquee">
                <span class="ticker-item">017***5541 won 3 Patti Trail <strong>+৳3,000.00</strong> (30x)</span>
                <span class="ticker-item">018***1120 won Andar <strong>+৳975.00</strong> (1.95x)</span>
                <span class="ticker-item">019***4439 won Dragon <strong>+৳1,980.00</strong> (1.98x)</span>
                <span class="ticker-item">016***8823 hit Lucky 7 <strong>+৳1,000.00</strong> (5x)</span>
            </div>
        </div>
    </div>

    <!-- Casino Table Main Stage -->
    <main class="c365-table">
        <div class="table-felt">
            <div class="felt-logo">CARD 365 VIP CASINO</div>

            <!-- ==================== MODE 1: 3 PATTI (TEEN PATTI) ==================== -->
            <section class="game-view <?= $initialMode === 'teenpatti' ? 'active' : '' ?>" id="view-teenpatti">
                <!-- Dealer Hand -->
                <div class="hand-section dealer-hand-sec">
                    <div class="hand-label">DEALER</div>
                    <div class="cards-row" id="tp-dealer-cards">
                        <div class="playing-card back"></div>
                        <div class="playing-card back"></div>
                        <div class="playing-card back"></div>
                    </div>
                    <div class="hand-rank-badge" id="tp-dealer-rank">Waiting for deal</div>
                </div>

                <!-- Center Table VS Emblem -->
                <div class="vs-emblem">VS</div>

                <!-- Player Hand -->
                <div class="hand-section player-hand-sec">
                    <div class="cards-row" id="tp-player-cards">
                        <div class="playing-card back"></div>
                        <div class="playing-card back"></div>
                        <div class="playing-card back"></div>
                    </div>
                    <div class="hand-rank-badge highlight" id="tp-player-rank">Waiting for deal</div>
                    <div class="hand-label">PLAYER</div>
                </div>

                <!-- 3 Patti Betting Spots -->
                <div class="betting-spots-row">
                    <div class="bet-spot active" data-choice="player" onclick="selectBetChoice('player')">
                        <div class="spot-title">PLAYER</div>
                        <div class="spot-odds">1.95x</div>
                        <div class="spot-chips" id="chips-player"></div>
                    </div>
                    <div class="bet-spot" data-choice="dealer" onclick="selectBetChoice('dealer')">
                        <div class="spot-title">DEALER</div>
                        <div class="spot-odds">1.95x</div>
                        <div class="spot-chips" id="chips-dealer"></div>
                    </div>
                    <div class="bet-spot bonus-spot" data-choice="pair_plus" onclick="selectBetChoice('pair_plus')">
                        <div class="spot-title">PAIR PLUS</div>
                        <div class="spot-odds">UP TO 30x</div>
                        <div class="spot-chips" id="chips-pair_plus"></div>
                    </div>
                </div>
            </section>

            <!-- ==================== MODE 2: ANDAR BAHAR ==================== -->
            <section class="game-view <?= $initialMode === 'andarbahar' ? 'active' : '' ?>" id="view-andarbahar">
                <!-- Joker Card Slot -->
                <div class="joker-container">
                    <div class="joker-label">JOKER CARD</div>
                    <div class="joker-slot" id="ab-joker-slot">
                        <div class="playing-card back"></div>
                    </div>
                </div>

                <!-- Andar & Bahar Tracks -->
                <div class="ab-tracks-container">
                    <!-- Andar Track -->
                    <div class="ab-side-track" id="ab-track-andar">
                        <div class="ab-track-header">
                            <span class="ab-name">ANDAR (আন্দার)</span>
                            <span class="ab-odds">1.95x</span>
                        </div>
                        <div class="ab-cards-deck" id="ab-cards-andar"></div>
                    </div>

                    <!-- Bahar Track -->
                    <div class="ab-side-track" id="ab-track-bahar">
                        <div class="ab-track-header">
                            <span class="ab-name">BAHAR (বাহার)</span>
                            <span class="ab-odds">2.00x</span>
                        </div>
                        <div class="ab-cards-deck" id="ab-cards-bahar"></div>
                    </div>
                </div>

                <!-- Andar Bahar Betting Spots -->
                <div class="betting-spots-row">
                    <div class="bet-spot active" data-choice="andar" onclick="selectBetChoice('andar')">
                        <div class="spot-title">ANDAR</div>
                        <div class="spot-odds">1.95x</div>
                        <div class="spot-chips" id="chips-andar"></div>
                    </div>
                    <div class="bet-spot" data-choice="bahar" onclick="selectBetChoice('bahar')">
                        <div class="spot-title">BAHAR</div>
                        <div class="spot-odds">2.00x</div>
                        <div class="spot-chips" id="chips-bahar"></div>
                    </div>
                </div>
            </section>

            <!-- ==================== MODE 3: DRAGON TIGER ==================== -->
            <section class="game-view <?= $initialMode === 'dragontiger' ? 'active' : '' ?>" id="view-dragontiger">
                <div class="dt-arena">
                    <!-- Dragon Side -->
                    <div class="dt-side dragon-side">
                        <div class="dt-motif">🐉</div>
                        <div class="dt-title">DRAGON</div>
                        <div class="dt-card-slot" id="dt-dragon-card">
                            <div class="playing-card back"></div>
                        </div>
                    </div>

                    <!-- VS / Tie -->
                    <div class="dt-center">
                        <div class="dt-vs">VS</div>
                    </div>

                    <!-- Tiger Side -->
                    <div class="dt-side tiger-side">
                        <div class="dt-motif">🐅</div>
                        <div class="dt-title">TIGER</div>
                        <div class="dt-card-slot" id="dt-tiger-card">
                            <div class="playing-card back"></div>
                        </div>
                    </div>
                </div>

                <!-- Dragon Tiger Betting Spots -->
                <div class="betting-spots-row">
                    <div class="bet-spot active dragon-spot" data-choice="dragon" onclick="selectBetChoice('dragon')">
                        <div class="spot-title">DRAGON</div>
                        <div class="spot-odds">1.98x</div>
                        <div class="spot-chips" id="chips-dragon"></div>
                    </div>
                    <div class="bet-spot tie-spot" data-choice="tie" onclick="selectBetChoice('tie')">
                        <div class="spot-title">TIE</div>
                        <div class="spot-odds">9.00x</div>
                        <div class="spot-chips" id="chips-tie"></div>
                    </div>
                    <div class="bet-spot tiger-spot" data-choice="tiger" onclick="selectBetChoice('tiger')">
                        <div class="spot-title">TIGER</div>
                        <div class="spot-odds">1.98x</div>
                        <div class="spot-chips" id="chips-tiger"></div>
                    </div>
                </div>
            </section>

            <!-- ==================== MODE 4: 7 UP 7 DOWN ==================== -->
            <section class="game-view <?= $initialMode === 'sevenup' ? 'active' : '' ?>" id="view-sevenup">
                <!-- 3D Dice Stage -->
                <div class="dice-arena">
                    <div class="dice-cup">
                        <div class="die" id="die-1">⚄</div>
                        <div class="die" id="die-2">⚂</div>
                    </div>
                    <div class="dice-sum-badge" id="dice-sum-display">TOTAL: 8 (7 UP)</div>
                </div>

                <!-- 7 Up 7 Down Betting Spots -->
                <div class="betting-spots-row">
                    <div class="bet-spot" data-choice="down" onclick="selectBetChoice('down')">
                        <div class="spot-title">7 DOWN</div>
                        <div class="spot-sub">2 - 6</div>
                        <div class="spot-odds">2.00x</div>
                        <div class="spot-chips" id="chips-down"></div>
                    </div>
                    <div class="bet-spot lucky-seven-spot active" data-choice="seven" onclick="selectBetChoice('seven')">
                        <div class="spot-title">LUCKY 7</div>
                        <div class="spot-sub">EXACT 7</div>
                        <div class="spot-odds">5.00x</div>
                        <div class="spot-chips" id="chips-seven"></div>
                    </div>
                    <div class="bet-spot" data-choice="up" onclick="selectBetChoice('up')">
                        <div class="spot-title">7 UP</div>
                        <div class="spot-sub">8 - 12</div>
                        <div class="spot-odds">2.00x</div>
                        <div class="spot-chips" id="chips-up"></div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Result Status Banner -->
        <div class="result-banner" id="result-banner">
            SELECT BET & CLICK DEAL
        </div>

        <!-- Bottom Controls & Chips Panel -->
        <div class="c365-controls">
            <!-- Chips Row -->
            <div class="chips-selector-row">
                <span class="chips-label">CHIPS:</span>
                <div class="chips-tray">
                    <button class="casino-chip chip-10" onclick="selectChip(10)">
                        <span>10</span>
                    </button>
                    <button class="casino-chip chip-20" onclick="selectChip(20)">
                        <span>20</span>
                    </button>
                    <button class="casino-chip chip-50 active" onclick="selectChip(50)">
                        <span>50</span>
                    </button>
                    <button class="casino-chip chip-100" onclick="selectChip(100)">
                        <span>100</span>
                    </button>
                    <button class="casino-chip chip-500" onclick="selectChip(500)">
                        <span>500</span>
                    </button>
                    <button class="casino-chip chip-1000" onclick="selectChip(1000)">
                        <span>1K</span>
                    </button>
                </div>
            </div>

            <!-- Action Buttons Row -->
            <div class="action-bar-row">
                <div class="total-bet-display">
                    <span class="lbl">TOTAL BET</span>
                    <span class="val"><span class="cur"><?= $currency ?></span><span id="display-stake">50</span></span>
                </div>
                <button class="btn-clear" onclick="clearBet()">CLEAR</button>
                <button class="btn-double" onclick="doubleBet()">2X</button>
                <button class="btn-deal" id="btn-deal" onclick="handleDeal()">
                    <span class="deal-text">DEAL</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge">MEGA WIN!</div>
            <div class="celebration-icon" id="celeb-icon">👑</div>
            <div class="celebration-amount" id="celeb-amount">+৳0.00</div>
            <div class="celebration-subtitle" id="celeb-sub">CARD365 CHAMPION</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT</button>
        </div>
    </div>

    <!-- Script Config -->
    <script>
        window.CARD365_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>,
            initialMode: "<?= htmlspecialchars($initialMode, ENT_QUOTES, 'UTF-8') ?>"
        };
    </script>
    <script src="card365.js?v=<?= time() ?>"></script>
</body>
</html>
