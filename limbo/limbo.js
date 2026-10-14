/**
 * Limbo Turbo - Cyber Rocket Crash Arcade Engine
 * Features: 60FPS Hyperspace Warp Canvas, Fast Multiplier Ticker, Synchronous Dual-Input Math,
 * WebAudio Synthesizer & Atomic Wallet Sync
 */

(function () {
    'use strict';

    // --- Configuration & State ---
    const config = window.LB_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    const state = {
        stake: 10,
        targetMultiplier: 2.0,
        winChance: 49.25,
        balance: config.initialBalance,
        isRolling: false,
        autoPlaying: false,
        autoTimer: null,
        soundEnabled: localStorage.getItem('lb_sound') !== '0',
        particles: []
    };

    // --- Audio Synthesizer (WebAudio API) ---
    class LimboAudio {
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

        playWarpLaunch() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.36);
        }

        playWinFanfare(isBig = false) {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const notes = isBig ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [440, 554.37, 659.25, 880];
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

        playMissTone() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.21);
        }
    }

    const audio = new LimboAudio();

    // --- 60FPS Warp Canvas Graphics ---
    class WarpCanvas {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.width = 0;
            this.height = 0;
            this.stars = [];
            this.speedFactor = 1.0;
            this.resize();
            this.initStars();
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

        initStars() {
            this.stars = [];
            const count = 90;
            for (let i = 0; i < count; i++) {
                this.stars.push({
                    x: (Math.random() - 0.5) * this.width,
                    y: (Math.random() - 0.5) * this.height,
                    z: Math.random() * this.width,
                    pz: 0
                });
            }
        }

        addExplosion(x, y, color) {
            for (let i = 0; i < 28; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2;
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

        setSpeed(factor) {
            this.speedFactor = factor;
        }

        loop() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            const cx = this.width / 2;
            const cy = this.height / 2;

            // 1. Hyperspace Warp Stars
            this.ctx.fillStyle = '#FFFFFF';
            const speed = 4 * this.speedFactor;

            for (let i = 0; i < this.stars.length; i++) {
                const s = this.stars[i];
                s.pz = s.z;
                s.z -= speed;

                if (s.z <= 0) {
                    s.z = this.width;
                    s.pz = s.z;
                    s.x = (Math.random() - 0.5) * this.width;
                    s.y = (Math.random() - 0.5) * this.height;
                }

                const k = 128.0 / s.z;
                const px = s.x * k + cx;
                const py = s.y * k + cy;

                const pk = 128.0 / s.pz;
                const prevX = s.x * pk + cx;
                const prevY = s.y * pk + cy;

                if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
                    const size = Math.max(0.5, (1 - s.z / this.width) * 2.5);
                    this.ctx.beginPath();
                    this.ctx.moveTo(prevX, prevY);
                    this.ctx.lineTo(px, py);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${Math.min(1.0, (1 - s.z / this.width) * 1.2)})`;
                    this.ctx.lineWidth = size;
                    this.ctx.stroke();
                }
            }

            // 2. Center Warp Core Glow Ring
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 65, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            // 3. Particles
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

            requestAnimationFrame(() => this.loop());
        }
    }

    let warpCanvas = null;

    // --- Synchronous Dual-Input Math ---
    function updateCalculations() {
        const estProfit = Math.max(0, (state.stake * state.targetMultiplier) - state.stake);
        const elEst = document.getElementById('est-profit');
        if (elEst) {
            elEst.textContent = `${config.currency} ${estProfit.toFixed(2)}`;
        }

        const targetSub = document.getElementById('target-sub');
        if (targetSub) {
            targetSub.innerHTML = `TARGET: <span class="cyan">${state.targetMultiplier.toFixed(2)}x</span> • WIN CHANCE: <span class="gold">${state.winChance.toFixed(2)}%</span>`;
        }
    }

    window.onStakeInput = function (val) {
        state.stake = Math.max(10, Math.min(50000, Number(val)));
        updateStakeUI();
    };

    window.setStake = function (amt) {
        state.stake = Math.max(10, Math.min(50000, Number(amt)));
        document.querySelectorAll('.chips-tray .chip').forEach(c => {
            c.classList.toggle('active', Number(c.textContent.replace('K', '000')) === state.stake);
        });
        updateStakeUI();
    };

    window.changeStake = function (delta) {
        state.stake = Math.max(10, Math.min(50000, state.stake + delta));
        updateStakeUI();
    };

    window.adjustStake = function (type) {
        if (type === 'half') {
            state.stake = Math.max(10, Math.floor(state.stake / 2));
        } else if (type === 'double') {
            state.stake = Math.min(50000, state.stake * 2);
        } else if (type === 'max') {
            state.stake = Math.max(10, Math.min(50000, Math.floor(state.balance)));
        }
        updateStakeUI();
    };

    function updateStakeUI() {
        const inp = document.getElementById('input-stake');
        if (inp) inp.value = state.stake;
        updateCalculations();
    }

    window.onTargetChange = function (val) {
        let t = parseFloat(val);
        if (isNaN(t) || t < 1.01) t = 1.01;
        if (t > 10000) t = 10000;
        state.targetMultiplier = Math.round(t * 100) / 100;
        state.winChance = Math.round((98.5 / state.targetMultiplier) * 100) / 100;

        const inpChance = document.getElementById('input-chance');
        if (inpChance) inpChance.value = state.winChance.toFixed(2);

        updateActivePreset();
        updateCalculations();
    };

    window.onChanceChange = function (val) {
        let c = parseFloat(val);
        if (isNaN(c) || c < 0.01) c = 0.01;
        if (c > 97.5) c = 97.5;
        state.winChance = Math.round(c * 100) / 100;
        state.targetMultiplier = Math.round((98.5 / state.winChance) * 100) / 100;

        const inpTarget = document.getElementById('input-target');
        if (inpTarget) inpTarget.value = state.targetMultiplier.toFixed(2);

        updateActivePreset();
        updateCalculations();
    };

    window.changeTarget = function (delta) {
        const newTarget = Math.max(1.01, Math.min(10000, state.targetMultiplier + delta));
        window.onTargetChange(newTarget);
        const inpTarget = document.getElementById('input-target');
        if (inpTarget) inpTarget.value = state.targetMultiplier.toFixed(2);
    };

    window.setPreset = function (mult) {
        window.onTargetChange(mult);
        const inpTarget = document.getElementById('input-target');
        if (inpTarget) inpTarget.value = state.targetMultiplier.toFixed(2);
    };

    function updateActivePreset() {
        document.querySelectorAll('.btn-preset').forEach(b => {
            b.classList.toggle('active', parseFloat(b.dataset.preset) === state.targetMultiplier);
        });
    }

    // --- Launch Bet Execution ---
    window.launchBet = async function () {
        if (state.isRolling) return;

        if (state.balance < state.stake) {
            alert('Insufficient balance. Please recharge.');
            stopAutoPlay();
            return;
        }

        state.isRolling = true;
        const btnLaunch = document.getElementById('btn-launch');
        if (btnLaunch) btnLaunch.classList.add('disabled');

        // Optimistic deduction
        updateBalanceUI(state.balance - state.stake);

        // UI status & canvas speed up
        const hudStatus = document.getElementById('hud-status');
        const counterVal = document.getElementById('counter-val');
        const payoutBanner = document.getElementById('payout-banner');

        if (hudStatus) hudStatus.textContent = 'WARPING...';
        if (payoutBanner) payoutBanner.style.display = 'none';
        if (counterVal) {
            counterVal.className = 'counter-val';
            counterVal.textContent = '1.00x';
        }

        if (warpCanvas) warpCanvas.setSpeed(6.0);
        audio.playWarpLaunch();

        const payload = {
            token: config.token,
            stake: state.stake,
            target_multiplier: state.targetMultiplier
        };

        try {
            const resp = await fetch('/api/limbo/play.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();

            if (data.code !== 0) {
                alert(data.msg || 'Bet error');
                if (warpCanvas) warpCanvas.setSpeed(1.0);
                refreshState();
                state.isRolling = false;
                if (btnLaunch) btnLaunch.classList.remove('disabled');
                return;
            }

            const res = data.data;

            // Animate rolling number counter smoothly up to result
            animateCounter(res.result_multiplier, () => {
                handleResultOutcome(res);
                state.isRolling = false;
                if (btnLaunch) btnLaunch.classList.remove('disabled');
            });
        } catch (err) {
            console.error('Limbo play error:', err);
            if (warpCanvas) warpCanvas.setSpeed(1.0);
            refreshState();
            state.isRolling = false;
            if (btnLaunch) btnLaunch.classList.remove('disabled');
        }
    };

    function animateCounter(finalVal, onComplete) {
        const counterVal = document.getElementById('counter-val');
        const duration = 500; // ms
        const startTime = performance.now();

        function frame(time) {
            const elapsed = time - startTime;
            const progress = Math.min(1.0, elapsed / duration);
            // Ease-out expo
            const current = 1.0 + (finalVal - 1.0) * (progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress));

            if (counterVal) {
                counterVal.textContent = `${current.toFixed(2)}x`;
            }

            if (progress < 1.0) {
                requestAnimationFrame(frame);
            } else {
                if (counterVal) counterVal.textContent = `${finalVal.toFixed(2)}x`;
                if (onComplete) onComplete();
            }
        }

        requestAnimationFrame(frame);
    }

    function handleResultOutcome(res) {
        if (warpCanvas) warpCanvas.setSpeed(1.0);
        updateBalanceUI(res.wallet_balance);

        const hudStatus = document.getElementById('hud-status');
        const counterVal = document.getElementById('counter-val');
        const payoutBanner = document.getElementById('payout-banner');

        if (res.is_win) {
            if (counterVal) counterVal.className = 'counter-val win';
            if (hudStatus) hudStatus.textContent = '🚀 TURBO WIN!';
            if (payoutBanner) {
                payoutBanner.textContent = `+${config.currency}${res.payout.toFixed(2)}`;
                payoutBanner.style.display = 'block';
            }

            audio.playWinFanfare(res.target_multiplier >= 10.0);

            if (warpCanvas) {
                warpCanvas.addExplosion(warpCanvas.width / 2, warpCanvas.height / 2, '#00FF88');
            }

            if (res.target_multiplier >= 10.0 && !state.autoPlaying) {
                showCelebration(res.target_multiplier, res.payout);
            }
        } else {
            if (counterVal) counterVal.className = 'counter-val lose';
            if (hudStatus) hudStatus.textContent = '💥 CRASHED';
            audio.playMissTone();
        }

        addHistoryChip(res.result_multiplier, res.is_win);
    }

    function addHistoryChip(mult, isWin) {
        const ribbon = document.getElementById('hist-scroll');
        if (!ribbon) return;

        let cls = isWin ? (mult >= 10.0 ? 'gold' : 'green') : 'red';
        const chip = document.createElement('span');
        chip.className = `hist-chip ${cls}`;
        chip.textContent = `${mult.toFixed(2)}x`;

        ribbon.prepend(chip);

        while (ribbon.children.length > 12) {
            ribbon.removeChild(ribbon.lastChild);
        }
    }

    // --- Auto Play Logic ---
    window.toggleAutoPlay = function () {
        if (state.autoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    };

    function startAutoPlay() {
        state.autoPlaying = true;
        const btnAuto = document.getElementById('btn-auto');
        const autoTxt = document.getElementById('auto-txt');
        if (btnAuto) btnAuto.classList.add('active');
        if (autoTxt) autoTxt.textContent = 'STOP';

        runAutoLoop();
    }

    function stopAutoPlay() {
        state.autoPlaying = false;
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
        if (!state.autoPlaying) return;
        window.launchBet().then(() => {
            if (state.autoPlaying) {
                state.autoTimer = setTimeout(runAutoLoop, 750);
            }
        });
    }

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
            const resp = await fetch(`/api/limbo/state.php?token=${encodeURIComponent(config.token)}`);
            const data = await resp.json();
            if (data.code === 0 && data.data) {
                updateBalanceUI(data.data.wallet_balance);
            }
        } catch (err) {
            console.error('Refresh state error:', err);
        } finally {
            if (spinner) setTimeout(() => spinner.classList.remove('spin'), 500);
        }
    }

    // --- DOM Init ---
    document.addEventListener('DOMContentLoaded', async () => {
        warpCanvas = new WarpCanvas('warp-canvas');
        updateCalculations();
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
                localStorage.setItem('lb_sound', state.soundEnabled ? '1' : '0');
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
