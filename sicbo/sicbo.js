/**
 * Super Sic Bo - Royal Macau 3-Dice Casino Arcade Engine
 * Features: 3D Electric Shaker Dome Canvas, Lightning Super Multipliers,
 * Multi-spot Chip Placement, WebAudio Synthesizer & Atomic Wallet Sync
 */

(function () {
    'use strict';

    // --- Configuration & State ---
    const config = window.SB_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    const state = {
        selectedChip: 10,
        currentBets: {}, // { spot: amount }
        lastBets: null,
        totalStake: 0,
        balance: config.initialBalance,
        isShaking: false,
        autoRolling: false,
        autoTimer: null,
        soundEnabled: localStorage.getItem('sb_sound') !== '0',
        baseOdds: {},
        dice: [4, 5, 6],
        lightning: {}
    };

    // --- Audio Synthesizer (WebAudio API) ---
    class SicBoAudio {
        constructor() {
            this.ctx = null;
        }

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playChip() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200 + Math.random() * 200, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        }

        playShakerRattle() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;

            // Rattle bursts simulating dice inside dome
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    if (!this.ctx) return;
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(450 + Math.random() * 300, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.06);

                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.07);
                }, i * 110);
            }
        }

        playLightningZap() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // Electric zap noise
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(1800, now + 0.15);

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.23);
        }

        playWinFanfare(isBig = false) {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const notes = isBig ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [440, 554.37, 659.25];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0.25, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.32);
            });
        }
    }

    const audio = new SicBoAudio();

    // --- 3D Shaker Dome Canvas Graphics ---
    class ShakerCanvas {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.width = 0;
            this.height = 0;
            this.shakeProgress = 0;
            this.isShaking = false;
            this.diceCoords = [
                { x: 0, y: 0, val: 4, rot: 0 },
                { x: 0, y: 0, val: 5, rot: 0 },
                { x: 0, y: 0, val: 6, rot: 0 }
            ];
            this.resize();
            window.addEventListener('resize', () => this.resize());
            requestAnimationFrame(() => this.loop());
        }

        resize() {
            const rect = this.canvas.getBoundingClientRect();
            this.width = rect.width;
            this.height = rect.height;
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.ctx.scale(dpr, dpr);
            this.updateDiceRestPositions();
        }

        updateDiceRestPositions() {
            const cx = this.width / 2;
            const cy = this.height / 2 - 4;
            this.diceCoords[0].x = cx - 44;
            this.diceCoords[0].y = cy + 4;
            this.diceCoords[1].x = cx;
            this.diceCoords[1].y = cy - 14;
            this.diceCoords[2].x = cx + 44;
            this.diceCoords[2].y = cy + 4;
        }

        startShake() {
            this.isShaking = true;
            this.shakeProgress = 0;
        }

        stopShake(finalDice) {
            this.isShaking = false;
            this.shakeProgress = 0;
            this.updateDiceRestPositions();
            if (finalDice && finalDice.length === 3) {
                this.diceCoords[0].val = finalDice[0];
                this.diceCoords[1].val = finalDice[1];
                this.diceCoords[2].val = finalDice[2];
            }
        }

        loop() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            const cx = this.width / 2;
            const cy = this.height / 2 - 4;

            // 1. Draw Golden Pedestal Base
            this.drawPedestal(cx, cy);

            // 2. Draw 3 Dice
            this.drawDice(cx, cy);

            // 3. Draw Glass Dome with reflections
            this.drawGlassDome(cx, cy);

            requestAnimationFrame(() => this.loop());
        }

        drawPedestal(cx, cy) {
            // Shadow
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy + 50, 95, 25, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fill();

            // Gold Outer Ring
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy + 45, 90, 20, 0, 0, Math.PI * 2);
            const goldGrad = this.ctx.createLinearGradient(cx - 90, cy + 45, cx + 90, cy + 45);
            goldGrad.addColorStop(0, '#B8860B');
            goldGrad.addColorStop(0.5, '#FFE57F');
            goldGrad.addColorStop(1, '#B8860B');
            this.ctx.fillStyle = goldGrad;
            this.ctx.fill();
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Felt Inner Tray
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy + 42, 78, 16, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = '#0a241b';
            this.ctx.fill();
        }

        drawGlassDome(cx, cy) {
            // Glass Dome Shell
            this.ctx.beginPath();
            this.ctx.arc(cx, cy + 30, 80, Math.PI, 0);
            this.ctx.closePath();

            // Translucent glass gradient
            const glassGrad = this.ctx.createRadialGradient(cx - 25, cy - 10, 10, cx, cy + 20, 90);
            glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
            glassGrad.addColorStop(0.6, 'rgba(0, 240, 255, 0.08)');
            glassGrad.addColorStop(1, 'rgba(12, 38, 28, 0.4)');
            this.ctx.fillStyle = glassGrad;
            this.ctx.fill();

            this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            // Specular glass highlight reflection
            this.ctx.beginPath();
            this.ctx.arc(cx, cy + 30, 72, Math.PI * 1.15, Math.PI * 1.55);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        drawDice(cx, cy) {
            for (let i = 0; i < 3; i++) {
                const die = this.diceCoords[i];
                let x = die.x;
                let y = die.y;
                let rot = die.rot;
                let face = die.val;

                if (this.isShaking) {
                    x += (Math.random() * 24 - 12);
                    y += (Math.random() * 24 - 12);
                    rot += (Math.random() * 0.8 - 0.4);
                    face = Math.floor(Math.random() * 6) + 1;
                }

                this.renderDie(x, y, face, rot);
            }
        }

        renderDie(x, y, face, rot) {
            const size = 32;
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rot);

            // Die shadow
            this.ctx.beginPath();
            this.ctx.roundRect(-size / 2 + 2, -size / 2 + 3, size, size, 6);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.fill();

            // Die body (ivory gradient)
            const bodyGrad = this.ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
            bodyGrad.addColorStop(0, '#FFFFFF');
            bodyGrad.addColorStop(0.7, '#F1F5F9');
            bodyGrad.addColorStop(1, '#CBD5E1');

            this.ctx.beginPath();
            this.ctx.roundRect(-size / 2, -size / 2, size, size, 6);
            this.ctx.fillStyle = bodyGrad;
            this.ctx.fill();

            this.ctx.strokeStyle = '#D4AF37';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            // Pips (1 & 4 are traditional red in Asian casinos, others dark)
            const isRed = (face === 1 || face === 4);
            const pipColor = isRed ? '#E11D48' : '#0F172A';
            this.drawDiePips(face, size, pipColor);

            this.ctx.restore();
        }

        drawDiePips(face, size, color) {
            const r = face === 1 ? 4.5 : 2.8;
            const offset = size * 0.26;
            this.ctx.fillStyle = color;

            const pip = (px, py) => {
                this.ctx.beginPath();
                this.ctx.arc(px, py, r, 0, Math.PI * 2);
                this.ctx.fill();
            };

            switch (face) {
                case 1:
                    pip(0, 0);
                    break;
                case 2:
                    pip(-offset, -offset);
                    pip(offset, offset);
                    break;
                case 3:
                    pip(-offset, -offset);
                    pip(0, 0);
                    pip(offset, offset);
                    break;
                case 4:
                    pip(-offset, -offset);
                    pip(offset, -offset);
                    pip(-offset, offset);
                    pip(offset, offset);
                    break;
                case 5:
                    pip(-offset, -offset);
                    pip(offset, -offset);
                    pip(0, 0);
                    pip(-offset, offset);
                    pip(offset, offset);
                    break;
                case 6:
                    pip(-offset, -offset);
                    pip(offset, -offset);
                    pip(-offset, 0);
                    pip(offset, 0);
                    pip(-offset, offset);
                    pip(offset, offset);
                    break;
            }
        }
    }

    let shakerCanvas = null;

    // --- Betting Table Interactions ---
    window.selectChip = function (amt) {
        state.selectedChip = Number(amt);
        document.querySelectorAll('.chips-tray .chip').forEach(c => {
            c.classList.toggle('active', Number(c.textContent.replace('K', '000')) === state.selectedChip);
        });
        audio.playChip();
    };

    window.placeChip = function (spot) {
        if (state.isShaking) return;

        const currentAmt = state.currentBets[spot] || 0;
        state.currentBets[spot] = currentAmt + state.selectedChip;
        audio.playChip();
        updateBetsUI();
    };

    function updateBetsUI() {
        let total = 0;

        document.querySelectorAll('.bet-spot').forEach(spotEl => {
            const spotName = spotEl.dataset.spot;
            const amt = state.currentBets[spotName] || 0;
            const stackEl = document.getElementById(`chip-${spotName}`);

            if (amt > 0) {
                spotEl.classList.add('has-bet');
                if (stackEl) {
                    stackEl.textContent = amt >= 1000 ? `${amt / 1000}K` : amt;
                    stackEl.style.display = 'block';
                }
                total += amt;
            } else {
                spotEl.classList.remove('has-bet');
                if (stackEl) stackEl.style.display = 'none';
            }
        });

        state.totalStake = total;
        const elTotal = document.getElementById('total-bet-val');
        if (elTotal) {
            elTotal.textContent = total;
        }
    }

    window.clearBets = function () {
        if (state.isShaking) return;
        state.currentBets = {};
        updateBetsUI();
    };

    window.doubleBets = function () {
        if (state.isShaking) return;
        for (const spot in state.currentBets) {
            state.currentBets[spot] *= 2;
        }
        updateBetsUI();
    };

    window.rebet = function () {
        if (state.isShaking || !state.lastBets) return;
        state.currentBets = { ...state.lastBets };
        updateBetsUI();
    };

    // --- Shake & Roll Execution ---
    window.shakeAndRoll = async function () {
        if (state.isShaking) return;

        if (state.totalStake < 10) {
            alert('Please place a bet on the table first (minimum ৳10).');
            stopAutoRoll();
            return;
        }

        if (state.balance < state.totalStake) {
            alert('Insufficient balance. Please recharge.');
            stopAutoRoll();
            return;
        }

        state.isShaking = true;
        state.lastBets = { ...state.currentBets };
        const btnShake = document.getElementById('btn-shake');
        if (btnShake) btnShake.classList.add('disabled');

        // Optimistic deduction
        updateBalanceUI(state.balance - state.totalStake);

        // Start Shaker Canvas Rumble & Audio
        if (shakerCanvas) shakerCanvas.startShake();
        audio.playShakerRattle();

        // Convert current bets to array
        const betsArray = [];
        for (const spot in state.currentBets) {
            betsArray.push({ spot, amount: state.currentBets[spot] });
        }

        const payload = {
            token: config.token,
            bets: betsArray
        };

        try {
            const resp = await fetch('/api/sicbo/roll.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();

            if (data.code !== 0) {
                alert(data.msg || 'Roll error');
                if (shakerCanvas) shakerCanvas.stopShake();
                refreshState();
                state.isShaking = false;
                if (btnShake) btnShake.classList.remove('disabled');
                return;
            }

            const res = data.data;

            // Wait 1.1s for shaker rumble to complete naturally
            setTimeout(() => {
                handleRollResult(res);
                state.isShaking = false;
                if (btnShake) btnShake.classList.remove('disabled');
            }, 1100);
        } catch (err) {
            console.error('Sic Bo roll error:', err);
            if (shakerCanvas) shakerCanvas.stopShake();
            refreshState();
            state.isShaking = false;
            if (btnShake) btnShake.classList.remove('disabled');
        }
    };

    function handleRollResult(res) {
        // Stop canvas shaker on final dice
        if (shakerCanvas) {
            shakerCanvas.stopShake(res.dice);
        }

        // Update Balance UI
        updateBalanceUI(res.wallet_balance);

        // Update Result HUD
        const d1 = document.getElementById('die-1');
        const d2 = document.getElementById('die-2');
        const d3 = document.getElementById('die-3');
        const sumBadge = document.getElementById('sum-badge');
        const winPayout = document.getElementById('win-payout-badge');

        if (d1) d1.textContent = res.dice[0];
        if (d2) d2.textContent = res.dice[1];
        if (d3) d3.textContent = res.dice[2];

        if (sumBadge) {
            sumBadge.textContent = `SUM ${res.sum} • ${res.outcome}`;
        }

        if (winPayout) {
            if (res.total_payout > 0) {
                winPayout.textContent = `+${config.currency}${res.total_payout.toFixed(2)}`;
                winPayout.style.display = 'block';
            } else {
                winPayout.style.display = 'none';
            }
        }

        // Update Lightning Badges
        renderLightningRibbon(res.lightning);

        // Audio & Celebration
        if (res.total_payout > 0) {
            const hasLightning = res.winning_bets.some(b => b.lightning);
            const isBigWin = (res.total_payout >= state.totalStake * 5.0) || hasLightning;
            audio.playWinFanfare(isBigWin);

            if (isBigWin && !state.autoRolling) {
                showCelebration(res.total_payout, hasLightning);
            }
        }
    }

    function renderLightningRibbon(lightning) {
        const container = document.getElementById('lt-chips');
        if (!container) return;

        container.innerHTML = '';
        for (const spot in lightning) {
            const boost = lightning[spot];
            const chip = document.createElement('span');
            chip.className = 'lt-chip';
            chip.innerHTML = `${spot.toUpperCase()} <strong>${boost}x</strong>`;
            container.appendChild(chip);

            // Highlight corresponding table spot
            const spotEl = document.querySelector(`.bet-spot[data-spot="${spot}"]`);
            if (spotEl) {
                spotEl.classList.add('lightning-boost');
                setTimeout(() => spotEl.classList.remove('lightning-boost'), 5000);
            }
        }
    }

    // --- Auto Roll Logic ---
    window.toggleAutoRoll = function () {
        if (state.autoRolling) {
            stopAutoRoll();
        } else {
            startAutoRoll();
        }
    };

    function startAutoRoll() {
        if (state.totalStake < 10) {
            alert('Please place a bet on the table before starting Auto Play.');
            return;
        }
        state.autoRolling = true;
        const btnAuto = document.getElementById('btn-auto');
        const autoTxt = document.getElementById('auto-txt');
        if (btnAuto) btnAuto.classList.add('active');
        if (autoTxt) autoTxt.textContent = 'STOP';

        runAutoLoop();
    }

    function stopAutoRoll() {
        state.autoRolling = false;
        if (state.autoTimer) {
            clearTimeout(state.autoTimer);
            state.autoTimer = null;
        }
        const btnAuto = document.getElementById('btn-auto');
        const autoTxt = document.getElementById('auto-txt');
        if (btnAuto) btnAuto.classList.remove('active');
        if (autoTxt) autoTxt.textContent = 'AUTO';
    }

    function runAutoLoop() {
        if (!state.autoRolling) return;
        window.shakeAndRoll().then(() => {
            if (state.autoRolling) {
                state.autoTimer = setTimeout(runAutoLoop, 1600);
            }
        });
    }

    // --- Celebration & Modals ---
    function showCelebration(amount, isLightning) {
        const modal = document.getElementById('celebration-modal');
        const elAmt = document.getElementById('celeb-amount');
        const elBadge = document.getElementById('celeb-badge');
        const elSub = document.getElementById('celeb-sub');

        if (!modal) return;
        if (elAmt) elAmt.textContent = `+${config.currency}${amount.toFixed(2)}`;
        if (elBadge) elBadge.textContent = isLightning ? '⚡ LIGHTNING SUPER WIN! ⚡' : '👑 ROYAL SIC BO WIN! 👑';
        if (elSub) elSub.textContent = isLightning ? 'SUPER MULTIPLIER UNLOCKED' : 'MASSIVE CASINO PAYOUT';

        modal.classList.add('show');
    }

    window.closeCelebration = function () {
        const modal = document.getElementById('celebration-modal');
        if (modal) modal.classList.remove('show');
    };

    window.closeRules = function () {
        const modal = document.getElementById('rules-modal');
        if (modal) modal.classList.remove('show');
    };

    function updateBalanceUI(val) {
        state.balance = Number(val);
        const el = document.getElementById('user-balance');
        if (el) {
            el.textContent = state.balance.toFixed(2);
        }
    }

    // --- State Refresh ---
    async function refreshState() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.classList.add('spin');
        try {
            const resp = await fetch(`/api/sicbo/state.php?token=${encodeURIComponent(config.token)}`);
            const data = await resp.json();
            if (data.code === 0 && data.data) {
                updateBalanceUI(data.data.wallet_balance);
                state.baseOdds = data.data.base_odds || {};
            }
        } catch (err) {
            console.error('Refresh state error:', err);
        } finally {
            if (spinner) setTimeout(() => spinner.classList.remove('spin'), 500);
        }
    }

    // --- DOM Init ---
    document.addEventListener('DOMContentLoaded', async () => {
        shakerCanvas = new ShakerCanvas('shaker-canvas');
        await refreshState();

        // Top bar buttons
        document.getElementById('btn-lobby')?.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/#/home';
            }
        });

        document.getElementById('balance-box')?.addEventListener('click', () => {
            refreshState();
        });

        const btnSound = document.getElementById('btn-sound');
        if (btnSound) {
            btnSound.textContent = state.soundEnabled ? '🔊' : '🔇';
            btnSound.addEventListener('click', () => {
                state.soundEnabled = !state.soundEnabled;
                localStorage.setItem('sb_sound', state.soundEnabled ? '1' : '0');
                btnSound.textContent = state.soundEnabled ? '🔊' : '🔇';
                if (state.soundEnabled) audio.init();
            });
        }

        document.getElementById('btn-info')?.addEventListener('click', () => {
            const modal = document.getElementById('rules-modal');
            if (modal) modal.classList.add('show');
        });
    });

})();
