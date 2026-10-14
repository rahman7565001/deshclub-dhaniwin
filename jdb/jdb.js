/**
 * jdb/jdb.js - JDB Gaming Master Suite Frontend Engine
 * Includes: 60 FPS Marine Fishing Hunter + 3x3 Super Niubi Deluxe Slot
 */
(function() {
    'use strict';

    // Global Config & State
    const CONFIG = window.JDB_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0,
        initialMode: 'fishing'
    };

    let userBalance = CONFIG.initialBalance;
    let currentMode = CONFIG.initialMode; // 'fishing' or 'slot'
    let soundEnabled = true;

    // Web Audio Synthesizer
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const Sound = {
        playTone(freq, type, duration, gainLevel = 0.1) {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + duration);
            } catch (e) {}
        },
        cannonShoot() {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(140, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
            } catch (e) {}
        },
        netExplode() {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
            } catch (e) {}
        },
        coinCatch() {
            if (!soundEnabled) return;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((f, idx) => {
                setTimeout(() => Sound.playTone(f, 'sine', 0.18, 0.12), idx * 60);
            });
        },
        bigWin() {
            if (!soundEnabled) return;
            const fanfare = [392, 523, 659, 783, 1046, 1318];
            fanfare.forEach((f, idx) => {
                setTimeout(() => Sound.playTone(f, 'triangle', 0.3, 0.15), idx * 90);
            });
        },
        reelStop() {
            Sound.playTone(180, 'square', 0.08, 0.05);
        }
    };

    // UI Helpers
    function updateBalanceDisplay(newBal) {
        userBalance = Math.max(0, parseFloat(newBal) || 0);
        const el = document.getElementById('user-balance');
        if (el) {
            el.textContent = userBalance.toFixed(2);
        }
    }

    async function refreshBalance() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.parentElement.classList.add('refreshing');
        try {
            const res = await fetch(`/api/jdb/state.php?token=${encodeURIComponent(CONFIG.token)}`);
            const data = await res.json();
            if (data && data.code === 0 && data.data) {
                updateBalanceDisplay(data.data.wallet_balance);
            }
        } catch (e) {}
        finally {
            if (spinner) setTimeout(() => spinner.parentElement.classList.remove('refreshing'), 500);
        }
    }

    // Mode Switching
    window.switchMode = function(mode) {
        if (mode !== 'fishing' && mode !== 'slot') return;
        currentMode = mode;
        document.body.setAttribute('data-mode', mode);

        document.getElementById('tab-fishing').classList.toggle('active', mode === 'fishing');
        document.getElementById('tab-slot').classList.toggle('active', mode === 'slot');

        document.getElementById('view-fishing').classList.toggle('active', mode === 'fishing');
        document.getElementById('view-slot').classList.toggle('active', mode === 'slot');

        if (mode === 'fishing') {
            initFishingCanvas();
        }
    };

    // Lobby Exit
    document.getElementById('btn-lobby').addEventListener('click', () => {
        try {
            window.parent.postMessage('game', '*');
        } catch (e) {}
        window.location.href = '/';
    });

    document.getElementById('balance-box').addEventListener('click', refreshBalance);

    // Sound Toggle
    const btnSound = document.getElementById('btn-sound');
    btnSound.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        btnSound.textContent = soundEnabled ? '🔊' : '🔇';
    });

    /* ========================================================
       DRAGON FISHING ARCADE MODULE
       ======================================================== */
    const FISH_CONFIGS = {
        clownfish: { name: 'Clownfish', mult: 2, icon: '🐠', color: '#ff793f', size: 36, speed: 1.8, maxHp: 1 },
        butterfly: { name: 'Butterfly Fish', mult: 3, icon: '🐟', color: '#fbc531', size: 42, speed: 1.6, maxHp: 2 },
        puffer: { name: 'Pufferfish', mult: 5, icon: '🐡', color: '#e1b12c', size: 50, speed: 1.4, maxHp: 3 },
        turtle: { name: 'Sea Turtle', mult: 10, icon: '🐢', color: '#4cd137', size: 62, speed: 1.1, maxHp: 4 },
        jellyfish: { name: 'Jellyfish', mult: 20, icon: '🪼', color: '#9c88ff', size: 68, speed: 0.9, maxHp: 6 },
        shark: { name: 'Great White Shark', mult: 50, icon: '🦈', color: '#00a8ff', size: 92, speed: 1.4, maxHp: 10 },
        dragon: { name: 'Golden Dragon', mult: 150, icon: '🐲', color: '#f1c40f', size: 120, speed: 0.8, maxHp: 18 },
        caishen: { name: 'Cai Shen', mult: 388, icon: '🧧', color: '#e74c3c', size: 135, speed: 0.7, maxHp: 25 }
    };

    let fishingCanvas = null;
    let ctx = null;
    let canvasW = 800;
    let canvasH = 500;
    let fishingStake = 10;
    let autoFire = false;
    let lockBoss = false;
    let autoFireInterval = null;
    let laserCharge = 35; // 0 to 100

    let fishes = [];
    let bullets = [];
    let nets = [];
    let floatingTexts = [];
    let coins = [];
    let bubbles = [];

    let cannonAngle = -Math.PI / 2;
    let targetX = 400;
    let targetY = 200;

    function initFishingCanvas() {
        fishingCanvas = document.getElementById('fishing-canvas');
        if (!fishingCanvas) return;
        ctx = fishingCanvas.getContext('2d');

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Input listeners
        fishingCanvas.addEventListener('mousemove', onCanvasPointerMove);
        fishingCanvas.addEventListener('mousedown', onCanvasPointerDown);
        fishingCanvas.addEventListener('touchmove', onCanvasTouchMove, { passive: false });
        fishingCanvas.addEventListener('touchstart', onCanvasTouchDown, { passive: false });

        // Seed initial fish
        fishes = [];
        for (let i = 0; i < 12; i++) {
            spawnFish(true);
        }

        // Seed bubbles
        bubbles = [];
        for (let i = 0; i < 20; i++) {
            bubbles.push({
                x: Math.random() * canvasW,
                y: Math.random() * canvasH,
                r: 2 + Math.random() * 4,
                speed: 0.5 + Math.random() * 1.5,
                opacity: 0.2 + Math.random() * 0.4
            });
        }
    }

    function resizeCanvas() {
        const wrapper = document.getElementById('fishing-wrapper');
        if (!wrapper || !fishingCanvas) return;
        const rect = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasW = rect.width;
        canvasH = rect.height;

        fishingCanvas.width = canvasW * dpr;
        fishingCanvas.height = canvasH * dpr;
        ctx.scale(dpr, dpr);
    }

    function onCanvasPointerMove(e) {
        const rect = fishingCanvas.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        updateCannonAim(targetX, targetY);
    }

    function onCanvasPointerDown(e) {
        onCanvasPointerMove(e);
        fireCannon(targetX, targetY);
    }

    function onCanvasTouchMove(e) {
        e.preventDefault();
        if (!e.touches[0]) return;
        const rect = fishingCanvas.getBoundingClientRect();
        targetX = e.touches[0].clientX - rect.left;
        targetY = e.touches[0].clientY - rect.top;
        updateCannonAim(targetX, targetY);
    }

    function onCanvasTouchDown(e) {
        e.preventDefault();
        if (!e.touches[0]) return;
        onCanvasTouchMove(e);
        fireCannon(targetX, targetY);
    }

    function updateCannonAim(tx, ty) {
        const cx = canvasW / 2;
        const cy = canvasH - 10;
        cannonAngle = Math.atan2(ty - cy, tx - cx);
        // Clamp angle so cannon doesn't shoot backwards into floor
        if (cannonAngle > -0.15) cannonAngle = -0.15;
        if (cannonAngle < -Math.PI + 0.15) cannonAngle = -Math.PI + 0.15;
    }

    // Fish Spawning
    function spawnFish(randomX = false) {
        const types = Object.keys(FISH_CONFIGS);
        // Weight distribution: small fish more common, bosses rare
        const r = Math.random();
        let type = 'clownfish';
        if (r < 0.35) type = 'clownfish';
        else if (r < 0.55) type = 'butterfly';
        else if (r < 0.72) type = 'puffer';
        else if (r < 0.84) type = 'turtle';
        else if (r < 0.92) type = 'jellyfish';
        else if (r < 0.97) type = 'shark';
        else if (r < 0.99) type = 'dragon';
        else type = 'caishen';

        const cfg = FISH_CONFIGS[type];
        const dir = Math.random() > 0.5 ? 1 : -1; // 1 = moving right, -1 = moving left
        const startX = randomX ? Math.random() * canvasW : (dir === 1 ? -cfg.size : canvasW + cfg.size);
        const startY = 40 + Math.random() * (canvasH - 140);

        fishes.push({
            id: 'f_' + Math.random().toString(36).substr(2, 7),
            type: type,
            name: cfg.name,
            icon: cfg.icon,
            mult: cfg.mult,
            color: cfg.color,
            size: cfg.size,
            speed: (cfg.speed * (0.8 + Math.random() * 0.4)) * dir,
            dir: dir,
            x: startX,
            y: startY,
            baseY: startY,
            angle: 0,
            swimPhase: Math.random() * Math.PI * 2,
            hp: cfg.maxHp,
            isHit: 0,
            dead: false
        });
    }

    // Stake Selection
    window.setFishingStake = function(val) {
        fishingStake = val;
        document.getElementById('fish-stake-val').textContent = val;
        document.querySelectorAll('#fish-chips .chip').forEach(c => {
            c.classList.toggle('active', parseInt(c.textContent, 10) === val);
        });
    };

    window.fishingChangeStake = function(delta) {
        const stakes = [2, 5, 10, 20, 50, 100, 200, 500];
        let idx = stakes.indexOf(fishingStake);
        if (idx === -1) idx = 2;
        let nextIdx = Math.max(0, Math.min(stakes.length - 1, idx + delta));
        window.setFishingStake(stakes[nextIdx]);
    };

    // Auto Fire & Lock Boss Toggles
    window.toggleAutoFire = function() {
        autoFire = !autoFire;
        const btn = document.getElementById('btn-autofire');
        btn.classList.toggle('active', autoFire);

        if (autoFire) {
            autoFireInterval = setInterval(() => {
                if (currentMode === 'fishing') {
                    if (lockBoss) {
                        aimAtBestBoss();
                    }
                    fireCannon(targetX, targetY);
                }
            }, 380);
        } else {
            clearInterval(autoFireInterval);
            autoFireInterval = null;
        }
    };

    window.toggleLockBoss = function() {
        lockBoss = !lockBoss;
        document.getElementById('btn-lockboss').classList.toggle('active', lockBoss);
        if (lockBoss) {
            aimAtBestBoss();
        }
    };

    function aimAtBestBoss() {
        // Priority: caishen > dragon > shark > jellyfish
        const bossOrder = ['caishen', 'dragon', 'shark', 'jellyfish', 'turtle'];
        for (const type of bossOrder) {
            const boss = fishes.find(f => f.type === type && !f.dead && f.x > 50 && f.x < canvasW - 50);
            if (boss) {
                targetX = boss.x;
                targetY = boss.y;
                updateCannonAim(targetX, targetY);
                break;
            }
        }
    }

    // Firing Cannon
    async function fireCannon(tx, ty) {
        if (userBalance < fishingStake) {
            alert('Insufficient balance! Please recharge.');
            return;
        }

        // Deduct locally for instantaneous responsiveness
        updateBalanceDisplay(userBalance - fishingStake);

        Sound.cannonShoot();

        // Increment laser meter
        laserCharge = Math.min(100, laserCharge + 2);
        updateLaserBar();

        const cx = canvasW / 2;
        const cy = canvasH - 10;
        const angle = Math.atan2(ty - cy, tx - cx);

        // Bullet projectile
        bullets.push({
            x: cx + Math.cos(angle) * 35,
            y: cy + Math.sin(angle) * 35,
            vx: Math.cos(angle) * 14,
            vy: Math.sin(angle) * 14,
            targetX: tx,
            targetY: ty,
            stake: fishingStake,
            angle: angle,
            alive: true
        });

        // Determine target fish closest to target point
        let closestFish = null;
        let minDist = 70;
        for (const f of fishes) {
            if (f.dead) continue;
            const dist = Math.hypot(f.x - tx, f.y - ty);
            if (dist < f.size * 0.8 && dist < minDist) {
                minDist = dist;
                closestFish = f;
            }
        }

        const targetFishType = closestFish ? closestFish.type : 'clownfish';

        // Call backend API
        try {
            const res = await fetch('/api/jdb/shoot.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: CONFIG.token,
                    stake: fishingStake,
                    fish_type: targetFishType
                })
            });
            const data = await res.json();
            if (data && data.code === 0 && data.data) {
                const d = data.data;
                updateBalanceDisplay(d.wallet_balance);

                if (d.is_caught && closestFish) {
                    onFishCaught(closestFish, d.payout, d.multiplier);
                }
            }
        } catch (e) {}
    }

    function onFishCaught(fish, payout, multiplier) {
        fish.dead = true;
        Sound.coinCatch();

        // Spawn gold coins fountain
        const coinCount = Math.min(18, Math.max(6, Math.floor(multiplier / 3)));
        for (let i = 0; i < coinCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            coins.push({
                x: fish.x,
                y: fish.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                alpha: 1.0,
                scale: 1.0
            });
        }

        // Floating win text
        floatingTexts.push({
            text: `+${CONFIG.currency}${payout.toFixed(2)} (${multiplier}x)`,
            x: fish.x,
            y: fish.y - 20,
            vy: -1.2,
            alpha: 1.0,
            color: multiplier >= 50 ? '#FFD700' : '#4cd137',
            size: multiplier >= 50 ? 22 : 16
        });

        // Check if mega boss catch -> celebration modal
        if (multiplier >= 50) {
            triggerCelebration(fish.icon, `+${CONFIG.currency}${payout.toFixed(2)}`, `${fish.name.toUpperCase()} CAUGHT!`);
        }
    }

    function updateLaserBar() {
        const fill = document.getElementById('laser-fill');
        const btn = document.getElementById('btn-laser');
        if (fill) fill.style.width = laserCharge + '%';
        if (btn) btn.disabled = (laserCharge < 100);
    }

    // Laser Cannon Trigger
    document.getElementById('btn-laser').addEventListener('click', () => {
        if (laserCharge < 100) return;
        laserCharge = 0;
        updateLaserBar();
        Sound.bigWin();

        // Screen shake & full laser beam capture!
        nets.push({
            x: canvasW / 2,
            y: canvasH / 2,
            r: 5,
            maxR: Math.max(canvasW, canvasH),
            alpha: 1.0,
            isMegaLaser: true
        });

        // Award catch on 2-3 fishes
        fishes.forEach(f => {
            if (!f.dead && Math.random() < 0.5) {
                f.dead = true;
                const payout = fishingStake * f.mult;
                onFishCaught(f, payout, f.mult);
            }
        });
    });

    // 60 FPS Render Loop
    function renderFishingLoop() {
        if (currentMode === 'fishing' && ctx) {
            ctx.clearRect(0, 0, canvasW, canvasH);

            // 1. Water Caustic Lighting & Rays
            drawCaustics();

            // 2. Rising Bubbles
            drawBubbles();

            // 3. Update & Draw Fishes
            updateAndDrawFishes();

            // 4. Update & Draw Bullets
            updateAndDrawBullets();

            // 5. Update & Draw Expanding Nets
            updateAndDrawNets();

            // 6. Update & Draw Coins Fountain
            updateAndDrawCoins();

            // 7. Update & Draw Floating Texts
            updateAndDrawTexts();

            // 8. Draw Player Cannon
            drawCannon();

            // 9. Draw Crosshair
            drawCrosshair();
        }

        requestAnimationFrame(renderFishingLoop);
    }

    function drawCaustics() {
        const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
        grad.addColorStop(0.5, 'rgba(0, 100, 200, 0.03)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW, canvasH);
    }

    function drawBubbles() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        bubbles.forEach(b => {
            b.y -= b.speed;
            if (b.y < -10) {
                b.y = canvasH + 10;
                b.x = Math.random() * canvasW;
            }
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateAndDrawFishes() {
        // Maintain fish density
        if (fishes.length < 14) {
            spawnFish(false);
        }

        for (let i = fishes.length - 1; i >= 0; i--) {
            const f = fishes[i];
            f.swimPhase += 0.06;
            f.x += f.speed;
            f.y = f.baseY + Math.sin(f.swimPhase) * 12;

            // Remove fish if out of bounds or dead
            if ((f.dir === 1 && f.x > canvasW + f.size * 2) || (f.dir === -1 && f.x < -f.size * 2) || f.dead) {
                fishes.splice(i, 1);
                continue;
            }

            // Draw Fish Icon & Multiplier Badge
            ctx.save();
            ctx.translate(f.x, f.y);
            if (f.dir === -1) {
                ctx.scale(-1, 1);
            }

            // Glow aura for high tier fish
            if (f.mult >= 50) {
                ctx.shadowColor = f.color;
                ctx.shadowBlur = 15;
            }

            ctx.font = `${f.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(f.icon, 0, 0);

            // Multiplier tag above fish
            ctx.shadowBlur = 0;
            ctx.font = 'bold 11px Montserrat';
            ctx.fillStyle = f.color;
            ctx.fillText(`${f.mult}x`, 0, -f.size / 2 - 2);

            ctx.restore();
        }
    }

    function updateAndDrawBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += b.vx;
            b.y += b.vy;

            // Check if bullet reached target or hit canvas boundary
            const dist = Math.hypot(b.x - b.targetX, b.y - b.targetY);
            if (dist < 15 || b.x < 0 || b.x > canvasW || b.y < 0) {
                // Explode into plasma capture net
                nets.push({
                    x: b.x,
                    y: b.y,
                    r: 8,
                    maxR: 45 + b.stake * 0.1,
                    alpha: 1.0,
                    isMegaLaser: false
                });
                Sound.netExplode();
                bullets.splice(i, 1);
                continue;
            }

            // Draw glowing plasma orb projectile
            ctx.save();
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function updateAndDrawNets() {
        for (let i = nets.length - 1; i >= 0; i--) {
            const n = nets[i];
            n.r += n.isMegaLaser ? 25 : 4;
            n.alpha -= n.isMegaLaser ? 0.02 : 0.06;

            if (n.alpha <= 0 || n.r >= n.maxR) {
                nets.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.strokeStyle = n.isMegaLaser ? `rgba(255, 215, 0, ${n.alpha})` : `rgba(0, 240, 255, ${n.alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = n.isMegaLaser ? '#FFD700' : '#00F0FF';
            ctx.shadowBlur = 10;

            // Concentric capture rings with radial spokes (electric web)
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 0.6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function updateAndDrawCoins() {
        for (let i = coins.length - 1; i >= 0; i--) {
            const c = coins[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.2; // gravity
            c.alpha -= 0.025;

            if (c.alpha <= 0) {
                coins.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.font = '18px Arial';
            ctx.globalAlpha = Math.max(0, c.alpha);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🪙', c.x, c.y);
            ctx.restore();
        }
    }

    function updateAndDrawTexts() {
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const t = floatingTexts[i];
            t.y += t.vy;
            t.alpha -= 0.02;

            if (t.alpha <= 0) {
                floatingTexts.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, t.alpha);
            ctx.font = `bold ${t.size}px Montserrat`;
            ctx.fillStyle = t.color;
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 6;
            ctx.textAlign = 'center';
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        }
    }

    function drawCannon() {
        const cx = canvasW / 2;
        const cy = canvasH - 5;

        ctx.save();
        ctx.translate(cx, cy);

        // Cannon Base Turret
        ctx.beginPath();
        ctx.arc(0, 0, 36, Math.PI, 0);
        const baseGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 36);
        baseGrad.addColorStop(0, '#FFD700');
        baseGrad.addColorStop(1, '#8B5A00');
        ctx.fillStyle = baseGrad;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFE066';
        ctx.stroke();

        // Rotate Cannon Barrel
        ctx.rotate(cannonAngle + Math.PI / 2);

        // Barrel styling according to stake
        if (fishingStake >= 100) {
            // Triple Golden Dragon Barrel
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(-14, -48, 8, 45);
            ctx.fillRect(6, -48, 8, 45);
            ctx.fillRect(-4, -54, 8, 50);
        } else if (fishingStake >= 20) {
            // Double Barrel
            ctx.fillStyle = '#00F0FF';
            ctx.fillRect(-10, -46, 8, 42);
            ctx.fillRect(2, -46, 8, 42);
        } else {
            // Single Barrel
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(-6, -44, 12, 40);
        }

        ctx.restore();
    }

    function drawCrosshair() {
        if (!targetX || !targetY) return;
        ctx.save();
        ctx.strokeStyle = lockBoss ? '#FF416C' : 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(targetX - 20, targetY);
        ctx.lineTo(targetX + 20, targetY);
        ctx.moveTo(targetX, targetY - 20);
        ctx.lineTo(targetX, targetY + 20);
        ctx.stroke();
        ctx.restore();
    }

    // Start 60 FPS Fishing loop
    initFishingCanvas();
    requestAnimationFrame(renderFishingLoop);


    /* ========================================================
       SUPER NIUBI SLOT MODULE
       ======================================================== */
    const SLOT_SYMBOLS = [
        { id: 0, name: 'Firecracker', icon: '🧨', mult: 2 },
        { id: 1, name: 'Red Envelope', icon: '🧧', mult: 5 },
        { id: 2, name: 'Silk Lantern', icon: '🏮', mult: 10 },
        { id: 3, name: 'Ancient Coins', icon: '🪙', mult: 25 },
        { id: 4, name: 'Golden Ingot', icon: '💰', mult: 50 },
        { id: 5, name: 'Golden Bull', icon: '🐂', mult: 150 },
        { id: 6, name: 'Wild Bull', icon: '⚡', mult: 388 }
    ];

    let slotBet = 50;
    let slotIsSpinning = false;
    let slotIsAuto = false;
    let slotTurbo = false;
    let slotGrid = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 0, 1]
    ];

    // Initialize Slot Reels
    function renderSlotReels(grid, winningCoords = []) {
        for (let col = 0; col < 3; col++) {
            const ribbon = document.getElementById(`ribbon-${col}`);
            if (!ribbon) continue;
            ribbon.innerHTML = '';
            for (let row = 0; row < 3; row++) {
                const symId = grid[row][col];
                const sym = SLOT_SYMBOLS[symId] || SLOT_SYMBOLS[0];
                const card = document.createElement('div');
                card.className = 'slot-card';
                card.textContent = sym.icon;

                const isWin = winningCoords.some(([r, c]) => r === row && c === col);
                if (isWin) card.classList.add('winning');

                ribbon.appendChild(card);
            }
        }
    }

    window.setSlotBet = function(val) {
        slotBet = val;
        document.getElementById('slot-bet-val').textContent = val;
        document.querySelectorAll('.slot-controls .quick-chips .chip').forEach(c => {
            c.classList.toggle('active', parseInt(c.textContent, 10) === val);
        });
    };

    window.slotChangeBet = function(delta) {
        const bets = [10, 20, 50, 100, 200, 500];
        let idx = bets.indexOf(slotBet);
        if (idx === -1) idx = 2;
        let nextIdx = Math.max(0, Math.min(bets.length - 1, idx + delta));
        window.setSlotBet(bets[nextIdx]);
    };

    window.toggleTurbo = function() {
        slotTurbo = !slotTurbo;
        document.getElementById('btn-turbo').classList.toggle('active', slotTurbo);
    };

    window.toggleSlotAuto = function() {
        slotIsAuto = !slotIsAuto;
        const btn = document.getElementById('btn-autospin');
        btn.classList.toggle('active', slotIsAuto);
        document.getElementById('autospin-label').textContent = slotIsAuto ? 'STOP' : 'AUTO';

        if (slotIsAuto && !slotIsSpinning) {
            handleSlotSpin();
        }
    };

    window.handleSlotSpin = async function() {
        if (slotIsSpinning) return;
        if (userBalance < slotBet) {
            alert('Insufficient balance! Please recharge.');
            slotIsAuto = false;
            document.getElementById('btn-autospin').classList.remove('active');
            document.getElementById('autospin-label').textContent = 'AUTO';
            return;
        }

        slotIsSpinning = true;
        const spinBtn = document.getElementById('btn-spin-main');
        spinBtn.disabled = true;

        // Deduct balance locally
        updateBalanceDisplay(userBalance - slotBet);

        // Hide old payline highlights
        for (let i = 0; i < 5; i++) {
            const line = document.getElementById(`line-${i}`);
            if (line) line.classList.add('line-hide');
        }

        const winStrip = document.getElementById('slot-win-strip');
        winStrip.textContent = 'SPINNING...';

        // Animate Reel Spin with random scrolling
        const spinDuration = slotTurbo ? 400 : 1000;
        const spinInterval = setInterval(() => {
            const tempGrid = [
                [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)],
                [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)],
                [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)]
            ];
            renderSlotReels(tempGrid);
            Sound.reelStop();
        }, 80);

        try {
            const res = await fetch('/api/jdb/slot_spin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: CONFIG.token,
                    bet_amount: slotBet
                })
            });
            const data = await res.json();

            setTimeout(() => {
                clearInterval(spinInterval);

                if (data && data.code === 0 && data.data) {
                    const d = data.data;
                    slotGrid = d.reels;
                    updateBalanceDisplay(d.wallet_balance);

                    const winCoords = [];
                    d.win_lines.forEach(wl => {
                        wl.coords.forEach(coord => winCoords.push(coord));
                        const line = document.getElementById(`line-${wl.line}`);
                        if (line) line.classList.remove('line-hide');
                    });

                    renderSlotReels(slotGrid, winCoords);

                    if (d.is_win) {
                        winStrip.textContent = `WIN: +${CONFIG.currency}${d.win_amount.toFixed(2)} (${d.total_multiplier}x)`;
                        Sound.coinCatch();

                        if (d.win_amount >= slotBet * 5 || d.is_jackpot) {
                            triggerCelebration('🐂', `+${CONFIG.currency}${d.win_amount.toFixed(2)}`, 'SUPER NIUBI JACKPOT WIN!');
                        }
                    } else {
                        winStrip.textContent = 'BETTER LUCK NEXT SPIN!';
                    }
                }

                slotIsSpinning = false;
                spinBtn.disabled = false;

                // Auto Spin Continuation
                if (slotIsAuto) {
                    setTimeout(() => {
                        if (slotIsAuto) handleSlotSpin();
                    }, slotTurbo ? 300 : 900);
                }
            }, spinDuration);

        } catch (e) {
            clearInterval(spinInterval);
            slotIsSpinning = false;
            spinBtn.disabled = false;
        }
    };

    renderSlotReels(slotGrid);

    /* ========================================================
       CELEBRATION MODAL
       ======================================================== */
    function triggerCelebration(icon, amount, subtitle) {
        Sound.bigWin();
        document.getElementById('celeb-icon').textContent = icon;
        document.getElementById('celeb-amount').textContent = amount;
        document.getElementById('celeb-sub').textContent = subtitle;
        document.getElementById('celebration-modal').classList.add('active');
    }

    window.closeCelebration = function() {
        document.getElementById('celebration-modal').classList.remove('active');
    };

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (currentMode === 'fishing') {
                fireCannon(targetX, targetY);
            } else if (currentMode === 'slot') {
                handleSlotSpin();
            }
        }
    });

})();
