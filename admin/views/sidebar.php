<?php
declare(strict_types=1);
$currentTab = (string)($_GET['tab'] ?? 'dashboard');

$wingoTabs = ['wingo_30s', 'wingo_1m', 'wingo_3m', 'wingo_5m'];
$k3Tabs = ['k3_1m', 'k3_3m', 'k3_5m', 'k3_10m'];
$d5Tabs = ['d5_1m', 'd5_3m', 'd5_5m', 'd5_10m'];
$trxTabs = ['trxwingo_1m', 'trxwingo_3m', 'trxwingo_5m', 'trxwingo_10m'];
$motoTabs = ['motorace_1m', 'motorace_3m', 'motorace_5m', 'motorace_10m'];
$financeTabs = ['gateways', 'add_upi', 'usdt_rate', 'add_usdt', 'add_upi_image', 'add_usdt_image', 'recharges', 'withdrawals', 'upi_withdraw', 'withdraw_sent', 'withdraw_reject'];
$supportTabs = ['support_deposit', 'support_withdraw', 'support_ifsc', 'support_bank', 'support_game'];
$adminManageTabs = ['bonus_manage', 'admin_password', 'check_same_ip', 'site_maintenance', 'banned_users', 'users', 'daily_salary', 'gift_code', 'add_admin', 'demo_user', 'agent_user'];
?>

<style>
.sidebar-submenu {
    padding-left: 28px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
    margin-bottom: 6px;
}
.sidebar-sub-link {
    display: flex;
    align-items: center;
    padding: 8px 14px;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: 10px;
    font-size: 13px;
    transition: var(--transition-smooth);
}
.sidebar-sub-link:hover {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-primary);
    transform: translateX(2px);
}
.sidebar-sub-link.active {
    color: var(--accent-gold);
    font-weight: 600;
    background: rgba(255, 255, 255, 0.03);
    border-left: 2px solid var(--accent-gold);
    border-radius: 0 10px 10px 0;
}
.sidebar-dropdown-toggle {
    cursor: pointer;
}
.sidebar-dropdown-toggle::after {
    content: "\f107";
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
    margin-left: auto;
    font-size: 14px;
    transition: transform 0.25s ease;
}
.sidebar-dropdown-toggle[aria-expanded="true"]::after {
    transform: rotate(180deg);
}
</style>

