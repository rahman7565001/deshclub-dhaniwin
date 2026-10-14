/**
 * tower/tower.js - Tower Legend Castle Climb Arcade Client
 */

(function () {
    'use strict';

    const cfg = window.TL_CONFIG || {};
    let userBalance = Number(cfg.initialBalance || 0);
    const currency = cfg.currency || '৳';
    const token = cfg.token || '';

    // Difficulties Definition
    const DIFFICULTIES = {
        'easy': {
            name: 'Easy',
            tiles: 5,
            skulls: 1,
            gems: 4,
            multipliers: [1.20, 1.50, 1.88, 2.35, 2.94, 3.68, 4.60, 5.75, 7.20]
        },
        'medium': {
            name: 'Medium',
            tiles: 4,
            skulls: 1,
            gems: 3,
            multipliers: [1.29, 1.72, 2.29, 3.06, 4.08, 5.45, 7.26, 9.69, 12.92]
        },
        'hard': {
            name: 'Hard',
            tiles: 3,
            skulls: 1,
            gems: 2,
            multipliers: [1.45, 2.18, 3.26, 4.90, 7.35, 11.02, 16.53, 24.80, 37.20]
        },
        'expert': {
            name: 'Expert',
            tiles: 2,
            skulls: 1,
            gems: 1,
            multipliers: [1.93, 3.86, 7.72, 15.44, 30.88, 61.76, 123.52, 247.04, 494.08]
        },
        'master': {
            name: 'Master',
            tiles: 3,
            skulls: 2,
            gems: 1,
            multipliers: [2.89, 8.68, 26.06, 78.18, 234.54, 703.62, 2110.86, 6332.58, 18997.74]
        }
    };

    // Game State
    let currentDifficulty = 'medium';
    let currentStake = 10;
    let activeSession = null;
    let isProcessing = false;
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

    function playStepSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.09);
        } catch (e) {}
    }

    function playGemSound(floor) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            // Higher pitch per floor (e.g. 500Hz to 1800Hz)
            const baseFreq = 523.25 + (floor * 110);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    }

    function playSkullSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.46);
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

    function updateActionButton() {
        const btn = document.getElementById('btn-action');
        const ico = document.getElementById('action-ico');
        const txt = document.getElementById('action-txt');
        const sub = document.getElementById('action-sub');
        if (!btn) return;

        if (activeSession && activeSession.status === 'active') {
            const currentFloor = activeSession.current_floor;
            const winAmt = activeSession.current_win || (activeSession.stake * activeSession.current_multiplier);

            btn.className = 'btn-action btn-cashout';
            if (ico) ico.textContent = '💰';
            if (txt) txt.textContent = currentFloor > 0 ? `CASHOUT ${currency}${winAmt.toFixed(2)}` : 'PICK A TILE';
            if (sub) sub.textContent = currentFloor > 0 ? `Secures current ${activeSession.current_multiplier.toFixed(2)}x win` : 'Floor 1 Unlocked';
            btn.disabled = currentFloor <= 0 || isProcessing;
        } else {
            btn.className = 'btn-action btn-climb';
            if (ico) ico.textContent = '🏰';
            if (txt) txt.textContent = 'START CLIMB';
            if (sub) sub.textContent = `Stake: ${currency}${currentStake.toFixed(2)}`;
            btn.disabled = isProcessing;
        }

        // Lock / Unlock inputs and difficulty ribbon
        const isGameActive = activeSession && activeSession.status === 'active';
        document.querySelectorAll('.diff-ribbon .btn-diff').forEach(b => b.disabled = isGameActive);
        const stakeInput = document.getElementById('stake-input');
        if (stakeInput) stakeInput.disabled = isGameActive;
        document.querySelectorAll('.btn-helper, .chips-tray .chip').forEach(b => b.disabled = isGameActive);
    }

    // Render Tower Board
    function renderTowerBoard() {
        const container = document.getElementById('floors-container');
        if (!container) return;

        const diffConfig = DIFFICULTIES[currentDifficulty] || DIFFICULTIES['medium'];
        const totalFloors = diffConfig.multipliers.length; // 9
        const tilesCount = diffConfig.tiles;

        const currentFloor = activeSession && activeSession.status === 'active' ? activeSession.current_floor : -1;
        const sessionFloors = activeSession ? activeSession.floors : null;
        const picks = activeSession ? activeSession.picks : [];

        container.innerHTML = '';

        // Render from top (Floor 9, idx 8) down to bottom (Floor 1, idx 0)
        for (let floorIdx = totalFloors - 1; floorIdx >= 0; floorIdx--) {
            const mult = diffConfig.multipliers[floorIdx];
            const floorRow = document.createElement('div');
            floorRow.className = 'floor-row';
            floorRow.dataset.floor = floorIdx;

            // Determine floor state
            if (activeSession && activeSession.status === 'active') {
                if (floorIdx === currentFloor) {
                    floorRow.classList.add('active-floor');
                } else if (floorIdx < currentFloor) {
                    floorRow.classList.add('cleared-floor');
                } else {
                    floorRow.classList.add('locked-floor');
                }
            } else if (activeSession && activeSession.status !== 'active') {
                // Game ended
                if (floorIdx < activeSession.current_floor) {
                    floorRow.classList.add('cleared-floor');
                }
            }

            // Left Multiplier Badge
            const badge = document.createElement('div');
            badge.className = 'floor-badge';
            badge.innerHTML = `
                <span class="floor-idx">${floorIdx + 1}F</span>
                <span class="floor-mult">${mult.toFixed(2)}x</span>
            `;
            floorRow.appendChild(badge);

            // Tiles Container
            const tilesWrap = document.createElement('div');
            tilesWrap.className = 'floor-tiles';

            // Check if player made a pick on this floor
            const pickForThisFloor = picks.find(p => p.floor === floorIdx);

            for (let tileIdx = 0; tileIdx < tilesCount; tileIdx++) {
                const tile = document.createElement('div');
                tile.className = 'stone-tile';
                tile.dataset.floor = floorIdx;
                tile.dataset.tile = tileIdx;

                if (activeSession && activeSession.status === 'active') {
                    if (floorIdx === currentFloor) {
                        tile.classList.add('clickable');
                        tile.innerHTML = '🛡️';
                        tile.addEventListener('click', () => pickTile(floorIdx, tileIdx));
                    } else if (floorIdx < currentFloor) {
                        if (pickForThisFloor && pickForThisFloor.tile === tileIdx) {
                            tile.classList.add('gem-revealed');
                            tile.innerHTML = '💎';
                        } else {
                            tile.innerHTML = '✨';
                        }
                    } else {
                        tile.innerHTML = '🔒';
                    }
                } else if (sessionFloors && sessionFloors[floorIdx]) {
                    // Game finished: reveal true board contents
                    const tileType = sessionFloors[floorIdx][tileIdx];
                    const wasPicked = pickForThisFloor && pickForThisFloor.tile === tileIdx;

                    if (wasPicked) {
                        if (tileType === 'skull') {
                            tile.classList.add('skull-revealed');
                            tile.innerHTML = '💀';
                        } else {
                            tile.classList.add('gem-revealed');
                            tile.innerHTML = '💎';
                        }
                    } else {
                        if (tileType === 'skull') {
                            tile.classList.add('skull-peek');
                            tile.innerHTML = '💀';
                        } else {
                            tile.classList.add('gem-peek');
                            tile.innerHTML = '💎';
                        }
                    }
                } else {
                    // Idle default preview
                    tile.innerHTML = '🛡️';
                }

                tilesWrap.appendChild(tile);
            }

            floorRow.appendChild(tilesWrap);
            container.appendChild(floorRow);
        }
    }

    // Set Stake & Helper Controls
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

    // Difficulty Switching
    document.querySelectorAll('.diff-ribbon .btn-diff').forEach(btn => {
        btn.addEventListener('click', function () {
            if (activeSession && activeSession.status === 'active') return;
            const diff = this.dataset.diff;
            if (DIFFICULTIES[diff]) {
                currentDifficulty = diff;
                document.querySelectorAll('.diff-ribbon .btn-diff').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                playChipSound();
                renderTowerBoard();
            }
        });
    });

    // Handle Big Action Button (Start Climb or Cashout)
    window.handleActionButton = async function () {
        getAudioCtx();
        if (isProcessing) return;

        if (activeSession && activeSession.status === 'active') {
            // Player wants to Cashout!
            if (activeSession.current_floor <= 0) return;
            await cashoutGame();
        } else {
            // Start Climb!
            await startClimb();
        }
    };

    // Start Climb
    async function startClimb() {
        if (currentStake > userBalance) {
            showToast('Insufficient balance. Please recharge.');
            return;
        }

        isProcessing = true;
        updateActionButton();

        try {
            const resp = await fetch('/api/tower/start.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    stake: currentStake,
                    difficulty: currentDifficulty
                })
            });

            const data = await resp.json();
            if (data.code !== 0) {
                showToast(data.msg || 'Could not start game');
                isProcessing = false;
                updateActionButton();
                return;
            }

            activeSession = data.data;
            currentDifficulty = activeSession.difficulty;
            updateBalanceUI(activeSession.wallet_balance);
            updateHud(activeSession.current_multiplier, activeSession.current_win);

            playStepSound();
            renderTowerBoard();
        } catch (err) {
            console.error('Start error:', err);
            showToast('Network error while starting climb');
        } finally {
            isProcessing = false;
            updateActionButton();
        }
    }

    // Pick Tile on Active Floor
    async function pickTile(floorIdx, tileIdx) {
        if (!activeSession || activeSession.status !== 'active') return;
        if (floorIdx !== activeSession.current_floor) return;
        if (isProcessing) return;

        isProcessing = true;
        getAudioCtx();
        playStepSound();

        try {
            const resp = await fetch('/api/tower/step.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    session_uuid: activeSession.session_uuid,
                    tile_index: tileIdx
                })
            });

            const data = await resp.json();
            if (data.code !== 0) {
                showToast(data.msg || 'Step error');
                isProcessing = false;
                return;
            }

            const stepData = data.data;
            activeSession = stepData;
            updateBalanceUI(stepData.wallet_balance);

            if (stepData.step_result === 'skull') {
                // Skull exploded!
                playSkullSound();
                updateHud(1.0, 0.0);
                renderTowerBoard();
                showToast('💀 Dungeon trap triggered! Game over.');
                activeSession = null;
            } else {
                // Gem found!
                playGemSound(activeSession.current_floor);
                updateHud(activeSession.current_multiplier, activeSession.current_win);
                renderTowerBoard();

                if (stepData.is_apex) {
                    // Reached Apex!
                    playCashoutSound();
                    showCelebration(stepData.current_multiplier, stepData.total_payout);
                    activeSession = null;
                }
            }
        } catch (err) {
            console.error('Step error:', err);
            showToast('Network error during climb');
        } finally {
            isProcessing = false;
            updateActionButton();
        }
    }

    // Cashout Game
    async function cashoutGame() {
        if (!activeSession || activeSession.status !== 'active') return;
        if (activeSession.current_floor <= 0) return;

        isProcessing = true;
        try {
            const resp = await fetch('/api/tower/cashout.php', {
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
                isProcessing = false;
                return;
            }

            const cashoutData = data.data;
            playCashoutSound();
            updateBalanceUI(cashoutData.wallet_balance);
            updateHud(cashoutData.current_multiplier, cashoutData.total_payout);

            // Show celebratory win
            showCelebration(cashoutData.current_multiplier, cashoutData.total_payout);

            activeSession = cashoutData; // for revealing whole board
            renderTowerBoard();
            activeSession = null;
        } catch (err) {
            console.error('Cashout error:', err);
            showToast('Network error during cashout');
        } finally {
            isProcessing = false;
            updateActionButton();
        }
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

    // Refresh Balance & Resume State
    async function fetchState() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.classList.add('spinning');
        try {
            const resp = await fetch(`/api/tower/state.php?token=${encodeURIComponent(token)}`);
            const json = await resp.json();
            if (json.code === 0 && json.data) {
                updateBalanceUI(json.data.wallet_balance);
                if (json.data.active_session) {
                    activeSession = json.data.active_session;
                    currentDifficulty = activeSession.difficulty;
                    document.querySelectorAll('.diff-ribbon .btn-diff').forEach(b => {
                        b.classList.toggle('active', b.dataset.diff === currentDifficulty);
                    });
                    updateHud(activeSession.current_multiplier, activeSession.current_win);
                    renderTowerBoard();
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
        let toast = document.getElementById('tl-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'tl-toast';
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
        renderTowerBoard();
        updateBalanceUI(userBalance);
        updateActionButton();
        fetchState();
    });

})();
