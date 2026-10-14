/**
 * jackpot_fishing/jf.js - JILI Jackpot Fishing Master Arcade Engine
 * 60 FPS HTML5 Canvas Marine Game with 10 Fish Species, Progressive Jackpots,
 * Tactical Skills (Freeze, Torpedo, Lock Boss, Auto Fire), WebAudio SFX & Dual Wallet Integration
 */

(function () {
    'use strict';

    // -------------------------------------------------------------
    // Configuration & State
    // -------------------------------------------------------------
    const CFG = window.JF_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    let userBalance = parseFloat(CFG.initialBalance) || 0;
    let currentStake = 10;
    const STAKE_STEPS = [1, 2, 5, 10, 20, 30, 50, 100, 200, 500, 1000];

    // Skills & Toggles
    let isFrozen = false;
    let freezeTimer = null;
    let freezeCooldown = false;
    let isAutoFire = false;
    let autoFireInterval = null;
    let isLockTarget = false;
    let lockedFish = null;
    let soundEnabled = true;

    // Canvas & Geometry
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('canvas-wrapper');
    let width = 800;
    let height = 500;
    let dpr = window.devicePixelRatio || 1;

    // Cannon State
    const cannon = {
        x: 400,
        y: 490,
        angle: -Math.PI / 2, // Aim straight up initially
        targetAngle: -Math.PI / 2,
        recoil: 0,
        barrelLen: 50,
        barrelWidth: 16
    };

    // Game Entities
    const fishList = [];
    const projectiles = [];
    const nets = [];
    const particles = [];
    const floatingTexts = [];
    const bubbles = [];
    const coins = [];

    // Pointer coordinates
    let mousePos = { x: 400, y: 250 };
    let isPointerDown = false;
    let lastShootTime = 0;

    // Progressive Jackpot display values
    let jpGrand = 888888.00;
    let jpMajor = 88888.00;
    let jpMini = 8888.00;

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
        shoot() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.13);
            } catch (e) {}
        },
        hit() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.16);
            } catch (e) {}
        },
        freeze() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                [659, 880, 1174, 1760, 2349].forEach((f, i) => {
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + i * 0.05);
                    gain.gain.setValueAtTime(0.2, now + i * 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.4);
                    osc.connect(gain);
                    gain.connect(actx.destination);
                    osc.start(now + i * 0.05);
                    osc.stop(now + i * 0.05 + 0.45);
                });
            } catch (e) {}
        },
        torpedo() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.linearRampToValueAtTime(450, now + 0.3);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.42);
            } catch (e) {}
        },
        explosion() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start(now);
                osc.stop(now + 0.6);
            } catch (e) {}
        },
        catch() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                [1046, 1318, 1567, 2093].forEach((f, i) => {
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + i * 0.06);
                    gain.gain.setValueAtTime(0.25, now + i * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.25);
                    osc.connect(gain);
                    gain.connect(actx.destination);
                    osc.start(now + i * 0.06);
                    osc.stop(now + i * 0.06 + 0.3);
                });
            } catch (e) {}
        },
        jackpot() {
            if (!soundEnabled) return;
            const actx = getAudioContext();
            if (!actx) return;
            try {
                const now = actx.currentTime;
                const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
                notes.forEach((freq, idx) => {
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    gain.gain.setValueAtTime(0.3, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.6);
                    osc.connect(gain);
                    gain.connect(actx.destination);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.65);
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
                osc.frequency.setValueAtTime(800, now);
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
    // Fish Species Catalog
    // -------------------------------------------------------------
    const FISH_TYPES = {
        clownfish: {
            name: 'Clownfish',
            mult: 2.0,
            size: 32,
            speed: 1.8,
            color: '#FF793F',
            secondary: '#FFFFFF',
            isBoss: false
        },
        flyingfish: {
            name: 'Flying Fish',
            mult: 3.0,
            size: 36,
            speed: 1.6,
            color: '#00D2D3',
            secondary: '#FFFFFF',
            isBoss: false
        },
        angelfish: {
            name: 'Golden Angelfish',
            mult: 5.0,
            size: 42,
            speed: 1.4,
            color: '#FBC531',
            secondary: '#E1B12C',
            isBoss: false
        },
        pufferfish: {
            name: 'Spiky Pufferfish',
            mult: 8.0,
            size: 46,
            speed: 1.2,
            color: '#4CD137',
            secondary: '#44BD32',
            isBoss: false
        },
        electric_ray: {
            name: 'Electric Manta Ray',
            mult: 15.0,
            size: 58,
            speed: 1.1,
            color: '#9C88FF',
            secondary: '#00F0FF',
            isBoss: false
        },
        bomb_crab: {
            name: 'Armored Bomb Crab',
            mult: 25.0,
            size: 64,
            speed: 1.0,
            color: '#E84118',
            secondary: '#F5CD79',
            isBoss: false
        },
        hammerhead: {
            name: 'Hammerhead Shark',
            mult: 60.0,
            size: 80,
            speed: 1.3,
            color: '#00A8FF',
            secondary: '#0097E6',
            isBoss: true
        },
        treasure_box: {
            name: 'Sunken Treasure Chest',
            mult: 120.0,
            size: 72,
            speed: 0.85,
            color: '#FFD700',
            secondary: '#FFA502',
            isBoss: true
        },
        golden_turtle: {
            name: 'Jackpot Golden Turtle',
            mult: 250.0,
            size: 96,
            speed: 0.75,
            color: '#E1B12C',
            secondary: '#44BD32',
            isBoss: true
        },
        megalodon_dragon: {
            name: 'Megalodon Dragon King',
            mult: 666.0,
            size: 118,
            speed: 0.65,
            color: '#FF3838',
            secondary: '#FFD700',
            isBoss: true
        }
    };

    const SPAWN_WEIGHTS = [
        { type: 'clownfish', weight: 30 },
        { type: 'flyingfish', weight: 22 },
        { type: 'angelfish', weight: 16 },
        { type: 'pufferfish', weight: 12 },
        { type: 'electric_ray', weight: 8 },
        { type: 'bomb_crab', weight: 6 },
        { type: 'hammerhead', weight: 3 },
        { type: 'treasure_box', weight: 1.8 },
        { type: 'golden_turtle', weight: 0.8 },
        { type: 'megalodon_dragon', weight: 0.4 }
    ];

    function getRandomFishType() {
        const total = SPAWN_WEIGHTS.reduce((s, w) => s + w.weight, 0);
        let r = Math.random() * total;
        for (const item of SPAWN_WEIGHTS) {
            if (r < item.weight) return item.type;
            r -= item.weight;
        }
        return 'clownfish';
    }

    // -------------------------------------------------------------
    // Fish Class
    // -------------------------------------------------------------
    class Fish {
        constructor(type) {
            this.type = type || getRandomFishType();
            this.def = FISH_TYPES[this.type];
            this.size = this.def.size;
            this.mult = this.def.mult;
            this.name = this.def.name;
            this.isBoss = this.def.isBoss;

            // Direction: from left to right (+1) or right to left (-1)
            this.direction = Math.random() < 0.5 ? 1 : -1;
            this.x = this.direction === 1 ? -this.size - 40 : width + this.size + 40;
            this.y = 50 + Math.random() * (height - 180);

            this.speed = (this.def.speed * (0.8 + Math.random() * 0.4));
            this.vx = this.direction * this.speed;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.waveAmp = 15 + Math.random() * 20;
            this.waveFreq = 0.02 + Math.random() * 0.02;
            this.wavePhase = Math.random() * Math.PI * 2;
            this.baseY = this.y;

            this.wiggle = 0;
            this.wiggleSpeed = 0.12 + Math.random() * 0.06;
            this.hitFlash = 0;
            this.isDying = false;
            this.deathProgress = 0;

            if (this.isBoss) {
                showBossAlert(this.name + ' (' + this.mult + 'x)');
            }
        }

        update() {
            if (this.isDying) {
                this.deathProgress += 0.04;
                this.hitFlash = 1;
                return;
            }

            if (!isFrozen) {
                this.x += this.vx;
                this.wavePhase += this.waveFreq;
                this.y = this.baseY + Math.sin(this.wavePhase) * this.waveAmp;
                this.wiggle += this.wiggleSpeed;
            }

            if (this.hitFlash > 0) {
                this.hitFlash -= 0.08;
                if (this.hitFlash < 0) this.hitFlash = 0;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);

            // Scale according to facing direction & death shrink
            let scaleX = this.direction;
            let scaleY = 1;
            if (this.isDying) {
                const s = Math.max(0, 1 - this.deathProgress);
                scaleX *= s;
                scaleY *= s;
                ctx.rotate(this.deathProgress * Math.PI * 4);
            }
            ctx.scale(scaleX, scaleY);

            // Frost filter if frozen
            if (isFrozen) {
                ctx.shadowColor = '#00F0FF';
                ctx.shadowBlur = 12;
            }

            // Draw procedural fish geometry based on type
            this.renderSpecies(ctx);

            ctx.restore();

            // Multiplier Badge rendered above fish in screen coordinates
            if (!this.isDying) {
                this.renderBadge(ctx);
            }
        }

        renderBadge(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y - this.size * 0.65 - 10);
            const text = this.mult + 'x';
            ctx.font = 'bold 11px Montserrat, sans-serif';
            const tm = ctx.measureText(text);
            const bw = tm.width + 12;
            const bh = 16;

            // Badge Background
            ctx.fillStyle = this.isBoss ? 'rgba(255, 56, 56, 0.85)' : 'rgba(4, 13, 30, 0.8)';
            ctx.strokeStyle = this.isBoss ? '#FFD700' : 'rgba(0, 240, 255, 0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6);
            ctx.fill();
            ctx.stroke();

            // Badge Text
            ctx.fillStyle = this.isBoss ? '#FFD700' : '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, 0);

            ctx.restore();
        }

        renderSpecies(ctx) {
            const s = this.size;
            const color = this.hitFlash > 0.2 ? '#FFFFFF' : this.def.color;
            const secColor = this.hitFlash > 0.2 ? '#FFD700' : this.def.secondary;

            // Tail wiggle offset
            const tailWiggle = Math.sin(this.wiggle) * 8;

            if (this.type === 'clownfish' || this.type === 'flyingfish' || this.type === 'angelfish') {
                // Main Fish Body
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 0.6, s * 0.35, 0, 0, Math.PI * 2);
                ctx.fill();

                // Distinctive White/Stripe Pattern
                ctx.fillStyle = secColor;
                ctx.beginPath();
                ctx.ellipse(-s * 0.1, 0, s * 0.1, s * 0.33, 0, 0, Math.PI * 2);
                ctx.fill();

                // Swishing Tail Fin
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(-s * 0.55, 0);
                ctx.lineTo(-s * 0.9, -s * 0.3 + tailWiggle);
                ctx.lineTo(-s * 0.75, 0 + tailWiggle * 0.5);
                ctx.lineTo(-s * 0.9, s * 0.3 + tailWiggle);
                ctx.closePath();
                ctx.fill();

                // Eye
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(s * 0.35, -s * 0.08, s * 0.08, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(s * 0.38, -s * 0.08, s * 0.04, 0, Math.PI * 2);
                ctx.fill();

            } else if (this.type === 'pufferfish') {
                // Round Spiky Body
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2);
                ctx.fill();

                // Spikes
                ctx.fillStyle = secColor;
                for (let i = 0; i < 8; i++) {
                    const ang = (i * Math.PI) / 4;
                    ctx.beginPath();
                    ctx.arc(Math.cos(ang) * s * 0.48, Math.sin(ang) * s * 0.48, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Cute Big Eyes
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(s * 0.22, -s * 0.12, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(s * 0.25, -s * 0.12, 3, 0, Math.PI * 2);
                ctx.fill();

                // Tiny Fin
                ctx.fillStyle = secColor;
                ctx.beginPath();
                ctx.ellipse(-s * 0.35, 0, 6, 10 + tailWiggle * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();

            } else if (this.type === 'electric_ray') {
                // Wide Manta Ray Wings
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(s * 0.5, 0);
                ctx.quadraticCurveTo(0, -s * 0.55 + tailWiggle * 0.3, -s * 0.4, -s * 0.4);
                ctx.lineTo(-s * 0.6, 0);
                ctx.lineTo(-s * 0.4, s * 0.4);
                ctx.quadraticCurveTo(0, s * 0.55 + tailWiggle * 0.3, s * 0.5, 0);
                ctx.fill();

                // Glowing Electric Spine
                ctx.strokeStyle = secColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-s * 0.6, 0);
                ctx.lineTo(-s * 1.1, tailWiggle * 0.8);
                ctx.stroke();

            } else if (this.type === 'bomb_crab') {
                // Crab Shell & Claws
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 0.45, s * 0.35, 0, 0, Math.PI * 2);
                ctx.fill();

                // Claws
                ctx.fillStyle = secColor;
                ctx.beginPath();
                ctx.arc(s * 0.38, -s * 0.25, 8, 0, Math.PI * 2);
                ctx.arc(s * 0.38, s * 0.25, 8, 0, Math.PI * 2);
                ctx.fill();

                // Bomb Fuse on Shell
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(-s * 0.15, -s * 0.45, 6, 8);
                ctx.fillStyle = Math.random() < 0.5 ? '#FF4757' : '#FFA502';
                ctx.beginPath();
                ctx.arc(-s * 0.12, -s * 0.5, 4, 0, Math.PI * 2);
                ctx.fill();

            } else if (this.type === 'hammerhead') {
                // Sleek Shark Body
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(s * 0.6, 0);
                ctx.lineTo(0, -s * 0.22);
                ctx.lineTo(-s * 0.7, -s * 0.08);
                ctx.lineTo(-s * 0.9, -s * 0.3 + tailWiggle);
                ctx.lineTo(-s * 0.75, 0);
                ctx.lineTo(-s * 0.9, s * 0.3 + tailWiggle);
                ctx.lineTo(-s * 0.7, s * 0.08);
                ctx.lineTo(0, s * 0.22);
                ctx.closePath();
                ctx.fill();

                // Hammerhead T-Bar Head
                ctx.fillStyle = secColor;
                ctx.fillRect(s * 0.45, -s * 0.38, s * 0.18, s * 0.76);

                // Dorsal Fin
                ctx.fillStyle = secColor;
                ctx.beginPath();
                ctx.moveTo(-s * 0.1, -s * 0.2);
                ctx.lineTo(-s * 0.25, -s * 0.45);
                ctx.lineTo(-s * 0.35, -s * 0.15);
                ctx.closePath();
                ctx.fill();

            } else if (this.type === 'treasure_box') {
                // Sunken Golden Chest
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-s * 0.4, -s * 0.25, s * 0.8, s * 0.5);

                // Golden Trim & Locks
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.strokeRect(-s * 0.4, -s * 0.25, s * 0.8, s * 0.5);

                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(0, 0, 7, 0, Math.PI * 2);
                ctx.fill();

                // Radiant Aura
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 15;

            } else if (this.type === 'golden_turtle') {
                // Giant Golden Sea Turtle Shell
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(0, 0, s * 0.45, s * 0.35, 0, 0, Math.PI * 2);
                ctx.fill();

                // Carved Emerald Hex Pattern
                ctx.strokeStyle = secColor;
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Turtle Head & Flippers
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(s * 0.5, 0, s * 0.16, 0, Math.PI * 2);
                ctx.fill();

                // Front Flippers
                ctx.beginPath();
                ctx.ellipse(s * 0.2, -s * 0.38, s * 0.28, s * 0.12, Math.PI / 4 + tailWiggle * 0.05, 0, Math.PI * 2);
                ctx.ellipse(s * 0.2, s * 0.38, s * 0.28, s * 0.12, -Math.PI / 4 - tailWiggle * 0.05, 0, Math.PI * 2);
                ctx.fill();

            } else if (this.type === 'megalodon_dragon') {
                // Mythical Sea Dragon King
                ctx.fillStyle = color;

                // Segmented serpentine body
                for (let i = 0; i < 5; i++) {
                    const segOffset = i * (s * 0.2);
                    const segWiggle = Math.sin(this.wiggle - i * 0.5) * 12;
                    ctx.beginPath();
                    ctx.arc(-segOffset, segWiggle, s * (0.35 - i * 0.04), 0, Math.PI * 2);
                    ctx.fill();

                    // Gold scale ridges
                    ctx.fillStyle = secColor;
                    ctx.fillRect(-segOffset - 3, segWiggle - s * 0.32, 6, 8);
                    ctx.fillStyle = color;
                }

                // Dragon Horns & Crown
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.moveTo(s * 0.2, -s * 0.2);
                ctx.lineTo(s * 0.4, -s * 0.48);
                ctx.lineTo(s * 0.28, -s * 0.15);
                ctx.closePath();
                ctx.fill();

                // Dragon Glowing Eye
                ctx.fillStyle = '#00F0FF';
                ctx.beginPath();
                ctx.arc(s * 0.28, -s * 0.08, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        isOffScreen() {
            if (this.direction === 1 && this.x > width + this.size + 60) return true;
            if (this.direction === -1 && this.x < -this.size - 60) return true;
            return false;
        }

        containsPoint(px, py) {
            const dx = px - this.x;
            const dy = py - this.y;
            return (dx * dx + dy * dy) <= (this.size * 0.7) * (this.size * 0.7);
        }
    }

    // -------------------------------------------------------------
    // Projectiles & Net Explosions
    // -------------------------------------------------------------
    class Projectile {
        constructor(startX, startY, targetX, targetY, stake, isSkill = false) {
            this.x = startX;
            this.y = startY;
            this.targetX = targetX;
            this.targetY = targetY;
            this.stake = stake;
            this.isSkill = isSkill;

            const dx = targetX - startX;
            const dy = targetY - startY;
            const dist = Math.hypot(dx, dy) || 1;
            this.speed = isSkill ? 18 : 14;
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
            this.totalDist = dist;
            this.traveled = 0;
            this.isDead = false;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.traveled += this.speed;

            // Spawn smoke/spark trail
            if (Math.random() < 0.6) {
                particles.push(new Particle(this.x, this.y, this.isSkill ? '#FFD700' : '#00F0FF', 2, 0.4));
            }

            if (this.traveled >= this.totalDist || this.y < 0 || this.x < 0 || this.x > width) {
                this.explode();
            }
        }

        explode() {
            this.isDead = true;
            const radius = this.isSkill ? 90 : (this.stake >= 100 ? 60 : 44);
            nets.push(new CaptureNet(this.targetX, this.targetY, radius, this.isSkill));

            if (this.isSkill) {
                Sound.explosion();
                triggerScreenShake(8);
            } else {
                Sound.hit();
            }

            // Check collision against fishes
            handleNetHit(this.targetX, this.targetY, radius, this.stake, this.isSkill);
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);

            if (this.isSkill) {
                // Rocket Torpedo
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = '#FF8C00';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, 0, 9, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Plasma Orb
                ctx.fillStyle = this.stake >= 50 ? '#FFD700' : '#00F0FF';
                ctx.shadowColor = this.stake >= 50 ? '#FFD700' : '#00F0FF';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    class CaptureNet {
        constructor(x, y, maxRadius, isSkill = false) {
            this.x = x;
            this.y = y;
            this.radius = 6;
            this.maxRadius = maxRadius;
            this.isSkill = isSkill;
            this.alpha = 1.0;
            this.growSpeed = 5;
            this.isDead = false;
        }

        update() {
            if (this.radius < this.maxRadius) {
                this.radius += this.growSpeed;
            } else {
                this.alpha -= 0.08;
                if (this.alpha <= 0) {
                    this.isDead = true;
                }
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = Math.max(0, this.alpha);

            const color = this.isSkill ? '#FFD700' : '#00F0FF';
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;

            // Expanding outer ring
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Inner Laser Web Grid
            const spokes = 8;
            for (let i = 0; i < spokes; i++) {
                const ang = (i * Math.PI * 2) / spokes;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(ang) * this.radius, Math.sin(ang) * this.radius);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    // -------------------------------------------------------------
    // Particles, Floating Text & Gold Coins
    // -------------------------------------------------------------
    class Particle {
        constructor(x, y, color, size, speed) {
            this.x = x;
            this.y = y;
            this.color = color || '#00F0FF';
            this.size = size || 3;
            const ang = Math.random() * Math.PI * 2;
            const spd = (Math.random() + 0.5) * speed;
            this.vx = Math.cos(ang) * spd;
            this.vy = Math.sin(ang) * spd;
            this.alpha = 1.0;
            this.decay = 0.03 + Math.random() * 0.03;
            this.isDead = false;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            if (this.alpha <= 0) this.isDead = true;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class FloatingText {
        constructor(x, y, text, color, isBig = false) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.color = color || '#FFD700';
            this.isBig = isBig;
            this.alpha = 1.0;
            this.vy = -1.5;
            this.isDead = false;
        }

        update() {
            this.y += this.vy;
            this.alpha -= 0.02;
            if (this.alpha <= 0) this.isDead = true;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.font = this.isBig ? '900 22px Cinzel, serif' : 'bold 16px Montserrat, sans-serif';
            ctx.fillStyle = this.color;
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 6;
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.x, this.y);
            ctx.restore();
        }
    }

    class GoldCoin {
        constructor(startX, startY) {
            this.x = startX;
            this.y = startY;
            // Target header balance position (approx top right)
            this.targetX = width - 80;
            this.targetY = 25;
            this.progress = 0;
            this.speed = 0.035 + Math.random() * 0.02;

            // Quadratic bezier control point
            this.ctrlX = startX + (Math.random() - 0.5) * 120;
            this.ctrlY = Math.min(startY, this.targetY) - (50 + Math.random() * 80);
            this.isDead = false;
        }

        update() {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.isDead = true;
            } else {
                const t = this.progress;
                const invT = 1 - t;
                this.x = invT * invT * this.x + 2 * invT * t * this.ctrlX + t * t * this.targetX;
                this.y = invT * invT * this.y + 2 * invT * t * this.ctrlY + t * t * this.targetY;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFA502';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
    }

    // -------------------------------------------------------------
    // Screen Shake & Background Environment
    // -------------------------------------------------------------
    let screenShakeAmt = 0;
    function triggerScreenShake(amt) {
        screenShakeAmt = Math.max(screenShakeAmt, amt);
    }

    function initBubbles() {
        bubbles.length = 0;
        for (let i = 0; i < 35; i++) {
            bubbles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 1 + Math.random() * 4,
                speed: 0.5 + Math.random() * 1.2,
                amp: 4 + Math.random() * 6,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function drawAtmosphere(ctx) {
        // Deep underwater gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#06284F');
        bgGrad.addColorStop(0.5, '#04162E');
        bgGrad.addColorStop(1, '#020914');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Animated shimmering light caustics
        const time = Date.now() * 0.001;
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = '#00F0FF';
        for (let i = 0; i < 6; i++) {
            const cx = (width / 5) * i + Math.sin(time + i) * 30;
            ctx.beginPath();
            ctx.moveTo(cx - 30, 0);
            ctx.lineTo(cx + 60, 0);
            ctx.lineTo(cx + 120 + Math.cos(time + i) * 40, height);
            ctx.lineTo(cx - 80 + Math.cos(time + i) * 40, height);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // Rising Bubbles
        ctx.save();
        ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
        for (const b of bubbles) {
            b.y -= b.speed;
            b.phase += 0.03;
            const bx = b.x + Math.sin(b.phase) * b.amp;
            if (b.y < -10) {
                b.y = height + 10;
                b.x = Math.random() * width;
            }
            ctx.beginPath();
            ctx.arc(bx, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // -------------------------------------------------------------
    // Cannon Drawing & Swivel Aim
    // -------------------------------------------------------------
    function updateCannon() {
        // If locked target is active and valid, aim at it
        if (isLockTarget && lockedFish && !lockedFish.isDying && !lockedFish.isOffScreen()) {
            cannon.targetAngle = Math.atan2(lockedFish.y - cannon.y, lockedFish.x - cannon.x);
            updateCrosshair(lockedFish.x, lockedFish.y, true);
        } else {
            cannon.targetAngle = Math.atan2(mousePos.y - cannon.y, mousePos.x - cannon.x);
            if (isLockTarget) {
                findNewLockTarget();
            } else {
                updateCrosshair(0, 0, false);
            }
        }

        // Smooth angle interpolation
        let diff = cannon.targetAngle - cannon.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        cannon.angle += diff * 0.25;

        // Recoil damping
        if (cannon.recoil > 0) {
            cannon.recoil -= 1.8;
            if (cannon.recoil < 0) cannon.recoil = 0;
        }
    }

    function drawCannon(ctx) {
        ctx.save();
        ctx.translate(cannon.x, cannon.y);

        // Circular Golden Turret Base
        ctx.fillStyle = '#0F264A';
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        // Swivel Cannon Barrel
        ctx.rotate(cannon.angle);
        const recoilOffset = -cannon.recoil;

        if (currentStake < 20) {
            // Single Barrel
            ctx.fillStyle = '#00F0FF';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.fillRect(0, -7 + recoilOffset, 42, 14);
            ctx.strokeRect(0, -7 + recoilOffset, 42, 14);
        } else if (currentStake < 100) {
            // Double Barrel
            ctx.fillStyle = '#00F0FF';
            ctx.fillRect(0, -12 + recoilOffset, 44, 10);
            ctx.fillRect(0, 2 + recoilOffset, 44, 10);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(28, -14 + recoilOffset, 6, 28);
        } else {
            // Triple Gatling Laser Cannon
            ctx.fillStyle = '#FF3838';
            ctx.fillRect(0, -14 + recoilOffset, 48, 8);
            ctx.fillRect(0, -4 + recoilOffset, 52, 8);
            ctx.fillRect(0, 6 + recoilOffset, 48, 8);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(32, -16 + recoilOffset, 8, 32);
        }

        ctx.restore();
    }

    // -------------------------------------------------------------
    // Collision & Backend API Hit Handling
    // -------------------------------------------------------------
    function handleNetHit(hitX, hitY, radius, stake, isSkill) {
        // Collect candidate fishes inside net blast radius
        const hitFishes = [];
        for (const fish of fishList) {
            if (fish.isDying) continue;
            const dist = Math.hypot(fish.x - hitX, fish.y - hitY);
            if (dist <= radius + fish.size * 0.5) {
                hitFishes.push(fish);
                fish.hitFlash = 1.0;
            }
        }

        if (hitFishes.length === 0) return;

        // Prioritize boss or highest multiplier fish
        hitFishes.sort((a, b) => b.mult - a.mult);
        const primaryTarget = hitFishes[0];

        // Call backend API
        executeShotApi(stake, primaryTarget.type, isSkill, primaryTarget);
    }

    async function executeShotApi(stake, fishType, isSkill, targetFish) {
        try {
            const resp = await fetch('/api/jackpot_fishing/shoot.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + CFG.token
                },
                body: JSON.stringify({
                    token: CFG.token,
                    stake: stake,
                    fish_type: fishType,
                    is_skill: isSkill
                })
            });

            const res = await resp.json();
            if (res.code === 0 && res.data) {
                const d = res.data;
                userBalance = parseFloat(d.wallet_balance) || 0;
                updateBalanceDisplay(userBalance);

                if (d.is_caught) {
                    onFishCaught(targetFish, d.multiplier, d.payout, d.is_jackpot, d.jackpot_type);
                }
            } else if (res.code === 400) {
                // Insufficient balance
                floatingTexts.push(new FloatingText(cannon.x, cannon.y - 60, res.msg || 'Balance low!', '#FF4757', true));
                if (isAutoFire) toggleAutoFire();
            }
        } catch (err) {
            console.error('Shoot API error:', err);
        }
    }

    function onFishCaught(fish, mult, payout, isJackpot, jackpotType) {
        if (!fish) return;
        fish.isDying = true;
        Sound.catch();

        // Spawn Gold Coin Fountain
        const coinCount = Math.min(30, Math.max(8, Math.floor(mult / 2)));
        for (let i = 0; i < coinCount; i++) {
            setTimeout(() => {
                coins.push(new GoldCoin(fish.x, fish.y));
            }, i * 35);
        }

        // Floating Win Text
        const winStr = '+' + CFG.currency + payout.toFixed(2) + ' (' + mult + 'x)';
        floatingTexts.push(new FloatingText(fish.x, fish.y - 20, winStr, '#FFD700', mult >= 20));

        // Big Celebration Trigger
        if (mult >= 50 || isJackpot) {
            Sound.jackpot();
            openCelebration(jackpotType || (mult >= 200 ? 'GRAND WIN' : 'BIG WIN'), fish.def.icon || '🐲', payout, fish.name);
        }
    }

    // -------------------------------------------------------------
    // Shooting Trigger & Controls
    // -------------------------------------------------------------
    function fireCannon(targetX, targetY, isSkill = false) {
        const now = Date.now();
        if (!isSkill && now - lastShootTime < 180) return; // Rate limiter
        lastShootTime = now;

        if (userBalance < currentStake) {
            floatingTexts.push(new FloatingText(cannon.x, cannon.y - 50, 'Insufficient balance!', '#FF4757', true));
            if (isAutoFire) toggleAutoFire();
            return;
        }

        // Optimistic UI debit
        userBalance = Math.max(0, userBalance - currentStake);
        updateBalanceDisplay(userBalance);

        // Cannon recoil & sound
        cannon.recoil = 12;
        if (isSkill) {
            Sound.torpedo();
        } else {
            Sound.shoot();
        }

        // Barrel muzzle position
        const barrelLen = 45;
        const muzzleX = cannon.x + Math.cos(cannon.angle) * barrelLen;
        const muzzleY = cannon.y + Math.sin(cannon.angle) * barrelLen;

        projectiles.push(new Projectile(muzzleX, muzzleY, targetX, targetY, currentStake, isSkill));
    }

    // -------------------------------------------------------------
    // Tactical Skills Implementation
    // -------------------------------------------------------------
    window.triggerFreezeSkill = function () {
        if (freezeCooldown) return;
        getAudioContext();
        Sound.freeze();
        isFrozen = true;
        freezeCooldown = true;

        const overlay = document.getElementById('ice-overlay');
        const btn = document.getElementById('btn-freeze');
        if (overlay) overlay.classList.add('active');
        if (btn) btn.classList.add('cooldown');

        if (freezeTimer) clearTimeout(freezeTimer);
        freezeTimer = setTimeout(() => {
            isFrozen = false;
            if (overlay) overlay.classList.remove('active');
        }, 6000);

        // Cooldown reset after 14s
        setTimeout(() => {
            freezeCooldown = false;
            if (btn) btn.classList.remove('cooldown');
        }, 14000);
    };

    window.triggerTorpedoSkill = function () {
        getAudioContext();
        // Fire torpedo right to center / locked boss
        const tx = (lockedFish && !lockedFish.isDying) ? lockedFish.x : (width * 0.5);
        const ty = (lockedFish && !lockedFish.isDying) ? lockedFish.y : (height * 0.4);
        fireCannon(tx, ty, true);
    };

    window.toggleLockTarget = function () {
        getAudioContext();
        Sound.click();
        isLockTarget = !isLockTarget;
        const btn = document.getElementById('btn-lock');
        if (btn) btn.classList.toggle('active', isLockTarget);

        if (isLockTarget) {
            findNewLockTarget();
        } else {
            lockedFish = null;
            updateCrosshair(0, 0, false);
        }
    };

    function findNewLockTarget() {
        // Find highest multiplier active boss
        let best = null;
        for (const fish of fishList) {
            if (fish.isDying || fish.isOffScreen()) continue;
            if (!best || fish.mult > best.mult) {
                best = fish;
            }
        }
        lockedFish = best;
        if (lockedFish) {
            updateCrosshair(lockedFish.x, lockedFish.y, true);
        } else {
            updateCrosshair(0, 0, false);
        }
    }

    function updateCrosshair(x, y, visible) {
        const cross = document.getElementById('crosshair');
        if (!cross) return;
        if (visible) {
            cross.style.display = 'block';
            cross.style.left = x + 'px';
            cross.style.top = y + 'px';
        } else {
            cross.style.display = 'none';
        }
    }

    window.toggleAutoFire = function () {
        getAudioContext();
        Sound.click();
        isAutoFire = !isAutoFire;
        const btn = document.getElementById('btn-auto');
        if (btn) btn.classList.toggle('active', isAutoFire);

        if (isAutoFire) {
            if (autoFireInterval) clearInterval(autoFireInterval);
            autoFireInterval = setInterval(() => {
                if (isLockTarget && lockedFish && !lockedFish.isDying) {
                    fireCannon(lockedFish.x, lockedFish.y);
                } else {
                    fireCannon(mousePos.x, mousePos.y);
                }
            }, 230);
        } else {
            if (autoFireInterval) {
                clearInterval(autoFireInterval);
                autoFireInterval = null;
            }
        }
    };

    // -------------------------------------------------------------
    // Stake Controls
    // -------------------------------------------------------------
    window.setStake = function (val) {
        getAudioContext();
        Sound.click();
        currentStake = Math.max(1, parseFloat(val) || 10);
        updateStakeUI();
    };

    window.changeStake = function (delta) {
        getAudioContext();
        Sound.click();
        let idx = STAKE_STEPS.indexOf(currentStake);
        if (idx === -1) {
            currentStake = Math.max(1, currentStake + delta * 5);
        } else {
            idx = Math.max(0, Math.min(STAKE_STEPS.length - 1, idx + delta));
            currentStake = STAKE_STEPS[idx];
        }
        updateStakeUI();
    };

    function updateStakeUI() {
        const display = document.getElementById('display-stake');
        if (display) display.textContent = currentStake;

        // Highlight chip if exact match
        const chips = document.querySelectorAll('.chips-tray .chip');
        chips.forEach(c => {
            const val = parseFloat(c.textContent.trim());
            c.classList.toggle('active', val === currentStake);
        });
    }

    // -------------------------------------------------------------
    // UI Helpers & Celebration Modal
    // -------------------------------------------------------------
    function updateBalanceDisplay(bal) {
        const el = document.getElementById('user-balance');
        if (el) el.textContent = bal.toFixed(2);
    }

    function showBossAlert(text) {
        const banner = document.getElementById('boss-alert');
        const txt = document.getElementById('boss-alert-text');
        if (banner && txt) {
            txt.textContent = text + ' APPEARED!';
            banner.classList.add('active');
            setTimeout(() => {
                banner.classList.remove('active');
            }, 4500);
        }
    }

    function openCelebration(badge, icon, amount, subtitle) {
        const modal = document.getElementById('celebration-modal');
        const badgeEl = document.getElementById('celeb-badge');
        const iconEl = document.getElementById('celeb-icon');
        const amountEl = document.getElementById('celeb-amount');
        const subEl = document.getElementById('celeb-sub');

        if (modal) {
            if (badgeEl) badgeEl.textContent = badge;
            if (iconEl) iconEl.textContent = icon || '🐲';
            if (amountEl) amountEl.textContent = '+' + CFG.currency + parseFloat(amount).toFixed(2);
            if (subEl) subEl.textContent = subtitle || 'LEGENDARY CATCH!';
            modal.classList.add('active');
        }
    }

    window.closeCelebration = function () {
        Sound.click();
        const modal = document.getElementById('celebration-modal');
        if (modal) modal.classList.remove('active');
    };

    // -------------------------------------------------------------
    // Periodic Progressive Jackpot & State Poll
    // -------------------------------------------------------------
    async function syncGameState() {
        try {
            const res = await fetch('/api/jackpot_fishing/state.php?token=' + encodeURIComponent(CFG.token));
            const json = await res.json();
            if (json.code === 0 && json.data) {
                const d = json.data;
                if (d.jackpots) {
                    jpGrand = d.jackpots.grand;
                    jpMajor = d.jackpots.major;
                    jpMini = d.jackpots.mini;
                }
                if (typeof d.wallet_balance === 'number') {
                    userBalance = d.wallet_balance;
                    updateBalanceDisplay(userBalance);
                }
            }
        } catch (e) {}
    }

    function updateJackpotMeters() {
        // Ticking micro-increment
        jpGrand += 0.08;
        jpMajor += 0.03;
        jpMini += 0.01;

        const gEl = document.getElementById('jp-grand');
        const mEl = document.getElementById('jp-major');
        const nEl = document.getElementById('jp-mini');

        if (gEl) gEl.textContent = jpGrand.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (mEl) mEl.textContent = jpMajor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (nEl) nEl.textContent = jpMini.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // -------------------------------------------------------------
    // Main Game Loop (60 FPS)
    // -------------------------------------------------------------
    let lastSpawnTime = 0;

    function gameLoop(timestamp) {
        requestAnimationFrame(gameLoop);

        // Screen Shake calculation
        let shakeX = 0;
        let shakeY = 0;
        if (screenShakeAmt > 0) {
            shakeX = (Math.random() - 0.5) * screenShakeAmt;
            shakeY = (Math.random() - 0.5) * screenShakeAmt;
            screenShakeAmt *= 0.88;
            if (screenShakeAmt < 0.5) screenShakeAmt = 0;
        }

        ctx.save();
        ctx.translate(shakeX, shakeY);

        // 1. Atmosphere & Caustics
        drawAtmosphere(ctx);

        // 2. Fish Spawner (maintain ~12-16 fish on screen)
        if (fishList.length < 15 && (!lastSpawnTime || timestamp - lastSpawnTime > 750)) {
            fishList.push(new Fish());
            lastSpawnTime = timestamp;
        }

        // 3. Update & Draw Fishes
        for (let i = fishList.length - 1; i >= 0; i--) {
            const f = fishList[i];
            f.update();
            f.draw(ctx);

            if (f.deathProgress >= 1 || (!f.isDying && f.isOffScreen())) {
                fishList.splice(i, 1);
            }
        }

        // 4. Update & Draw Projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            p.update();
            p.draw(ctx);
            if (p.isDead) projectiles.splice(i, 1);
        }

        // 5. Update & Draw Capture Nets
        for (let i = nets.length - 1; i >= 0; i--) {
            const n = nets[i];
            n.update();
            n.draw(ctx);
            if (n.isDead) nets.splice(i, 1);
        }

        // 6. Update & Draw Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const pt = particles[i];
            pt.update();
            pt.draw(ctx);
            if (pt.isDead) particles.splice(i, 1);
        }

        // 7. Update & Draw Coins
        for (let i = coins.length - 1; i >= 0; i--) {
            const c = coins[i];
            c.update();
            c.draw(ctx);
            if (c.isDead) coins.splice(i, 1);
        }

        // 8. Update & Draw Floating Texts
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const ft = floatingTexts[i];
            ft.update();
            ft.draw(ctx);
            if (ft.isDead) floatingTexts.splice(i, 1);
        }

        // 9. Update & Draw Cannon
        updateCannon();
        drawCannon(ctx);

        ctx.restore();

        // Progressive Jackpot micro-ticker
        updateJackpotMeters();
    }

    // -------------------------------------------------------------
    // Resize & Event Listeners
    // -------------------------------------------------------------
    function handleResize() {
        if (!wrapper || !canvas) return;
        const rect = wrapper.getBoundingClientRect();
        width = Math.max(320, rect.width);
        height = Math.max(320, rect.height);

        dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        cannon.x = width * 0.5;
        cannon.y = height - 12;

        initBubbles();
    }

    function initListeners() {
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => setTimeout(handleResize, 150));

        // Pointer tracking & Shooting
        const getCanvasCoords = (e) => {
            const r = canvas.getBoundingClientRect();
            return {
                x: e.clientX - r.left,
                y: e.clientY - r.top
            };
        };

        canvas.addEventListener('mousemove', (e) => {
            mousePos = getCanvasCoords(e);
        });

        canvas.addEventListener('mousedown', (e) => {
            getAudioContext();
            mousePos = getCanvasCoords(e);
            isPointerDown = true;
            fireCannon(mousePos.x, mousePos.y);
        });

        window.addEventListener('mouseup', () => {
            isPointerDown = false;
        });

        // Touch Support for Mobile
        canvas.addEventListener('touchstart', (e) => {
            getAudioContext();
            if (e.touches.length > 0) {
                mousePos = getCanvasCoords(e.touches[0]);
                isPointerDown = true;
                fireCannon(mousePos.x, mousePos.y);
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mousePos = getCanvasCoords(e.touches[0]);
            }
        }, { passive: true });

        canvas.addEventListener('touchend', () => {
            isPointerDown = false;
        }, { passive: true });

        // Lobby Back Button
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

        // Sound Toggle Button
        const btnSound = document.getElementById('btn-sound');
        if (btnSound) {
            btnSound.addEventListener('click', () => {
                soundEnabled = !soundEnabled;
                btnSound.textContent = soundEnabled ? '🔊' : '🔇';
                Sound.click();
            });
        }

        // Balance Refresh Button
        const balBox = document.getElementById('balance-box');
        if (balBox) {
            balBox.addEventListener('click', () => {
                balBox.classList.add('refreshing');
                syncGameState().finally(() => {
                    setTimeout(() => balBox.classList.remove('refreshing'), 600);
                });
            });
        }
    }

    // -------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------
    function init() {
        handleResize();
        initListeners();
        updateStakeUI();
        updateBalanceDisplay(userBalance);
        syncGameState();

        // State poll every 12 seconds
        setInterval(syncGameState, 12000);

        requestAnimationFrame(gameLoop);
    }

    // Start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
