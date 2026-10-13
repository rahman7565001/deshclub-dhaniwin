<?php
// aviator/index.php - Self-Hosted Spribe Aviator Game
$token = $_GET['token'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Deshclub Aviator - Crash Game</title>
    <link rel="stylesheet" href="aviator.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
</head>
<body>
    <div id="aviator-app">
        <!-- Top Navbar -->
        <header class="game-header">
            <div class="logo-area">
                <a href="/" class="back-btn" title="Back to Lobby">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                </a>
                <span class="aviator-logo">Aviator</span>
                <span class="provably-fair" title="100% Provably Fair">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#28a745" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    Provably Fair
                </span>
            </div>

            <div class="user-info">
                <div class="balance-box">
                    <span class="currency">৳</span>
                    <span id="user-balance" class="balance-amount">0.00</span>
                    <button id="refresh-balance-btn" class="icon-btn" title="Refresh Balance">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- Multipliers History Strip -->
        <div class="history-bar-container">
            <div class="history-label">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
            </div>
            <div class="history-pills" id="history-pills">
                <!-- Dynamically populated -->
            </div>
        </div>

        <!-- Main Layout: Sidebar & Stage -->
        <div class="game-body">
            <!-- Left Live Bets Sidebar -->
            <aside class="bets-sidebar">
                <div class="sidebar-tabs">
                    <button class="tab-btn active" data-tab="all">All Bets</button>
                    <button class="tab-btn" data-tab="my">My Bets</button>
                    <button class="tab-btn" data-tab="top">Top</button>
                </div>
                <div class="sidebar-header-row">
                    <span>User</span>
                    <span>Bet, ৳</span>
                    <span>X</span>
                    <span>Cash out, ৳</span>
                </div>
                <div class="sidebar-list" id="sidebar-list">
                    <!-- Populated dynamically -->
                </div>
            </aside>

            <!-- Center Stage & Controls -->
            <main class="stage-container">
                <!-- Game Canvas & Stage -->
                <div class="canvas-wrapper">
                    <canvas id="aviator-canvas"></canvas>

                    <!-- Overlay Multiplier Text -->
                    <div id="multiplier-display" class="multiplier-display">
                        <span id="multiplier-value">1.00x</span>
                    </div>

                    <!-- Waiting Overlay -->
                    <div id="waiting-overlay" class="waiting-overlay">
                        <div class="propeller-spinner"></div>
                        <div class="waiting-text">WAITING FOR NEXT ROUND</div>
                        <div class="countdown-bar">
                            <div id="countdown-progress" class="progress-fill"></div>
                        </div>
                    </div>

                    <!-- Crashed Overlay -->
                    <div id="crashed-overlay" class="crashed-overlay">
                        <div class="flew-away-text">FLEW AWAY!</div>
                        <div id="crashed-multiplier-text" class="crashed-multiplier-text">1.00x</div>
                    </div>
                </div>

                <!-- Dual Bet Control Panels -->
                <div class="bet-panels-container">
                    <!-- Panel 1 -->
                    <div class="bet-panel" id="panel-1">
                        <div class="panel-header">
                            <span class="panel-tag">Bet 1</span>
                            <label class="auto-cashout-toggle">
                                <span>Auto Cashout</span>
                                <input type="checkbox" id="auto-cashout-chk-1">
                                <span class="slider"></span>
                            </label>
                            <input type="number" id="auto-cashout-val-1" class="auto-input" step="0.1" min="1.01" value="2.00" disabled>
                        </div>
                        <div class="panel-controls">
                            <div class="amount-stepper">
                                <button class="step-btn" onclick="adjustStake(1, -10)">-</button>
                                <input type="number" id="stake-input-1" class="stake-input" value="100" min="10" step="10">
                                <button class="step-btn" onclick="adjustStake(1, 10)">+</button>
                            </div>
                            <button id="main-btn-1" class="main-bet-btn btn-bet" onclick="handlePanelAction(1)">
                                <span class="btn-primary-text">BET</span>
                                <span class="btn-sub-text" id="btn-sub-1">100.00 INR</span>
                            </button>
                        </div>
                        <div class="quick-chips">
                            <button onclick="setStake(1, 50)">50</button>
                            <button onclick="setStake(1, 100)">100</button>
                            <button onclick="setStake(1, 200)">200</button>
                            <button onclick="setStake(1, 500)">500</button>
                        </div>
                    </div>

                    <!-- Panel 2 -->
                    <div class="bet-panel" id="panel-2">
                        <div class="panel-header">
                            <span class="panel-tag">Bet 2</span>
                            <label class="auto-cashout-toggle">
                                <span>Auto Cashout</span>
                                <input type="checkbox" id="auto-cashout-chk-2">
                                <span class="slider"></span>
                            </label>
                            <input type="number" id="auto-cashout-val-2" class="auto-input" step="0.1" min="1.01" value="5.00" disabled>
                        </div>
                        <div class="panel-controls">
                            <div class="amount-stepper">
                                <button class="step-btn" onclick="adjustStake(2, -10)">-</button>
                                <input type="number" id="stake-input-2" class="stake-input" value="50" min="10" step="10">
                                <button class="step-btn" onclick="adjustStake(2, 10)">+</button>
                            </div>
                            <button id="main-btn-2" class="main-bet-btn btn-bet" onclick="handlePanelAction(2)">
                                <span class="btn-primary-text">BET</span>
                                <span class="btn-sub-text" id="btn-sub-2">50.00 INR</span>
                            </button>
                        </div>
                        <div class="quick-chips">
                            <button onclick="setStake(2, 50)">50</button>
                            <button onclick="setStake(2, 100)">100</button>
                            <button onclick="setStake(2, 200)">200</button>
                            <button onclick="setStake(2, 500)">500</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Alert Toast -->
        <div id="toast" class="toast"></div>
    </div>

    <script>
        window.AVIATOR_TOKEN = "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>";
    </script>
    <script src="aviator.js"></script>
</body>
</html>