<aside class="app-sidebar">
    <a class="sidebar-nav-link <?php echo $currentTab === 'dashboard' ? 'active' : ''; ?>" href="/admin/?tab=dashboard">
        <i class="fas fa-chart-line"></i>
        <span>Dashboard</span>
    </a>

    <!-- GAME CONTROL HUB (ALL 21 GAMES) -->
    <a class="sidebar-nav-link <?php echo $currentTab === 'live' ? 'active' : ''; ?>" href="/admin/?tab=live">
        <i class="fas fa-tower-broadcast text-danger"></i>
        <span>Game Control Hub</span>
        <span class="badge bg-gold text-dark ms-auto" style="font-size: 10px; font-weight: 700;">২১ গেম</span>
    </a>

    <!-- 1. WINGO MANAGER -->
    <?php $wingoOpen = in_array($currentTab, $wingoTabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $wingoOpen ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#wingoCollapse" role="button" aria-expanded="<?php echo $wingoOpen ? 'true' : 'false'; ?>">
            <i class="fas fa-gamepad text-gold"></i>
            <span>WinGo (কালার ও সংখ্যা)</span>
        </a>
        <div class="collapse <?php echo $wingoOpen ? 'show' : ''; ?>" id="wingoCollapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'wingo_30s' ? 'active' : ''; ?>" href="/admin/?tab=wingo_30s">
                    <i class="far fa-clock me-1 text-muted"></i> WinGo 30s (৩০ সেকেন্ড)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'wingo_1m' ? 'active' : ''; ?>" href="/admin/?tab=wingo_1m">
                    <i class="far fa-clock me-1 text-muted"></i> WinGo 1M (১ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'wingo_3m' ? 'active' : ''; ?>" href="/admin/?tab=wingo_3m">
                    <i class="far fa-clock me-1 text-muted"></i> WinGo 3M (৩ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'wingo_5m' ? 'active' : ''; ?>" href="/admin/?tab=wingo_5m">
                    <i class="far fa-clock me-1 text-muted"></i> WinGo 5M (৫ মিনিট)
                </a>
            </div>
        </div>
    </div>

    <!-- 2. K3 MANAGER -->
    <?php $k3Open = in_array($currentTab, $k3Tabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $k3Open ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#k3Collapse" role="button" aria-expanded="<?php echo $k3Open ? 'true' : 'false'; ?>">
            <i class="fas fa-dice text-blue"></i>
            <span>K3 (ডাইস / ছক্কার ড্র)</span>
        </a>
        <div class="collapse <?php echo $k3Open ? 'show' : ''; ?>" id="k3Collapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'k3_1m' ? 'active' : ''; ?>" href="/admin/?tab=k3_1m">
                    <i class="far fa-clock me-1 text-muted"></i> K3 1M (১ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'k3_3m' ? 'active' : ''; ?>" href="/admin/?tab=k3_3m">
                    <i class="far fa-clock me-1 text-muted"></i> K3 3M (৩ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'k3_5m' ? 'active' : ''; ?>" href="/admin/?tab=k3_5m">
                    <i class="far fa-clock me-1 text-muted"></i> K3 5M (৫ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'k3_10m' ? 'active' : ''; ?>" href="/admin/?tab=k3_10m">
                    <i class="far fa-clock me-1 text-muted"></i> K3 10M (১০ মিনিট)
                </a>
            </div>
        </div>
    </div>

    <!-- 3. 5D MANAGER -->
    <?php $d5Open = in_array($currentTab, $d5Tabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $d5Open ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#d5Collapse" role="button" aria-expanded="<?php echo $d5Open ? 'true' : 'false'; ?>">
            <i class="fas fa-gem text-purple"></i>
            <span>5D (পাঁচ ডিজিট লটারি)</span>
        </a>
        <div class="collapse <?php echo $d5Open ? 'show' : ''; ?>" id="d5Collapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'd5_1m' ? 'active' : ''; ?>" href="/admin/?tab=d5_1m">
                    <i class="far fa-clock me-1 text-muted"></i> 5D 1M (১ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'd5_3m' ? 'active' : ''; ?>" href="/admin/?tab=d5_3m">
                    <i class="far fa-clock me-1 text-muted"></i> 5D 3M (৩ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'd5_5m' ? 'active' : ''; ?>" href="/admin/?tab=d5_5m">
                    <i class="far fa-clock me-1 text-muted"></i> 5D 5M (৫ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'd5_10m' ? 'active' : ''; ?>" href="/admin/?tab=d5_10m">
                    <i class="far fa-clock me-1 text-muted"></i> 5D 10M (১০ মিনিট)
                </a>
            </div>
        </div>
    </div>

    <!-- 4. TRX WINGO MANAGER -->
    <?php $trxOpen = in_array($currentTab, $trxTabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $trxOpen ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#trxCollapse" role="button" aria-expanded="<?php echo $trxOpen ? 'true' : 'false'; ?>">
            <i class="fas fa-coins text-warning"></i>
            <span>TrxWinGo (TRX ব্লকচেইন)</span>
        </a>
        <div class="collapse <?php echo $trxOpen ? 'show' : ''; ?>" id="trxCollapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'trxwingo_1m' ? 'active' : ''; ?>" href="/admin/?tab=trxwingo_1m">
                    <i class="far fa-clock me-1 text-muted"></i> TrxWinGo 1M (১ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'trxwingo_3m' ? 'active' : ''; ?>" href="/admin/?tab=trxwingo_3m">
                    <i class="far fa-clock me-1 text-muted"></i> TrxWinGo 3M (৩ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'trxwingo_5m' ? 'active' : ''; ?>" href="/admin/?tab=trxwingo_5m">
                    <i class="far fa-clock me-1 text-muted"></i> TrxWinGo 5M (৫ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'trxwingo_10m' ? 'active' : ''; ?>" href="/admin/?tab=trxwingo_10m">
                    <i class="far fa-clock me-1 text-muted"></i> TrxWinGo 10M (১০ মিনিট)
                </a>
            </div>
        </div>
    </div>

    <!-- 5. MOTO RACING MANAGER -->
    <?php $motoOpen = in_array($currentTab, $motoTabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $motoOpen ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#motoCollapse" role="button" aria-expanded="<?php echo $motoOpen ? 'true' : 'false'; ?>">
            <i class="fas fa-motorcycle text-danger"></i>
            <span>Moto Racing (বাইক রেস)</span>
        </a>
        <div class="collapse <?php echo $motoOpen ? 'show' : ''; ?>" id="motoCollapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'motorace_1m' ? 'active' : ''; ?>" href="/admin/?tab=motorace_1m">
                    <i class="far fa-clock me-1 text-muted"></i> Moto Race 1M (১ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'motorace_3m' ? 'active' : ''; ?>" href="/admin/?tab=motorace_3m">
                    <i class="far fa-clock me-1 text-muted"></i> Moto Race 3M (৩ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'motorace_5m' ? 'active' : ''; ?>" href="/admin/?tab=motorace_5m">
                    <i class="far fa-clock me-1 text-muted"></i> Moto Race 5M (৫ মিনিট)
                </a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'motorace_10m' ? 'active' : ''; ?>" href="/admin/?tab=motorace_10m">
                    <i class="far fa-clock me-1 text-muted"></i> Moto Race 10M (১০ মিনিট)
                </a>
            </div>
        </div>
    </div>

    <!-- 6. AVIATOR CRASH ENGINE -->
    <a class="sidebar-nav-link" href="/admin/aviator.php">
        <i class="fas fa-plane text-danger"></i>
        <span>Aviator Crash Control</span>
        <span class="badge bg-danger text-white ms-auto" style="font-size: 10px; font-weight: 700;">Live Crash</span>
    </a>

    <!-- 7. RESULT QUEUE -->
    <a class="sidebar-nav-link <?php echo $currentTab === 'queue' ? 'active' : ''; ?>" href="/admin/?tab=queue">
        <i class="fas fa-list-check text-info"></i>
        <span>Result Queue (ফোর্স রেজাল্ট)</span>
    </a>

    <!-- FINANCE -->
    <?php $financeOpen = in_array($currentTab, $financeTabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $financeOpen ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#financeCollapse" role="button" aria-expanded="<?php echo $financeOpen ? 'true' : 'false'; ?>">
            <i class="fas fa-wallet text-green"></i>
            <span>Finance (অর্থ লেনদেন)</span>
        </a>
        <div class="collapse <?php echo $financeOpen ? 'show' : ''; ?>" id="financeCollapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'gateways' ? 'active' : ''; ?>" href="/admin/?tab=gateways"><i class="fas fa-credit-card me-1 text-gold"></i> Payment Gateways</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'recharges' ? 'active' : ''; ?>" href="/admin/?tab=recharges">Deposit Update</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'withdrawals' ? 'active' : ''; ?>" href="/admin/?tab=withdrawals">Withdraw Apply</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'add_upi' ? 'active' : ''; ?>" href="/admin/?tab=gateways">Add UPI / Bkash / Nagad</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'usdt_rate' ? 'active' : ''; ?>" href="/admin/?tab=gateways">USDT Gateways</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'upi_withdraw' ? 'active' : ''; ?>" href="/admin/?tab=withdrawals">UPI / Wallet Withdraw</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'withdraw_sent' ? 'active' : ''; ?>" href="/admin/?tab=withdrawals">Withdraw Sent</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'withdraw_reject' ? 'active' : ''; ?>" href="/admin/?tab=withdrawals">Withdraw Reject</a>
            </div>
    </div>

    <!-- SUPPORT -->
    <?php $supportOpen = in_array($currentTab, $supportTabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $supportOpen ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#supportCollapse" role="button" aria-expanded="<?php echo $supportOpen ? 'true' : 'false'; ?>">
            <i class="fas fa-headset text-orange"></i>
            <span>Support</span>
        </a>
        <div class="collapse <?php echo $supportOpen ? 'show' : ''; ?>" id="supportCollapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'support_deposit' ? 'active' : ''; ?>" href="/admin/?tab=support_deposit">Deposit Problem</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'support_withdraw' ? 'active' : ''; ?>" href="/admin/?tab=support_withdraw">Withdrawal Problem</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'support_ifsc' ? 'active' : ''; ?>" href="/admin/?tab=support_ifsc">IFSC Modification</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'support_bank' ? 'active' : ''; ?>" href="/admin/?tab=support_bank">Bank Modification</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'support_game' ? 'active' : ''; ?>" href="/admin/?tab=support_game">Game Problem</a>
            </div>
        </div>
    </div>

    <!-- ADMIN MANAGE -->
    <?php $adminManageOpen = in_array($currentTab, $adminManageTabs, true); ?>
    <div class="sidebar-dropdown">
        <a class="sidebar-nav-link sidebar-dropdown-toggle <?php echo $adminManageOpen ? 'active' : ''; ?>" 
           data-bs-toggle="collapse" href="#adminManageCollapse" role="button" aria-expanded="<?php echo $adminManageOpen ? 'true' : 'false'; ?>">
            <i class="fas fa-user-shield text-red"></i>
            <span>Admin Manage</span>
        </a>
        <div class="collapse <?php echo $adminManageOpen ? 'show' : ''; ?>" id="adminManageCollapse">
            <div class="sidebar-submenu">
                <a class="sidebar-sub-link <?php echo $currentTab === 'bonus_manage' ? 'active' : ''; ?>" href="/admin/?tab=bonus_manage">Bonus Manage</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'admin_password' ? 'active' : ''; ?>" href="/admin/?tab=admin_password">Admin Password</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'check_same_ip' ? 'active' : ''; ?>" href="/admin/?tab=check_same_ip">Check Same IP</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'site_maintenance' ? 'active' : ''; ?>" href="/admin/?tab=site_maintenance">Site Maintenance</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'banned_users' ? 'active' : ''; ?>" href="/admin/?tab=banned_users">Banned Users</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'users' ? 'active' : ''; ?>" href="/admin/?tab=users">Manage Users</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'daily_salary' ? 'active' : ''; ?>" href="/admin/?tab=daily_salary">Daily Salary</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'gift_code' ? 'active' : ''; ?>" href="/admin/?tab=gift_code">Gift Code</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'add_admin' ? 'active' : ''; ?>" href="/admin/?tab=add_admin">Add Admin</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'demo_user' ? 'active' : ''; ?>" href="/admin/?tab=demo_user">Demo User</a>
                <a class="sidebar-sub-link <?php echo $currentTab === 'agent_user' ? 'active' : ''; ?>" href="/admin/?tab=agent_user">Agent User</a>
            </div>
        </div>
    </div>

    <!-- GO TO WEBSITE -->
    <a class="sidebar-nav-link" href="/" target="_blank">
        <i class="fas fa-external-link-alt text-muted"></i>
        <span>Go To Website</span>
    </a>
</aside>
