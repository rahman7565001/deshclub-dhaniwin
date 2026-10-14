/**
 * Plinko - Cyber Arcade Client Engine
 * Features: High-DPI Canvas Peg Pyramid, Multi-ball Elastic Physics & Collision Trails,
 * WebAudio Dynamic Chimes, Multiplier Buckets, Multi-Drop Spam & Wallet Sync
 */

(function () {
    'use strict';

    // --- Configuration & State ---
    const config = window.PK_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    const state = {
        rows: 16,
        risk: 'medium',
        stake: 10,
        balance: config.initialBalance,
        multipliersTable: {},
        soundEnabled: localStorage.getItem('pk_sound') !== '0',
        autoDropping: false,
        autoTimer: null,
        activeBalls: [],
        pegs: [],
        buckets: [],
        particles: []
    };

    // --- Audio Synthesizer (WebAudio API) ---
    class PlinkoAudio {
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

        playPegChime(row, totalRows) {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // Pitch rises as ball travels down: 400Hz to 850Hz
            const baseFreq = 400 + (row / totalRows) * 450 + (Math.random() * 30 - 15);

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        }

        playBucketLand(mult) {
            if (!state.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            if (mult >= 10.0) {
                // High Multiplier Victory Fanfare
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + i * 0.07);

                    gain.gain.setValueAtTime(0.25, now + i * 0.07);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.28);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + i * 0.07);
                    osc.stop(now + i * 0.07 + 0.3);
                });
            } else if (mult >= 1.5) {
                // Small Win Pop
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.13);
            } else {
                // Minor / Loss Thud
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.09);
            }
        }
    }

    const audio = new PlinkoAudio();

    // --- HTML5 Canvas Engine ---
    class PlinkoCanvas {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.width = 0;
            this.height = 0;
            this.topY = 40;
            this.bottomY = 0;
            this.rowSpacing = 0;
            this.resize();
            window.addEventListener('resize', () => {
                this.resize();
                this.buildPyramid();
            });
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
            this.bottomY = this.height - 48;
            this.buildPyramid();
        }

        buildPyramid() {
            state.pegs = [];
            state.buckets = [];
            const R = state.rows;
            const availableHeight = this.bottomY - this.topY;
            this.rowSpacing = availableHeight / (R + 1);

            const pegRadius = R >= 14 ? 3.0 : 3.8;

            // Generate Peg Coordinates
            // Row 0 has 3 pegs, Row 1 has 4 pegs... Row (R-1) has R+2 pegs
            for (let r = 0; r < R; r++) {
                const count = r + 3;
                const y = this.topY + (r + 1) * this.rowSpacing;
                // Peg horizontal spacing
                const spacingX = Math.min(32, (this.width - 40) / (R + 3));
                const startX = (this.width - (count - 1) * spacingX) / 2;

                const rowPegs = [];
                for (let c = 0; c < count; c++) {
                    rowPegs.push({
                        x: startX + c * spacingX,
                        y: y,
                        radius: pegRadius,
                        flash: 0
                    });
                }
                state.pegs.push(rowPegs);
            }

            // Generate Buckets at the Bottom (R + 1 buckets)
            const bucketCount = R + 1;
            const bucketY = this.bottomY + 8;
            const spacingX = Math.min(32, (this.width - 40) / (R + 3));
            const totalWidth = (bucketCount - 1) * spacingX;
            const startX = (this.width - totalWidth) / 2;
            const bucketWidth = spacingX * 0.88;
            const bucketHeight = 24;

            const mults = state.multipliersTable[state.rows]?.[state.risk] || [];

            for (let i = 0; i < bucketCount; i++) {
                const cx = startX + i * spacingX;
                const mult = mults[i] !== undefined ? mults[i] : 1.0;
                state.buckets.push({
                    index: i,
                    x: cx - bucketWidth / 2,
                    y: bucketY,
                    w: bucketWidth,
                    h: bucketHeight,
                    cx: cx,
                    multiplier: mult,
                    color: this.getBucketColor(i, bucketCount, mult),
                    bounce: 0
                });
            }
        }

        getBucketColor(index, count, mult) {
            const mid = (count - 1) / 2;
            const dist = Math.abs(index - mid) / mid; // 0 at center, 1 at edges

            if (mult >= 100.0) return { bg: '#FF0055', text: '#FFFFFF', glow: '#FF0055' };
            if (mult >= 20.0) return { bg: '#FF5500', text: '#FFFFFF', glow: '#FF5500' };
            if (mult >= 5.0)  return { bg: '#FFAA00', text: '#000000', glow: '#FFAA00' };
            if (mult >= 2.0)  return { bg: '#FFD700', text: '#000000', glow: '#FFD700' };
            if (mult >= 1.0)  return { bg: '#00F0FF', text: '#000000', glow: '#00F0FF' };
            return { bg: '#9D4EDD', text: '#FFFFFF', glow: '#9D4EDD' };
        }

        spawnBall(dropData) {
            const R = state.rows;
            const startX = this.width / 2 + (Math.random() * 4 - 2);
            const startY = this.topY - 8;

            // Target peg coordinates path
            const waypoints = [];
            let currentCol = 1; // start above row 0 center peg
            waypoints.push({ x: startX, y: startY });

            for (let r = 0; r < R; r++) {
                const decision = dropData.path[r]; // 0 = left, 1 = right
                if (decision === 1) {
                    currentCol += 1;
                }
                const rowPegs = state.pegs[r];
                if (rowPegs) {
                    const peg = rowPegs[Math.min(rowPegs.length - 1, Math.max(0, currentCol))];
                    if (peg) {
                        waypoints.push({ x: peg.x, y: peg.y, pegRef: peg, row: r });
                    }
                }
            }

            // Final waypoint is the bucket slot
            const bucket = state.buckets[dropData.slot_index];
            if (bucket) {
                waypoints.push({
                    x: bucket.cx,
                    y: bucket.y + 4,
                    bucketRef: bucket,
                    isFinal: true
                });
            }

            state.activeBalls.push({
                uuid: dropData.drop_uuid,
                stake: dropData.stake,
                multiplier: dropData.multiplier,
                payout: dropData.payout,
                slotIndex: dropData.slot_index,
                x: startX,
                y: startY,
                waypoints: waypoints,
                wpIndex: 0,
                progress: 0,
                speed: 0.12, // Progress step per frame
                radius: R >= 14 ? 4.5 : 5.5,
                trail: []
            });

            this.updateBallsCounter();
        }

        updateBallsCounter() {
            const badge = document.getElementById('balls-active-badge');
            const countEl = document.getElementById('balls-count');
            const cnt = state.activeBalls.length;
            if (badge && countEl) {
                countEl.textContent = cnt;
                badge.style.display = cnt > 1 ? 'flex' : 'none';
            }
        }

        addBucketImpactParticles(x, y, color) {
            for (let i = 0; i < 16; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3 + 1;
                state.particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.5,
                    life: 1.0,
                    size: Math.random() * 2.5 + 1.5,
                    color
                });
            }
        }

        loop() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // 1. Draw Multiplier Buckets at Bottom
            this.drawBuckets();

            // 2. Draw Pegs with Glow & Flash
            this.drawPegs();

            // 3. Update & Draw Particles
            this.drawParticles();

            // 4. Update & Draw Active Balls
            this.updateBalls();

            requestAnimationFrame(() => this.loop());
        }

        drawPegs() {
            for (let r = 0; r < state.pegs.length; r++) {
                const row = state.pegs[r];
                for (let c = 0; c < row.length; c++) {
                    const peg = row[c];
                    if (peg.flash > 0) {
                        peg.flash -= 0.05;
                    }

                    this.ctx.beginPath();
                    this.ctx.arc(peg.x, peg.y, peg.radius + (peg.flash > 0 ? peg.flash * 2 : 0), 0, Math.PI * 2);

                    if (peg.flash > 0.01) {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.shadowColor = '#00F0FF';
                        this.ctx.shadowBlur = 12 * peg.flash;
                    } else {
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                        this.ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
                        this.ctx.shadowBlur = 4;
                    }
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                }
            }
        }

        drawBuckets() {
            const fontSize = state.rows >= 14 ? 8 : 9;
            this.ctx.font = `bold ${fontSize}px 'Orbitron', monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            for (let i = 0; i < state.buckets.length; i++) {
                const b = state.buckets[i];
                if (b.bounce > 0) {
                    b.bounce -= 0.08;
                }

                const offsetY = b.bounce > 0 ? Math.sin(b.bounce * Math.PI) * 4 : 0;

                // Bucket body
                this.ctx.fillStyle = b.color.bg;
                if (b.bounce > 0.05) {
                    this.ctx.shadowColor = b.color.glow;
                    this.ctx.shadowBlur = 14;
                }
                this.roundRect(b.x, b.y + offsetY, b.w, b.h, 4, true, false);
                this.ctx.shadowBlur = 0;

                // Bucket text
                this.ctx.fillStyle = b.color.text;
                let txt = b.multiplier >= 100 ? Math.round(b.multiplier) : (b.multiplier >= 10 ? b.multiplier : b.multiplier.toFixed(1));
                if (txt == 1.0) txt = '1';
                this.ctx.fillText(txt, b.cx, b.y + b.h / 2 + offsetY);
            }
        }

        drawParticles() {
            for (let i = state.particles.length - 1; i >= 0; i--) {
                const p = state.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.08; // gravity
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

        updateBalls() {
            for (let i = state.activeBalls.length - 1; i >= 0; i--) {
                const ball = state.activeBalls[i];

                // Append trail
                ball.trail.push({ x: ball.x, y: ball.y, alpha: 0.6 });
                if (ball.trail.length > 5) {
                    ball.trail.shift();
                }

                // Draw trail
                for (let t = 0; t < ball.trail.length; t++) {
                    const pt = ball.trail[t];
                    pt.alpha -= 0.08;
                    if (pt.alpha > 0) {
                        this.ctx.beginPath();
                        this.ctx.arc(pt.x, pt.y, ball.radius * (t / ball.trail.length), 0, Math.PI * 2);
                        this.ctx.fillStyle = `rgba(0, 255, 136, ${pt.alpha * 0.4})`;
                        this.ctx.fill();
                    }
                }

                // Interpolate along waypoints with arc/parabola physics
                const p0 = ball.waypoints[ball.wpIndex];
                const p1 = ball.waypoints[ball.wpIndex + 1];

                if (!p1) {
                    // Ball arrived at destination bucket
                    this.onBallLanded(ball);
                    state.activeBalls.splice(i, 1);
                    this.updateBallsCounter();
                    continue;
                }

                ball.progress += ball.speed;

                if (ball.progress >= 1.0) {
                    ball.progress = 0;
                    ball.wpIndex += 1;
                    ball.x = p1.x;
                    ball.y = p1.y;

                    // Trigger peg flash & chime
                    if (p1.pegRef) {
                        p1.pegRef.flash = 1.0;
                        audio.playPegChime(p1.row, state.rows);
                    }
                } else {
                    // Parabolic bounce arc between waypoints
                    const t = ball.progress;
                    const dx = p1.x - p0.x;
                    const dy = p1.y - p0.y;
                    const arcOffset = Math.sin(t * Math.PI) * -8; // slight upward pop on bounce

                    ball.x = p0.x + dx * t;
                    ball.y = p0.y + dy * t + arcOffset;
                }

                // Draw Ball
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = '#00FF88';
                this.ctx.shadowColor = '#00FF88';
                this.ctx.shadowBlur = 12;
                this.ctx.fill();

                // Ball glossy highlight
                this.ctx.beginPath();
                this.ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.35, 0, Math.PI * 2);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fill();

                this.ctx.shadowBlur = 0;
            }
        }

        onBallLanded(ball) {
            const bucket = state.buckets[ball.slotIndex];
            if (bucket) {
                bucket.bounce = 1.0;
                this.addBucketImpactParticles(bucket.cx, bucket.y, bucket.color.glow);
            }

            audio.playBucketLand(ball.multiplier);
            addHistoryChip(ball.multiplier);

            // Trigger celebration if high multiplier
            if (ball.multiplier >= 10.0 && !state.autoDropping) {
                showCelebration(ball.multiplier, ball.payout);
            }
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
    }

    let plinkoCanvas = null;

    // --- History Ribbon ---
    function addHistoryChip(mult) {
        const ribbon = document.getElementById('hist-scroll');
        if (!ribbon) return;

        let cls = 'dark';
        if (mult >= 100) cls = 'gold';
        else if (mult >= 20) cls = 'cyan';
        else if (mult >= 5) cls = 'purple';
        else if (mult >= 1.5) cls = 'orange';

        const chip = document.createElement('span');
        chip.className = `hist-chip ${cls}`;
        chip.textContent = mult >= 100 ? `${Math.round(mult)}x` : `${mult}x`;

        ribbon.prepend(chip);

        // Limit to 12 items
        while (ribbon.children.length > 12) {
            ribbon.removeChild(ribbon.lastChild);
        }
    }

    // --- Balance & Stake Helpers ---
    function updateBalanceUI(val) {
        state.balance = Number(val);
        const el = document.getElementById('user-balance');
        if (el) {
            el.textContent = state.balance.toFixed(2);
        }
    }

    function updateStakeDisplay() {
        const el = document.getElementById('display-stake');
        if (el) {
            el.textContent = state.stake;
        }
    }

    // --- Global Controls Expose ---
    window.setRisk = function (risk) {
        state.risk = risk;
        document.querySelectorAll('.btn-risk').forEach(b => {
            b.classList.toggle('active', b.dataset.risk === risk);
        });
        if (plinkoCanvas) {
            plinkoCanvas.buildPyramid();
        }
    };

    window.setRows = function (rows) {
        state.rows = Number(rows);
        document.querySelectorAll('.btn-row').forEach(b => {
            b.classList.toggle('active', Number(b.dataset.rows) === state.rows);
        });
        if (plinkoCanvas) {
            plinkoCanvas.buildPyramid();
        }
    };

    window.setStake = function (amt) {
        state.stake = Math.max(10, Math.min(50000, Number(amt)));
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

    // --- Drop Ball Execution ---
    window.dropBall = async function () {
        if (state.balance < state.stake) {
            alert('Insufficient balance. Please recharge.');
            stopAutoDrop();
            return;
        }

        // Optimistic deduction on client
        updateBalanceUI(state.balance - state.stake);

        const payload = {
            token: config.token,
            stake: state.stake,
            rows: state.rows,
            risk: state.risk
        };

        try {
            const resp = await fetch('/api/plinko/drop.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();

            if (data.code !== 0) {
                alert(data.msg || 'Drop error');
                refreshState();
                return;
            }

            const drop = data.data;

            // Update balance with final wallet balance after payout credited
            updateBalanceUI(drop.wallet_balance);

            if (plinkoCanvas) {
                plinkoCanvas.spawnBall(drop);
            }
        } catch (err) {
            console.error('Plinko drop error:', err);
            refreshState();
        }
    };

    // --- Auto Drop Logic ---
    window.toggleAutoDrop = function () {
        if (state.autoDropping) {
            stopAutoDrop();
        } else {
            startAutoDrop();
        }
    };

    function startAutoDrop() {
        state.autoDropping = true;
        const btnAuto = document.getElementById('btn-auto');
        const autoTxt = document.getElementById('auto-txt');
        if (btnAuto) btnAuto.classList.add('active');
        if (autoTxt) autoTxt.textContent = 'STOP';

        runAutoLoop();
    }

    function stopAutoDrop() {
        state.autoDropping = false;
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
        if (!state.autoDropping) return;
        window.dropBall().then(() => {
            if (state.autoDropping) {
                state.autoTimer = setTimeout(runAutoLoop, 450); // fast drop rhythm
            }
        });
    }

    // --- Celebration & Rules Modals ---
    function showCelebration(mult, payout) {
        const modal = document.getElementById('celebration-modal');
        const elMult = document.getElementById('celeb-mult');
        const elAmt = document.getElementById('celeb-amount');
        const elBadge = document.getElementById('celeb-badge');

        if (!modal) return;
        if (elMult) elMult.textContent = `${mult}x`;
        if (elAmt) elAmt.textContent = `+${config.currency}${payout.toFixed(2)}`;
        if (elBadge) elBadge.textContent = mult >= 100 ? '💥 MEGA JACKPOT HIT! 💥' : '🚀 BIG MULTIPLIER! 🚀';

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
            const resp = await fetch(`/api/plinko/state.php?token=${encodeURIComponent(config.token)}`);
            const data = await resp.json();
            if (data.code === 0 && data.data) {
                updateBalanceUI(data.data.wallet_balance);
                state.multipliersTable = data.data.multipliers || {};
                if (plinkoCanvas) {
                    plinkoCanvas.buildPyramid();
                }
            }
        } catch (err) {
            console.error('Refresh state error:', err);
        } finally {
            if (spinner) setTimeout(() => spinner.classList.remove('spin'), 500);
        }
    }

    // --- DOM Init ---
    document.addEventListener('DOMContentLoaded', async () => {
        plinkoCanvas = new PlinkoCanvas('plinko-canvas');
        updateStakeDisplay();

        // Fetch initial state & multiplier catalog
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
                localStorage.setItem('pk_sound', state.soundEnabled ? '1' : '0');
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
