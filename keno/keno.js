/**
 * keno/keno.js - Instant Keno Vegas Digital Lottery Arcade Client
 */

(function () {
    'use strict';

    const cfg = window.KENO_CONFIG || {};
    let userBalance = Number(cfg.initialBalance || 0);
    const currency = cfg.currency || '৳';
    const token = cfg.token || '';

    // Standard Authentic Keno Paytables for Picks 1 to 10
    const PAYTABLES = {
        1: { 1: 3.84 },
        2: { 1: 1.0, 2: 9.0 },
        3: { 2: 2.5, 3: 46.0 },
        4: { 2: 1.5, 3: 8.0, 4: 90.0 },
        5: { 3: 3.0, 4: 12.0, 5: 300.0 },
        6: { 3: 2.0, 4: 6.0, 5: 50.0, 6: 800.0 },
        7: { 3: 1.5, 4: 3.5, 5: 15.0, 6: 120.0, 7: 2000.0 },
        8: { 4: 2.5, 5: 8.0, 6: 60.0, 7: 400.0, 8: 5000.0 },
        9: { 4: 2.0, 5: 5.0, 6: 25.0, 7: 150.0, 8: 1000.0, 9: 8000.0 },
        10: { 4: 1.5, 5: 4.0, 6: 15.0, 7: 60.0, 8: 300.0, 9: 2000.0, 10: 10000.0 }
    };

    // Game State
    let selectedPicks = [];
    let currentStake = 10;
    let isDrawing = false;
    let isAutoPlay = false;
    let autoPlayTimer = null;
    let soundEnabled = true;

    // WebAudio Synthesizer
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) {
            const AudioClass = window.AudioContext || window.webkitAudioContext;
            if (AudioClass) audioCtx = new AudioClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playSelectSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.06);
        } catch (e) {}
    }

    function playBallPopSound(isHit) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = isHit ? 'sine' : 'triangle';
            const baseFreq = isHit ? 987.77 : 440; // B5 for hit
            osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.06);
            gain.gain.setValueAtTime(isHit ? 0.25 : 0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.09);
        } catch (e) {}
    }

    function playWinSound(isBig) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const freqs = isBig ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [523.25, 659.25, 783.99];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = ctx.currentTime + idx * 0.08;
                gain.gain.setValueAtTime(0.2, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.4);
            });
        } catch (e) {}
    }

    function playChipSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1100, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    }

    // UI Updates
    function updateBalanceUI(val) {
        userBalance = Number(val);
        const el = document.getElementById('user-balance');
        if (el) el.textContent = userBalance.toFixed(2);
    }

    function updatePicksCounter() {
        const valEl = document.getElementById('picks-val');
        if (valEl) valEl.textContent = `${selectedPicks.length} / 10`;

        const playBtn = document.getElementById('btn-play');
        if (playBtn && !isDrawing) {
            playBtn.disabled = selectedPicks.length === 0;
        }

        renderPaytable();
    }

    // Render Dynamic Paytable
    function renderPaytable(activeHitCount = -1) {
        const container = document.getElementById('paytable-scroll');
        if (!container) return;

        const count = selectedPicks.length;
        if (count === 0) {
            container.innerHTML = `
                <div class="pay-step highlight">
                    <span class="hit-lbl">PICK NUMBERS</span>
                    <span class="mult-val">UP TO 10,000x</span>
                </div>
            `;
            return;
        }

        const table = PAYTABLES[count] || {};
        let html = '';

        for (let hits = 0; hits <= count; hits++) {
            const mult = table[hits] || 0;
            const isHitActive = activeHitCount === hits && mult > 0;
            const isPotential = mult > 0;

            const classes = ['pay-step'];
            if (isHitActive) classes.push('active-win');
            else if (isPotential) classes.push('highlight');

            html += `
                <div class="${classes.join(' ')}">
                    <span class="hit-lbl">${hits} HITS</span>
                    <span class="mult-val">${mult > 0 ? mult + 'x' : '-'}</span>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // Reset 20 Ball Shelf
    function resetBallShelf() {
        for (let i = 1; i <= 20; i++) {
            const slot = document.getElementById(`ball-slot-${i}`);
            if (slot) {
                slot.className = 'drawn-ball empty';
                slot.textContent = '?';
            }
        }
    }

    // Clear Previous Drawn Grid Highlights (keep user picks)
    function clearDrawnMarks() {
        document.querySelectorAll('.keno-grid .keno-tile').forEach(t => {
            const num = Number(t.dataset.num);
            t.className = 'keno-tile' + (selectedPicks.includes(num) ? ' selected' : '');
        });
    }

    // Toggle Pick
    window.toggleNumber = function (num) {
        if (isDrawing) return;
        getAudioCtx();

        num = Number(num);
        const idx = selectedPicks.indexOf(num);
        if (idx > -1) {
            selectedPicks.splice(idx, 1);
        } else {
            if (selectedPicks.length >= 10) {
                showToast('Maximum 10 numbers allowed');
                return;
            }
            selectedPicks.push(num);
        }

        selectedPicks.sort((a, b) => a - b);
        playSelectSound();
        clearDrawnMarks();
        resetBallShelf();
        updatePicksCounter();
    };

    // Auto Pick
    window.autoPick = function (count) {
        if (isDrawing) return;
        getAudioCtx();

        count = Math.min(10, Math.max(1, Number(count) || 5));
        const pool = Array.from({ length: 80 }, (_, i) => i + 1);
        selectedPicks = [];

        for (let i = 0; i < count; i++) {
            const rIdx = Math.floor(Math.random() * pool.length);
            selectedPicks.push(pool[rIdx]);
            pool.splice(rIdx, 1);
        }

        selectedPicks.sort((a, b) => a - b);
        playSelectSound();
        clearDrawnMarks();
        resetBallShelf();
        updatePicksCounter();
    };

    // Clear Picks
    window.clearPicks = function () {
        if (isDrawing) return;
        selectedPicks = [];
        clearDrawnMarks();
        resetBallShelf();
        updatePicksCounter();
        playChipSound();
    };

    // Set Stake & Controls
    window.setStake = function (val) {
        if (isDrawing) return;
        currentStake = Math.max(10, Math.min(50000, Number(val)));
        const input = document.getElementById('stake-input');
        if (input) input.value = currentStake;
        document.querySelectorAll('.chips-tray .chip').forEach(c => {
            const txt = c.textContent.trim();
            const cVal = txt.endsWith('K') ? 1000 : Number(txt);
            c.classList.toggle('active', cVal === currentStake);
        });
        playChipSound();
    };

    document.getElementById('stake-input')?.addEventListener('input', function () {
        currentStake = Math.max(10, Math.min(50000, Number(this.value) || 10));
    });

    document.getElementById('btn-half')?.addEventListener('click', () => {
        setStake(Math.max(10, Math.floor(currentStake / 2)));
    });

    document.getElementById('btn-double')?.addEventListener('click', () => {
        setStake(Math.min(50000, currentStake * 2));
    });

    document.getElementById('btn-max')?.addEventListener('click', () => {
        setStake(Math.min(50000, Math.floor(userBalance)));
    });

    // Play Keno Draw
    window.playKeno = async function () {
        if (isDrawing) return;
        getAudioCtx();

        if (selectedPicks.length === 0) {
            showToast('Please select between 1 and 10 lucky numbers');
            return;
        }

        if (currentStake > userBalance) {
            showToast('Insufficient balance. Please recharge.');
            return;
        }

        isDrawing = true;
        const playBtn = document.getElementById('btn-play');
        const playTxt = document.getElementById('play-txt');
        if (playBtn) playBtn.disabled = true;
        if (playTxt) playTxt.textContent = 'DRAWING...';

        clearDrawnMarks();
        resetBallShelf();
        const shelfStatus = document.getElementById('shelf-status');
        if (shelfStatus) shelfStatus.textContent = 'DRAWING 20 WINNING BALLS...';

        try {
            const resp = await fetch('/api/keno/draw.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    stake: currentStake,
                    picks: selectedPicks
                })
            });

            const data = await resp.json();
            if (data.code !== 0) {
                showToast(data.msg || 'Draw error');
                isDrawing = false;
                if (playBtn) playBtn.disabled = false;
                if (playTxt) playTxt.textContent = 'PLAY DRAW';
                return;
            }

            const drawData = data.data;
            const drawn = drawData.drawn_balls;
            const hits = drawData.hits;

            // Animate 20 balls sequential popping (~65ms each)
            let ballIdx = 0;
            const drawInterval = setInterval(() => {
                if (ballIdx >= drawn.length) {
                    clearInterval(drawInterval);
                    onDrawComplete(drawData);
                    return;
                }

                const ballNum = drawn[ballIdx];
                const isHit = hits.includes(ballNum);
                const slot = document.getElementById(`ball-slot-${ballIdx + 1}`);

                if (slot) {
                    slot.textContent = ballNum;
                    slot.className = `drawn-ball revealed ${isHit ? 'hit' : ''}`;
                }

                // Highlight on 80-grid
                const tile = document.querySelector(`.keno-grid .keno-tile[data-num="${ballNum}"]`);
                if (tile) {
                    if (isHit) {
                        tile.className = 'keno-tile hit';
                    } else {
                        tile.className = 'keno-tile drawn-miss';
                    }
                }

                playBallPopSound(isHit);
                ballIdx++;
            }, 65);

        } catch (err) {
            console.error('Play error:', err);
            showToast('Connection error during draw');
            isDrawing = false;
            if (playBtn) playBtn.disabled = false;
            if (playTxt) playTxt.textContent = 'PLAY DRAW';
        }
    };

    function onDrawComplete(drawData) {
        isDrawing = false;
        updateBalanceUI(drawData.wallet_balance);

        const playBtn = document.getElementById('btn-play');
        const playTxt = document.getElementById('play-txt');
        if (playBtn) playBtn.disabled = false;
        if (playTxt) playTxt.textContent = 'PLAY DRAW';

        const shelfStatus = document.getElementById('shelf-status');
        if (shelfStatus) {
            shelfStatus.innerHTML = drawData.payout > 0 
                ? `🔥 MATCHED ${drawData.hits_count} / ${drawData.picks_count}! WON +${currency}${drawData.payout.toFixed(2)} (${drawData.multiplier}x)` 
                : `MATCHED ${drawData.hits_count} / ${drawData.picks_count}`;
        }

        renderPaytable(drawData.hits_count);

        if (drawData.payout > 0) {
            playWinSound(drawData.multiplier >= 10);
            if (drawData.multiplier >= 10) {
                showCelebration(drawData.multiplier, drawData.payout);
            }
        }

        // Auto-play next round
        if (isAutoPlay) {
            autoPlayTimer = setTimeout(() => {
                if (isAutoPlay && !isDrawing) {
                    window.playKeno();
                }
            }, 1800);
        }
    }

    // Auto Play Toggle
    window.toggleAutoPlay = function () {
        isAutoPlay = !isAutoPlay;
        const autoBtn = document.getElementById('btn-auto');
        const autoTxt = document.getElementById('auto-txt');
        if (autoBtn) autoBtn.classList.toggle('active', isAutoPlay);
        if (autoTxt) autoTxt.textContent = isAutoPlay ? 'STOP' : 'AUTO';

        if (isAutoPlay && !isDrawing) {
            window.playKeno();
        } else if (!isAutoPlay && autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
    };

    // Celebration Modal
    function showCelebration(mult, amount) {
        const modal = document.getElementById('celebration-modal');
        const multEl = document.getElementById('celeb-mult');
        const amtEl = document.getElementById('celeb-amount');

        if (multEl) multEl.textContent = `${Number(mult).toFixed(2)}x`;
        if (amtEl) amtEl.textContent = `+${currency}${Number(amount).toFixed(2)}`;
        if (modal) modal.classList.add('visible');
    }

    window.closeCelebration = function () {
        const modal = document.getElementById('celebration-modal');
        if (modal) modal.classList.remove('visible');
    };

    // Rules Modal
    window.closeRules = function () {
        const modal = document.getElementById('rules-modal');
        if (modal) modal.classList.remove('visible');
    };

    document.getElementById('btn-info')?.addEventListener('click', () => {
        const modal = document.getElementById('rules-modal');
        if (modal) modal.classList.add('visible');
    });

    // Sound Toggle
    document.getElementById('btn-sound')?.addEventListener('click', function () {
        soundEnabled = !soundEnabled;
        this.textContent = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled) playChipSound();
    });

    // Lobby Navigation
    document.getElementById('btn-lobby')?.addEventListener('click', () => {
        window.location.href = '/';
    });

    // Refresh State
    async function fetchState() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.classList.add('spinning');
        try {
            const resp = await fetch(`/api/keno/state.php?token=${encodeURIComponent(token)}`);
            const json = await resp.json();
            if (json.code === 0 && json.data) {
                updateBalanceUI(json.data.wallet_balance);
            }
        } catch (e) {
        } finally {
            setTimeout(() => spinner?.classList.remove('spinning'), 600);
        }
    }

    document.getElementById('balance-box')?.addEventListener('click', fetchState);

    // Toast Notification
    function showToast(msg) {
        let toast = document.getElementById('keno-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'keno-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 85px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid #FFD700;
                color: #FFF;
                padding: 8px 18px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 700;
                z-index: 300;
                box-shadow: 0 4px 15px rgba(0,0,0,0.6);
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2200);
    }

    // Init
    document.addEventListener('DOMContentLoaded', () => {
        updateBalanceUI(userBalance);
        updatePicksCounter();
        fetchState();
    });

})();
