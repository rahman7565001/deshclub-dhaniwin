/**
 * Advanced Dynamic Admin AJAX Handlers & Chart Integrations
 */
$(document).ready(function() {
    // Globals
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    // Setup global AJAX headers
    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': csrfToken
        }
    });

    // Helper: Show Toast
    window.showToast = function(message, type = 'info') {
        const bgClass = type === 'success' ? 'bg-success' : (type === 'danger' ? 'bg-danger' : 'bg-primary');
        const toastHTML = `
            <div class="toast toast-premium align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        const $container = $('#toast-container');
        if ($container.length === 0) {
            $('body').append('<div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>');
        }
        $('#toast-container').append(toastHTML);
        const $toastEl = $('#toast-container .toast').last();
        const toast = new bootstrap.Toast($toastEl[0], { delay: 4000 });
        toast.show();
        $toastEl.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    };

    // Load Dashboard Stats & Charts
    if ($('#dashboard-view').length > 0) {
        loadDashboardStats();
        loadDashboardCharts();
    }

    function loadDashboardStats() {
        $.getJSON('api.php', { action: 'get_stats' }, function(res) {
            if (res.success) {
                const s = res.data;
                $('#stat-total-users').text(s.users.total);
                $('#stat-today-users').html('<i class="fas fa-user-plus"></i> +' + s.users.today + ' today');
                
                $('#stat-user-wallet').text('₹' + s.user_wallet.total.toFixed(2));
                
                $('#stat-today-recharges').text('₹' + s.recharge.today.toFixed(2));
                $('[id="stat-total-recharges"]').html('<i class="fas fa-arrow-circle-down"></i> Total: ₹' + s.recharge.total.toFixed(2));
                
                $('#stat-today-withdrawals').text('₹' + s.withdraw.today.toFixed(2));
                $('[id="stat-total-withdrawals"]').html('<i class="fas fa-arrow-circle-up"></i> Total: ₹' + s.withdraw.total.toFixed(2));
                
                $('#stat-pending-recharges').text('₹' + s.recharge.pending.toFixed(2));
                $('#stat-pending-recharges-count').html('<i class="fas fa-clock"></i> ' + s.recharge.pending_count + ' requests pending');
                
                $('#stat-today-profit').text('₹' + s.profit.today.toFixed(2));
            }
        });
    }

    function loadDashboardCharts() {
        $.getJSON('api.php', { action: 'get_charts', days: 7 }, function(res) {
            if (res.success) {
                const data = res.data;
                
                // 1. User Growth Chart
                const ctxUsers = document.getElementById('chart-user-growth').getContext('2d');
                new Chart(ctxUsers, {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'New Registrations',
                            data: data.registrations,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } }
                    }
                });

                // 2. Transaction Volumes Chart
                const ctxFinance = document.getElementById('chart-finance').getContext('2d');
                new Chart(ctxFinance, {
                    type: 'bar',
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: 'Deposits',
                                data: data.recharges,
                                backgroundColor: '#10b981'
                            },
                            {
                                label: 'Withdrawals',
                                data: data.withdrawals,
                                backgroundColor: '#ef4444'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }
        });
    }

    // Initialize Users DataTable
    if ($('#users-table').length > 0) {
        const usersTable = $('#users-table').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: 'api.php',
                data: function(d) {
                    d.action = 'list_users';
                }
            },
            columns: [
                { data: 'user_id' },
                { data: 'username' },
                { data: 'nickname' },
                { data: 'phone' },
                { data: 'wallet_balance', render: d => '₹' + d.toFixed(2) },
                { data: 'game_balance', render: d => '₹' + d.toFixed(2) },
                { 
                    data: 'can_bet',
                    render: function(d, t, row) {
                        const checked = d === 1 ? 'checked' : '';
                        return `<div class="form-check form-switch"><input class="form-check-input toggle-bet-switch" type="checkbox" data-id="${row.id}" ${checked}></div>`;
                    }
                },
                {
                    data: 'id',
                    render: function(d, t, row) {
                        return `
                            <button class="btn btn-sm btn-outline-info adjust-balance-btn" data-id="${row.user_id}" data-nickname="${row.nickname}">Adjust Balance</button>
                            <button class="btn btn-sm btn-outline-warning control-user-btn" data-id="${row.user_id}" data-rate="${row.win_rate_percent}" data-status="${row.control_status}">Target Control</button>
                        `;
                    }
                }
            ]
        });

        // Toggle Bet switch handler
        $('#users-table').on('change', '.toggle-bet-switch', function() {
            const id = $(this).data('id');
            const canBet = $(this).is(':checked') ? 1 : 0;
            // Let's call save_user endpoint
            $.post('api.php', { action: 'save_user', id: id, can_bet: canBet }, function(res) {
                if (res.success) {
                    showToast('Betting permission updated', 'success');
                } else {
                    showToast(res.message || 'Error updating status', 'danger');
                }
            });
        });

        // Adjust Balance dialog launch
        $('#users-table').on('click', '.adjust-balance-btn', function() {
            const userId = $(this).data('id');
            const nickname = $(this).data('nickname');
            $('#adjust-balance-user-id').val(userId);
            $('#adjust-balance-username').text(nickname);
            const modal = new bootstrap.Modal(document.getElementById('modal-adjust-balance'));
            modal.show();
        });

        // Adjust Balance Submit
        $('#btn-submit-adjustment').click(function() {
            const form = $('#form-adjust-balance');
            $.post('api.php', form.serialize(), function(res) {
                if (res.success) {
                    showToast(res.message, 'success');
                    bootstrap.Modal.getInstance(document.getElementById('modal-adjust-balance')).hide();
                    usersTable.ajax.reload(null, false);
                } else {
                    showToast(res.message || 'Error adjusting balance', 'danger');
                }
            });
        });

        // Target Control launch
        $('#users-table').on('click', '.control-user-btn', function() {
            const userId = $(this).data('id');
            const rate = $(this).data('rate');
            const status = $(this).data('status');
            
            $('#control-user-id').val(userId);
            $('#control-win-rate').val(rate);
            $('#control-status').val(status);
            
            const modal = new bootstrap.Modal(document.getElementById('modal-target-control'));
            modal.show();
        });

        // Target Control Submit
        $('#btn-submit-control').click(function() {
            const form = $('#form-target-control');
            $.post('api.php', form.serialize(), function(res) {
                if (res.success) {
                    showToast(res.message, 'success');
                    bootstrap.Modal.getInstance(document.getElementById('modal-target-control')).hide();
                    usersTable.ajax.reload(null, false);
                } else {
                    showToast(res.message || 'Error updating target control', 'danger');
                }
            });
        });
    }

    // Initialize Recharges DataTable
    if ($('#recharges-table').length > 0) {
        const rechargesTable = $('#recharges-table').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: 'api.php',
                data: function(d) {
                    d.action = 'list_recharges';
                    d.status = $('#recharge-status-filter').val();
                }
            },
            columns: [
                { 
                    data: 'id',
                    render: function(d) {
                        return `<input type="checkbox" class="recharge-select-row" value="${d}">`;
                    }
                },
                { data: 'order_no' },
                { data: 'player_id' },
                { data: 'username' },
                { data: 'amount', render: d => '₹' + d.toFixed(2) },
                { data: 'payment_type' },
                { 
                    data: 'status',
                    render: function(d) {
                        const style = d === 'Approved' ? 'bg-success' : (d === 'Pending' ? 'bg-warning' : 'bg-danger');
                        return `<span class="badge ${style}">${d}</span>`;
                    }
                },
                { data: 'utr' },
                { 
                    data: 'screenshot_url',
                    render: function(d, t, row) {
                        if (d) {
                            return `<a href="#" class="view-screenshot" data-url="${d}">View</a>`;
                        }
                        return 'None';
                    }
                },
                {
                    data: 'id',
                    render: function(d, t, row) {
                        if (row.status === 'Pending' || row.status === 'PendingReview') {
                            return `
                                <button class="btn btn-sm btn-success approve-recharge-btn" data-id="${d}">Approve</button>
                                <button class="btn btn-sm btn-danger reject-recharge-btn" data-id="${d}">Reject</button>
                            `;
                        }
                        return 'Settled';
                    }
                }
            ]
        });

        // Filter recharges
        $('#recharge-status-filter').change(function() {
            rechargesTable.ajax.reload();
        });

        // Approve recharge
        $('#recharges-table').on('click', '.approve-recharge-btn', function() {
            const id = $(this).data('id');
            if (confirm('Approve this recharge deposit?')) {
                $.post('api.php', { action: 'update_recharge', id: id, status: 'Approved' }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        rechargesTable.ajax.reload(null, false);
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });

        // Reject recharge
        $('#recharges-table').on('click', '.reject-recharge-btn', function() {
            const id = $(this).data('id');
            const reason = prompt('Enter reason for rejection:');
            if (reason !== null) {
                $.post('api.php', { action: 'update_recharge', id: id, status: 'Rejected', remarks: reason }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        rechargesTable.ajax.reload(null, false);
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });

        // Bulk approval
        $('#btn-bulk-approve-recharge').click(function() {
            const selected = [];
            $('.recharge-select-row:checked').each(function() {
                selected.push($(this).val());
            });
            if (selected.length === 0) {
                showToast('Please select at least one order', 'danger');
                return;
            }
            if (confirm(`Approve ${selected.length} selected orders?`)) {
                $.post('api.php', { action: 'bulk_approve_recharges', ids: selected }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        rechargesTable.ajax.reload(null, false);
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });

        // View screenshot overlay
        $('#recharges-table').on('click', '.view-screenshot', function(e) {
            e.preventDefault();
            const url = $(this).data('url');
            $('#screenshot-image').attr('src', url);
            const modal = new bootstrap.Modal(document.getElementById('modal-screenshot'));
            modal.show();
        });
    }

    // Initialize Withdrawals DataTable
    if ($('#withdrawals-table').length > 0) {
        const withdrawalsTable = $('#withdrawals-table').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: 'api.php',
                data: function(d) {
                    d.action = 'list_withdrawals';
                    d.status = $('#withdrawal-status-filter').val();
                }
            },
            columns: [
                { data: 'order_no' },
                { data: 'player_id' },
                { data: 'username' },
                { data: 'amount', render: d => '₹' + d.toFixed(2) },
                { data: 'payment_type' },
                { 
                    data: 'status',
                    render: function(d) {
                        const style = d === 'Approved' ? 'bg-success' : (d === 'Pending' ? 'bg-warning' : 'bg-danger');
                        return `<span class="badge ${style}">${d}</span>`;
                    }
                },
                { 
                    data: 'account_json', 
                    render: function(d, t, row) {
                        try {
                            const acc = typeof d === 'string' ? JSON.parse(d) : (d || {});
                            let text = acc.accountNo || acc.mobileNumber || acc.phone || acc.upiId || acc.bankCardNo || '';
                            let holder = acc.accountName || acc.holderName || acc.actualName || '';
                            let type = acc.withdrawType || acc.type || row.payment_type || '';
                            let out = '';
                            if (type) out += `<span class="badge bg-secondary me-1">${type}</span>`;
                            if (text) out += `<strong>${text}</strong>`;
                            if (holder) out += ` <span class="text-muted">(${holder})</span>`;
                            return out || d || 'N/A';
                        } catch (e) {
                            return d || 'N/A';
                        }
                    }
                },
                { data: 'remarks' },
                {
                    data: 'id',
                    render: function(d, t, row) {
                        if (row.status === 'Pending') {
                            return `
                                <button class="btn btn-sm btn-success approve-withdraw-btn" data-id="${d}">Approve</button>
                                <button class="btn btn-sm btn-danger reject-withdraw-btn" data-id="${d}">Reject</button>
                            `;
                        }
                        return 'Settled';
                    }
                }
            ]
        });

        // Filter withdrawals
        $('#withdrawal-status-filter').change(function() {
            withdrawalsTable.ajax.reload();
        });

        // Approve withdraw
        $('#withdrawals-table').on('click', '.approve-withdraw-btn', function() {
            const id = $(this).data('id');
            if (confirm('Approve this withdrawal payouts?')) {
                $.post('api.php', { action: 'update_withdrawal', id: id, status: 'Approved' }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        withdrawalsTable.ajax.reload(null, false);
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });

        // Reject withdraw
        $('#withdrawals-table').on('click', '.reject-withdraw-btn', function() {
            const id = $(this).data('id');
            const reason = prompt('Enter rejection reason:');
            if (reason !== null) {
                $.post('api.php', { action: 'update_withdrawal', id: id, status: 'Rejected', remarks: reason }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        withdrawalsTable.ajax.reload(null, false);
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });
    }

    // Support Ticket reply system
    if ($('#support-view').length > 0) {
        const supportTable = $('#support-tickets-table').DataTable({
            ajax: {
                url: 'api.php',
                data: { action: 'list_tickets' }
            },
            columns: [
                { data: 'title' },
                { data: 'username' },
                { 
                    data: 'status',
                    render: function(d) {
                        const style = d === 'open' ? 'bg-warning' : (d === 'replied' ? 'bg-info' : 'bg-secondary');
                        return `<span class="badge ${style}">${d}</span>`;
                    }
                },
                { data: 'updated_at' },
                {
                    data: 'id',
                    render: function(d) {
                        return `<button class="btn btn-sm btn-primary view-ticket-btn" data-id="${d}">Chat</button>`;
                    }
                }
            ]
        });

        // Launch ticket chat
        $('#support-tickets-table').on('click', '.view-ticket-btn', function() {
            const ticketId = $(this).data('id');
            $('#chat-ticket-id').val(ticketId);
            
            // Fetch messages
            $.getJSON('api.php', { action: 'get_ticket', ticket_id: ticketId }, function(res) {
                if (res.success) {
                    const data = res.data;
                    $('#chat-title').text(data.ticket.title + ' (User ID: ' + data.ticket.user_id + ')');
                    
                    let chatHTML = '';
                    data.replies.forEach(function(msg) {
                        const side = msg.sender_type === 'admin' ? 'text-end text-primary' : 'text-start text-light';
                        const label = msg.sender_type === 'admin' ? 'Admin' : 'User';
                        chatHTML += `
                            <div class="mb-3 ${side}">
                                <strong>${label}:</strong>
                                <div class="p-2 rounded d-inline-block bg-dark border mt-1" style="max-width: 70%; text-align: left;">
                                    ${msg.message}
                                </div>
                                <div class="text-muted" style="font-size: 11px;">${msg.created_at}</div>
                            </div>
                        `;
                    });

                    $('#chat-box-body').html(chatHTML || '<p class="text-muted">No messages yet.</p>');
                    
                    const modal = new bootstrap.Modal(document.getElementById('modal-chat'));
                    modal.show();
                    
                    // Scroll to bottom
                    setTimeout(() => {
                        const chatBody = document.getElementById('chat-box-body');
                        chatBody.scrollTop = chatBody.scrollHeight;
                    }, 200);
                }
            });
        });

        // Submit Ticket Reply
        $('#btn-send-reply').click(function() {
            const ticketId = $('#chat-ticket-id').val();
            const message = $('#chat-input-message').val();
            if (message.trim() === '') return;

            $.post('api.php', { action: 'reply_ticket', ticket_id: ticketId, message: message }, function(res) {
                if (res.success) {
                    showToast('Reply sent', 'success');
                    $('#chat-input-message').val('');
                    // Close modal and reload
                    bootstrap.Modal.getInstance(document.getElementById('modal-chat')).hide();
                    supportTable.ajax.reload(null, false);
                } else {
                    showToast(res.message, 'danger');
                }
            });
        });
    }

    // Queue override
    if ($('#results-view').length > 0) {
        // Handle queue deletion
        $('.btn-delete-queue').click(function(e) {
            e.preventDefault();
            const id = $(this).data('id');
            if (confirm('Remove this result override from queue?')) {
                $.post('api.php', { action: 'delete_from_queue', id: id }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        location.reload();
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });
    }

    // --- COLLAPSIBLE SUITE AJAX CONTROLLERS ---

    // 1. Live Game Manager
    const $gameView = $('#game-manager-view');
    if ($gameView.length > 0) {
        const gameCode = $gameView.data('game-code');
        let currentIssueNumber = '';

        function refreshGameState() {
            $.getJSON('api.php', { action: 'get_game_state', game_code: gameCode }, function(res) {
                if (res.success) {
                    const data = res.data;
                    currentIssueNumber = data.issue.issueNumber;

                    // Update UI Labels
                    $('#game-active-issue').text(currentIssueNumber);
                    $('#game-forced-status').text(data.forced_outcome ? data.forced_outcome : 'None');
                    $('#game-total-pool').text('₹' + data.total_bets_pool.toFixed(2));
                    
                    // Update timer minutes/seconds
                    const countdown = parseInt(data.issue.countdown);
                    const minutes = Math.floor(countdown / 60);
                    const seconds = countdown % 60;
                    $('#game-timer').text(
                        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
                    );

                    // Populate Active Bets
                    let betsHTML = '';
                    if (data.live_bets && data.live_bets.length > 0) {
                        data.live_bets.forEach(function(b) {
                            betsHTML += `
                                <tr>
                                    <td>${b.player_id}</td>
                                    <td><strong>${b.username}</strong></td>
                                    <td><span class="badge bg-secondary">${b.bet_content}</span></td>
                                    <td class="text-white">₹${b.stake_amount.toFixed(2)}</td>
                                </tr>
                            `;
                        });
                    } else {
                        betsHTML = '<tr><td colspan="4" class="text-center text-muted">No active stakes</td></tr>';
                    }
                    $('#game-bets-table tbody').html(betsHTML);

                    // Populate History
                    let historyHTML = '';
                    if (data.history && data.history.length > 0) {
                        data.history.forEach(function(h) {
                            historyHTML += `
                                <tr>
                                    <td><code>${h.issue_number}</code></td>
                                    <td><strong class="text-gold">${h.premium}</strong></td>
                                    <td><span class="text-muted small">${h.color || h.sum_value || ''}</span></td>
                                </tr>
                            `;
                        });
                    } else {
                        historyHTML = '<tr><td colspan="3" class="text-center text-muted">No history yet</td></tr>';
                    }
                    $('#game-history-table tbody').html(historyHTML);
                }
            });
        }

        // Initial load & poll every 2 seconds
        refreshGameState();
        const pollInterval = setInterval(refreshGameState, 2000);

        // Submit Override SET
        $('#form-game-override').submit(function(e) {
            e.preventDefault();
            const premium = $('#override-premium-value').val();
            if (!currentIssueNumber || !premium) return;

            $.post('api.php', {
                action: 'add_to_queue',
                game_code: gameCode,
                issue_number: currentIssueNumber,
                premium: premium
            }, function(res) {
                if (res.success) {
                    showToast(res.message, 'success');
                    $('#override-premium-value').val('');
                    refreshGameState();
                } else {
                    showToast(res.message, 'danger');
                }
            });
        });

        // Submit UNSET
        $('#btn-unset-override').click(function() {
            if (!currentIssueNumber) return;
            $.post('api.php', {
                action: 'unset_forced_outcome',
                game_code: gameCode,
                issue_number: currentIssueNumber
            }, function(res) {
                if (res.success) {
                    showToast(res.message, 'success');
                    refreshGameState();
                } else {
                    showToast(res.message, 'danger');
                }
            });
        });
    }

    // 2. Gift Code Manager
    const $giftView = $('#gift-code-view');
    if ($giftView.length > 0) {
        function loadGiftCodes() {
            $.getJSON('api.php', { action: 'list_gift_codes' }, function(res) {
                if (res.success) {
                    let html = '';
                    res.data.forEach(function(c) {
                        html += `
                            <tr>
                                <td><strong>${c.code}</strong></td>
                                <td>₹${parseFloat(c.prize_amount).toFixed(2)}</td>
                                <td>${c.max_redeem}</td>
                                <td>${c.redeemed_count}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-danger btn-delete-gift" data-id="${c.id}">Delete</button>
                                </td>
                            </tr>
                        `;
                    });
                    if (res.data.length === 0) {
                        html = '<tr><td colspan="5" class="text-center text-muted">No active gift codes</td></tr>';
                    }
                    $('#gift-codes-table tbody').html(html);
                }
            });
        }

        loadGiftCodes();

        // Create Gift Code
        $('#form-add-gift-code').submit(function(e) {
            e.preventDefault();
            $.post('api.php', $(this).serialize(), function(res) {
                if (res.success) {
                    showToast(res.message, 'success');
                    $('#form-add-gift-code')[0].reset();
                    bootstrap.Modal.getInstance(document.getElementById('modal-add-gift-code')).hide();
                    loadGiftCodes();
                } else {
                    showToast(res.message, 'danger');
                }
            });
        });

        // Delete Gift Code
        $('#gift-codes-table').on('click', '.btn-delete-gift', function() {
            const id = $(this).data('id');
            if (confirm('Delete this gift code?')) {
                $.post('api.php', { action: 'delete_gift_code', id: id }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        loadGiftCodes();
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });
    }

    // 3. Same IP Checker
    const $sameIpView = $('#check-same-ip-view');
    if ($sameIpView.length > 0) {
        $.getJSON('api.php', { action: 'check_same_ip' }, function(res) {
            if (res.success) {
                let html = '';
                res.data.forEach(function(row) {
                    let accountsHTML = '';
                    row.users.forEach(function(u) {
                        accountsHTML += `<span class="badge bg-secondary me-1" title="Username: ${u.username}">${u.nickname} (${u.user_id})</span>`;
                    });
                    html += `
                        <tr>
                            <td><code>${row.ip}</code></td>
                            <td><span class="badge bg-danger">${row.count} accounts</span></td>
                            <td>${accountsHTML}</td>
                        </tr>
                    `;
                });
                if (res.data.length === 0) {
                    html = '<tr><td colspan="3" class="text-center text-muted">All logins are unique. No same-IP account conflicts detected.</td></tr>';
                }
                $('#same-ip-table tbody').html(html);
            }
        });
    }

    // 4. Site Maintenance Control
    const $maintBtn = $('#btn-toggle-maintenance');
    if ($maintBtn.length > 0) {
        $maintBtn.click(function() {
            const currentEnabled = parseInt($(this).attr('data-enabled'));
            const nextEnabled = currentEnabled === 1 ? 0 : 1;
            const actionText = nextEnabled === 1 ? 'Activate Site Maintenance?' : 'Deactivate Site Maintenance?';
            
            if (confirm(actionText)) {
                $.post('api.php', { action: 'toggle_maintenance', enabled: nextEnabled }, function(res) {
                    if (res.success) {
                        showToast(res.message, 'success');
                        location.reload();
                    } else {
                        showToast(res.message, 'danger');
                    }
                });
            }
        });
    }
});
