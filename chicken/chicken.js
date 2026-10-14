// chicken.js - Chicken Road 1 Client Logic & Web Audio Synthesizer
(function () {
    'use strict';

    // Game State
    let userToken = window.CHICKEN_TOKEN || '';
    let currentDifficulty = 'medium';
    let currentStake = 100;
    let walletBalance = 0;
    let activeRound = null;
    let isBusy = false;
    let soundEnabled = localStorage.getItem('chicken_sound') !== 'false';

    let diffMultipliers = {
        easy: { 1: 1.04, 2: 1.09, 3: 1.15, 4: 1.22, 5: 1.30, 6: 1.40, 7: 1.52, 8: 1.66, 9: 1.83, 10: 2.05, 11: 2.32, 12: 2.68, 13: 3.15, 14: 3.80, 15: 4.70, 16: 6.00, 17: 8.00, 18: 11.50, 19: 18.00, 20: 30.00 },
        medium: { 1: 1.15, 2: 1.35, 3: 1.62, 4: 1.98, 5: 2.45, 6: 3.10, 7: 4.00, 8: 5.30, 9: 7.20, 10: 10.00, 11: 14.50, 12: 22.00, 13: 35.00, 14: 60.00, 15: 110.00, 16: 220.00, 17: 450.00, 18: 900.00, 19: 2000.00, 20: 5000.00 },
        hard: { 1: 1.45, 2: 2.15, 3: 3.25, 4: 5.00, 5: 8.00, 6: 13.50, 7: 23.50, 8: 42.00, 9: 80.00, 10: 160.00, 11: 330.00, 12: 700.00, 13: 1600.00, 14: 3800.00, 15: 9500.00, 16: 25000.00 },
        daredevil: { 1: 1.90, 2: 3.75, 3: 7.50, 4: 15.20, 5: 32.00, 6: 70.00, 7: 160.00, 8: 380.00, 9: 950.00, 10: 2500.00, 11: 7000.00, 12: 20000.00 }
    };

    // DOM Elements
    const walletBalanceEl = document.getElementById('wallet-balance-val');
    const stakeInput = document.getElementById('stake-input');
    const historyList = document.getElementById('history-pills-list');
    const lanesWrapper = document.getElementById('lanes-wrapper');
    const roadTrack = document.getElementById('road-track');
    const chickenChar = document.getElementById('chicken-char');
    const roastedOverlay = document.getElementById('roasted-overlay');
    const winOverlay = document.getElementById('win-overlay');
    const winMultText = document.getElementById('win-mult-text');
    const winAmountText = document.getElementById('win-amount-text');
    const liveCurrentMult = document.getElementById('live-current-mult');
    const liveNextMult = document.getElementById('live-next-mult');
    const btnStart = document.getElementById('btn-start-game');
    const btnStartSub = document.getElementById('btn-start-sub');
    const playingActionsGroup = document.getElementById('playing-actions');
    const btnStepForward = document.getElementById('btn-step-forward');
    const btnStepSub = document.getElementById('btn-step-sub');
    const btnCashout = document.getElementById('btn-cashout');
    const btnCashoutSub = document.getElementById('btn-cashout-sub');
    const soundBtn = document.getElementById('sound-btn');
    const soundIcon = document.getElementById('sound-icon');
    const toastEl = document.getElementById('game-toast');

    // ----------------------------------------------------------------------
    // Web Audio Synthesizer (Zero-Asset Sound Effects)
    // ----------------------------------------------------------------------
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    function playHopSound() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
    }

    function playCoinSound() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [987.77, 1318.51]; // B5, E6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
            gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.06 + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.06);
            osc.stop(ctx.currentTime + idx * 0.06 + 0.19);
        });
    }

    function playCluckSound() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        // Two quick comic squawks
        [0, 0.08].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(420, ctx.currentTime + delay);
            osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + delay + 0.06);
            gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.06);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.07);
        });
    }

    function playRoastedSound() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        // Slide whistle down + noise explosion
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.46);
    }

    function playWinFanfare() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
            gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.09 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.09);
            osc.stop(ctx.currentTime + idx * 0.09 + 0.36);
        });
    }

    function playClickSound() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    }

    window.toggleSound = function () {
        soundEnabled = !soundEnabled;
        localStorage.setItem('chicken_sound', soundEnabled ? 'true' : 'false');
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled) playClickSound();
    };
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';

    // ----------------------------------------------------------------------
    // UI Notification Toast
    // ----------------------------------------------------------------------
    let toastTimeout = null;
    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2500);
    }

    // ----------------------------------------------------------------------
    // Render Road Lanes
    // ----------------------------------------------------------------------
    function renderLanes() {
        lanesWrapper.innerHTML = '';
        const mults = diffMultipliers[currentDifficulty] || diffMultipliers.medium;
        const total = Object.keys(mults).length;

        // Render from step 1 up to total
        for (let i = 1; i <= total; i++) {
            const laneDiv = document.createElement('div');
            laneDiv.className = 'road-lane';
            laneDiv.id = `lane-${i}`;
            laneDiv.dataset.step = i;

            const mVal = mults[i].toFixed(2) + 'x';
            laneDiv.innerHTML = `
                <div class="lane-num-badge">STEP ${i}</div>
                <div class="lane-tiles-group">
                    <div class="lane-tile tile-0"></div>
                    <div class="lane-tile tile-1"></div>
                    <div class="lane-tile tile-2"></div>
                </div>
                <div class="lane-mult-badge">${mVal}</div>
            `;
            lanesWrapper.appendChild(laneDiv);
        }

        updateLanesVisuals();
    }

    function updateLanesVisuals() {
        const mults = diffMultipliers[currentDifficulty] || diffMultipliers.medium;
        const total = Object.keys(mults).length;
        const curStep = activeRound ? activeRound.current_step : 0;

        for (let i = 1; i <= total; i++) {
            const lane = document.getElementById(`lane-${i}`);
            if (!lane) continue;

            lane.classList.remove('passed-safe', 'current-target', 'crashed-trap');

            if (i <= curStep) {
                lane.classList.add('passed-safe');
            } else if (activeRound && i === curStep + 1) {
                lane.classList.add('current-target');
            }
        }

        // Position Chicken Character
        positionChicken(curStep);

        // Update Multiplier Strip
        if (activeRound && activeRound.status === 'playing') {
            const curMult = (activeRound.current_multiplier || 1.00).toFixed(2) + 'x';
            const nextMult = (mults[curStep + 1] || activeRound.current_multiplier).toFixed(2) + 'x';
            liveCurrentMult.textContent = curMult;
            liveNextMult.textContent = nextMult;
        } else {
            liveCurrentMult.textContent = '1.00x';
            const firstMult = (mults[1] || 1.15).toFixed(2) + 'x';
            liveNextMult.textContent = firstMult;
        }
    }

    function positionChicken(step) {
        if (!chickenChar) return;

        if (step === 0) {
            // At start lane
            chickenChar.style.bottom = '24px';
            roadTrack.scrollTo({ top: roadTrack.scrollHeight, behavior: 'smooth' });
            return;
        }

        const lane = document.getElementById(`lane-${step}`);
        if (lane) {
            const laneBottom = lane.offsetTop + lane.offsetHeight;
            const trackHeight = roadTrack.scrollHeight;
            const targetBottom = trackHeight - laneBottom + (lane.offsetHeight / 2) - 10;
            chickenChar.style.bottom = `${targetBottom}px`;

            // Scroll so current step is nicely framed
            const scrollPos = lane.offsetTop - (roadTrack.clientHeight / 2) + 40;
            roadTrack.scrollTo({ top: Math.max(0, scrollPos), behavior: 'smooth' });
        }
    }

    // ----------------------------------------------------------------------
    // Game Controls & Bet Handling
    // ----------------------------------------------------------------------
    window.setDifficulty = function (diff) {
        if (activeRound && activeRound.status === 'playing') {
            showToast('Finish or cash out current round first!');
            return;
        }
        playClickSound();
        currentDifficulty = diff;
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.diff === diff);
        });
        renderLanes();
    };

    window.adjustStake = function (delta) {
        if (activeRound && activeRound.status === 'playing') return;
        playClickSound();
        currentStake = Math.max(10, currentStake + delta);
        stakeInput.value = currentStake;
        updateChipsUI();
        updateStartButtonUI();
    };

    window.setStake = function (amt) {
        if (activeRound && activeRound.status === 'playing') return;
        playClickSound();
        currentStake = amt;
        stakeInput.value = currentStake;
        updateChipsUI();
        updateStartButtonUI();
    };

    window.onStakeInputChange = function () {
        const val = parseInt(stakeInput.value);
        currentStake = (!isNaN(val) && val >= 10) ? val : 10;
        stakeInput.value = currentStake;
        updateChipsUI();
        updateStartButtonUI();
    };

    function updateChipsUI() {
        document.querySelectorAll('.chip-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.textContent) === currentStake);
        });
    }

    function updateStartButtonUI() {
        if (btnStartSub) {
            btnStartSub.textContent = `৳ ${currentStake.toFixed(2)}`;
        }
    }

    function updateControlPanels() {
        if (activeRound && activeRound.status === 'playing') {
            btnStart.style.display = 'none';
            playingActionsGroup.style.display = 'flex';

            const curStep = activeRound.current_step;
            const mults = diffMultipliers[activeRound.difficulty] || diffMultipliers.medium;
            const nextMult = (mults[curStep + 1] || activeRound.current_multiplier).toFixed(2);
            btnStepSub.textContent = `Next: ${nextMult}x`;

            const cashoutAmt = (activeRound.stake * activeRound.current_multiplier).toFixed(2);
            btnCashoutSub.textContent = `৳ ${cashoutAmt}`;

            // Can only cash out after at least step 1
            btnCashout.disabled = (curStep === 0);
        } else {
            btnStart.style.display = 'flex';
            playingActionsGroup.style.display = 'none';
            updateStartButtonUI();
        }
    }

    // ----------------------------------------------------------------------
    // API Server Communications
    // ----------------------------------------------------------------------
    async function fetchState() {
        try {
            const res = await fetch(`/api/chicken/state.php?token=${encodeURIComponent(userToken)}`);
            const json = await res.json();
            if (json.code === 0 && json.data) {
                const d = json.data;
                walletBalance = parseFloat(d.wallet_balance) || 0;
                walletBalanceEl.textContent = walletBalance.toFixed(2);

                if (d.active_round && d.active_round.status === 'playing') {
                    activeRound = d.active_round;
                    currentDifficulty = activeRound.difficulty;
                    currentStake = activeRound.stake;
                    stakeInput.value = currentStake;

                    document.querySelectorAll('.diff-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.diff === currentDifficulty);
                    });
                }

                if (d.history && Array.isArray(d.history)) {
                    renderHistoryPills(d.history);
                }

                renderLanes();
                updateControlPanels();
            }
        } catch (e) {
            console.error('State load error:', e);
        }
    }

    function renderHistoryPills(list) {
        historyList.innerHTML = '';
        list.slice(0, 15).forEach(item => {
            const mult = parseFloat(item.multiplier) || 1.0;
            const pill = document.createElement('div');
            pill.className = 'history-pill' + (mult >= 10.0 ? ' mega' : mult >= 3.0 ? ' high' : '');
            pill.textContent = mult.toFixed(2) + 'x';
            historyList.appendChild(pill);
        });
    }

    window.refreshWalletBalance = async function () {
        playClickSound();
        await fetchState();
        showToast('Balance updated');
    };

    // ----------------------------------------------------------------------
    // Game Actions (Start, Step, Cashout)
    // ----------------------------------------------------------------------
    window.handleStartGame = async function () {
        if (isBusy) return;
        if (walletBalance < currentStake) {
            showToast('Insufficient wallet balance. Please recharge.');
            return;
        }

        isBusy = true;
        btnStart.disabled = true;
        playClickSound();

        try {
            const res = await fetch('/api/chicken/start.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: userToken,
                    stake: currentStake,
                    difficulty: currentDifficulty
                })
            });
            const json = await res.json();

            if (json.code === 0 && json.data) {
                activeRound = json.data;
                walletBalance = parseFloat(json.data.wallet_balance);
                walletBalanceEl.textContent = walletBalance.toFixed(2);

                playCluckSound();
                renderLanes();
                updateControlPanels();
                showToast('Game started! Hop carefully!');
            } else {
                showToast(json.msg || 'Failed to start game');
            }
        } catch (e) {
            showToast('Network error');
        } finally {
            isBusy = false;
            btnStart.disabled = false;
        }
    };

    window.handleStepForward = async function () {
        if (isBusy || !activeRound || activeRound.status !== 'playing') return;

        isBusy = true;
        btnStepForward.disabled = true;

        playHopSound();
        chickenChar.classList.add('hopping');
        setTimeout(() => chickenChar.classList.remove('hopping'), 350);

        try {
            const res = await fetch('/api/chicken/step.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: userToken,
                    round_uuid: activeRound.round_uuid,
                    lane: 1
                })
            });
            const json = await res.json();

            if (json.code === 0 && json.data) {
                const d = json.data;

                if (!d.is_safe) {
                    // Crashed / Roasted!
                    handleChickenRoasted(d.step);
                } else if (d.is_finished) {
                    // Completed full highway!
                    activeRound.current_step = d.step;
                    activeRound.current_multiplier = d.multiplier;
                    updateLanesVisuals();
                    handleChickenWin(d.multiplier, d.payout, d.wallet_balance);
                } else {
                    // Safe step!
                    activeRound.current_step = d.step;
                    activeRound.current_multiplier = d.multiplier;

                    playCoinSound();
                    updateLanesVisuals();
                    updateControlPanels();
                }
            } else {
                showToast(json.msg || 'Step error');
            }
        } catch (e) {
            showToast('Connection error');
        } finally {
            isBusy = false;
            btnStepForward.disabled = false;
        }
    };

    function handleChickenRoasted(step) {
        playRoastedSound();

        const lane = document.getElementById(`lane-${step}`);
        if (lane) {
            lane.classList.add('crashed-trap');
        }

        roastedOverlay.style.display = 'flex';
        activeRound = null;
        updateControlPanels();

        setTimeout(() => {
            roastedOverlay.style.display = 'none';
            renderLanes();
        }, 2500);
    }

    window.handleCashout = async function () {
        if (isBusy || !activeRound || activeRound.status !== 'playing') return;
        if (activeRound.current_step <= 0) return;

        isBusy = true;
        btnCashout.disabled = true;

        try {
            const res = await fetch('/api/chicken/cashout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: userToken,
                    round_uuid: activeRound.round_uuid
                })
            });
            const json = await res.json();

            if (json.code === 0 && json.data) {
                const d = json.data;
                handleChickenWin(d.multiplier, d.payout, d.wallet_balance);
            } else {
                showToast(json.msg || 'Cashout error');
            }
        } catch (e) {
            showToast('Network error');
        } finally {
            isBusy = false;
            btnCashout.disabled = false;
        }
    };

    function handleChickenWin(mult, payout, newBal) {
        playWinFanfare();

        winMultText.textContent = `${parseFloat(mult).toFixed(2)}x`;
        winAmountText.textContent = `৳ ${parseFloat(payout).toFixed(2)}`;
        winOverlay.style.display = 'flex';

        if (typeof newBal !== 'undefined') {
            walletBalance = parseFloat(newBal);
            walletBalanceEl.textContent = walletBalance.toFixed(2);
        }

        activeRound = null;
        updateControlPanels();

        // Prepend to history ticker
        const pill = document.createElement('div');
        pill.className = 'history-pill' + (mult >= 10.0 ? ' mega' : mult >= 3.0 ? ' high' : '');
        pill.textContent = `${parseFloat(mult).toFixed(2)}x`;
        historyList.insertBefore(pill, historyList.firstChild);
    }

    window.dismissWinOverlay = function () {
        playClickSound();
        winOverlay.style.display = 'none';
        renderLanes();
    };

    // Keyboard shortcuts for convenience
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (activeRound && activeRound.status === 'playing') {
                handleStepForward();
            } else {
                handleStartGame();
            }
        } else if (e.code === 'KeyC') {
            if (activeRound && activeRound.status === 'playing' && activeRound.current_step > 0) {
                handleCashout();
            }
        }
    });

    // Boot
    fetchState();
})();
