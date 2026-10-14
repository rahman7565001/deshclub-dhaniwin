/**
 * Space Dice - Cyber Cosmic Arcade Client Engine
 * Features: 60FPS Parallax Starfield & 3D Isometric Cyber Dice Canvas,
 * WebAudio Synthesizer, Slider Drag Math, Twin Pulsar Bets, Supernova Surge & Wallet Sync
 */

(function () {
    'use strict';

    // --- Configuration & State ---
    const config = window.SD_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    const state = {
        mode: 'slider', // 'slider' | 'twindice'
        sliderCondition: 'under', // 'under' | 'over'
        sliderTarget: 50.0,
        twinBet: 'seven', // 'seven' | 'low' | 'high' | 'even' | 'odd' | 'pair' | 'exact'
        exactTarget: 7,
        stake: 10,
        balance: config.initialBalance,
        isRolling: false,
        autoRolling: false,
        autoTimer: null,
        soundEnabled: localStorage.getItem('sd_sound') !== '0',
        lastRollResult: null,
        jackpotPool: 555842.00
    };

    // --- Audio Synthesizer (WebAudio API) ---
    class CosmicAudio {
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

            // Pitch rise laser warp
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.36);
        }

        playDiceTumble() {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // Percussive cyber clack
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320 + Math.random() * 150, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        }

        playWinFanfare(isSupernova = false) {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // Cosmic victory arpeggio: C5, E5, G5, B5, C6
            const notes = isSupernova ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [440, 554.37, 659.25, 880];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = isSupernova ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.09);

                gain.gain.setValueAtTime(0.25, now + i * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.09);
                osc.stop(now + i * 0.09 + 0.32);
            });

            if (isSupernova) {
                // Sub bass supernova boom
                const subOsc = this.ctx.createOscillator();
                const subGain = this.ctx.createGain();
                subOsc.type = 'sine';
                subOsc.frequency.setValueAtTime(90, now);
                subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

                subGain.gain.setValueAtTime(0.5, now);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

                subOsc.connect(subGain);
                subGain.connect(this.ctx.destination);
                subOsc.start(now);
                subOsc.stop(now + 0.62);
            }
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
            osc.frequency.exponentialRampToValueAtTime(130, now + 0.22);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.23);
        }
    }

    const audio = new CosmicAudio();

    // --- HTML5 Canvas Graphics Engine ---
    class CosmicCanvas {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.particles = [];
            this.diceAnim = {
                active: false,
                d1: 1,
                d2: 1,
                rot1: 0,
                rot2: 0,
                progress: 0
            };
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
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    z: Math.random() * 2 + 0.5,
                    size: Math.random() * 1.8 + 0.5,
                    alpha: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.4 + 0.1
                });
            }
        }

        addShockwave(x, y, color = '#00F0FF') {
            for (let i = 0; i < 24; i++) {
                const angle = (Math.PI * 2 / 24) * i;
                const speed = Math.random() * 3 + 2;
                this.particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                    color,
                    size: Math.random() * 3 + 2
                });
            }
        }

        triggerDiceRoll(d1, d2) {
            this.diceAnim = {
                active: true,
                d1,
                d2,
                rot1: 0,
                rot2: 0,
                progress: 0
            };
        }

        loop() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Draw Parallax Starfield
            this.ctx.fillStyle = '#FFFFFF';
            this.stars.forEach(star => {
                star.y += star.speed;
                if (star.y > this.height) {
                    star.y = 0;
                    star.x = Math.random() * this.width;
                }
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                this.ctx.fill();
            });

            // Draw Dynamic Cosmic Nebula Orbs
            const t = Date.now() * 0.001;
            const grad1 = this.ctx.createRadialGradient(
                this.width * 0.25 + Math.sin(t) * 20, this.height * 0.4, 10,
                this.width * 0.25, this.height * 0.4, 120
            );
            grad1.addColorStop(0, 'rgba(157, 78, 221, 0.12)');
            grad1.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad1;
            this.ctx.fillRect(0, 0, this.width, this.height);

            const grad2 = this.ctx.createRadialGradient(
                this.width * 0.75 - Math.cos(t) * 20, this.height * 0.6, 10,
                this.width * 0.75, this.height * 0.6, 120
            );
            grad2.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
            grad2.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad2;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Draw Particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.025;
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life;
                this.ctx.fill();
                this.ctx.globalAlpha = 1.0;
            }

            // Draw Twin Pulsar 3D Isometric Cybernetic Dice (When in Twin Dice Mode)
            if (state.mode === 'twindice') {
                this.drawTwinDice();
            }

            requestAnimationFrame(() => this.loop());
        }

        drawTwinDice() {
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            const gap = 64;

            if (this.diceAnim.active) {
                this.diceAnim.progress += 0.04;
                this.diceAnim.rot1 += 0.35;
                this.diceAnim.rot2 -= 0.35;
                if (this.diceAnim.progress >= 1.0) {
                    this.diceAnim.active = false;
                }
            }

            const d1Face = this.diceAnim.active ? Math.floor(Math.random() * 6) + 1 : this.diceAnim.d1;
            const d2Face = this.diceAnim.active ? Math.floor(Math.random() * 6) + 1 : this.diceAnim.d2;

            this.renderCyberDie(centerX - gap, centerY, d1Face, this.diceAnim.rot1, '#00F0FF');
            this.renderCyberDie(centerX + gap, centerY, d2Face, this.diceAnim.rot2, '#9D4EDD');
        }

        renderCyberDie(cx, cy, face, rotation, neonColor) {
            const size = 52;
            this.ctx.save();
            this.ctx.translate(cx, cy);
            if (this.diceAnim.active) {
                this.ctx.rotate(rotation);
            }

            // Die outer shadow / neon halo
            this.ctx.shadowColor = neonColor;
            this.ctx.shadowBlur = 18;

            // Die face body
            this.ctx.fillStyle = 'rgba(12, 16, 42, 0.95)';
            this.ctx.strokeStyle = neonColor;
            this.ctx.lineWidth = 2.5;

            this.roundRect(-size / 2, -size / 2, size, size, 12, true, true);
            this.ctx.shadowBlur = 0; // reset

            // Draw Cybernetic Corner Tech Lines
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(-size / 2 + 5, -size / 2 + 5, size - 10, size - 10);

            // Render Dice Pips
            this.drawPips(face, size, neonColor);

            this.ctx.restore();
        }

        roundRect(x, y, w, h, r, fill, stroke) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + r, y);
            this.ctx.lineTo(x + w - r, y);
            this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            this.ctx.lineTo(x + w, y + h - r);
            this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.ctx.lineTo(x + r, y + h);
            this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            this.ctx.lineTo(x, y + r);
            this.ctx.quadraticCurveTo(x, y, x + r, y);
            this.ctx.closePath();
            if (fill) this.ctx.fill();
            if (stroke) this.ctx.stroke();
        }

        drawPips(face, size, color) {
            const r = 4.2;
            const offset = size * 0.25;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 8;

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
            this.ctx.shadowBlur = 0;
        }
    }

    let canvasEngine = null;

    // --- Math & UI Updates ---
    function updateSliderMath() {
        let winChance = 50.0;
        if (state.sliderCondition === 'under') {
            winChance = state.sliderTarget;
        } else {
            winChance = 100.0 - state.sliderTarget;
        }
        winChance = Math.max(1.0, Math.min(98.0, winChance));

        const multiplier = (98.5 / winChance).toFixed(2);
        const estWin = (state.stake * multiplier).toFixed(2);

        const elChance = document.getElementById('slider-chance');
        const elMult = document.getElementById('slider-mult');
        const elEstWin = document.getElementById('slider-est-win');
        const elThumbTip = document.getElementById('thumb-tip');
        const elSliderFill = document.getElementById('slider-fill');
        const elSliderThumb = document.getElementById('slider-thumb');
        const elCondUnderVal = document.getElementById('cond-under-val');
        const elCondOverVal = document.getElementById('cond-over-val');

        if (elChance) elChance.textContent = winChance.toFixed(2) + '%';
        if (elMult) elMult.textContent = multiplier + 'x';
        if (elEstWin) elEstWin.textContent = config.currency + ' ' + estWin;

        const percent = state.sliderTarget.toFixed(2);
        if (elThumbTip) elThumbTip.textContent = percent;
        if (elSliderFill) elSliderFill.style.width = percent + '%';
        if (elSliderThumb) elSliderThumb.style.left = percent + '%';

        if (elCondUnderVal) elCondUnderVal.textContent = '< ' + percent;
        if (elCondOverVal) elCondOverVal.textContent = '> ' + percent;
    }

    function updateStakeDisplay() {
        const elDisplay = document.getElementById('display-stake');
        if (elDisplay) {
            elDisplay.textContent = state.stake;
        }
        updateSliderMath();
    }

    function updateBalanceUI(val) {
        state.balance = Number(val);
        const el = document.getElementById('user-balance');
        if (el) {
            el.textContent = state.balance.toFixed(2);
        }
    }

    // --- Global Controls Expose ---
    window.switchGameMode = function (mode) {
        state.mode = mode;
        const tabSlider = document.getElementById('tab-slider');
        const tabTwin = document.getElementById('tab-twindice');
        const secSlider = document.getElementById('section-slider');
        const secTwin = document.getElementById('section-twindice');
        const rollLabel = document.getElementById('roll-label');
        const rollNumber = document.getElementById('roll-number');
        const hud = document.querySelector('.roll-result-hud');

        if (mode === 'slider') {
            tabSlider.classList.add('active');
            tabTwin.classList.remove('active');
            secSlider.style.display = 'block';
            secTwin.style.display = 'none';
            if (hud) hud.style.display = 'block';
            if (rollLabel) rollLabel.textContent = 'LAST ROLL';
            if (rollNumber) rollNumber.textContent = '50.00';
        } else {
            tabTwin.classList.add('active');
            tabSlider.classList.remove('active');
            secSlider.style.display = 'none';
            secTwin.style.display = 'block';
            // In twindice, canvas renders the dice prominently
            if (hud) hud.style.display = 'none';
        }
    };

    window.setCondition = function (cond) {
        state.sliderCondition = cond;
        const btnUnder = document.getElementById('btn-under');
        const btnOver = document.getElementById('btn-over');
        if (cond === 'under') {
            btnUnder.classList.add('active');
            btnOver.classList.remove('active');
        } else {
            btnOver.classList.add('active');
            btnUnder.classList.remove('active');
        }
        updateSliderMath();
    };

    window.setTwinBet = function (betType) {
        state.twinBet = betType;
        document.querySelectorAll('.btn-dice-bet').forEach(b => {
            b.classList.toggle('active', b.dataset.bet === betType);
        });
        document.querySelectorAll('.chip-sum').forEach(c => c.classList.remove('active'));
    };

    window.setExactSum = function (sum) {
        state.twinBet = 'exact';
        state.exactTarget = sum;
        document.querySelectorAll('.btn-dice-bet').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.chip-sum').forEach(c => {
            c.classList.toggle('active', Number(c.dataset.sum) === sum);
        });
    };

    window.setStake = function (amount) {
        state.stake = Math.max(10, Math.min(50000, Number(amount)));
        document.querySelectorAll('.chips-tray .chip').forEach(c => {
            c.classList.toggle('active', Number(c.textContent.replace('K', '000')) === state.stake);
        });
        updateStakeDisplay();
    };

    window.changeStake = function (delta) {
        state.stake = Math.max(10, Math.min(50000, state.stake + delta));
        updateStakeDisplay();
    };

    window.adjustStake = function (type) {
        if (type === 'half') {
            state.stake = Math.max(10, Math.floor(state.stake / 2));
        } else if (type === 'double') {
            state.stake = Math.min(50000, state.stake * 2);
        } else if (type === 'max') {
            state.stake = Math.max(10, Math.min(50000, Math.floor(state.balance)));
        }
        updateStakeDisplay();
    };

    // --- Slider Drag Physics ---
    function initSliderPhysics() {
        const track = document.getElementById('slider-track');
        if (!track) return;

        let isDragging = false;

        function computeTargetFromEvent(e) {
            const rect = track.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let offset = clientX - rect.left;
            offset = Math.max(0, Math.min(rect.width, offset));
            const pct = (offset / rect.width) * 100;
            // Clamped to 1.00 - 98.00
            state.sliderTarget = Math.max(1.0, Math.min(98.0, Math.round(pct * 10) / 10));
            updateSliderMath();
        }

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            computeTargetFromEvent(e);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                computeTargetFromEvent(e);
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            computeTargetFromEvent(e);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging) {
                computeTargetFromEvent(e);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // --- Launch Roll Execution ---
    window.launchRoll = async function () {
        if (state.isRolling) return;
        if (state.balance < state.stake) {
            alert('Insufficient balance. Please recharge your wallet.');
            stopAutoRoll();
            return;
        }

        state.isRolling = true;
        const btnLaunch = document.getElementById('btn-launch');
        if (btnLaunch) btnLaunch.classList.add('disabled');

        audio.playWarpLaunch();

        // Local optimistic stake deduction
        updateBalanceUI(state.balance - state.stake);

        // Animate result display while waiting
        const elRollNum = document.getElementById('roll-number');
        const elPayout = document.getElementById('payout-badge');
        if (elRollNum) {
            elRollNum.className = 'roll-number';
            elRollNum.textContent = '...';
        }
        if (elPayout) elPayout.textContent = 'CALCULATING...';

        if (canvasEngine) {
            canvasEngine.addShockwave(canvasEngine.width / 2, canvasEngine.height / 2, '#00F0FF');
            if (state.mode === 'twindice') {
                canvasEngine.triggerDiceRoll(3, 4);
                audio.playDiceTumble();
            }
        }

        const payload = {
            token: config.token,
            mode: state.mode,
            stake: state.stake,
            condition: state.sliderCondition,
            target: state.sliderTarget,
            bet_type: state.twinBet,
            exact_target: state.exactTarget
        };

        try {
            const resp = await fetch('/api/space_dice/roll.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();

            if (data.code !== 0) {
                alert(data.msg || 'Roll error');
                refreshState();
                state.isRolling = false;
                if (btnLaunch) btnLaunch.classList.remove('disabled');
                return;
            }

            const res = data.data;
            handleRollSuccess(res);
        } catch (err) {
            console.error('Space dice roll error:', err);
            refreshState();
        } finally {
            state.isRolling = false;
            if (btnLaunch) btnLaunch.classList.remove('disabled');
        }
    };

    function handleRollSuccess(res) {
        updateBalanceUI(res.wallet_balance);

        const elRollNum = document.getElementById('roll-number');
        const elPayout = document.getElementById('payout-badge');
        const supernovaBanner = document.getElementById('supernova-banner');

        if (state.mode === 'slider') {
            if (elRollNum) {
                elRollNum.textContent = Number(res.roll_result).toFixed(2);
                elRollNum.className = 'roll-number ' + (res.is_win ? 'win' : 'lose');
            }
        } else {
            // Twin dice: Update canvas with final dice faces
            if (canvasEngine && res.dices) {
                canvasEngine.diceAnim.d1 = res.dices[0];
                canvasEngine.diceAnim.d2 = res.dices[1];
                canvasEngine.diceAnim.active = false;
            }
        }

        if (elPayout) {
            if (res.is_win) {
                elPayout.textContent = `+${config.currency}${res.payout.toFixed(2)} (${res.multiplier}x)`;
                elPayout.style.color = '#FFD700';
            } else {
                elPayout.textContent = 'NO HIT';
                elPayout.style.color = '#8E9BB0';
            }
        }

        // Supernova Banner Flash
        if (res.is_supernova && supernovaBanner) {
            supernovaBanner.classList.add('show');
            setTimeout(() => supernovaBanner.classList.remove('show'), 3500);
        }

        // Sound & Celebration
        if (res.is_win) {
            audio.playWinFanfare(res.is_supernova);
            if (canvasEngine) {
                canvasEngine.addShockwave(
                    canvasEngine.width / 2,
                    canvasEngine.height / 2,
                    res.is_supernova ? '#FFD700' : '#00FF88'
                );
            }

            if (res.multiplier >= 5.0 || res.is_supernova) {
                showCelebration(res.payout, res.is_supernova);
            }
        } else {
            audio.playMissTone();
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
        window.launchRoll().then(() => {
            if (state.autoRolling) {
                state.autoTimer = setTimeout(runAutoLoop, 1100);
            }
        });
    }

    // --- Celebration & Modal Controls ---
    function showCelebration(amount, isSupernova) {
        const modal = document.getElementById('celebration-modal');
        const elAmt = document.getElementById('celeb-amount');
        const elBadge = document.getElementById('celeb-badge');
        const elSub = document.getElementById('celeb-sub');
        const elIco = document.getElementById('celeb-icon');

        if (!modal) return;
        if (elAmt) elAmt.textContent = `+${config.currency}${amount.toFixed(2)}`;
        if (elBadge) elBadge.textContent = isSupernova ? '💥 SUPERNOVA JACKPOT SURGE! 💥' : '🚀 COSMIC BIG WIN! 🚀';
        if (elSub) elSub.textContent = isSupernova ? '2X MULTIPLIER BOOST ACTIVATED' : 'INTERSTELLAR CASINO GLORY';
        if (elIco) elIco.textContent = isSupernova ? '🌌' : '🪐';

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
            const resp = await fetch(`/api/space_dice/state.php?token=${encodeURIComponent(config.token)}`);
            const data = await resp.json();
            if (data.code === 0 && data.data) {
                updateBalanceUI(data.data.balance);
                if (data.data.jackpot_pool) {
                    const elJp = document.getElementById('jp-val');
                    if (elJp) elJp.textContent = Number(data.data.jackpot_pool).toLocaleString('en-US', { minimumFractionDigits: 2 });
                }
            }
        } catch (err) {
            console.error('Refresh state error:', err);
        } finally {
            if (spinner) setTimeout(() => spinner.classList.remove('spin'), 500);
        }
    }

    // --- DOM Init ---
    document.addEventListener('DOMContentLoaded', () => {
        canvasEngine = new CosmicCanvas('space-canvas');
        initSliderPhysics();
        updateSliderMath();
        updateStakeDisplay();

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
                localStorage.setItem('sd_sound', state.soundEnabled ? '1' : '0');
                btnSound.textContent = state.soundEnabled ? '🔊' : '🔇';
                if (state.soundEnabled) audio.init();
            });
        }

        document.getElementById('btn-info')?.addEventListener('click', () => {
            const modal = document.getElementById('rules-modal');
            if (modal) modal.classList.add('show');
        });

        // Jackpot ticker incremental crawl
        setInterval(() => {
            state.jackpotPool += (Math.random() * 2.5 + 0.5);
            const elJp = document.getElementById('jp-val');
            if (elJp) elJp.textContent = state.jackpotPool.toLocaleString('en-US', { minimumFractionDigits: 2 });
        }, 3000);
    });

})();
