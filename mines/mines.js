/**
 * mines/mines.js - Diamond Mines Interactive Client Engine
 */
(function() {
    'use strict';

    const CONFIG = window.MINES_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0
    };

    let userBalance = CONFIG.initialBalance;
    let gameState = 'idle'; // 'idle' or 'playing'
    let currentRoundUuid = '';
    let currentStake = 50;
    let currentMinesCount = 3;
    let gemsFound = 0;
    let currentMultiplier = 1.00;
    let nextMultiplier = 1.10;
    let currentPayout = 0;
    let revealedTiles = new Set();
    let isProcessing = false;
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
        click() {
            Sound.playTone(600, 'triangle', 0.04, 0.05);
        },
        gemReveal(gemStep) {
            if (!soundEnabled) return;
            // Major scale ascending frequencies based on consecutive gems
            const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51, 1567.98];
            const baseFreq = scale[Math.min(gemStep - 1, scale.length - 1)] || 523.25;

            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.18);
                gain.gain.setValueAtTime(0.18, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } catch(e) {}
        },
        explosion() {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                // Low rumble sub-bass
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(90, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.35, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.45);
            } catch(e) {}
        },
        cashout() {
            if (!soundEnabled) return;
            const arpeggio = [523, 659, 784, 1046, 1318];
            arpeggio.forEach((freq, idx) => {
                setTimeout(() => Sound.playTone(freq, 'triangle', 0.25, 0.12), idx * 75);
            });
        }
    };

    // UI Updates
    function updateBalance(newBal) {
        userBalance = Math.max(0, parseFloat(newBal) || 0);
        const el = document.getElementById('user-balance');
        if (el) el.textContent = userBalance.toFixed(2);
    }

    async function refreshBalance() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.parentElement.classList.add('refreshing');
        try {
            const res = await fetch(`/api/mines/state.php?token=${encodeURIComponent(CONFIG.token)}`);
            const data = await res.json();
            if (data && data.code === 0 && data.data) {
                updateBalance(data.data.wallet_balance);
            }
        } catch (e) {}
        finally {
            if (spinner) setTimeout(() => spinner.parentElement.classList.remove('refreshing'), 500);
        }
    }

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

    // Mines Selector
    window.selectMines = function(count) {
        if (gameState === 'playing') return;
        currentMinesCount = count;
        document.querySelectorAll('#mines-pills .pill').forEach(p => {
            p.classList.toggle('active', parseInt(p.getAttribute('data-mines'), 10) === count);
        });

        document.getElementById('hud-mines-count').textContent = count;
        const safeTotal = 25 - count;
        document.getElementById('hud-gems-count').textContent = `0/${safeTotal}`;
        document.getElementById('mines-hint').textContent = `${safeTotal} GEMS HIDDEN`;

        // Multiplier Preview
        const previewNext = calculateMultiplierPreview(count, 1);
        document.getElementById('hud-next-mult').textContent = `${previewNext.toFixed(2)}x`;
        Sound.click();
    };

    function calculateMultiplierPreview(mines, step) {
        let prob = 1.0;
        const safe = 25 - mines;
        for (let i = 0; i < step; i++) {
            prob *= (safe - i) / (25 - i);
        }
        return prob > 0 ? Math.max(1.01, 0.97 / prob) : 1.0;
    }

    // Stake Selection
    const stakeInput = document.getElementById('stake-input');
    window.setStake = function(val) {
        if (gameState === 'playing') return;
        currentStake = Math.max(1, parseFloat(val) || 10);
        stakeInput.value = currentStake;
        updateChipsActive();
        updateActionButton();
        Sound.click();
    };

    window.changeStake = function(delta) {
        if (gameState === 'playing') return;
        window.setStake(currentStake + delta);
    };

    window.multiplyStake = function(factor) {
        if (gameState === 'playing') return;
        window.setStake(Math.round(currentStake * factor));
    };

    stakeInput.addEventListener('input', () => {
        if (gameState === 'playing') return;
        currentStake = Math.max(1, parseFloat(stakeInput.value) || 10);
        updateChipsActive();
        updateActionButton();
    });

    function updateChipsActive() {
        document.querySelectorAll('.quick-chips .chip:not(.half):not(.double)').forEach(c => {
            c.classList.toggle('active', parseFloat(c.textContent) === currentStake);
        });
    }

    function updateActionButton() {
        const btn = document.getElementById('btn-main-action');
        const text = document.getElementById('action-text');

        if (gameState === 'idle') {
            btn.className = 'btn-main-action btn-start';
            text.textContent = `BET ${CONFIG.currency}${currentStake.toFixed(2)}`;
            setControlsDisabled(false);
            document.getElementById('btn-random').disabled = true;
        } else if (gameState === 'playing') {
            btn.className = 'btn-main-action btn-cashout';
            if (gemsFound === 0) {
                text.textContent = `PICK A TILE`;
            } else {
                text.textContent = `CASH OUT ${CONFIG.currency}${currentPayout.toFixed(2)} (${currentMultiplier.toFixed(2)}x)`;
            }
            setControlsDisabled(true);
            document.getElementById('btn-random').disabled = false;
        }
    }

    function setControlsDisabled(disabled) {
        stakeInput.disabled = disabled;
        document.querySelectorAll('.btn-step, .quick-chips .chip, #mines-pills .pill').forEach(el => {
            el.disabled = disabled;
        });
    }

    // Reset Grid View
    function resetGrid() {
        revealedTiles.clear();
        for (let i = 0; i < 25; i++) {
            const tile = document.querySelector(`.mine-tile[data-index="${i}"]`);
            if (tile) {
                tile.classList.remove('revealed');
                const back = document.getElementById(`tile-back-${i}`);
                if (back) {
                    back.className = 'tile-back';
                    back.innerHTML = '';
                }
            }
        }
    }

    // Main Action Button (BET or CASH OUT)
    window.handleMainAction = async function() {
        if (isProcessing) return;

        if (gameState === 'idle') {
            // Start Round
            await startRound();
        } else if (gameState === 'playing') {
            // Cash Out
            if (gemsFound < 1) {
                alert('Please reveal at least 1 diamond before cashing out!');
                return;
            }
            await cashOutRound();
        }
    };

    // 1. Start Round
    async function startRound() {
        if (userBalance < currentStake) {
            alert('Insufficient balance! Please recharge.');
            return;
        }

        isProcessing = true;
        Sound.click();

        try {
            const res = await fetch('/api/mines/start.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: CONFIG.token,
                    stake: currentStake,
                    mines_count: currentMinesCount
                })
            });
            const data = await res.json();

            if (data && data.code === 0 && data.data) {
                const d = data.data;
                currentRoundUuid = d.round_uuid;
                gameState = 'playing';
                gemsFound = 0;
                currentMultiplier = 1.00;
                nextMultiplier = d.next_multiplier;
                currentPayout = 0;
                updateBalance(d.wallet_balance);

                resetGrid();

                const safeTotal = 25 - currentMinesCount;
                document.getElementById('hud-gems-count').textContent = `0/${safeTotal}`;
                document.getElementById('hud-next-mult').textContent = `${nextMultiplier.toFixed(2)}x`;

                updateActionButton();
            } else {
                alert(data.msg || 'Failed to start game.');
            }
        } catch (e) {
            alert('Connection error. Please try again.');
        } finally {
            isProcessing = false;
        }
    }

    // 2. Tile Click / Reveal
    window.onTileClick = async function(tileIndex) {
        if (isProcessing) return;
        if (gameState !== 'playing') {
            // If idle and clicks tile, start game automatically
            await startRound();
            return;
        }

        if (revealedTiles.has(tileIndex)) return;

        isProcessing = true;
        revealedTiles.add(tileIndex);

        try {
            const res = await fetch('/api/mines/reveal.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: CONFIG.token,
                    round_uuid: currentRoundUuid,
                    tile_index: tileIndex
                })
            });
            const data = await res.json();

            if (data && data.code === 0 && data.data) {
                const d = data.data;
                const tile = document.querySelector(`.mine-tile[data-index="${tileIndex}"]`);
                const back = document.getElementById(`tile-back-${tileIndex}`);

                if (d.is_mine) {
                    // BOOM!
                    Sound.explosion();
                    tile.classList.add('revealed');
                    back.className = 'tile-back mine';
                    back.innerHTML = '<span class="bomb-icon">💣</span>';

                    // Shake Minefield
                    const grid = document.getElementById('minefield-grid');
                    grid.style.animation = 'bomb-shake 0.4s ease';
                    setTimeout(() => grid.style.animation = '', 400);

                    // Reveal all other mines and remaining gems in faded mode
                    revealRemainingBoard(d.all_mines, tileIndex);

                    gameState = 'idle';
                    currentRoundUuid = '';
                    updateActionButton();
                    updateBalance(d.wallet_balance);
                } else {
                    // Safe Gem!
                    gemsFound = d.current_step;
                    currentMultiplier = d.current_multiplier;
                    nextMultiplier = d.next_multiplier;
                    currentPayout = d.current_payout;

                    Sound.gemReveal(gemsFound);
                    tile.classList.add('revealed');
                    back.className = 'tile-back gem';
                    back.innerHTML = `<span class="gem-icon">💎</span><span style="font-size: 10px; font-weight: 900; color: #fff; margin-top: 2px;">${currentMultiplier.toFixed(2)}x</span>`;

                    const safeTotal = 25 - currentMinesCount;
                    document.getElementById('hud-gems-count').textContent = `${gemsFound}/${safeTotal}`;
                    document.getElementById('hud-next-mult').textContent = `${nextMultiplier.toFixed(2)}x`;

                    updateActionButton();

                    if (d.is_all_cleared) {
                        // Jackpot cleared!
                        Sound.cashout();
                        triggerCelebration('💎', `+${CONFIG.currency}${currentPayout.toFixed(2)}`, 'ALL GEMS CLEARED! JACKPOT!');
                        revealRemainingBoard(d.all_mines, -1);
                        gameState = 'idle';
                        currentRoundUuid = '';
                        updateBalance(d.wallet_balance);
                        updateActionButton();
                    }
                }
            } else {
                revealedTiles.delete(tileIndex);
            }
        } catch (e) {
            revealedTiles.delete(tileIndex);
        } finally {
            isProcessing = false;
        }
    };

    // 3. Cash Out
    async function cashOutRound() {
        if (gemsFound < 1) return;
        isProcessing = true;

        try {
            const res = await fetch('/api/mines/cashout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: CONFIG.token,
                    round_uuid: currentRoundUuid
                })
            });
            const data = await res.json();

            if (data && data.code === 0 && data.data) {
                const d = data.data;
                Sound.cashout();
                updateBalance(d.wallet_balance);

                revealRemainingBoard(d.all_mines, -1);

                if (d.multiplier >= 2.5 || gemsFound >= 5) {
                    triggerCelebration('💎', `+${CONFIG.currency}${d.payout.toFixed(2)}`, `CASHED OUT AT ${d.multiplier.toFixed(2)}x!`);
                }

                gameState = 'idle';
                currentRoundUuid = '';
                updateActionButton();
            } else {
                alert(data.msg || 'Cashout failed.');
            }
        } catch (e) {
            alert('Connection error. Please try again.');
        } finally {
            isProcessing = false;
        }
    }

    // Reveal Remaining Board after round ends
    function revealRemainingBoard(minesList, explodedTile) {
        for (let i = 0; i < 25; i++) {
            if (i === explodedTile || revealedTiles.has(i)) continue;

            const tile = document.querySelector(`.mine-tile[data-index="${i}"]`);
            const back = document.getElementById(`tile-back-${i}`);
            if (!tile || !back) continue;

            tile.classList.add('revealed');
            const isMine = minesList.includes(i);

            if (isMine) {
                back.className = 'tile-back mine faded';
                back.innerHTML = '<span class="bomb-icon">💣</span>';
            } else {
                back.className = 'tile-back gem faded';
                back.innerHTML = '<span class="gem-icon">💎</span>';
            }
        }
    }

    // 4. Auto Pick Random Tile
    window.pickRandomTile = function() {
        if (gameState !== 'playing' || isProcessing) return;
        const available = [];
        for (let i = 0; i < 25; i++) {
            if (!revealedTiles.has(i)) available.push(i);
        }
        if (available.length === 0) return;
        const randIndex = available[Math.floor(Math.random() * available.length)];
        window.onTileClick(randIndex);
    };

    // Celebration Modal
    function triggerCelebration(icon, amount, subtitle) {
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
            handleMainAction();
        } else if (e.code === 'KeyR') {
            e.preventDefault();
            pickRandomTile();
        }
    });

    // Check for Active Playing Round on page load
    async function checkActiveRound() {
        try {
            const res = await fetch(`/api/mines/state.php?token=${encodeURIComponent(CONFIG.token)}`);
            const data = await res.json();
            if (data && data.code === 0 && data.data) {
                updateBalance(data.data.wallet_balance);
                const r = data.data.active_round;
                if (r && r.status === 'playing') {
                    currentRoundUuid = r.round_uuid;
                    gameState = 'playing';
                    currentStake = r.stake;
                    currentMinesCount = r.mines_count;
                    gemsFound = r.current_step;
                    currentMultiplier = r.current_multiplier;
                    nextMultiplier = r.next_multiplier;
                    currentPayout = r.current_payout;

                    // Update controls
                    window.selectMines(currentMinesCount);
                    window.setStake(currentStake);

                    // Render already revealed gems
                    r.revealed.forEach((idx, stepIdx) => {
                        revealedTiles.add(idx);
                        const tile = document.querySelector(`.mine-tile[data-index="${idx}"]`);
                        const back = document.getElementById(`tile-back-${idx}`);
                        if (tile && back) {
                            tile.classList.add('revealed');
                            back.className = 'tile-back gem';
                            back.innerHTML = '<span class="gem-icon">💎</span>';
                        }
                    });

                    updateActionButton();
                }
            }
        } catch (e) {}
    }

    checkActiveRound();

})();
