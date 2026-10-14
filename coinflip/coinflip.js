/**
 * Coin Flip - Cyber Golden Streak Arcade Engine
 * Features: 3D Isometric Coin Toss Canvas, Progressive Streak Multipliers,
 * Cashout Mechanism, WebAudio Synthesizer & Atomic Wallet Sync
 */

(function () {
    'use strict';

    // --- Configuration & State ---
    const config = window.CF_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    const state = {
        stake: 10,
        streak: 0,
        currentMultiplier: 1.0,
        currentPayout: 0.0,
        canCashout: false,
        balance: config.initialBalance,
        isFlipping: false,
        soundEnabled: localStorage.getItem('cf_sound') !== '0',
        ladder: {},
        particles: []
    };

    // --- Audio Synthesizer (WebAudio API) ---
    class CoinAudio {
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

        playCoinTing() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // High metallic coin spin chime
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2400, now);
            osc.frequency.exponentialRampToValueAtTime(1800, now + 0.3);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.36);
        }

        playCoinCatch() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        }

        playCashout() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // Cash register double bell
            [987.77, 1318.51].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.09);

                gain.gain.setValueAtTime(0.3, now + idx * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.09);
                osc.stop(now + idx * 0.09 + 0.26);
            });
        }

        playWinFanfare() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0.22, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.26);
            });
        }

        playLossTone() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.26);
        }
    }

    const audio = new CoinAudio();

    // --- 3D Coin Canvas Graphics ---
    class CoinCanvas {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.width = 0;
            this.height = 0;
            this.rotationY = 0;
            this.flipProgress = 0;
            this.isFlipping = false;
            this.currentFace = 'heads'; // 'heads' or 'tails'
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
        }

        startFlip() {
            this.isFlipping = true;
            this.flipProgress = 0;
        }

        stopFlip(finalOutcome) {
            this.isFlipping = false;
            this.currentFace = finalOutcome;
            this.rotationY = finalOutcome === 'heads' ? 0 : Math.PI;
        }

        addShockwave(x, y, color) {
            for (let i = 0; i < 24; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.5 + 1.5;
                state.particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                    size: Math.random() * 3 + 2,
                    color
                });
            }
        }

        loop() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            const cx = this.width / 2;
            const cy = this.height / 2 - 10;

            if (this.isFlipping) {
                this.rotationY += 0.35;
                this.flipProgress += 0.03;
            }

            // 1. Draw Pedestal Spotlight & Shadow
            this.drawSpotlightAndShadow(cx, cy);

            // 2. Draw 3D Coin
            this.drawCoin(cx, cy);

            // 3. Draw Particles
            this.drawParticles();

            requestAnimationFrame(() => this.loop());
        }

        drawSpotlightAndShadow(cx, cy) {
            // Radial floor spotlight
            const spotGrad = this.ctx.createRadialGradient(cx, cy + 65, 10, cx, cy + 65, 95);
            spotGrad.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
            spotGrad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = spotGrad;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Dynamic Coin Shadow
            const shadowScale = this.isFlipping ? Math.max(0.6, 1.0 - Math.sin(this.flipProgress * Math.PI) * 0.4) : 1.0;
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy + 65, 55 * shadowScale, 14 * shadowScale, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
            this.ctx.fill();
        }

        drawCoin(cx, cy) {
            const coinRadius = 54;
            // 3D rotation projection factor: cos(rotationY)
            const scaleX = Math.cos(this.rotationY);
            const isHeadsSide = Math.cos(this.rotationY) >= 0;

            const liftY = this.isFlipping ? -Math.sin(this.flipProgress * Math.PI) * 45 : 0;
            const coinY = cy + liftY;

            this.ctx.save();
            this.ctx.translate(cx, coinY);

            // Coin Outer Rim Glow
            this.ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
            this.ctx.shadowBlur = 18;

            // Outer Golden Rim
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, Math.abs(scaleX) * coinRadius, coinRadius, 0, 0, Math.PI * 2);

            const goldGrad = this.ctx.createLinearGradient(-coinRadius, -coinRadius, coinRadius, coinRadius);
            goldGrad.addColorStop(0, '#FFE57F');
            goldGrad.addColorStop(0.4, '#FFD700');
            goldGrad.addColorStop(0.8, '#B8860B');
            goldGrad.addColorStop(1, '#FFE57F');

            this.ctx.fillStyle = goldGrad;
            this.ctx.fill();

            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.shadowBlur = 0; // reset

            // Inner Medallion Inset
            if (Math.abs(scaleX) > 0.15) {
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, Math.abs(scaleX) * (coinRadius - 8), coinRadius - 8, 0, 0, Math.PI * 2);
                this.ctx.fillStyle = isHeadsSide ? '#D4AF37' : '#0284C7';
                this.ctx.fill();
                this.ctx.strokeStyle = '#FFE57F';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Draw Embossed Icon
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = `900 ${Math.round(28 * Math.abs(scaleX))}px 'Montserrat', sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(isHeadsSide ? '👑' : '🦅', 0, 0);
            }

            this.ctx.restore();
        }

        drawParticles() {
            for (let i = state.particles.length - 1; i >= 0; i--) {
                const p = state.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.03;
                if (p.life <= 0) {
                    state.particles.splice(i, 1);
                    continue;
                }
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life;
                this.ctx.fill();
                this.ctx.globalAlpha = 1.0;
            }
        }
    }

    let coinCanvas = null;

    // --- Ladder & UI Updates ---
    function updateLadderUI() {
        document.querySelectorAll('.ladder-step').forEach(stepEl => {
            const stepNum = Number(stepEl.dataset.step);
            if (stepNum === state.streak) {
                stepEl.className = 'ladder-step active';
            } else if (stepNum < state.streak) {
                stepEl.className = 'ladder-step completed';
            } else {
                stepEl.className = 'ladder-step';
            }
        });

        // Scroll active ladder step into view smoothly
        const activeStep = document.querySelector('.ladder-step.active');
        if (activeStep) {
            activeStep.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function updateStakeDisplay() {
        const el = document.getElementById('display-stake');
        if (el) el.textContent = state.stake;
    }

    function updateBalanceUI(val) {
        state.balance = Number(val);
        const el = document.getElementById('user-balance');
        if (el) {
            el.textContent = state.balance.toFixed(2);
        }
    }

    function updateControlsState() {
        const banner = document.getElementById('cashout-banner');
        const stakeCard = document.getElementById('stake-card');
        const streakTag = document.getElementById('active-streak-tag');
        const payoutVal = document.getElementById('active-payout-val');
        const multHeads = document.getElementById('mult-heads');
        const multTails = document.getElementById('mult-tails');
        const hudStatus = document.getElementById('streak-status-badge');

        const nextStreak = state.streak + 1;
        const nextMult = state.ladder[nextStreak] || 1.96;

        if (multHeads) multHeads.textContent = `${nextMult}x`;
        if (multTails) multTails.textContent = `${nextMult}x`;

        if (state.canCashout && state.streak > 0) {
            if (banner) banner.style.display = 'flex';
            if (stakeCard) stakeCard.classList.add('disabled');
            if (streakTag) streakTag.textContent = `STREAK: ${state.streak} • ${state.currentMultiplier}x`;
            if (payoutVal) payoutVal.textContent = `+${config.currency}${state.currentPayout.toFixed(2)}`;
            if (hudStatus) hudStatus.innerHTML = `NEXT STEP: <strong style="color:#00F0FF;">${nextMult}x</strong> OR CASH OUT NOW`;
        } else {
            if (banner) banner.style.display = 'none';
            if (stakeCard) stakeCard.classList.remove('disabled');
            if (hudStatus) hudStatus.textContent = 'CHOOSE A SIDE TO BEGIN';
        }

        updateLadderUI();
    }

    // --- Stake Helpers ---
    window.setStake = function (amt) {
        if (state.canCashout) return;
        state.stake = Math.max(10, Math.min(50000, Number(amt)));
        document.querySelectorAll('.chips-tray .chip').forEach(c => {
            c.classList.toggle('active', Number(c.textContent.replace('K', '000')) === state.stake);
        });
        updateStakeDisplay();
    };

    window.changeStake = function (delta) {
        if (state.canCashout) return;
        state.stake = Math.max(10, Math.min(50000, state.stake + delta));
        updateStakeDisplay();
    };

    window.adjustStake = function (type) {
        if (state.canCashout) return;
        if (type === 'half') {
            state.stake = Math.max(10, Math.floor(state.stake / 2));
        } else if (type === 'double') {
            state.stake = Math.min(50000, state.stake * 2);
        } else if (type === 'max') {
            state.stake = Math.max(10, Math.min(50000, Math.floor(state.balance)));
        }
        updateStakeDisplay();
    };

    // --- Flip Execution ---
    window.flipCoin = async function (choice) {
        if (state.isFlipping) return;

        if (!state.canCashout && state.balance < state.stake) {
            alert('Insufficient balance. Please recharge.');
            return;
        }

        state.isFlipping = true;
        const btnHeads = document.getElementById('btn-heads');
        const btnTails = document.getElementById('btn-tails');
        if (btnHeads) btnHeads.classList.add('disabled');
        if (btnTails) btnTails.classList.add('disabled');

        // Deduct stake optimistically only if this is a fresh round
        if (!state.canCashout) {
            updateBalanceUI(state.balance - state.stake);
        }

        // Start coin flip animation & audio
        if (coinCanvas) coinCanvas.startFlip();
        audio.playCoinTing();

        const payload = {
            token: config.token,
            choice: choice,
            stake: state.stake
        };

        try {
            const resp = await fetch('/api/coinflip/flip.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();

            if (data.code !== 0) {
                alert(data.msg || 'Flip error');
                if (coinCanvas) coinCanvas.stopFlip('heads');
                refreshState();
                state.isFlipping = false;
                if (btnHeads) btnHeads.classList.remove('disabled');
                if (btnTails) btnTails.classList.remove('disabled');
                return;
            }

            const res = data.data;

            // Allow coin to flip through the air for 750ms
            setTimeout(() => {
                handleFlipResult(res);
                state.isFlipping = false;
                if (btnHeads) btnHeads.classList.remove('disabled');
                if (btnTails) btnTails.classList.remove('disabled');
            }, 750);
        } catch (err) {
            console.error('Coin flip error:', err);
            if (coinCanvas) coinCanvas.stopFlip('heads');
            refreshState();
            state.isFlipping = false;
            if (btnHeads) btnHeads.classList.remove('disabled');
            if (btnTails) btnTails.classList.remove('disabled');
        }
    };

    function handleFlipResult(res) {
        // Settle coin on resulting face
        if (coinCanvas) {
            coinCanvas.stopFlip(res.outcome);
        }
        audio.playCoinCatch();

        const faceName = document.getElementById('coin-face-name');
        if (faceName) {
            faceName.textContent = res.outcome === 'heads' ? 'HEADS 👑' : 'TAILS 🦅';
        }

        if (res.is_win) {
            state.streak = res.streak;
            state.currentMultiplier = res.multiplier;
            state.currentPayout = res.payout;
            state.canCashout = res.can_cashout;

            audio.playWinFanfare();

            if (coinCanvas) {
                coinCanvas.addShockwave(coinCanvas.width / 2, coinCanvas.height / 2 - 10, '#FFD700');
            }

            // If auto-cashed out at streak 10
            if (res.streak >= 10) {
                updateBalanceUI(res.wallet_balance);
                showCelebration(res.multiplier, res.payout);
                state.canCashout = false;
                state.streak = 0;
            }
        } else {
            // Player missed
            state.streak = 0;
            state.currentMultiplier = 1.0;
            state.currentPayout = 0;
            state.canCashout = false;

            audio.playLossTone();
        }

        updateControlsState();
    }

    // --- Cash Out Execution ---
    window.cashOut = async function () {
        if (!state.canCashout || state.isFlipping) return;

        const btn = document.getElementById('btn-cashout');
        if (btn) btn.disabled = true;

        try {
            const resp = await fetch('/api/coinflip/cashout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: config.token })
            });
            const data = await resp.json();

            if (data.code !== 0) {
                alert(data.msg || 'Cashout error');
                return;
            }

            const res = data.data;
            updateBalanceUI(res.wallet_balance);
            audio.playCashout();

            if (res.multiplier >= 3.84) {
                showCelebration(res.multiplier, res.payout);
            }

            // Reset streak
            state.streak = 0;
            state.currentMultiplier = 1.0;
            state.currentPayout = 0;
            state.canCashout = false;
            updateControlsState();
        } catch (err) {
            console.error('Cashout error:', err);
        } finally {
            if (btn) btn.disabled = false;
        }
    };

    // --- Celebration & Modals ---
    function showCelebration(mult, amount) {
        const modal = document.getElementById('celebration-modal');
        const elMult = document.getElementById('celeb-mult');
        const elAmt = document.getElementById('celeb-amount');

        if (!modal) return;
        if (elMult) elMult.textContent = `${mult.toFixed(2)}x`;
        if (elAmt) elAmt.textContent = `+${config.currency}${amount.toFixed(2)}`;

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

    // --- State Refresh ---
    async function refreshState() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.classList.add('spin');
        try {
            const resp = await fetch(`/api/coinflip/state.php?token=${encodeURIComponent(config.token)}`);
            const data = await resp.json();
            if (data.code === 0 && data.data) {
                updateBalanceUI(data.data.wallet_balance);
                state.ladder = data.data.ladder || {};

                // Restore active session if present
                if (data.data.active_session) {
                    const s = data.data.active_session;
                    state.stake = s.stake;
                    state.streak = s.streak;
                    state.currentMultiplier = s.multiplier;
                    state.currentPayout = s.payout;
                    state.canCashout = true;
                }
                updateControlsState();
            }
        } catch (err) {
            console.error('Refresh state error:', err);
        } finally {
            if (spinner) setTimeout(() => spinner.classList.remove('spin'), 500);
        }
    }

    // --- DOM Init ---
    document.addEventListener('DOMContentLoaded', async () => {
        coinCanvas = new CoinCanvas('coin-canvas');
        updateStakeDisplay();
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
                localStorage.setItem('cf_sound', state.soundEnabled ? '1' : '0');
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
