/**
 * card365/card365.js - Card365 Live Casino Interactive Engine
 */
(function() {
    'use strict';

    const CONFIG = window.CARD365_CONFIG || {
        token: '',
        currency: '৳',
        initialBalance: 0,
        initialMode: 'teenpatti'
    };

    let userBalance = CONFIG.initialBalance;
    let currentMode = CONFIG.initialMode; // 'teenpatti', 'andarbahar', 'dragontiger', 'sevenup'
    let selectedChip = 50;
    let currentStake = 50;
    let currentBetChoice = 'player';
    let isDealing = false;
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
            } catch(e) {}
        },
        chipClink() {
            if (!soundEnabled) return;
            Sound.playTone(1800, 'sine', 0.05, 0.08);
            setTimeout(() => Sound.playTone(2400, 'sine', 0.04, 0.06), 25);
        },
        cardSlide() {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(450, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
            } catch(e) {}
        },
        cardFlip() {
            if (!soundEnabled) return;
            Sound.playTone(900, 'square', 0.04, 0.06);
        },
        diceRoll() {
            if (!soundEnabled) return;
            for (let i = 0; i < 5; i++) {
                setTimeout(() => Sound.playTone(200 + Math.random() * 200, 'sawtooth', 0.05, 0.07), i * 60);
            }
        },
        win() {
            if (!soundEnabled) return;
            const fanfare = [523, 659, 784, 1046];
            fanfare.forEach((f, idx) => {
                setTimeout(() => Sound.playTone(f, 'triangle', 0.25, 0.12), idx * 80);
            });
        }
    };

    function updateBalance(newBal) {
        userBalance = Math.max(0, parseFloat(newBal) || 0);
        const el = document.getElementById('user-balance');
        if (el) el.textContent = userBalance.toFixed(2);
    }

    async function refreshBalance() {
        const spinner = document.getElementById('balance-spinner');
        if (spinner) spinner.parentElement.classList.add('refreshing');
        try {
            const res = await fetch(`/api/card365/state.php?token=${encodeURIComponent(CONFIG.token)}`);
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

    // Mode Switching
    window.switchMode = function(mode) {
        if (isDealing) return;
        currentMode = mode;
        document.body.setAttribute('data-mode', mode);

        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-mode') === mode);
        });

        document.querySelectorAll('.game-view').forEach(view => {
            view.classList.toggle('active', view.id === `view-${mode}`);
        });

        // Set default bet choice per mode
        if (mode === 'teenpatti') window.selectBetChoice('player');
        else if (mode === 'andarbahar') window.selectBetChoice('andar');
        else if (mode === 'dragontiger') window.selectBetChoice('dragon');
        else if (mode === 'sevenup') window.selectBetChoice('seven');

        document.getElementById('result-banner').textContent = 'SELECT BET & CLICK DEAL';
        Sound.click();
    };

    // Bet Choice Selector
    window.selectBetChoice = function(choice) {
        if (isDealing) return;
        currentBetChoice = choice;

        const currentView = document.getElementById(`view-${currentMode}`);
        if (currentView) {
            currentView.querySelectorAll('.bet-spot').forEach(spot => {
                spot.classList.toggle('active', spot.getAttribute('data-choice') === choice);
            });
        }
        Sound.chipClink();
        updateChipsDisplay();
    };

    // Chip Selection
    window.selectChip = function(amount) {
        selectedChip = amount;
        currentStake = amount;
        document.querySelectorAll('.casino-chip').forEach(c => {
            c.classList.toggle('active', parseInt(c.textContent, 10) === amount || c.classList.contains(`chip-${amount}`));
        });
        document.getElementById('display-stake').textContent = currentStake;
        Sound.chipClink();
        updateChipsDisplay();
    };

    window.clearBet = function() {
        if (isDealing) return;
        currentStake = selectedChip;
        document.getElementById('display-stake').textContent = currentStake;
        updateChipsDisplay();
        Sound.chipClink();
    };

    window.doubleBet = function() {
        if (isDealing) return;
        currentStake *= 2;
        document.getElementById('display-stake').textContent = currentStake;
        updateChipsDisplay();
        Sound.chipClink();
    };

    function updateChipsDisplay() {
        document.querySelectorAll('.spot-chips').forEach(el => el.textContent = '');
        const activeChipContainer = document.getElementById(`chips-${currentBetChoice}`);
        if (activeChipContainer) {
            activeChipContainer.textContent = `${CONFIG.currency}${currentStake}`;
        }
    }

    // Helper: Render Card HTML
    function createCardHtml(card) {
        const isRed = card.color === 'red';
        return `
            <div class="playing-card">
                <div class="card-top ${isRed ? 'card-red' : 'card-black'}">
                    <span>${card.rank}</span>
                    <span>${card.suit}</span>
                </div>
                <div class="card-center ${isRed ? 'card-red' : 'card-black'}">
                    ${card.suit}
                </div>
                <div class="card-bottom ${isRed ? 'card-red' : 'card-black'}">
                    <span>${card.rank}</span>
                    <span>${card.suit}</span>
                </div>
            </div>
        `;
    }

    // DEAL ACTION
    window.handleDeal = async function() {
        if (isDealing) return;

        if (userBalance < currentStake) {
            alert('Insufficient balance! Please recharge.');
            return;
        }

        isDealing = true;
        const dealBtn = document.getElementById('btn-deal');
        dealBtn.disabled = true;

        // Deduct balance locally
        updateBalance(userBalance - currentStake);

        const banner = document.getElementById('result-banner');
        banner.textContent = 'DEALING...';

        Sound.cardSlide();

        try {
            const res = await fetch('/api/card365/play.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: CONFIG.token,
                    mode: currentMode,
                    bet_choice: currentBetChoice,
                    stake: currentStake
                })
            });
            const data = await res.json();

            if (data && data.code === 0 && data.data) {
                const d = data.data;

                // Animate deal based on mode
                if (currentMode === 'teenpatti') {
                    await animateTeenPatti(d);
                } else if (currentMode === 'andarbahar') {
                    await animateAndarBahar(d);
                } else if (currentMode === 'dragontiger') {
                    await animateDragonTiger(d);
                } else if (currentMode === 'sevenup') {
                    await animateSevenUp(d);
                }

                // Balance update
                updateBalance(d.wallet_balance);

                // Win announcement
                if (d.is_win) {
                    banner.textContent = `WINNER! +${CONFIG.currency}${d.win_amount.toFixed(2)} (${d.multiplier}x)`;
                    Sound.win();

                    if (d.multiplier >= 3.0 || d.win_amount >= currentStake * 4) {
                        triggerCelebration('👑', `+${CONFIG.currency}${d.win_amount.toFixed(2)}`, 'MEGA CASINO VICTORY!');
                    }
                } else {
                    banner.textContent = 'ROUND OVER - TRY AGAIN!';
                }
            } else {
                banner.textContent = data.msg || 'Bet failed';
            }
        } catch (e) {
            banner.textContent = 'Network error. Please try again.';
        } finally {
            isDealing = false;
            dealBtn.disabled = false;
        }
    };

    // 1. Animate Teen Patti
    async function animateTeenPatti(d) {
        const pCont = document.getElementById('tp-player-cards');
        const dCont = document.getElementById('tp-dealer-cards');

        pCont.innerHTML = '';
        dCont.innerHTML = '';

        // Deal 3 player cards one by one
        for (const card of d.player_cards) {
            Sound.cardSlide();
            pCont.insertAdjacentHTML('beforeend', createCardHtml(card));
            await sleep(180);
        }
        document.getElementById('tp-player-rank').textContent = d.player_hand.name;

        // Deal 3 dealer cards face down
        for (let i = 0; i < 3; i++) {
            Sound.cardSlide();
            dCont.insertAdjacentHTML('beforeend', '<div class="playing-card back"></div>');
            await sleep(150);
        }

        await sleep(300);

        // Showdown: flip dealer cards
        dCont.innerHTML = '';
        for (const card of d.dealer_cards) {
            Sound.cardFlip();
            dCont.insertAdjacentHTML('beforeend', createCardHtml(card));
            await sleep(180);
        }
        document.getElementById('tp-dealer-rank').textContent = d.dealer_hand.name;
    }

    // 2. Animate Andar Bahar
    async function animateAndarBahar(d) {
        // Joker
        const jSlot = document.getElementById('ab-joker-slot');
        jSlot.innerHTML = createCardHtml(d.joker);
        Sound.cardFlip();

        const aTrack = document.getElementById('ab-cards-andar');
        const bTrack = document.getElementById('ab-cards-bahar');
        aTrack.innerHTML = '';
        bTrack.innerHTML = '';

        const maxReveal = Math.min(10, Math.max(d.andar_cards.length, d.bahar_cards.length));

        for (let i = 0; i < maxReveal; i++) {
            if (d.andar_cards[i]) {
                Sound.cardSlide();
                aTrack.insertAdjacentHTML('beforeend', createCardHtml(d.andar_cards[i]));
                await sleep(150);
                if (d.winner === 'andar' && i === d.andar_cards.length - 1) break;
            }
            if (d.bahar_cards[i]) {
                Sound.cardSlide();
                bTrack.insertAdjacentHTML('beforeend', createCardHtml(d.bahar_cards[i]));
                await sleep(150);
                if (d.winner === 'bahar' && i === d.bahar_cards.length - 1) break;
            }
        }
    }

    // 3. Animate Dragon Tiger
    async function animateDragonTiger(d) {
        const dSlot = document.getElementById('dt-dragon-card');
        const tSlot = document.getElementById('dt-tiger-card');

        dSlot.innerHTML = '<div class="playing-card back"></div>';
        tSlot.innerHTML = '<div class="playing-card back"></div>';

        await sleep(200);
        Sound.cardFlip();
        dSlot.innerHTML = createCardHtml(d.dragon_card);

        await sleep(300);
        Sound.cardFlip();
        tSlot.innerHTML = createCardHtml(d.tiger_card);
    }

    // 4. Animate 7 Up 7 Down
    async function animateSevenUp(d) {
        const diceGlyphs = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        const d1 = document.getElementById('die-1');
        const d2 = document.getElementById('die-2');

        Sound.diceRoll();

        // Shuffling dice rolling effect
        for (let i = 0; i < 6; i++) {
            d1.textContent = diceGlyphs[1 + Math.floor(Math.random() * 6)];
            d2.textContent = diceGlyphs[1 + Math.floor(Math.random() * 6)];
            await sleep(70);
        }

        d1.textContent = diceGlyphs[d.dice[0]];
        d2.textContent = diceGlyphs[d.dice[1]];

        const badge = document.getElementById('dice-sum-display');
        const outcomeName = (d.outcome === 'down') ? '7 DOWN' : ((d.outcome === 'up') ? '7 UP' : 'LUCKY 7');
        badge.textContent = `TOTAL: ${d.sum} (${outcomeName})`;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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
            handleDeal();
        }
    });

    updateChipsDisplay();

})();
