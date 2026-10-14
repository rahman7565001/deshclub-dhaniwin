/**
 * crazywheel/crazywheel.js - High Performance 60FPS Vegas Money Wheel Arcade
 */

(function () {
    'use strict';

    // 54 segments identical to engine.php
    const SEGMENTS = [
        '1', '2', '1', '5', '1', '2', '1', '10', '1', '2',
        '1', 'CHANCE', '1', '2', '1', '5', '1', '2', '1', '20',
        '1', '2', '1', '5', '1', '2', '1', '10', '1', '2',
        '1', '40', '1', '2', '1', '5', '1', '2', '1', '10',
        '1', 'CHANCE', '1', '2', '1', '5', '1', '2', '1', '20',
        '1', '2', '1', '5'
    ];

    const SEG_COLORS = {
        '1': { main: '#0284c7', light: '#38bdf8', text: '#FFFFFF' },
        '2': { main: '#059669', light: '#34d399', text: '#FFFFFF' },
        '5': { main: '#7c3aed', light: '#a78bfa', text: '#FFFFFF' },
        '10': { main: '#ea580c', light: '#fb923c', text: '#FFFFFF' },
        '20': { main: '#dc2626', light: '#f87171', text: '#FFFFFF' },
        '40': { main: '#d97706', light: '#facc15', text: '#000000' },
        'CHANCE': { main: '#ec4899', light: '#f472b6', text: '#FFFFFF' }
    };

    const TOTAL_SEGMENTS = SEGMENTS.length; // 54
    const ARC_SIZE = (2 * Math.PI) / TOTAL_SEGMENTS;

    // Game State
    let userBalance = window.CW_CONFIG?.initialBalance || 0;
    const currency = window.CW_CONFIG?.currency || '৳';
    const token = window.CW_CONFIG?.token || '';

    let currentChip = 10;
    let bets = { '1': 0, '2': 0, '5': 0, '10': 0, '20': 0, '40': 0, 'CHANCE': 0 };
    let previousBets = null;
    let isSpinning = false;
    let isAutoSpin = false;
    let autoSpinTimer = null;
    let soundEnabled = true;

    // Wheel Animation Variables
    let currentAngle = 0; // in radians
    let lastPegIndex = -1;

    // Audio Context
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

    function playTickSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.035);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {}
    }

    function playWinSound(isBig) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const notes = isBig ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = ctx.currentTime + idx * 0.1;
                gain.gain.setValueAtTime(0.2, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.4);
            });
        } catch (e) {}
    }

    function playBoostSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.36);
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
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    }

    // Canvas Setup
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const pointerEl = document.getElementById('wheel-pointer');

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);
        drawWheel(currentAngle);
    }

    function drawWheel(angle) {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(cx, cy) - 10;

        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // 1. Draw 54 Segments
        for (let i = 0; i < TOTAL_SEGMENTS; i++) {
            const segVal = SEGMENTS[i];
            const colorCfg = SEG_COLORS[segVal] || { main: '#333', light: '#555', text: '#fff' };
            const startAngle = i * ARC_SIZE;
            const endAngle = startAngle + ARC_SIZE;

            // Segment slice
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();

            // Gradient fill
            const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
            grad.addColorStop(0, colorCfg.light);
            grad.addColorStop(1, colorCfg.main);
            ctx.fillStyle = grad;
            ctx.fill();

            // Segment boundary divider
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw Segment Text & Value
            ctx.save();
            const midAngle = startAngle + ARC_SIZE / 2;
            ctx.rotate(midAngle);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';

            if (segVal === 'CHANCE') {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 10px Montserrat, sans-serif';
                ctx.fillText('🎁 CHANCE', radius - 14, 0);
            } else {
                ctx.fillStyle = colorCfg.text;
                ctx.font = '900 13px Orbitron, sans-serif';
                ctx.fillText(segVal, radius - 16, 0);
            }
            ctx.restore();
        }

        // 2. Outer Rim Bezel (Gold Casino Edge with Pegs)
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#D4AF37';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius + 4, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFF8DC';
        ctx.stroke();

        // 3. Brass/Silver Pegs around the wheel rim
        for (let i = 0; i < TOTAL_SEGMENTS; i++) {
            const pegAngle = i * ARC_SIZE;
            const px = Math.cos(pegAngle) * (radius - 2);
            const py = Math.sin(pegAngle) * (radius - 2);

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#996515';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 4. Center Golden Hub
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
        const hubGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.28);
        hubGrad.addColorStop(0, '#FFE57F');
        hubGrad.addColorStop(0.5, '#FFD700');
        hubGrad.addColorStop(0.9, '#B8860B');
        hubGrad.addColorStop(1, '#5C4033');
        ctx.fillStyle = hubGrad;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFF';
        ctx.stroke();

        // Hub Emblem
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 12px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CRAZY', 0, -6);
        ctx.fillStyle = '#FFD700';
        ctx.fillText('WHEEL', 0, 7);

        ctx.restore();
    }

    // UI Updates
    function updateBalanceUI(val) {
        userBalance = Number(val);
        const el = document.getElementById('user-balance');
        if (el) el.textContent = userBalance.toFixed(2);
    }

    function updateTotalBetUI() {
        let total = 0;
        for (const spot in bets) {
            total += bets[spot];
            const badge = document.getElementById(`chip-${spot}`);
            if (badge) {
                if (bets[spot] > 0) {
                    badge.textContent = bets[spot] >= 1000 ? (bets[spot] / 1000) + 'K' : bets[spot];
                    badge.classList.add('visible');
                } else {
                    badge.classList.remove('visible');
                }
            }
        }
        const totalValEl = document.getElementById('total-bet-val');
        if (totalValEl) totalValEl.textContent = total.toLocaleString();

        const spinBtn = document.getElementById('btn-spin');
        if (spinBtn && !isSpinning) {
            spinBtn.disabled = total <= 0;
        }
    }

    // Chip & Betting Actions
    window.selectChip = function (val) {
        currentChip = Number(val);
        document.querySelectorAll('.chips-tray .chip').forEach(c => {
            const txt = c.textContent.trim();
            const cVal = txt.endsWith('K') ? 1000 : Number(txt);
            c.classList.toggle('active', cVal === currentChip);
        });
        playChipSound();
    };

    window.placeChip = function (spot) {
        if (isSpinning) return;
        getAudioCtx();
        const totalNow = Object.values(bets).reduce((a, b) => a + b, 0);
        if (totalNow + currentChip > userBalance) {
            showToast('Insufficient balance for this bet');
            return;
        }
        bets[spot] = (bets[spot] || 0) + currentChip;
        playChipSound();
        updateTotalBetUI();
    };

    window.clearBets = function () {
        if (isSpinning) return;
        bets = { '1': 0, '2': 0, '5': 0, '10': 0, '20': 0, '40': 0, 'CHANCE': 0 };
        updateTotalBetUI();
        playChipSound();
    };

    window.doubleBets = function () {
        if (isSpinning) return;
        const totalNow = Object.values(bets).reduce((a, b) => a + b, 0);
        if (totalNow <= 0) return;
        if (totalNow * 2 > userBalance) {
            showToast('Insufficient balance to 2X bets');
            return;
        }
        for (const spot in bets) {
            bets[spot] *= 2;
        }
        updateTotalBetUI();
        playChipSound();
    };

    window.rebet = function () {
        if (isSpinning || !previousBets) return;
        const totalPrev = Object.values(previousBets).reduce((a, b) => a + b, 0);
        if (totalPrev > userBalance) {
            showToast('Insufficient balance to rebet');
            return;
        }
        bets = { ...previousBets };
        updateTotalBetUI();
        playChipSound();
    };

    // Spin Logic
    window.spinWheel = async function () {
        if (isSpinning) return;
        getAudioCtx();

        const betList = [];
        for (const spot in bets) {
            if (bets[spot] > 0) {
                betList.push({ spot, amount: bets[spot] });
            }
        }

        if (betList.length === 0) {
            showToast('Please place a bet on the board');
            return;
        }

        const totalStake = betList.reduce((acc, b) => acc + b.amount, 0);
        if (totalStake > userBalance) {
            showToast('Insufficient balance');
            return;
        }

        // Store previous bets for rebet
        previousBets = { ...bets };

        isSpinning = true;
        const spinBtn = document.getElementById('btn-spin');
        if (spinBtn) spinBtn.disabled = true;

        // Reset HUD
        const resultHud = document.getElementById('result-hud');
        const segBadge = document.getElementById('winning-seg-badge');
        const payoutBadge = document.getElementById('win-payout-badge');
        if (segBadge) segBadge.textContent = 'SPINNING...';
        if (payoutBadge) payoutBadge.style.display = 'none';

        try {
            const resp = await fetch('/api/crazywheel/spin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, bets: betList })
            });

            const data = await resp.json();
            if (data.code !== 0) {
                showToast(data.msg || 'Spin error occurred');
                isSpinning = false;
                if (spinBtn) spinBtn.disabled = false;
                return;
            }

            const spinData = data.data;
            const targetIndex = spinData.segment_index;
            const boost = spinData.crazy_boost || 1.0;

            // Handle Crazy Multiplier Boost Ribbon
            const ribbon = document.getElementById('boost-ribbon');
            const boostTxt = document.getElementById('boost-txt');
            if (boost > 1.0) {
                playBoostSound();
                if (ribbon) ribbon.classList.add('active-boost');
                if (boostTxt) boostTxt.innerHTML = `🔥 CRAZY BOOST ACTIVE! ALL WINS MULTIPLIED BY ${boost}X! 🔥`;
            } else {
                if (ribbon) ribbon.classList.remove('active-boost');
                if (boostTxt) boostTxt.innerHTML = 'CRAZY MULTIPLIERS READY • UP TO 50X BOOST!';
            }

            // Animate Wheel to targetIndex
            animateWheelTo(targetIndex, () => {
                // Spin finished callback
                isSpinning = false;
                updateBalanceUI(spinData.wallet_balance);

                // Show Result HUD
                const winningVal = spinData.winning_number;
                if (segBadge) segBadge.textContent = `RESULT: ${winningVal}`;
                if (spinData.total_payout > 0) {
                    if (payoutBadge) {
                        payoutBadge.textContent = `+${currency}${spinData.total_payout.toFixed(2)}`;
                        payoutBadge.style.display = 'block';
                    }
                    playWinSound(spinData.total_payout >= totalStake * 5);

                    // Check Celebration Modal
                    if (spinData.total_payout >= totalStake * 5) {
                        showCelebration(winningVal, spinData.total_payout, (spinData.total_payout / totalStake).toFixed(1));
                    }
                } else {
                    if (payoutBadge) {
                        payoutBadge.textContent = 'NO WIN';
                        payoutBadge.style.display = 'block';
                        payoutBadge.style.color = '#ef4444';
                    }
                }

                // If Auto Spin is active, schedule next spin
                if (isAutoSpin) {
                    autoSpinTimer = setTimeout(() => {
                        if (isAutoSpin && !isSpinning) {
                            window.spinWheel();
                        }
                    }, 2200);
                } else {
                    if (spinBtn) spinBtn.disabled = false;
                }
            });

        } catch (err) {
            console.error('Spin error:', err);
            showToast('Connection error. Please try again.');
            isSpinning = false;
            if (spinBtn) spinBtn.disabled = false;
        }
    };

    /**
     * Animate Wheel with Easing and Flapper Physics
     */
    function animateWheelTo(targetIndex, onComplete) {
        // Pointer is at Top: -Math.PI / 2
        // Center angle of target segment relative to 0 is (targetIndex * ARC_SIZE + ARC_SIZE / 2)
        // In order for target segment center to stop at pointer (-Math.PI/2):
        // FinalAngle % 2PI = -Math.PI/2 - (targetIndex * ARC_SIZE + ARC_SIZE / 2)
        const targetSegAngle = targetIndex * ARC_SIZE + ARC_SIZE / 2;
        const pointerOffset = -Math.PI / 2;

        // Current normalized angle
        const curNorm = currentAngle % (2 * Math.PI);
        const desiredNorm = (pointerOffset - targetSegAngle) % (2 * Math.PI);

        // Calculate clockwise delta
        let delta = desiredNorm - curNorm;
        while (delta < 0) delta += 2 * Math.PI;

        // Add 6 full revolutions (6 * 2 * Math.PI) for authentic Vegas suspense
        const totalRotations = 6;
        const totalDistance = totalRotations * 2 * Math.PI + delta;

        const duration = 5200; // 5.2 seconds
        const startTime = performance.now();
        const startAngle = currentAngle;

        function easeOutQuint(t) {
            return 1 - Math.pow(1 - t, 5);
        }

        function frame(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuint(progress);

            currentAngle = startAngle + totalDistance * easedProgress;

            // Check Peg Crossings under the flapper pointer
            // Peg occurs at i * ARC_SIZE
            const pointerEffectiveAngle = -Math.PI / 2 - currentAngle;
            let normAngle = pointerEffectiveAngle % (2 * Math.PI);
            if (normAngle < 0) normAngle += 2 * Math.PI;
            const currentPeg = Math.floor(normAngle / ARC_SIZE);

            if (currentPeg !== lastPegIndex) {
                lastPegIndex = currentPeg;
                playTickSound();

                // Flapper twitch animation
                if (pointerEl) {
                    const twitchAngle = progress < 0.7 ? -18 : -8;
                    pointerEl.style.transform = `translateX(-50%) rotate(${twitchAngle}deg)`;
                    setTimeout(() => {
                        if (pointerEl) pointerEl.style.transform = 'translateX(-50%) rotate(0deg)';
                    }, 40);
                }
            }

            drawWheel(currentAngle);

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                if (pointerEl) pointerEl.style.transform = 'translateX(-50%) rotate(0deg)';
                if (onComplete) onComplete();
            }
        }

        requestAnimationFrame(frame);
    }

    // Auto Spin Toggle
    window.toggleAutoSpin = function () {
        isAutoSpin = !isAutoSpin;
        const autoBtn = document.getElementById('btn-auto');
        const autoTxt = document.getElementById('auto-txt');
        if (autoBtn) autoBtn.classList.toggle('active', isAutoSpin);
        if (autoTxt) autoTxt.textContent = isAutoSpin ? 'STOP' : 'AUTO';

        if (isAutoSpin && !isSpinning) {
            window.spinWheel();
        } else if (!isAutoSpin && autoSpinTimer) {
            clearTimeout(autoSpinTimer);
        }
    };

    // Celebration Modal
    function showCelebration(winningVal, payout, mult) {
        const modal = document.getElementById('celebration-modal');
        const multEl = document.getElementById('celeb-mult');
        const amtEl = document.getElementById('celeb-amount');
        const badgeEl = document.getElementById('celeb-badge');

        if (badgeEl) badgeEl.textContent = `SEGMENT ${winningVal} JACKPOT!`;
        if (multEl) multEl.textContent = `${mult}x`;
        if (amtEl) amtEl.textContent = `+${currency}${Number(payout).toFixed(2)}`;
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

    // Refresh Balance
    document.getElementById('balance-box')?.addEventListener('click', async () => {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.classList.add('spinning');
        try {
            const resp = await fetch(`/api/crazywheel/state.php?token=${encodeURIComponent(token)}`);
            const json = await resp.json();
            if (json.code === 0 && json.data) {
                updateBalanceUI(json.data.wallet_balance);
            }
        } catch (e) {
        } finally {
            setTimeout(() => spinner?.classList.remove('spinning'), 600);
        }
    });

    // Toast notification
    function showToast(msg) {
        let toast = document.getElementById('cw-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cw-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 80px;
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
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('DOMContentLoaded', () => {
        resizeCanvas();
        updateBalanceUI(userBalance);
        updateTotalBetUI();
    });

})();
