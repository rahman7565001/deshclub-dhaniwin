/**
 * roulette/roulette.js - Royal European Roulette 3D Engine
 * Features: High-fidelity Canvas 3D Wheel Physics, Interactive French/European Felt Betting Table,
 * Zero-latency WebAudio SFX, Statistics & Hot/Cold Analytics, Dual Wallet Integration
 */

(function () {
    'use strict';

    // -------------------------------------------------------------
    // Configuration & State
    // -------------------------------------------------------------
    const CFG = window.RLT_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    let userBalance = parseFloat(CFG.initialBalance) || 0;
    let currentChip = 10;
    let isSpinning = false;
    let isAutoSpin = false;
    let autoSpinTimeout = null;
    let soundEnabled = true;

    // Placed Bets: Key -> { type, target, amount, el }
    const currentBets = new Map();
    let previousBets = null;
    const betHistoryStack = []; // For Undo functionality

    // European Roulette Wheel Sequence (37 Pockets: 0 to 36)
    const WHEEL_NUMBERS = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

    function getNumberColor(num) {
        if (num === 0) return 'green';
        return RED_NUMBERS.has(num) ? 'red' : 'black';
    }

    // -------------------------------------------------------------
    // WebAudio Synthesizer (Zero-latency SFX)
    // -------------------------------------------------------------
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const Sound = {
        chip() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1400, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.07);
            } catch (e) {}
        },
        spin() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.linearRampToValueAtTime(320, now + 1.2);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 2.6);
            } catch (e) {}
        },
        bounce() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
                osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.06);
            } catch (e) {}
        },
        drop() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.17);
            } catch (e) {}
        },
        win() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    gain.gain.setValueAtTime(0.25, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.35);
                    osc.connect(gain);
                    gain.connect(actx.destination);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.4);
                });
            } catch (e) {}
        },
        bigWin() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
                melody.forEach((freq, idx) => {
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.07);
                    gain.gain.setValueAtTime(0.25, now + idx * 0.07);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.6);
                    osc.connect(gain);
                    gain.connect(actx.destination);
                    osc.start(now + idx * 0.07);
                    osc.stop(now + idx * 0.07 + 0.65);
                });
            } catch (e) {}
        },
        click() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(700, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } catch (e) {}
        }
    };

    // -------------------------------------------------------------
    // Canvas Roulette Wheel Physics & 3D Renderer
    // -------------------------------------------------------------
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const WHEEL_SIZE = 400;
    const NUM_SECTORS = 37;
    const SECTOR_ANGLE = (Math.PI * 2) / NUM_SECTORS;

    const wheelState = {
        angle: 0,
        angularVelocity: 0,
        ballAngle: 0,
        ballVelocity: 0,
        ballRadius: 160,
        targetRadius: 160,
        isSettled: true,
        targetNumber: null,
        settleStartTime: 0
    };

    function initWheelCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = WHEEL_SIZE * dpr;
        canvas.height = WHEEL_SIZE * dpr;
        ctx.scale(dpr, dpr);
        drawWheel();
    }

    function drawWheel() {
        const cx = WHEEL_SIZE / 2;
        const cy = WHEEL_SIZE / 2;

        ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

        ctx.save();
        ctx.translate(cx, cy);

        // 1. Outer Mahogany Wooden Rim
        const woodGrad = ctx.createRadialGradient(0, 0, 160, 0, 0, 198);
        woodGrad.addColorStop(0, '#3A1A0B');
        woodGrad.addColorStop(0.7, '#241006');
        woodGrad.addColorStop(1, '#110602');
        ctx.fillStyle = woodGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 198, 0, Math.PI * 2);
        ctx.fill();

        // Outer Gold Trim
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 196, 0, Math.PI * 2);
        ctx.stroke();

        // Brass Deflectors (8 diamonds on rim)
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 8; i++) {
            const ang = (i * Math.PI * 2) / 8;
            ctx.save();
            ctx.rotate(ang);
            ctx.beginPath();
            ctx.moveTo(180, 0);
            ctx.lineTo(186, 3);
            ctx.lineTo(192, 0);
            ctx.lineTo(186, -3);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Silver Ball Track Ring
        ctx.strokeStyle = '#718093';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 168, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Rotating Wheel Core (Pockets & Numbers)
        ctx.save();
        ctx.rotate(wheelState.angle);

        // Pockets Circle
        for (let i = 0; i < NUM_SECTORS; i++) {
            const startAng = i * SECTOR_ANGLE - SECTOR_ANGLE / 2;
            const endAng = startAng + SECTOR_ANGLE;
            const num = WHEEL_NUMBERS[i];
            const color = getNumberColor(num);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 160, startAng, endAng);
            ctx.closePath();

            if (color === 'green') {
                ctx.fillStyle = '#00B894';
            } else if (color === 'red') {
                ctx.fillStyle = '#D63031';
            } else {
                ctx.fillStyle = '#1E272E';
            }
            ctx.fill();

            // Pocket Separator Silver Fret
            ctx.strokeStyle = '#DCDDE1';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Number Text in Sector
            ctx.save();
            ctx.rotate(i * SECTOR_ANGLE);
            ctx.translate(138, 0);
            ctx.rotate(Math.PI / 2);
            ctx.font = 'bold 12px Montserrat, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(num.toString(), 0, 0);
            ctx.restore();
        }

        // Inner Brass Pocket Ring
        const innerRing = ctx.createRadialGradient(0, 0, 90, 0, 0, 115);
        innerRing.addColorStop(0, '#5C4305');
        innerRing.addColorStop(0.5, '#B8860B');
        innerRing.addColorStop(1, '#FFD700');
        ctx.fillStyle = innerRing;
        ctx.beginPath();
        ctx.arc(0, 0, 115, 0, Math.PI * 2);
        ctx.fill();

        // 8 Center Spoke Ridges
        ctx.strokeStyle = '#FFE066';
        ctx.lineWidth = 2.5;
        for (let s = 0; s < 8; s++) {
            const spokeAng = (s * Math.PI * 2) / 8;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(spokeAng) * 115, Math.sin(spokeAng) * 115);
            ctx.stroke();
        }

        ctx.restore(); // Restore Wheel rotation

        // 3. Ivory Ball Rendering
        if (wheelState.ballRadius > 0) {
            const bx = Math.cos(wheelState.ballAngle) * wheelState.ballRadius;
            const by = Math.sin(wheelState.ballAngle) * wheelState.ballRadius;

            // Ball Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.arc(bx + 2, by + 3, 7, 0, Math.PI * 2);
            ctx.fill();

            // 3D Ivory Ball
            const ballGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 7);
            ballGrad.addColorStop(0, '#FFFFFF');
            ballGrad.addColorStop(0.6, '#F5F6FA');
            ballGrad.addColorStop(1, '#DCDDE1');
            ctx.fillStyle = ballGrad;
            ctx.beginPath();
            ctx.arc(bx, by, 7, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    let lastFrameTime = performance.now();
    function animateWheel(now) {
        requestAnimationFrame(animateWheel);
        const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
        lastFrameTime = now;

        if (!wheelState.isSettled) {
            // Decelerate Wheel
            wheelState.angle += wheelState.angularVelocity * dt;
            wheelState.angularVelocity *= 0.992;

            // Decelerate Ball
            wheelState.ballAngle += wheelState.ballVelocity * dt;
            wheelState.ballVelocity *= 0.988;

            // Ball drops inward as it slows
            if (Math.abs(wheelState.ballVelocity) < 4.0 && wheelState.ballRadius > wheelState.targetRadius) {
                wheelState.ballRadius -= 45 * dt;
                if (Math.random() < 0.25) {
                    Sound.bounce();
                }
            }

            // Check if ball has settled into target pocket
            if (Math.abs(wheelState.ballVelocity) < 0.6 && wheelState.targetNumber !== null) {
                // Find target pocket angle in wheel space
                const targetIdx = WHEEL_NUMBERS.indexOf(wheelState.targetNumber);
                const targetPocketAngle = targetIdx * SECTOR_ANGLE;

                // Lock ball to pocket
                wheelState.ballAngle = wheelState.angle + targetPocketAngle;
                wheelState.ballRadius = 138;
                wheelState.isSettled = true;
                wheelState.angularVelocity = 0.08; // Gentle coasting rotation
                wheelState.ballVelocity = 0;

                Sound.drop();
                onSpinSettled(wheelState.targetNumber);
            }
        } else {
            // Gentle continuous idling spin
            wheelState.angle += (wheelState.angularVelocity || 0.1) * dt;
            if (wheelState.targetNumber !== null) {
                const targetIdx = WHEEL_NUMBERS.indexOf(wheelState.targetNumber);
                wheelState.ballAngle = wheelState.angle + targetIdx * SECTOR_ANGLE;
            }
        }

        drawWheel();
    }

    // -------------------------------------------------------------
    // Betting Grid Builder & Table Logic
    // -------------------------------------------------------------
    function buildNumbersGrid() {
        const grid = document.getElementById('numbers-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Standard 3x12 European Roulette Grid:
        // Row 1: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36
        // Row 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35
        // Row 3: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34
        const rows = [
            [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
            [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
            [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
        ];

        rows.forEach((rowNums, rowIdx) => {
            rowNums.forEach((num, colIdx) => {
                const color = getNumberColor(num);
                const cell = document.createElement('div');
                cell.className = 'felt-cell ' + color;
                cell.dataset.type = 'straight';
                cell.dataset.target = num;
                cell.innerHTML = `<span>${num}</span><div class="chip-stack" id="chip-straight-${num}"></div>`;
                grid.appendChild(cell);
            });
        });
    }

    function initTableListeners() {
        const table = document.getElementById('felt-table');
        if (!table) return;

        table.addEventListener('click', (e) => {
            if (isSpinning) return;
            const cell = e.target.closest('.felt-cell');
            if (!cell) return;

            getAudioContext();
            const type = cell.dataset.type;
            const target = cell.dataset.target;
            if (type && target !== undefined) {
                placeBet(type, target, currentChip);
            }
        });

        // Hover highlight matching numbers
        table.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('.felt-cell');
            if (!cell) return;
            highlightLinkedNumbers(cell.dataset.type, cell.dataset.target);
        });

        table.addEventListener('mouseout', () => {
            clearHighlights();
        });
    }

    function highlightLinkedNumbers(type, target) {
        clearHighlights();
        if (!type || target === undefined) return;

        const cells = document.querySelectorAll('.numbers-grid .felt-cell');
        cells.forEach(c => {
            const n = parseInt(c.dataset.target, 10);
            let match = false;

            if (type === 'straight' && n === parseInt(target, 10)) match = true;
            else if (type === 'red' && getNumberColor(n) === 'red') match = true;
            else if (type === 'black' && getNumberColor(n) === 'black') match = true;
            else if (type === 'even' && n > 0 && n % 2 === 0) match = true;
            else if (type === 'odd' && n > 0 && n % 2 === 1) match = true;
            else if (type === 'low' && n >= 1 && n <= 18) match = true;
            else if (type === 'high' && n >= 19 && n <= 36) match = true;
            else if (type === 'dozen1' && n >= 1 && n <= 12) match = true;
            else if (type === 'dozen2' && n >= 13 && n <= 24) match = true;
            else if (type === 'dozen3' && n >= 25 && n <= 36) match = true;
            else if (type === 'col1' && n % 3 === 1) match = true;
            else if (type === 'col2' && n % 3 === 2) match = true;
            else if (type === 'col3' && n % 3 === 0) match = true;

            if (match) c.classList.add('highlight');
        });

        if (type === 'straight' && target === '0') {
            const zeroCell = document.querySelector('.zero-cell');
            if (zeroCell) zeroCell.classList.add('highlight');
        }
    }

    function clearHighlights() {
        document.querySelectorAll('.felt-cell.highlight').forEach(el => el.classList.remove('highlight'));
    }

    // -------------------------------------------------------------
    // Bet Placement & Stack Management
    // -------------------------------------------------------------
    function placeBet(type, target, amount) {
        const betKey = type + '_' + target;
        const totalPlaced = getTotalBet();

        if (userBalance < totalPlaced + amount) {
            flashStatus('INSUFFICIENT BALANCE!');
            return;
        }

        Sound.chip();

        if (currentBets.has(betKey)) {
            const b = currentBets.get(betKey);
            b.amount += amount;
        } else {
            currentBets.set(betKey, {
                type: type,
                target: target,
                amount: amount
            });
        }

        // Push to history for Undo
        betHistoryStack.push({ type, target, amount });

        renderChipStack(type, target);
        updateSummaryUI();
    }

    function renderChipStack(type, target) {
        const betKey = type + '_' + target;
        let stackId = 'chip-' + type;
        if (type === 'straight') {
            stackId = 'chip-straight-' + target;
        }

        const stackEl = document.getElementById(stackId);
        if (!stackEl) return;

        stackEl.innerHTML = '';
        if (currentBets.has(betKey)) {
            const b = currentBets.get(betKey);
            const chipDiv = document.createElement('div');
            chipDiv.className = 'placed-chip ' + getChipClass(b.amount);
            chipDiv.textContent = formatChipText(b.amount);
            stackEl.appendChild(chipDiv);
        }
    }

    function getChipClass(amt) {
        if (amt >= 1000) return 'chip-1000';
        if (amt >= 500) return 'chip-500';
        if (amt >= 100) return 'chip-100';
        if (amt >= 50) return 'chip-50';
        if (amt >= 10) return 'chip-10';
        if (amt >= 5) return 'chip-5';
        return 'chip-1';
    }

    function formatChipText(amt) {
        if (amt >= 1000) return (amt / 1000).toFixed(amt % 1000 !== 0 ? 1 : 0) + 'K';
        return amt.toString();
    }

    function getTotalBet() {
        let sum = 0;
        for (const b of currentBets.values()) {
            sum += b.amount;
        }
        return sum;
    }

    function updateSummaryUI() {
        const total = getTotalBet();
        const totalEl = document.getElementById('total-bet-val');
        if (totalEl) totalEl.textContent = CFG.currency + ' ' + total.toFixed(2);

        const balEl = document.getElementById('user-balance');
        if (balEl) balEl.textContent = (userBalance - total).toFixed(2);
    }

    // -------------------------------------------------------------
    // Bet Controls (Undo, Clear, Double, Rebet)
    // -------------------------------------------------------------
    window.undoLastBet = function () {
        if (isSpinning || betHistoryStack.length === 0) return;
        Sound.click();

        const lastAction = betHistoryStack.pop();
        const betKey = lastAction.type + '_' + lastAction.target;

        if (currentBets.has(betKey)) {
            const b = currentBets.get(betKey);
            b.amount -= lastAction.amount;
            if (b.amount <= 0) {
                currentBets.delete(betKey);
            }
            renderChipStack(lastAction.type, lastAction.target);
            updateSummaryUI();
        }
    };

    window.clearAllBets = function () {
        if (isSpinning) return;
        Sound.click();

        for (const [key, b] of currentBets.entries()) {
            let stackId = 'chip-' + b.type;
            if (b.type === 'straight') stackId = 'chip-straight-' + b.target;
            const el = document.getElementById(stackId);
            if (el) el.innerHTML = '';
        }

        currentBets.clear();
        betHistoryStack.length = 0;
        updateSummaryUI();
    };

    window.doubleAllBets = function () {
        if (isSpinning || currentBets.size === 0) return;
        const currentTotal = getTotalBet();
        if (userBalance < currentTotal * 2) {
            flashStatus('INSUFFICIENT BALANCE TO DOUBLE!');
            return;
        }

        Sound.chip();
        for (const b of currentBets.values()) {
            b.amount *= 2;
            renderChipStack(b.type, b.target);
        }
        updateSummaryUI();
    };

    window.rebetPrevious = function () {
        if (isSpinning || !previousBets || previousBets.length === 0) return;
        clearAllBets();

        let needed = 0;
        previousBets.forEach(pb => needed += pb.amount);
        if (userBalance < needed) {
            flashStatus('INSUFFICIENT BALANCE TO REBET!');
            return;
        }

        Sound.chip();
        previousBets.forEach(pb => {
            placeBet(pb.type, pb.target, pb.amount);
        });
    };

    // -------------------------------------------------------------
    // Chips Selector
    // -------------------------------------------------------------
    function initChipsTray() {
        const chips = document.querySelectorAll('.chips-tray .chip');
        chips.forEach(c => {
            c.addEventListener('click', () => {
                Sound.click();
                chips.forEach(item => item.classList.remove('active'));
                c.classList.add('active');
                currentChip = parseInt(c.dataset.val, 10) || 10;
            });
        });
    }

    // -------------------------------------------------------------
    // Spin Execution & Server Communication
    // -------------------------------------------------------------
    window.startSpin = async function () {
        if (isSpinning) return;
        getAudioContext();

        const totalStake = getTotalBet();
        if (totalStake <= 0) {
            flashStatus('PLACE YOUR BETS FIRST!');
            return;
        }

        if (userBalance < totalStake) {
            flashStatus('INSUFFICIENT BALANCE!');
            return;
        }

        // Store previous bets for Rebet
        previousBets = Array.from(currentBets.values()).map(b => ({ ...b }));

        // Lock UI
        isSpinning = true;
        const btnSpin = document.getElementById('btn-spin');
        if (btnSpin) btnSpin.classList.add('spinning');
        hideWinSpotlight();
        setStatus('WHEEL SPINNING...');

        // Start Wheel Motion
        Sound.spin();
        wheelState.isSettled = false;
        wheelState.targetNumber = null;
        wheelState.angularVelocity = -4.8; // Counter-clockwise wheel spin
        wheelState.ballVelocity = 16.5;    // Fast clockwise ball spin
        wheelState.ballRadius = 168;       // Outer rim track
        wheelState.targetRadius = 138;     // Pockets track

        // Prepare Payload
        const betsPayload = Array.from(currentBets.values()).map(b => ({
            type: b.type,
            target: b.target,
            amount: b.amount
        }));

        try {
            const resp = await fetch('/api/roulette/spin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + CFG.token
                },
                body: JSON.stringify({
                    token: CFG.token,
                    bets: betsPayload
                })
            });

            const res = await resp.json();
            if (res.code === 0 && res.data) {
                const d = res.data;
                // Inform wheel physics of target number
                setTimeout(() => {
                    wheelState.targetNumber = d.winning_number;
                    wheelState.latestSpinData = d;
                }, 1200);
            } else {
                flashStatus(res.msg || 'Spin failed!');
                isSpinning = false;
                if (btnSpin) btnSpin.classList.remove('spinning');
            }
        } catch (err) {
            console.error('Spin API error:', err);
            flashStatus('Network error! Please retry.');
            isSpinning = false;
            if (btnSpin) btnSpin.classList.remove('spinning');
        }
    };

    function onSpinSettled(winningNum) {
        isSpinning = false;
        const btnSpin = document.getElementById('btn-spin');
        if (btnSpin) btnSpin.classList.remove('spinning');

        const d = wheelState.latestSpinData;
        if (!d) return;

        const winColor = d.winning_color;
        const totalPayout = d.total_payout;
        userBalance = d.wallet_balance;

        // Display winning spotlight
        showWinSpotlight(winningNum, winColor);
        setStatus('WINNING NUMBER: ' + winningNum + ' ' + winColor.toUpperCase());

        // Update Last Win display
        const lastWinEl = document.getElementById('last-win-val');
        if (lastWinEl) lastWinEl.textContent = CFG.currency + ' ' + totalPayout.toFixed(2);

        // Update Balance
        const balEl = document.getElementById('user-balance');
        if (balEl) balEl.textContent = userBalance.toFixed(2);

        // Sound & Celebration
        if (totalPayout > 0) {
            if (totalPayout >= d.total_stake * 10) {
                Sound.bigWin();
                openCelebration('BIG WIN!', winningNum, winColor, totalPayout, 'ROYAL PAYOUT!');
            } else {
                Sound.win();
            }
        }

        // Prepend to Recent Numbers strip
        prependRecentNumber(winningNum, winColor);

        // Clear bets from table for next round
        setTimeout(() => {
            clearAllBets();
            syncStats();

            // Auto Spin next trigger
            if (isAutoSpin) {
                autoSpinTimeout = setTimeout(() => {
                    if (isAutoSpin && previousBets && previousBets.length > 0) {
                        rebetPrevious();
                        startSpin();
                    }
                }, 2800);
            }
        }, 1500);
    }

    // -------------------------------------------------------------
    // UI Spotlights & Status Banners
    // -------------------------------------------------------------
    function setStatus(txt) {
        const el = document.getElementById('status-text');
        if (el) el.textContent = txt;
    }

    function flashStatus(txt) {
        setStatus(txt);
        setTimeout(() => {
            if (!isSpinning) setStatus('PLACE YOUR BETS');
        }, 3000);
    }

    function showWinSpotlight(num, color) {
        const spot = document.getElementById('win-spotlight');
        const circ = document.getElementById('spotlight-circle');
        const desc = document.getElementById('spotlight-desc');

        if (spot && circ && desc) {
            circ.textContent = num;
            circ.className = 'win-circle ' + color;
            desc.textContent = color.toUpperCase();
            spot.classList.add('active');
        }
    }

    function hideWinSpotlight() {
        const spot = document.getElementById('win-spotlight');
        if (spot) spot.classList.remove('active');
    }

    function prependRecentNumber(num, color) {
        const container = document.getElementById('history-scroll');
        if (!container) return;
        const badge = document.createElement('span');
        badge.className = 'badge-num ' + color;
        badge.textContent = num;
        container.insertBefore(badge, container.firstChild);
        if (container.children.length > 20) {
            container.removeChild(container.lastChild);
        }
    }

    // -------------------------------------------------------------
    // Auto Spin
    // -------------------------------------------------------------
    window.toggleAutoSpin = function () {
        Sound.click();
        isAutoSpin = !isAutoSpin;
        const btn = document.getElementById('btn-auto');
        if (btn) btn.classList.toggle('active', isAutoSpin);

        if (isAutoSpin) {
            if (!isSpinning) {
                if (getTotalBet() > 0) {
                    startSpin();
                } else if (previousBets && previousBets.length > 0) {
                    rebetPrevious();
                    startSpin();
                } else {
                    flashStatus('PLACE BETS TO START AUTO SPIN');
                }
            }
        } else {
            if (autoSpinTimeout) {
                clearTimeout(autoSpinTimeout);
                autoSpinTimeout = null;
            }
        }
    };

    // -------------------------------------------------------------
    // Celebration Modal
    // -------------------------------------------------------------
    function openCelebration(badge, num, color, amount, subtitle) {
        const modal = document.getElementById('celebration-modal');
        const bEl = document.getElementById('celeb-badge');
        const nEl = document.getElementById('celeb-number');
        const aEl = document.getElementById('celeb-amount');
        const sEl = document.getElementById('celeb-sub');

        if (modal) {
            if (bEl) bEl.textContent = badge;
            if (nEl) {
                nEl.textContent = num;
                nEl.className = 'win-number-display ' + color;
            }
            if (aEl) aEl.textContent = '+' + CFG.currency + parseFloat(amount).toFixed(2);
            if (sEl) sEl.textContent = subtitle;
            modal.classList.add('active');
        }
    }

    window.closeCelebration = function () {
        Sound.click();
        const modal = document.getElementById('celebration-modal');
        if (modal) modal.classList.remove('active');
    };

    // -------------------------------------------------------------
    // Modals (Stats & Rules)
    // -------------------------------------------------------------
    window.closeModal = function (id) {
        Sound.click();
        const m = document.getElementById(id);
        if (m) m.classList.remove('active');
    };

    function initHeaderButtons() {
        const btnLobby = document.getElementById('btn-lobby');
        if (btnLobby) {
            btnLobby.addEventListener('click', () => {
                Sound.click();
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/#/home';
                }
            });
        }

        const btnSound = document.getElementById('btn-sound');
        if (btnSound) {
            btnSound.addEventListener('click', () => {
                soundEnabled = !soundEnabled;
                btnSound.textContent = soundEnabled ? '🔊' : '🔇';
                Sound.click();
            });
        }

        const btnStats = document.getElementById('btn-stats');
        if (btnStats) {
            btnStats.addEventListener('click', () => {
                Sound.click();
                syncStats();
                const m = document.getElementById('stats-modal');
                if (m) m.classList.add('active');
            });
        }

        const btnInfo = document.getElementById('btn-info');
        if (btnInfo) {
            btnInfo.addEventListener('click', () => {
                Sound.click();
                const m = document.getElementById('rules-modal');
                if (m) m.classList.add('active');
            });
        }

        const balBox = document.getElementById('balance-box');
        if (balBox) {
            balBox.addEventListener('click', () => {
                balBox.classList.add('refreshing');
                syncState().finally(() => {
                    setTimeout(() => balBox.classList.remove('refreshing'), 600);
                });
            });
        }
    }

    // -------------------------------------------------------------
    // State & Statistics Synchronization
    // -------------------------------------------------------------
    async function syncState() {
        try {
            const resp = await fetch('/api/roulette/state.php?token=' + encodeURIComponent(CFG.token));
            const json = await resp.json();
            if (json.code === 0 && json.data) {
                userBalance = json.data.wallet_balance;
                const balEl = document.getElementById('user-balance');
                if (balEl) balEl.textContent = userBalance.toFixed(2);
                renderStats(json.data.stats);
            }
        } catch (e) {}
    }

    async function syncStats() {
        try {
            const resp = await fetch('/api/roulette/state.php?token=' + encodeURIComponent(CFG.token));
            const json = await resp.json();
            if (json.code === 0 && json.data && json.data.stats) {
                renderStats(json.data.stats);
            }
        } catch (e) {}
    }

    function renderStats(stats) {
        if (!stats) return;

        // Render Recent Strip
        if (stats.recent && Array.isArray(stats.recent)) {
            const container = document.getElementById('history-scroll');
            if (container) {
                container.innerHTML = '';
                stats.recent.forEach(r => {
                    const badge = document.createElement('span');
                    badge.className = 'badge-num ' + r.color;
                    badge.textContent = r.number;
                    container.appendChild(badge);
                });
            }
        }

        // Render Percentages
        if (stats.percentages) {
            const p = stats.percentages;
            const bRed = document.getElementById('bar-red');
            const bBlk = document.getElementById('bar-black');
            const bGrn = document.getElementById('bar-green');
            const bEvn = document.getElementById('bar-even');
            const bOdd = document.getElementById('bar-odd');

            if (bRed) { bRed.style.width = p.red + '%'; bRed.textContent = p.red + '%'; }
            if (bBlk) { bBlk.style.width = p.black + '%'; bBlk.textContent = p.black + '%'; }
            if (bGrn) { bGrn.style.width = p.green + '%'; bGrn.textContent = p.green + '%'; }
            if (bEvn) { bEvn.style.width = p.even + '%'; bEvn.textContent = 'EVEN ' + p.even + '%'; }
            if (bOdd) { bOdd.style.width = p.odd + '%'; bOdd.textContent = 'ODD ' + p.odd + '%'; }
        }

        // Render Hot & Cold Lists
        const hotList = document.getElementById('hot-list');
        const coldList = document.getElementById('cold-list');

        if (hotList && stats.hot) {
            hotList.innerHTML = '';
            stats.hot.forEach(h => {
                const b = document.createElement('span');
                b.className = 'badge-num ' + h.color;
                b.textContent = h.number;
                b.title = 'Hit ' + h.hits + ' times';
                hotList.appendChild(b);
            });
        }

        if (coldList && stats.cold) {
            coldList.innerHTML = '';
            stats.cold.forEach(c => {
                const b = document.createElement('span');
                b.className = 'badge-num ' + c.color;
                b.textContent = c.number;
                b.title = 'Hit ' + c.hits + ' times';
                coldList.appendChild(b);
            });
        }
    }

    // -------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------
    function init() {
        initWheelCanvas();
        buildNumbersGrid();
        initTableListeners();
        initChipsTray();
        initHeaderButtons();
        updateSummaryUI();
        syncState();

        requestAnimationFrame(animateWheel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
