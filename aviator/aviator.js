// aviator.js - Client-Side Aviator Game Engine
(function() {
    'use strict';

    // Canvas & Stage
    const canvas = document.getElementById('aviator-canvas');
    const ctx = canvas.getContext('2d');
    const multDisplay = document.getElementById('multiplier-display');
    const multValue = document.getElementById('multiplier-value');
    const waitingOverlay = document.getElementById('waiting-overlay');
    const countdownProgress = document.getElementById('countdown-progress');
    const crashedOverlay = document.getElementById('crashed-overlay');
    const crashedMultText = document.getElementById('crashed-multiplier-text');
    const userBalanceEl = document.getElementById('user-balance');
    const historyContainer = document.getElementById('history-pills');
    const sidebarList = document.getElementById('sidebar-list');

    // State Variables
    let gameState = {
        status: 'betting', // 'betting' | 'flying' | 'crashed'
        round_uuid: '',
        current_multiplier: 1.00,
        crash_multiplier: 1.00,
        countdown: 5.0,
        server_time: Date.now(),
        last_poll_time: Date.now(),
        history: [],
        user: null,
        my_bets: []
    };

    // Bet Panel States (1 & 2)
    const panels = {
        1: {
            state: 'idle', // 'idle' | 'placed' | 'cashed_out'
            stake: 100,
            autoCashout: false,
            autoVal: 2.00,
            betId: null
        },
        2: {
            state: 'idle',
            stake: 50,
            autoCashout: false,
            autoVal: 5.00,
            betId: null
        }
    };

    // Propeller angle & plane animation physics
    let propellerAngle = 0;
    let planeX = 0;
    let planeY = 0;
    let planeBob = 0;
    let crashFlyOffX = 0;
    let crashFlyOffY = 0;

    // Resize Canvas to device resolution
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Auto-cashout input bindings
    for (let p = 1; p <= 2; p++) {
        const chk = document.getElementById(`auto-cashout-chk-${p}`);
        const input = document.getElementById(`auto-cashout-val-${p}`);
        chk.addEventListener('change', (e) => {
            panels[p].autoCashout = e.target.checked;
            input.disabled = !e.target.checked;
        });
        input.addEventListener('input', (e) => {
            panels[p].autoVal = parseFloat(e.target.value) || 2.00;
        });
    }

    // Step stake helpers
    window.adjustStake = function(panel, delta) {
        const input = document.getElementById(`stake-input-${panel}`);
        let val = Math.max(10, (parseFloat(input.value) || 0) + delta);
        input.value = val;
        panels[panel].stake = val;
        updatePanelButton(panel);
    };

    window.setStake = function(panel, val) {
        const input = document.getElementById(`stake-input-${panel}`);
        input.value = val;
        panels[panel].stake = val;
        updatePanelButton(panel);
    };

    // Fetch Token from URL or storage
    let userToken = window.AVIATOR_TOKEN || localStorage.getItem('token') || '';
    if (!userToken) {
        // Try getting token from localStorage
        const stored = localStorage.getItem('PUM_TOKEN') || localStorage.getItem('token');
        if (stored) userToken = stored;
    }

    // Draw Iconic Red Airplane
    function drawAirplane(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Plane Body (Sleek aerodynamic red jet)
        ctx.shadowColor = 'rgba(229, 57, 53, 0.6)';
        ctx.shadowBlur = 12;

        // Fuselage
        ctx.fillStyle = '#e53935';
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cockpit window
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(6, -2, 7, 3, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // Main Wing
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-14, 18);
        ctx.lineTo(-7, 18);
        ctx.lineTo(8, 0);
        ctx.closePath();
        ctx.fill();

        // Top Wing
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-12, -14);
        ctx.lineTo(-6, -14);
        ctx.lineTo(8, 0);
        ctx.closePath();
        ctx.fill();

        // Tail Fin
        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(-26, -12);
        ctx.lineTo(-20, -12);
        ctx.lineTo(-14, 0);
        ctx.closePath();
        ctx.fill();

        // Propeller Nose Cone
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(24, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Propeller Blur (Spinning)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const propLen = 14;
        const cos = Math.cos(propellerAngle);
        const sin = Math.sin(propellerAngle);
        ctx.moveTo(24 - sin * propLen, cos * propLen);
        ctx.lineTo(24 + sin * propLen, -cos * propLen);
        ctx.stroke();

        ctx.restore();
    }

    // Main 60FPS Canvas Render Loop
    function render() {
        const rect = canvas.getBoundingClientRect();
        const W = rect.width;
        const H = rect.height;

        ctx.clearRect(0, 0, W, H);

        // Draw Coordinate Grid Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const gridStep = 40;
        for (let x = 0; x < W; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        propellerAngle += 0.4;
        planeBob = Math.sin(Date.now() / 250) * 4;

        if (gameState.status === 'flying') {
            // Calculate plane flight trajectory curve
            // Plane curves from (40, H - 40) towards (W * 0.75, H * 0.25)
            const targetX = Math.min(W * 0.75, 50 + (gameState.current_multiplier - 1) * 35);
            const targetY = Math.max(H * 0.25, (H - 50) - (gameState.current_multiplier - 1) * 28) + planeBob;

            planeX += (targetX - planeX) * 0.08;
            planeY += (targetY - planeY) * 0.08;

            const startX = 30;
            const startY = H - 30;

            // Draw glowing red filled area underneath the flight curve
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(startX + (planeX - startX) * 0.5, startY, planeX, planeY);
            ctx.lineTo(planeX, startY);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, planeY, 0, startY);
            grad.addColorStop(0, 'rgba(229, 57, 53, 0.35)');
            grad.addColorStop(1, 'rgba(229, 57, 53, 0.0)');
            ctx.fillStyle = grad;
            ctx.fill();

            // Draw the glowing red trajectory curve
            ctx.strokeStyle = '#e53935';
            ctx.lineWidth = 4;
            ctx.shadowColor = 'rgba(229, 57, 53, 0.8)';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(startX + (planeX - startX) * 0.5, startY, planeX, planeY);
            ctx.stroke();
            ctx.restore();

            // Calculate plane flight angle based on curve tangent
            const flightAngle = -Math.atan2(startY - planeY, planeX - startX) * 0.45;
            drawAirplane(ctx, planeX, planeY, flightAngle);

        } else if (gameState.status === 'crashed') {
            // Plane accelerates away off-screen into upper right
            crashFlyOffX += 14;
            crashFlyOffY -= 9;
            drawAirplane(ctx, planeX + crashFlyOffX, planeY + crashFlyOffY, -0.5);
        } else {
            // Betting phase: plane sits near bottom-left ready for takeoff
            planeX = 50;
            planeY = H - 55 + planeBob;
            crashFlyOffX = 0;
            crashFlyOffY = 0;
            drawAirplane(ctx, planeX, planeY, -0.1);
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // State Polling Loop (every 250ms for low-latency sync)
    async function pollState() {
        try {
            const url = `/api/aviator/state.php?token=${encodeURIComponent(userToken)}`;
            const res = await fetch(url);
            const json = await res.json();

            if (json.code === 0 && json.data) {
                const prevStatus = gameState.status;
                const prevRound = gameState.round_uuid;
                gameState = Object.assign(gameState, json.data);
                gameState.last_poll_time = Date.now();

                // Round change reset
                if (prevRound !== gameState.round_uuid) {
                    resetPanelsForNewRound();
                }

                // Balance update & Currency update
                if (gameState.user && gameState.user.balance !== undefined) {
                    userBalanceEl.textContent = parseFloat(gameState.user.balance).toFixed(2);
                    if (gameState.user.symbol) {
                        const curEls = document.querySelectorAll('.currency');
                        curEls.forEach(el => { el.textContent = gameState.user.symbol; });
                    }
                    if (gameState.user.currency) {
                        window.userCurrencyCode = gameState.user.currency;
                        window.userCurrencySymbol = gameState.user.symbol || '৳';
                    }
                }

                // Status UI Update
                updateStatusUI(prevStatus);

                // History update
                renderHistoryPills(gameState.history);

                // Sidebar live players update
                renderSidebarList(gameState.live_players);

                // Check auto cashout & panel states
                syncPanelBets();
            }
        } catch (err) {
            console.error('Aviator poll error:', err);
        }

        setTimeout(pollState, 250);
    }
    pollState();

    // Reset Panels for New Round
    function resetPanelsForNewRound() {
        for (let p = 1; p <= 2; p++) {
            panels[p].state = 'idle';
            panels[p].betId = null;
            updatePanelButton(p);
        }
    }

    // Sync panel bet status with server response
    function syncPanelBets() {
        if (!gameState.my_bets || !gameState.my_bets.length) return;

        gameState.my_bets.forEach(b => {
            const p = parseInt(b.bet_panel);
            if (panels[p]) {
                panels[p].betId = b.id;
                if (b.status === 'won') {
                    panels[p].state = 'cashed_out';
                } else if (b.status === 'active') {
                    panels[p].state = 'placed';
                    // Check client-side auto cashout trigger
                    if (panels[p].autoCashout && gameState.status === 'flying') {
                        if (gameState.current_multiplier >= panels[p].autoVal) {
                            executeCashout(p);
                        }
                    }
                } else if (b.status === 'lost') {
                    panels[p].state = 'idle';
                }
                updatePanelButton(p);
            }
        });
    }

    // Update Status UI (Overlays, Texts)
    function updateStatusUI(prevStatus) {
        if (gameState.status === 'betting') {
            waitingOverlay.style.display = 'flex';
            crashedOverlay.style.display = 'none';
            multDisplay.style.display = 'none';

            // Progress bar
            const pct = Math.max(0, Math.min(100, (gameState.countdown / 5.0) * 100));
            countdownProgress.style.width = `${pct}%`;

        } else if (gameState.status === 'flying') {
            waitingOverlay.style.display = 'none';
            crashedOverlay.style.display = 'none';
            multDisplay.style.display = 'block';

            multValue.textContent = `${gameState.current_multiplier.toFixed(2)}x`;
            multValue.style.color = '#ffffff';

        } else if (gameState.status === 'crashed') {
            waitingOverlay.style.display = 'none';
            multDisplay.style.display = 'none';
            crashedOverlay.style.display = 'flex';

            crashedMultText.textContent = `${(gameState.crash_multiplier || gameState.current_multiplier).toFixed(2)}x`;
        }

        // Update action buttons on panels
        updatePanelButton(1);
        updatePanelButton(2);
    }

    // Update Panel Button Appearance
    function updatePanelButton(p) {
        const btn = document.getElementById(`main-btn-${p}`);
        const primaryText = btn.querySelector('.btn-primary-text');
        const subText = document.getElementById(`btn-sub-${p}`);
        const panel = panels[p];

        btn.className = 'main-bet-btn';

        const curCode = window.userCurrencyCode || 'BDT';
        const curSym = window.userCurrencySymbol || '৳';

        if (panel.state === 'idle') {
            btn.classList.add('btn-bet');
            primaryText.textContent = 'BET';
            subText.textContent = `${panel.stake.toFixed(2)} ${curCode}`;
        } else if (panel.state === 'placed') {
            if (gameState.status === 'flying') {
                btn.classList.add('btn-cashout');
                primaryText.textContent = 'CASH OUT';
                const livePayout = (panel.stake * gameState.current_multiplier).toFixed(2);
                subText.textContent = `${livePayout} ${curCode}`;
            } else {
                btn.classList.add('btn-cancel');
                primaryText.textContent = 'WAITING';
                subText.textContent = `${panel.stake.toFixed(2)} ${curCode}`;
            }
        } else if (panel.state === 'cashed_out') {
            btn.classList.add('btn-bet');
            btn.style.opacity = '0.5';
            primaryText.textContent = 'CASHED OUT';
            subText.textContent = 'Round Complete';
        }
    }

    // Handle Main Button Action (Bet or Cash Out)
    window.handlePanelAction = async function(p) {
        const panel = panels[p];
        const curSym = window.userCurrencySymbol || '৳';

        if (panel.state === 'idle') {
            // Place Bet
            if (gameState.status !== 'betting') {
                showToast('Wait for the next round to bet.');
                return;
            }

            try {
                const res = await fetch('/api/aviator/bet.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: userToken,
                        bet_panel: p,
                        stake_amount: panel.stake,
                        auto_cashout: panel.autoCashout ? panel.autoVal : null
                    })
                });
                const data = await res.json();
                if (data.code === 0) {
                    panel.state = 'placed';
                    panel.betId = data.data.bet_id;
                    userBalanceEl.textContent = parseFloat(data.data.wallet_balance).toFixed(2);
                    showToast(`Bet of ${curSym}${panel.stake} placed!`);
                    updatePanelButton(p);
                } else {
                    showToast(data.msg || 'Bet failed');
                }
            } catch (e) {
                showToast('Network error placing bet');
            }

        } else if (panel.state === 'placed' && gameState.status === 'flying') {
            // Cash Out
            executeCashout(p);
        }
    };

    // Execute Cashout API
    async function executeCashout(p) {
        const panel = panels[p];
        const curSym = window.userCurrencySymbol || '৳';
        if (panel.state !== 'placed') return;

        try {
            const res = await fetch('/api/aviator/cashout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: userToken,
                    bet_panel: p
                })
            });
            const data = await res.json();
            if (data.code === 0) {
                panel.state = 'cashed_out';
                userBalanceEl.textContent = parseFloat(data.data.wallet_balance).toFixed(2);
                showToast(`🎉 WON ${curSym}${data.data.payout_amount} at ${data.data.multiplier}x!`);
                updatePanelButton(p);
            } else {
                showToast(data.msg || 'Cashout failed');
            }
        } catch (e) {
            console.error('Cashout error:', e);
        }
    }

    // Render History Pills
    function renderHistoryPills(history) {
        if (!history || !history.length) return;
        historyContainer.innerHTML = '';
        history.slice(0, 25).forEach(m => {
            const mult = parseFloat(m);
            const pill = document.createElement('span');
            pill.className = 'history-pill';
            if (mult < 2.0) {
                pill.classList.add('pill-blue');
            } else if (mult < 10.0) {
                pill.classList.add('pill-purple');
            } else {
                pill.classList.add('pill-pink');
            }
            pill.textContent = `${mult.toFixed(2)}x`;
            historyContainer.appendChild(pill);
        });
    }

    // Render Sidebar Live Players List
    function renderSidebarList(players) {
        if (!players || !players.length) return;
        sidebarList.innerHTML = '';
        players.forEach(pl => {
            const row = document.createElement('div');
            row.className = 'sidebar-row';
            row.innerHTML = `
                <span class="user-name">${pl.user}</span>
                <span class="stake-val">${pl.stake}</span>
                <span class="mult-val ${pl.cashout ? 'won' : ''}">${pl.cashout ? pl.cashout.toFixed(2) + 'x' : '-'}</span>
                <span class="cashout-val">${pl.payout ? pl.payout.toFixed(2) : '-'}</span>
            `;
            sidebarList.appendChild(row);
        });
    }

    // Refresh Balance Button
    document.getElementById('refresh-balance-btn').addEventListener('click', async () => {
        try {
            const res = await fetch(`/api/aviator/state.php?token=${encodeURIComponent(userToken)}`);
            const data = await res.json();
            if (data.code === 0 && data.data.user) {
                userBalanceEl.textContent = parseFloat(data.data.user.balance).toFixed(2);
                showToast('Balance updated');
            }
        } catch (e) {}
    });

    // Toast Notification Helper
    const toastEl = document.getElementById('toast');
    let toastTimeout = null;
    function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2500);
    }

})();
