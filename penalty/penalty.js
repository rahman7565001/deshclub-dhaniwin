/**
 * penalty/penalty.js - Penalty Shootout Football Casino Arcade Client
 */

(function () {
    'use strict';

    const cfg = window.PS_CONFIG || {};
    let userBalance = Number(cfg.initialBalance || 0);
    const currency = cfg.currency || '৳';
    const token = cfg.token || '';

    const TARGETS = ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'center'];
    const MULTIPLIERS = [1.92, 3.84, 7.68, 15.36, 30.72];

    // Game State
    let selectedTeam = 'ARG';
    let currentStake = 10;
    let activeSession = null;
    let isShooting = false;
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

    function playWhistleSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            [1900, 2400].forEach((freq) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            });
        } catch (e) {}
    }

    function playKickSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }

    function playGoalSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            // Cheering crowd chords
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = ctx.currentTime + idx * 0.06;
                gain.gain.setValueAtTime(0.2, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.4);
            });
        } catch (e) {}
    }

    function playSaveSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.22, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.36);
        } catch (e) {}
    }

    function playCashoutSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = ctx.currentTime + idx * 0.08;
                gain.gain.setValueAtTime(0.18, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.3);
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

    function updateHud(mult, win) {
        const multEl = document.getElementById('hud-mult');
        const winEl = document.getElementById('hud-win');
        if (multEl) multEl.textContent = `${Number(mult).toFixed(2)}x`;
        if (winEl) winEl.textContent = `${currency}${Number(win).toFixed(2)}`;
    }

    function updateLadder(currentGoal, kicks) {
        const steps = document.querySelectorAll('.ladder-ribbon .ladder-step');
        steps.forEach((step, idx) => {
            const stepNum = idx + 1;
            step.classList.remove('active-step', 'scored-step', 'saved-step');

            if (kicks && kicks[idx]) {
                if (kicks[idx].result === 'goal') {
                    step.classList.add('scored-step');
                } else if (kicks[idx].result === 'saved') {
                    step.classList.add('saved-step');
                }
            } else if (activeSession && activeSession.status === 'active' && stepNum === currentGoal + 1) {
                step.classList.add('active-step');
            }
        });
    }

    function updateActionButton() {
        const btn = document.getElementById('btn-action');
        const ico = document.getElementById('action-ico');
        const txt = document.getElementById('action-txt');
        const sub = document.getElementById('action-sub');
        if (!btn) return;

        if (activeSession && activeSession.status === 'active') {
            const currentGoal = activeSession.current_goal;
            const winAmt = activeSession.current_win || (activeSession.stake * activeSession.current_multiplier);

            btn.className = 'btn-action btn-cashout';
            if (ico) ico.textContent = '💰';
            if (txt) txt.textContent = currentGoal > 0 ? `CASHOUT ${currency}${winAmt.toFixed(2)}` : 'AIM & SHOOT 🎯';
            if (sub) sub.textContent = currentGoal > 0 ? `Take current ${activeSession.current_multiplier.toFixed(2)}x win` : 'Click a Target Corner';
            btn.disabled = currentGoal <= 0 || isShooting;
        } else {
            btn.className = 'btn-action btn-start';
            if (ico) ico.textContent = '⚽';
            if (txt) txt.textContent = 'START MATCH';
            if (sub) sub.textContent = `Stake: ${currency}${currentStake.toFixed(2)}`;
            btn.disabled = isShooting;
        }

        // Lock / Unlock inputs and team selector
        const isGameActive = activeSession && activeSession.status === 'active';
        document.querySelectorAll('.teams-ribbon .team-btn').forEach(b => b.disabled = isGameActive);
        const stakeInput = document.getElementById('stake-input');
        if (stakeInput) stakeInput.disabled = isGameActive;
        document.querySelectorAll('.btn-helper, .chips-tray .chip').forEach(b => b.disabled = isGameActive);
    }

    // Reset Pitch Visuals (Ball & Keeper to center ready state)
    function resetPitch() {
        const ball = document.getElementById('soccer-ball');
        const keeper = document.getElementById('goalkeeper');
        if (ball) ball.className = 'soccer-ball';
        if (keeper) keeper.className = 'goalkeeper';
    }

    // Set Stake & Quick Controls
    window.setStake = function (val) {
        if (activeSession && activeSession.status === 'active') return;
        currentStake = Math.max(10, Math.min(50000, Number(val)));
        const input = document.getElementById('stake-input');
        if (input) input.value = currentStake;
        document.querySelectorAll('.chips-tray .chip').forEach(c => {
            const txt = c.textContent.trim();
            const cVal = txt.endsWith('K') ? 1000 : Number(txt);
            c.classList.toggle('active', cVal === currentStake);
        });
        playChipSound();
        updateActionButton();
    };

    document.getElementById('stake-input')?.addEventListener('input', function () {
        currentStake = Math.max(10, Math.min(50000, Number(this.value) || 10));
        updateActionButton();
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

    // Team Selection
    document.querySelectorAll('.teams-ribbon .team-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (activeSession && activeSession.status === 'active') return;
            selectedTeam = this.dataset.team;
            document.querySelectorAll('.teams-ribbon .team-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            playChipSound();
        });
    });

    // Big Action Button Handler (Start Match or Cashout)
    window.handleActionButton = async function () {
        getAudioCtx();
        if (isShooting) return;

        if (activeSession && activeSession.status === 'active') {
            // Player wants to Cashout!
            if (activeSession.current_goal <= 0) return;
            await cashoutMatch();
        } else {
            // Start Match!
            await startMatch();
        }
    };

    // Start Match
    async function startMatch() {
        if (currentStake > userBalance) {
            showToast('Insufficient balance. Please recharge.');
            return;
        }

        isShooting = true;
        updateActionButton();
        resetPitch();

        try {
            const resp = await fetch('/api/penalty/start.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    stake: currentStake,
                    team: selectedTeam
                })
            });

            const data = await resp.json();
            if (data.code !== 0) {
                showToast(data.msg || 'Could not start match');
                isShooting = false;
                updateActionButton();
                return;
            }

            activeSession = data.data;
            updateBalanceUI(activeSession.wallet_balance);
            updateHud(activeSession.current_multiplier, activeSession.current_win);
            updateLadder(activeSession.current_goal, activeSession.kicks);

            playWhistleSound();
            showToast('Match started! Choose a target corner to shoot.');
        } catch (err) {
            console.error('Start match error:', err);
            showToast('Network error while starting match');
        } finally {
            isShooting = false;
            updateActionButton();
        }
    }

    // Shoot at Target
    window.shootAt = async function (target) {
        getAudioCtx();
        if (isShooting) return;

        // If no active session, start one first
        if (!activeSession || activeSession.status !== 'active') {
            if (currentStake > userBalance) {
                showToast('Insufficient balance. Please recharge.');
                return;
            }
            isShooting = true;
            try {
                const startResp = await fetch('/api/penalty/start.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, stake: currentStake, team: selectedTeam })
                });
                const startData = await startResp.json();
                if (startData.code !== 0) {
                    showToast(startData.msg || 'Error starting match');
                    isShooting = false;
                    return;
                }
                activeSession = startData.data;
                updateBalanceUI(activeSession.wallet_balance);
                updateHud(activeSession.current_multiplier, activeSession.current_win);
                updateLadder(activeSession.current_goal, activeSession.kicks);
                playWhistleSound();
            } catch (e) {
                showToast('Connection error');
                isShooting = false;
                return;
            }
        }

        isShooting = true;
        resetPitch();
        playKickSound();

        // Animate Kick & Dive
        const ball = document.getElementById('soccer-ball');
        const keeper = document.getElementById('goalkeeper');

        try {
            const resp = await fetch('/api/penalty/shoot.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    session_uuid: activeSession.session_uuid,
                    target: target
                })
            });

            const data = await resp.json();
            if (data.code !== 0) {
                showToast(data.msg || 'Shot error');
                isShooting = false;
                return;
            }

            const shotData = data.data;
            const keeperDive = shotData.keeper_dive;

            // Trigger visual animations
            if (ball) ball.classList.add(`kick-${target}`);
            if (keeper) keeper.classList.add(`dive-${keeperDive}`);

            setTimeout(() => {
                activeSession = shotData;
                updateBalanceUI(shotData.wallet_balance);
                updateLadder(shotData.current_goal, shotData.kicks);

                if (shotData.shot_result === 'goal') {
                    playGoalSound();
                    showMatchBanner('GOOOAL! ⚽', 'goal');
                    updateHud(shotData.current_multiplier, shotData.current_win);

                    if (shotData.is_champion) {
                        playCashoutSound();
                        showCelebration(shotData.current_multiplier, shotData.total_payout);
                        activeSession = null;
                        setTimeout(resetPitch, 1500);
                    }
                } else {
                    // SAVED!
                    playSaveSound();
                    showMatchBanner('SAVED! 🧤', 'saved');
                    updateHud(1.0, 0.0);
                    activeSession = null;
                    setTimeout(resetPitch, 1500);
                }

                isShooting = false;
                updateActionButton();
            }, 450);

        } catch (err) {
            console.error('Shot error:', err);
            showToast('Network error during shot');
            isShooting = false;
            updateActionButton();
        }
    };

    // Shoot at a Random Spot
    window.shootRandom = function () {
        const randTarget = TARGETS[Math.floor(Math.random() * TARGETS.length)];
        window.shootAt(randTarget);
    };

    // Cashout Match
    async function cashoutMatch() {
        if (!activeSession || activeSession.status !== 'active') return;
        if (activeSession.current_goal <= 0) return;

        isShooting = true;
        try {
            const resp = await fetch('/api/penalty/cashout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    session_uuid: activeSession.session_uuid
                })
            });

            const data = await resp.json();
            if (data.code !== 0) {
                showToast(data.msg || 'Cashout error');
                isShooting = false;
                return;
            }

            const cashoutData = data.data;
            playCashoutSound();
            updateBalanceUI(cashoutData.wallet_balance);
            updateHud(cashoutData.current_multiplier, cashoutData.total_payout);
            showCelebration(cashoutData.current_multiplier, cashoutData.total_payout);

            activeSession = null;
            resetPitch();
            updateLadder(0, []);
        } catch (err) {
            console.error('Cashout error:', err);
            showToast('Network error during cashout');
        } finally {
            isShooting = false;
            updateActionButton();
        }
    }

    // Match Banner
    function showMatchBanner(txt, type) {
        const banner = document.getElementById('match-banner');
        const bannerTxt = document.getElementById('banner-txt');
        if (!banner || !bannerTxt) return;

        bannerTxt.textContent = txt;
        banner.className = `match-banner show-${type}`;

        setTimeout(() => {
            banner.className = 'match-banner';
        }, 1200);
    }

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

    // Refresh State & Resume
    async function fetchState() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.classList.add('spinning');
        try {
            const resp = await fetch(`/api/penalty/state.php?token=${encodeURIComponent(token)}`);
            const json = await resp.json();
            if (json.code === 0 && json.data) {
                updateBalanceUI(json.data.wallet_balance);
                if (json.data.active_session) {
                    activeSession = json.data.active_session;
                    selectedTeam = activeSession.team;
                    document.querySelectorAll('.teams-ribbon .team-btn').forEach(b => {
                        b.classList.toggle('active', b.dataset.team === selectedTeam);
                    });
                    updateHud(activeSession.current_multiplier, activeSession.current_win);
                    updateLadder(activeSession.current_goal, activeSession.kicks);
                    updateActionButton();
                }
            }
        } catch (e) {
        } finally {
            setTimeout(() => spinner?.classList.remove('spinning'), 600);
        }
    }

    document.getElementById('balance-box')?.addEventListener('click', fetchState);

    // Toast Notification
    function showToast(msg) {
        let toast = document.getElementById('ps-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ps-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 85px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(14, 20, 36, 0.95);
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
        updateLadder(0, []);
        updateActionButton();
        fetchState();
    });

})();
