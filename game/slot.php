<?php
// game/slot.php - Interactive Slot Game Engine
require_once dirname(__DIR__) . '/api/_bootstrap.php';

$gameCode = (string)($_GET['game'] ?? $_GET['gameCode'] ?? 'slot');
$vendorCode = (string)($_GET['vendor'] ?? $_GET['vendorCode'] ?? 'JILI');
$token = (string)($_GET['token'] ?? $_GET['Token'] ?? '');

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

$balance = (float)($user['wallet_balance'] ?? 0);
$currency = api_user_currency($user)['symbol'] ?? '৳';

// Resolve game name from catalog
$gameName = 'Casino Slots';
$homeAll = api_read_snapshot_payload('Home/GetHomeAllGameList');
if (!empty($homeAll['data']['games'])) {
    foreach ($homeAll['data']['games'] as $cat) {
        foreach ($cat['gameList'] ?? [] as $g) {
            if ($g['gameCode'] == $gameCode || $g['gameId'] == $gameCode) {
                $gameName = $g['name'];
                $vendorCode = $g['vendorCode'];
                break 2;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title><?= htmlspecialchars($gameName) ?> - <?= htmlspecialchars($vendorCode) ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --gold-grad: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
            --dark-bg: #0B0E14;
            --card-bg: #161B22;
            --accent: #E52E2E;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
        body {
            background: var(--dark-bg);
            color: #fff;
            font-family: 'Roboto', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            overflow-x: hidden;
        }
        .header {
            width: 100%;
            max-width: 500px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: rgba(22, 27, 34, 0.95);
            border-bottom: 1px solid rgba(255, 215, 0, 0.2);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header .btn-back {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 6px 12px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .header .game-title {
            font-size: 15px;
            font-weight: 700;
            color: #FFD700;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 180px;
        }
        .header .balance-box {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid #FFD700;
            padding: 4px 10px;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 700;
            color: #4cd137;
        }

        /* Slot Stage */
        .slot-stage {
            width: 100%;
            max-width: 500px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px 12px;
            flex: 1;
        }
        .jackpot-banner {
            width: 100%;
            background: linear-gradient(90deg, #740000, #b31217, #740000);
            border: 2px solid #FFD700;
            border-radius: 12px;
            padding: 8px 12px;
            text-align: center;
            margin-bottom: 14px;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }
        .jackpot-title {
            font-family: 'Cinzel', serif;
            font-size: 12px;
            color: #FFD700;
            letter-spacing: 2px;
        }
        .jackpot-amount {
            font-family: 'Cinzel', serif;
            font-size: 24px;
            font-weight: 900;
            color: #fff;
            text-shadow: 0 0 10px #FFD700;
        }

        /* Slot Machine Frame */
        .slot-machine-frame {
            width: 100%;
            background: linear-gradient(180deg, #2A1B0E 0%, #150E07 100%);
            border: 4px solid #D4AF37;
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(212, 175, 55, 0.3);
            position: relative;
        }
        .reels-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            background: #000;
            border: 2px solid #553c16;
            border-radius: 10px;
            padding: 8px;
            overflow: hidden;
            position: relative;
        }
        .reel-col {
            background: #111;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow: hidden;
            height: 250px;
            position: relative;
        }
        .reel-col .symbol-strip {
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: transform 0.1s linear;
        }
        .symbol-card {
            height: 76px;
            background: linear-gradient(180deg, #222 0%, #161616 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        .symbol-card.winning {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.4), rgba(255, 140, 0, 0.4));
            border: 2px solid #FFD700;
            animation: pulse 0.6s infinite alternate;
        }
        @keyframes pulse {
            from { transform: scale(0.96); box-shadow: 0 0 10px #FFD700; }
            to { transform: scale(1.04); box-shadow: 0 0 20px #FFA500; }
        }

        /* Win Banner */
        .win-display-strip {
            width: 100%;
            height: 40px;
            margin-top: 12px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #FFD700;
            font-size: 15px;
        }

        /* Bet & Controls */
        .controls-card {
            width: 100%;
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            padding: 12px;
            margin-top: 14px;
        }
        .bet-adjust-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .stepper {
            display: flex;
            align-items: center;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .stepper button {
            width: 36px;
            height: 36px;
            background: transparent;
            border: none;
            color: #FFD700;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
        }
        .stepper input {
            width: 70px;
            background: transparent;
            border: none;
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            outline: none;
        }
        .chips-row {
            display: flex;
            gap: 6px;
            margin-bottom: 14px;
            overflow-x: auto;
            padding-bottom: 2px;
        }
        .chips-row button {
            flex: 1;
            padding: 6px 0;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: #ddd;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }
        .chips-row button.active {
            background: #FFD700;
            color: #000;
            border-color: #FFD700;
        }

        /* Spin Action Row */
        .action-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .btn-auto {
            flex: 1;
            padding: 14px 0;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
        }
        .btn-auto.active {
            background: #e74c3c;
            border-color: #e74c3c;
        }
        .btn-spin {
            flex: 2;
            padding: 14px 0;
            background: var(--gold-grad);
            border: none;
            border-radius: 12px;
            color: #000;
            font-family: 'Cinzel', serif;
            font-size: 22px;
            font-weight: 900;
            letter-spacing: 1px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.4);
            transition: all 0.1s ease;
        }
        .btn-spin:active {
            transform: scale(0.96);
        }
        .btn-spin:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <header class="header">
        <a href="/" class="btn-back" onclick="exitSlot(event)">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Lobby
        </a>
        <div class="game-title"><?= htmlspecialchars($gameName) ?></div>
        <div class="balance-box">
            <?= $currency ?> <span id="user-balance"><?= number_format($balance, 2, '.', '') ?></span>
        </div>
    </header>

    <main class="slot-stage">
        <div class="jackpot-banner">
            <div class="jackpot-title">MEGA JACKPOT</div>
            <div class="jackpot-amount"><?= $currency ?> 888,888.00</div>
        </div>

        <div class="slot-machine-frame">
            <div class="reels-container">
                <div class="reel-col" id="reel-0">
                    <div class="symbol-strip" id="strip-0"></div>
                </div>
                <div class="reel-col" id="reel-1">
                    <div class="symbol-strip" id="strip-1"></div>
                </div>
                <div class="reel-col" id="reel-2">
                    <div class="symbol-strip" id="strip-2"></div>
                </div>
            </div>

            <div class="win-display-strip" id="win-display">
                PRESS SPIN TO WIN
            </div>
        </div>

        <div class="controls-card">
            <div class="bet-adjust-row">
                <span style="font-size: 13px; font-weight: 600; color: #aaa;">BET AMOUNT</span>
                <div class="stepper">
                    <button onclick="changeBet(-10)">-</button>
                    <input type="number" id="bet-input" value="50" min="10" step="10">
                    <button onclick="changeBet(10)">+</button>
                </div>
            </div>

            <div class="chips-row">
                <button onclick="setBet(10)">10</button>
                <button onclick="setBet(20)">20</button>
                <button onclick="setBet(50)" class="active">50</button>
                <button onclick="setBet(100)">100</button>
                <button onclick="setBet(200)">200</button>
                <button onclick="setBet(500)">500</button>
            </div>

            <div class="action-row">
                <button class="btn-auto" id="btn-auto" onclick="toggleAutoSpin()">AUTO</button>
                <button class="btn-spin" id="btn-spin" onclick="handleSpin()">SPIN</button>
            </div>
        </div>
    </main>

    <script>
        const USER_TOKEN = "<?= htmlspecialchars($token, ENT_QUOTES, 'UTF-8') ?>";
        const GAME_CODE = "<?= htmlspecialchars($gameCode, ENT_QUOTES, 'UTF-8') ?>";
        const VENDOR_CODE = "<?= htmlspecialchars($vendorCode, ENT_QUOTES, 'UTF-8') ?>";
        const CURRENCY = "<?= $currency ?>";

        const SYMBOLS = ['🍒', '⭐', '🔔', '💰', '👑', '7️⃣', '💎'];
        let currentGrid = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 0, 1]
        ];

        let isSpinning = false;
        let isAutoSpin = false;
        let betAmount = 50;

        // Web Audio Synthesizer for realistic sounds
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playTone(freq, type, duration) {
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch(e) {}
        }
        function soundClick() { playTone(440, 'triangle', 0.05); }
        function soundReelStop() { playTone(180, 'sine', 0.12); }
        function soundWin() {
            setTimeout(() => playTone(523, 'triangle', 0.15), 0);
            setTimeout(() => playTone(659, 'triangle', 0.15), 150);
            setTimeout(() => playTone(784, 'triangle', 0.25), 300);
        }

        // Render current symbols into reels
        function renderReels(grid, winningCoords = []) {
            for (let col = 0; col < 3; col++) {
                const strip = document.getElementById(`strip-${col}`);
                strip.innerHTML = '';
                for (let row = 0; row < 3; row++) {
                    const symIdx = grid[row][col];
                    const card = document.createElement('div');
                    card.className = 'symbol-card';
                    card.id = `cell-${row}-${col}`;
                    card.textContent = SYMBOLS[symIdx] || '🍒';

                    const isWinCell = winningCoords.some(([r, c]) => r === row && c === col);
                    if (isWinCell) card.classList.add('winning');

                    strip.appendChild(card);
                }
            }
        }
        renderReels(currentGrid);

        function changeBet(delta) {
            soundClick();
            betAmount = Math.max(10, betAmount + delta);
            document.getElementById('bet-input').value = betAmount;
            highlightChips();
        }
        function setBet(val) {
            soundClick();
            betAmount = val;
            document.getElementById('bet-input').value = betAmount;
            highlightChips();
        }
        function highlightChips() {
            document.querySelectorAll('.chips-row button').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.textContent) === betAmount);
            });
        }

        function toggleAutoSpin() {
            soundClick();
            isAutoSpin = !isAutoSpin;
            const btn = document.getElementById('btn-auto');
            btn.classList.toggle('active', isAutoSpin);
            btn.textContent = isAutoSpin ? 'STOP' : 'AUTO';
            if (isAutoSpin && !isSpinning) {
                handleSpin();
            }
        }

        async function handleSpin() {
            if (isSpinning) return;
            isSpinning = true;
            document.getElementById('btn-spin').disabled = true;
            document.getElementById('win-display').textContent = 'SPINNING...';

            soundClick();

            // Clear previous win highlights
            document.querySelectorAll('.symbol-card').forEach(c => c.classList.remove('winning'));

            // Animated reel shake
            const intervals = [];
            for (let c = 0; c < 3; c++) {
                const strip = document.getElementById(`strip-${c}`);
                intervals[c] = setInterval(() => {
                    const temp = [
                        Math.floor(Math.random() * SYMBOLS.length),
                        Math.floor(Math.random() * SYMBOLS.length),
                        Math.floor(Math.random() * SYMBOLS.length)
                    ];
                    strip.children[0].textContent = SYMBOLS[temp[0]];
                    strip.children[1].textContent = SYMBOLS[temp[1]];
                    strip.children[2].textContent = SYMBOLS[temp[2]];
                }, 70);
            }

            try {
                const res = await fetch('/api/game/slot_spin.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: USER_TOKEN,
                        game_code: GAME_CODE,
                        vendor_code: VENDOR_CODE,
                        bet_amount: betAmount
                    })
                });
                const result = await res.json();

                // Stop reels progressively
                for (let c = 0; c < 3; c++) {
                    await new Promise(r => setTimeout(r, 250));
                    clearInterval(intervals[c]);
                    soundReelStop();
                }

                if (result.code === 0 && result.data) {
                    const d = result.data;
                    currentGrid = d.reels;
                    document.getElementById('user-balance').textContent = parseFloat(d.wallet_balance).toFixed(2);

                    const winCoords = [];
                    (d.win_lines || []).forEach(wl => winCoords.push(...wl.coords));

                    renderReels(currentGrid, winCoords);

                    if (d.win_amount > 0) {
                        soundWin();
                        document.getElementById('win-display').innerHTML = `🎉 WIN: ${CURRENCY} ${d.win_amount.toFixed(2)} 🎉`;
                    } else {
                        document.getElementById('win-display').textContent = 'BETTER LUCK NEXT SPIN';
                    }
                } else {
                    document.getElementById('win-display').textContent = result.msg || 'Spin error';
                    isAutoSpin = false;
                    document.getElementById('btn-auto').classList.remove('active');
                    document.getElementById('btn-auto').textContent = 'AUTO';
                }
            } catch (err) {
                intervals.forEach(clearInterval);
                document.getElementById('win-display').textContent = 'Connection error';
            } finally {
                isSpinning = false;
                document.getElementById('btn-spin').disabled = false;

                if (isAutoSpin) {
                    setTimeout(() => { if (isAutoSpin) handleSpin(); }, 1200);
                }
            }
        }

        function exitSlot(e) {
            if (e) e.preventDefault();
            if (window.parent && window.parent !== window) {
                window.parent.postMessage('game', '*');
                try { window.top.location.href = '/'; } catch(err) {}
            } else {
                window.location.href = '/';
            }
        }
    </script>
</body>
</html>
