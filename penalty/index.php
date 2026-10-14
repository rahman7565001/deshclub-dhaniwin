<?php
// penalty/index.php - Penalty Shootout Football Casino Arcade
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
    <title>Penalty Shootout - Football Casino Arcade</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@600;800;900&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="penalty.css?v=<?= time() ?>">
</head>
<body>
    <!-- Top Header -->
    <header class="ps-header">
        <div class="header-left">
            <button class="btn-lobby" id="btn-lobby" title="Back to Lobby">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>Lobby</span>
            </button>
            <div class="ps-brand">
                <span class="brand-sub">PREMIER LEAGUE ARCADE</span>
                <span class="brand-title">PENALTY SHOOTOUT ⚽</span>
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

    <!-- Team / Flag Selector Ribbon -->
    <div class="teams-ribbon" id="teams-ribbon">
        <button class="team-btn" data-team="BD"><span class="flag">🇧🇩</span><span class="name">BAN</span></button>
        <button class="team-btn active" data-team="ARG"><span class="flag">🇦🇷</span><span class="name">ARG</span></button>
        <button class="team-btn" data-team="BRA"><span class="flag">🇧🇷</span><span class="name">BRA</span></button>
        <button class="team-btn" data-team="POR"><span class="flag">🇵🇹</span><span class="name">POR</span></button>
        <button class="team-btn" data-team="GER"><span class="flag">🇩🇪</span><span class="name">GER</span></button>
        <button class="team-btn" data-team="FRA"><span class="flag">🇫🇷</span><span class="name">FRA</span></button>
        <button class="team-btn" data-team="ENG"><span class="flag">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span><span class="name">ENG</span></button>
        <button class="team-btn" data-team="ESP"><span class="flag">🇪🇸</span><span class="name">ESP</span></button>
    </div>

    <!-- 5-Goal Ladder Ribbon -->
    <div class="ladder-ribbon" id="ladder-ribbon">
        <div class="ladder-step" data-step="1">
            <div class="step-ball">⚽</div>
            <div class="step-mult">1.92x</div>
        </div>
        <div class="ladder-step" data-step="2">
            <div class="step-ball">⚽</div>
            <div class="step-mult">3.84x</div>
        </div>
        <div class="ladder-step" data-step="3">
            <div class="step-ball">⚽</div>
            <div class="step-mult">7.68x</div>
        </div>
        <div class="ladder-step" data-step="4">
            <div class="step-ball">⚽</div>
            <div class="step-mult">15.36x</div>
        </div>
        <div class="ladder-step trophy" data-step="5">
            <div class="step-ball">🏆</div>
            <div class="step-mult">30.72x</div>
        </div>
    </div>

    <!-- Main Game Container -->
    <main class="ps-main">
        <!-- Live Match HUD -->
        <div class="match-hud">
            <div class="hud-box">
                <span class="hud-lbl">CURRENT MULTIPLIER</span>
                <span class="hud-val highlight" id="hud-mult">1.00x</span>
            </div>
            <div class="hud-box text-right">
                <span class="hud-lbl">POTENTIAL WIN</span>
                <span class="hud-val win" id="hud-win"><?= $currency ?>0.00</span>
            </div>
        </div>

        <!-- Penalty Stadium Arena -->
        <div class="stadium-arena" id="stadium-arena">
            <!-- Stadium Lights & Crowd Silhouette -->
            <div class="stadium-bg">
                <div class="floodlight light-l"></div>
                <div class="floodlight light-r"></div>
            </div>

            <!-- Goal Net & Post Frame -->
            <div class="goal-frame" id="goal-frame">
                <div class="goal-crossbar"></div>
                <div class="goal-post post-l"></div>
                <div class="goal-post post-r"></div>
                <div class="goal-net" id="goal-net"></div>

                <!-- 5 Clickable Targets -->
                <div class="target-spot spot-tl" data-target="top_left" onclick="shootAt('top_left')">
                    <span class="target-aim">🎯</span>
                    <span class="target-lbl">TL</span>
                </div>
                <div class="target-spot spot-tr" data-target="top_right" onclick="shootAt('top_right')">
                    <span class="target-aim">🎯</span>
                    <span class="target-lbl">TR</span>
                </div>
                <div class="target-spot spot-bl" data-target="bottom_left" onclick="shootAt('bottom_left')">
                    <span class="target-aim">🎯</span>
                    <span class="target-lbl">BL</span>
                </div>
                <div class="target-spot spot-br" data-target="bottom_right" onclick="shootAt('bottom_right')">
                    <span class="target-aim">🎯</span>
                    <span class="target-lbl">BR</span>
                </div>
                <div class="target-spot spot-c" data-target="center" onclick="shootAt('center')">
                    <span class="target-aim">🎯</span>
                    <span class="target-lbl">C</span>
                </div>

                <!-- Goalkeeper Character -->
                <div class="goalkeeper" id="goalkeeper">
                    <div class="keeper-body">
                        <div class="keeper-head"></div>
                        <div class="keeper-torso"></div>
                        <div class="keeper-arm arm-l">🧤</div>
                        <div class="keeper-arm arm-r">🧤</div>
                        <div class="keeper-legs"></div>
                    </div>
                </div>
            </div>

            <!-- Pitch Surface & Penalty Spot -->
            <div class="pitch-ground">
                <div class="penalty-box-line"></div>
                <div class="penalty-spot"></div>

                <!-- The Football -->
                <div class="soccer-ball" id="soccer-ball">
                    <div class="ball-mesh">⚽</div>
                </div>
            </div>

            <!-- Match Banner Overlay (Goal / Saved Banner) -->
            <div class="match-banner" id="match-banner">
                <span class="banner-title" id="banner-txt">GOOOAL!</span>
            </div>
        </div>

        <!-- Controls Dock -->
        <div class="ps-controls">
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

            <!-- Action Buttons Row -->
            <div class="action-row">
                <button class="btn-random" id="btn-random" onclick="shootRandom()" title="Shoot at a random target">
                    <span class="ico">🎲</span>
                    <span class="txt">RANDOM</span>
                </button>
                <button class="btn-action btn-start" id="btn-action" onclick="handleActionButton()">
                    <span class="action-icon" id="action-ico">⚽</span>
                    <span class="action-text" id="action-txt">START MATCH</span>
                    <span class="action-sub" id="action-sub">Stake: ৳10.00</span>
                </button>
            </div>
        </div>
    </main>

    <!-- Celebration Modal (Apex / 5 Goals Trophy) -->
    <div class="celebration-overlay" id="celebration-modal">
        <div class="celebration-card">
            <div class="celebration-badge" id="celeb-badge">WORLD CUP CHAMPIONS!</div>
            <div class="celebration-icon">🏆</div>
            <div class="celebration-mult" id="celeb-mult">30.72x</div>
            <div class="celebration-amount" id="celeb-amount">+৳307.20</div>
            <div class="celebration-subtitle">5 CONSECUTIVE GOALS SCORED!</div>
            <button class="btn-collect" onclick="closeCelebration()">COLLECT TROPHY</button>
        </div>
    </div>

    <!-- Rules Modal -->
    <div class="modal-overlay" id="rules-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>ℹ️ HOW TO PLAY PENALTY SHOOTOUT</h3>
                <button class="btn-close-modal" onclick="closeRules()">✕</button>
            </div>
            <div class="modal-body">
                <p><strong>⚽ Objective:</strong> Pick a target spot in the net and score penalty goals against the goalkeeper.</p>
                <p><strong>🎯 5 Target Spots:</strong>
                    <br>• Top Left (TL), Top Right (TR)
                    <br>• Bottom Left (BL), Bottom Right (BR)
                    <br>• Center (C)
                </p>
                <p><strong>📈 Consecutive Goal Multipliers:</strong>
                    <br>• 1st Goal: <strong>1.92x</strong>
                    <br>• 2nd Goal: <strong>3.84x</strong>
                    <br>• 3rd Goal: <strong>7.68x</strong>
                    <br>• 4th Goal: <strong>15.36x</strong>
                    <br>• 5th Goal (Apex): <strong>30.72x!</strong>
                </p>
                <p><strong>💰 Cash Out Anytime:</strong> After every goal you can either press <strong>CASHOUT</strong> to collect your profit, or shoot the next penalty to double your winnings!</p>
            </div>
        </div>
    </div>

    <!-- Config & Scripts -->
    <script>
        window.PS_CONFIG = {
            token: "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>",
            currency: "<?= $currency ?>",
            initialBalance: <?= (float)$balance ?>
        };
    </script>
    <script src="penalty.js?v=<?= time() ?>"></script>
</body>
</html>
