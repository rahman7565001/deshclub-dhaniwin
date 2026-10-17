<?php
declare(strict_types=1);

require_once __DIR__ . '/../api/_bootstrap.php';

// Start Session
if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

// Load Authentication controller
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/DashboardController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/AgentController.php';
require_once __DIR__ . '/controllers/FinanceController.php';
require_once __DIR__ . '/controllers/GameController.php';
require_once __DIR__ . '/controllers/SupportController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/ReportController.php';

// Initialize CSRF Token
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['csrf'];
$adminSiteName = function_exists('api_setting') ? api_setting('site_name', 'Deshclub') : 'Deshclub';
if (empty($adminSiteName)) {
    $adminSiteName = 'Deshclub';
}

// Check Logout
if (($_GET['logout'] ?? '') === '1') {
    AuthController::logout();
    header('Location: /admin/');
    exit;
}

// Check Login Post
$loginError = '';
if (!api_pdo()) {
    $loginError = 'Database not available: ' . ($GLOBALS['db_connection_error'] ?? 'Connection failed');
}

if (!AuthController::checkRememberMe() && empty($_SESSION['admin_logged_in'])) {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && empty($loginError)) {
        $username = trim((string)($_POST['username'] ?? ''));
        $password = (string)($_POST['password'] ?? '');
        $remember = !empty($_POST['remember']);
        
        $res = AuthController::login($username, $password, $remember);
        if ($res['success']) {
            header('Location: /admin/');
            exit;
        } else {
            $loginError = $res['message'];
        }
    }
}

// Render Login Page if not authenticated
if (!AuthController::checkRememberMe() && empty($_SESSION['admin_logged_in'])):
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($adminSiteName); ?> Admin - Secure Access</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="assets/css/admin-theme.css" rel="stylesheet">
</head>
<body class="d-flex align-items-center justify-content-center" style="min-height: 100vh;">
  <div class="glass-panel p-5 text-center" style="width: min(440px, 90vw);">
    <div class="brand-logo mx-auto mb-4" style="width: 60px; height: 60px; font-size: 28px; border-radius: 18px;">✦</div>
    <h2 class="fw-bold mb-1" style="background: linear-gradient(to right, #fff, var(--accent-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><?php echo htmlspecialchars($adminSiteName); ?> Portal</h2>
    <p class="text-secondary mb-4">Enterprise Prediction Gaming Administrator Panel</p>
    
    <?php if ($loginError): ?>
        <div class="alert alert-danger border-0 text-start" style="background: rgba(239, 68, 68, 0.15); color: #fca5a5; border-radius: 12px;">
            <i class="fas fa-exclamation-circle me-2"></i> <?php echo htmlspecialchars($loginError); ?>
        </div>
    <?php endif; ?>

    <form method="post" class="text-start">
      <input type="hidden" name="csrf" value="<?php echo htmlspecialchars($csrfToken); ?>">
      <div class="mb-3">
        <label class="form-label text-secondary small fw-bold">Admin Username</label>
        <div class="input-group">
            <span class="input-group-text border-0" style="background: rgba(7, 9, 19, 0.6); color: var(--text-muted);"><i class="fas fa-user"></i></span>
            <input name="username" class="form-control form-control-premium" placeholder="Enter username" required autocomplete="username">
        </div>
      </div>
      <div class="mb-4">
        <label class="form-label text-secondary small fw-bold">Secret Password</label>
        <div class="input-group">
            <span class="input-group-text border-0" style="background: rgba(7, 9, 19, 0.6); color: var(--text-muted);"><i class="fas fa-lock"></i></span>
            <input name="password" type="password" class="form-control form-control-premium" placeholder="Enter password" required autocomplete="current-password">
        </div>
      </div>
      <div class="mb-4 form-check text-start">
        <input type="checkbox" name="remember" class="form-check-input" id="remember-me">
        <label class="form-check-label text-secondary small" for="remember-me">Remember me for 30 days</label>
      </div>
      <button type="submit" class="btn-premium w-100 py-3 justify-content-center">
        Secure Login <i class="fas fa-shield-alt ms-2"></i>
      </button>
    </form>
  </div>
</body>
</html>
<?php
exit;
endif;

// Perform CSRF checks on standard procedural POST requests if any remain
if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST['action'])) {
    $token = (string)($_POST['csrf'] ?? '');
    if (!empty($token) && !hash_equals($csrfToken, $token)) {
        http_response_code(403);
        exit('Invalid CSRF token');
    }
}

// Fetch active tab
$tab = (string)($_GET['tab'] ?? 'dashboard');
$validTabs = [
    'dashboard', 'live', 'users', 'recharges', 'withdrawals', 'agents', 'queue', 'support', 'gateways', 'settings', 'audit',
    'wingo_30s', 'wingo_1m', 'wingo_3m', 'wingo_5m',
    'k3_1m', 'k3_3m', 'k3_5m', 'k3_10m',
    'd5_1m', 'd5_3m', 'd5_5m', 'd5_10m',
    'trxwingo_1m', 'trxwingo_3m', 'trxwingo_5m', 'trxwingo_10m',
    'motorace_1m', 'motorace_3m', 'motorace_5m', 'motorace_10m',
    'add_upi', 'usdt_rate', 'add_usdt', 'add_upi_image', 'add_usdt_image', 'upi_withdraw', 'withdraw_sent', 'withdraw_reject',
    'support_deposit', 'support_withdraw', 'support_ifsc', 'support_bank', 'support_game',
    'bonus_manage', 'admin_password', 'check_same_ip', 'site_maintenance', 'banned_users', 'daily_salary', 'gift_code', 'add_admin', 'demo_user', 'agent_user'
];
if (!in_array($tab, $validTabs, true)) {
    $tab = 'dashboard';
}

// Permission checking per tab
$requiredPermissions = [
    'dashboard' => 'dashboard',
    'live' => 'game_control',
    'users' => 'user_management',
    'recharges' => 'finance',
    'withdrawals' => 'finance',
    'agents' => 'agent_management',
    'queue' => 'game_control',
    'support' => 'support',
    'gateways' => 'settings',
    'settings' => 'settings',
    'audit' => 'reports',
    // WinGo
    'wingo_30s' => 'game_control',
    'wingo_1m' => 'game_control',
    'wingo_3m' => 'game_control',
    'wingo_5m' => 'game_control',
    // K3
    'k3_1m' => 'game_control',
    'k3_3m' => 'game_control',
    'k3_5m' => 'game_control',
    'k3_10m' => 'game_control',
    // 5D
    'd5_1m' => 'game_control',
    'd5_3m' => 'game_control',
    'd5_5m' => 'game_control',
    'd5_10m' => 'game_control',
    // TrxWinGo
    'trxwingo_1m' => 'game_control',
    'trxwingo_3m' => 'game_control',
    'trxwingo_5m' => 'game_control',
    'trxwingo_10m' => 'game_control',
    // Moto Racing
    'motorace_1m' => 'game_control',
    'motorace_3m' => 'game_control',
    'motorace_5m' => 'game_control',
    'motorace_10m' => 'game_control',
    // Finance
    'add_upi' => 'settings',
    'usdt_rate' => 'settings',
    'add_usdt' => 'settings',
    'add_upi_image' => 'settings',
    'add_usdt_image' => 'settings',
    'upi_withdraw' => 'finance',
    'withdraw_sent' => 'finance',
    'withdraw_reject' => 'finance',
    // Support
    'support_deposit' => 'support',
    'support_withdraw' => 'support',
    'support_ifsc' => 'support',
    'support_bank' => 'support',
    'support_game' => 'support',
    // Admin Manage
    'bonus_manage' => 'settings',
    'admin_password' => 'settings',
    'check_same_ip' => 'security',
    'site_maintenance' => 'settings',
    'banned_users' => 'user_management',
    'daily_salary' => 'settings',
    'gift_code' => 'settings',
    'add_admin' => 'settings',
    'demo_user' => 'user_management',
    'agent_user' => 'agent_management'
];

$hasAccess = admin_has_permission($requiredPermissions[$tab]);

// Full Metadata Registry for All Games on Deshclub
$allGameMeta = [
    // WinGo (Color & Number Prediction)
    'WinGo_30S' => [
        'tab' => 'wingo_30s',
        'name_bn' => 'WinGo ৩০ সেকেন্ড',
        'name_en' => 'WinGo 30s',
        'category' => 'কালার ও সংখ্যা প্রেডিকশন',
        'category_badge' => 'Color & Number',
        'badge_class' => 'bg-warning text-dark',
        'duration' => '30s',
        'duration_bn' => '৩০ সেকেন্ড',
        'desc' => '৩০ সেকেন্ড কাউন্টডাউনে লাল, সবুজ, বেগুনি কালার এবং ০-৯ সংখ্যার প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-gamepad text-gold',
    ],
    'WinGo_1M' => [
        'tab' => 'wingo_1m',
        'name_bn' => 'WinGo ১ মিনিট',
        'name_en' => 'WinGo 1M',
        'category' => 'কালার ও সংখ্যা প্রেডিকশন',
        'category_badge' => 'Color & Number',
        'badge_class' => 'bg-warning text-dark',
        'duration' => '1M',
        'duration_bn' => '১ মিনিট',
        'desc' => '১ মিনিট কাউন্টডাউনে লাল, সবুজ, বেগুনি কালার এবং ০-৯ সংখ্যার প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-gamepad text-gold',
    ],
    'WinGo_3M' => [
        'tab' => 'wingo_3m',
        'name_bn' => 'WinGo ৩ মিনিট',
        'name_en' => 'WinGo 3M',
        'category' => 'কালার ও সংখ্যা প্রেডিকশন',
        'category_badge' => 'Color & Number',
        'badge_class' => 'bg-warning text-dark',
        'duration' => '3M',
        'duration_bn' => '৩ মিনিট',
        'desc' => '৩ মিনিট কাউন্টডাউনে লাল, সবুজ, বেগুনি কালার এবং ০-৯ সংখ্যার প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-gamepad text-gold',
    ],
    'WinGo_5M' => [
        'tab' => 'wingo_5m',
        'name_bn' => 'WinGo ৫ মিনিট',
        'name_en' => 'WinGo 5M',
        'category' => 'কালার ও সংখ্যা প্রেডিকশন',
        'category_badge' => 'Color & Number',
        'badge_class' => 'bg-warning text-dark',
        'duration' => '5M',
        'duration_bn' => '৫ মিনিট',
        'desc' => '৫ মিনিট কাউন্টডাউনে লাল, সবুজ, বেগুনি কালার এবং ০-৯ সংখ্যার প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-gamepad text-gold',
    ],

    // K3 (Dice Prediction)
    'K3_1M' => [
        'tab' => 'k3_1m',
        'name_bn' => 'K3 ১ মিনিট',
        'name_en' => 'K3 1M',
        'category' => 'ডাইস / ছক্কার ড্র লটারি',
        'category_badge' => 'Dice / ছক্কা',
        'badge_class' => 'bg-primary',
        'duration' => '1M',
        'duration_bn' => '১ মিনিট',
        'desc' => '১ মিনিটে ৩টি ছক্কার যোগফল (Sum 3-18), Big/Small, Odd/Even ও ট্রিপল ডাইস কম্বিনেশন।',
        'override_hint' => 'যেমন: Sum 3-18, Big, Small, 111, 222',
        'icon' => 'fas fa-dice text-blue',
    ],
    'K3_3M' => [
        'tab' => 'k3_3m',
        'name_bn' => 'K3 ৩ মিনিট',
        'name_en' => 'K3 3M',
        'category' => 'ডাইস / ছক্কার ড্র লটারি',
        'category_badge' => 'Dice / ছক্কা',
        'badge_class' => 'bg-primary',
        'duration' => '3M',
        'duration_bn' => '৩ মিনিট',
        'desc' => '৩ মিনিটে ৩টি ছক্কার যোগফল (Sum 3-18), Big/Small, Odd/Even ও ট্রিপল ডাইস কম্বিনেশন।',
        'override_hint' => 'যেমন: Sum 3-18, Big, Small, 111, 222',
        'icon' => 'fas fa-dice text-blue',
    ],
    'K3_5M' => [
        'tab' => 'k3_5m',
        'name_bn' => 'K3 ৫ মিনিট',
        'name_en' => 'K3 5M',
        'category' => 'ডাইস / ছক্কার ড্র লটারি',
        'category_badge' => 'Dice / ছক্কা',
        'badge_class' => 'bg-primary',
        'duration' => '5M',
        'duration_bn' => '৫ মিনিট',
        'desc' => '৫ মিনিটে ৩টি ছক্কার যোগফল (Sum 3-18), Big/Small, Odd/Even ও ট্রিপল ডাইস কম্বিনেশন।',
        'override_hint' => 'যেমন: Sum 3-18, Big, Small, 111, 222',
        'icon' => 'fas fa-dice text-blue',
    ],
    'K3_10M' => [
        'tab' => 'k3_10m',
        'name_bn' => 'K3 ১০ মিনিট',
        'name_en' => 'K3 10M',
        'category' => 'ডাইস / ছক্কার ড্র লটারি',
        'category_badge' => 'Dice / ছক্কা',
        'badge_class' => 'bg-primary',
        'duration' => '10M',
        'duration_bn' => '১০ মিনিট',
        'desc' => '১০ মিনিটে ৩টি ছক্কার যোগফল (Sum 3-18), Big/Small, Odd/Even ও ট্রিপল ডাইস কম্বিনেশন।',
        'override_hint' => 'যেমন: Sum 3-18, Big, Small, 111, 222',
        'icon' => 'fas fa-dice text-blue',
    ],

    // 5D (5-Digit Lottery)
    'D5_1M' => [
        'tab' => 'd5_1m',
        'name_bn' => '5D ১ মিনিট',
        'name_en' => '5D 1M',
        'category' => 'পাঁচ ডিজিট লটারি',
        'category_badge' => '5D Lottery',
        'badge_class' => 'bg-purple',
        'duration' => '1M',
        'duration_bn' => '১ মিনিট',
        'desc' => '১ মিনিটে A, B, C, D, E মোট ৫টি বলের ০-৯ নম্বর ও মোট যোগফলের প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 5 Digits যেমন 12345, Big, Small',
        'icon' => 'fas fa-gem text-purple',
    ],
    'D5_3M' => [
        'tab' => 'd5_3m',
        'name_bn' => '5D ৩ মিনিট',
        'name_en' => '5D 3M',
        'category' => 'পাঁচ ডিজিট লটারি',
        'category_badge' => '5D Lottery',
        'badge_class' => 'bg-purple',
        'duration' => '3M',
        'duration_bn' => '৩ মিনিট',
        'desc' => '৩ মিনিটে A, B, C, D, E মোট ৫টি বলের ০-৯ নম্বর ও মোট যোগফলের প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 5 Digits যেমন 12345, Big, Small',
        'icon' => 'fas fa-gem text-purple',
    ],
    'D5_5M' => [
        'tab' => 'd5_5m',
        'name_bn' => '5D ৫ মিনিট',
        'name_en' => '5D 5M',
        'category' => 'পাঁচ ডিজিট লটারি',
        'category_badge' => '5D Lottery',
        'badge_class' => 'bg-purple',
        'duration' => '5M',
        'duration_bn' => '৫ মিনিট',
        'desc' => '৫ মিনিটে A, B, C, D, E মোট ৫টি বলের ০-৯ নম্বর ও মোট যোগফলের প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 5 Digits যেমন 12345, Big, Small',
        'icon' => 'fas fa-gem text-purple',
    ],
    'D5_10M' => [
        'tab' => 'd5_10m',
        'name_bn' => '5D ১০ মিনিট',
        'name_en' => '5D 10M',
        'category' => 'পাঁচ ডিজিট লটারি',
        'category_badge' => '5D Lottery',
        'badge_class' => 'bg-purple',
        'duration' => '10M',
        'duration_bn' => '১০ মিনিট',
        'desc' => '১০ মিনিটে A, B, C, D, E মোট ৫টি বলের ০-৯ নম্বর ও মোট যোগফলের প্রেডিকশন ড্র।',
        'override_hint' => 'যেমন: 5 Digits যেমন 12345, Big, Small',
        'icon' => 'fas fa-gem text-purple',
    ],

    // TrxWinGo (Tron Blockchain)
    'TrxWinGo_1M' => [
        'tab' => 'trxwingo_1m',
        'name_bn' => 'TrxWinGo ১ মিনিট',
        'name_en' => 'TrxWinGo 1M',
        'category' => 'TRX ব্লকচেইন কালার',
        'category_badge' => 'Tron Blockchain',
        'badge_class' => 'bg-info text-dark',
        'duration' => '1M',
        'duration_bn' => '১ মিনিট',
        'desc' => '১ মিনিট Tron ব্লকচেইনের রিয়েল ব্লক হ্যাশ ভিত্তিক রেড, গ্রিন ও সংখ্যার ক্রিপ্টো ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-coins text-warning',
    ],
    'TrxWinGo_3M' => [
        'tab' => 'trxwingo_3m',
        'name_bn' => 'TrxWinGo ৩ মিনিট',
        'name_en' => 'TrxWinGo 3M',
        'category' => 'TRX ব্লকচেইন কালার',
        'category_badge' => 'Tron Blockchain',
        'badge_class' => 'bg-info text-dark',
        'duration' => '3M',
        'duration_bn' => '৩ মিনিট',
        'desc' => '৩ মিনিট Tron ব্লকচেইনের রিয়েল ব্লক হ্যাশ ভিত্তিক রেড, গ্রিন ও সংখ্যার ক্রিপ্টো ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-coins text-warning',
    ],
    'TrxWinGo_5M' => [
        'tab' => 'trxwingo_5m',
        'name_bn' => 'TrxWinGo ৫ মিনিট',
        'name_en' => 'TrxWinGo 5M',
        'category' => 'TRX ব্লকচেইন কালার',
        'category_badge' => 'Tron Blockchain',
        'badge_class' => 'bg-info text-dark',
        'duration' => '5M',
        'duration_bn' => '৫ মিনিট',
        'desc' => '৫ মিনিট Tron ব্লকচেইনের রিয়েল ব্লক হ্যাশ ভিত্তিক রেড, গ্রিন ও সংখ্যার ক্রিপ্টো ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-coins text-warning',
    ],
    'TrxWinGo_10M' => [
        'tab' => 'trxwingo_10m',
        'name_bn' => 'TrxWinGo ১০ মিনিট',
        'name_en' => 'TrxWinGo 10M',
        'category' => 'TRX ব্লকচেইন কালার',
        'category_badge' => 'Tron Blockchain',
        'badge_class' => 'bg-info text-dark',
        'duration' => '10M',
        'duration_bn' => '১০ মিনিট',
        'desc' => '১০ মিনিট Tron ব্লকচেইনের রিয়েল ব্লক হ্যাশ ভিত্তিক রেড, গ্রিন ও সংখ্যার ক্রিপ্টো ড্র।',
        'override_hint' => 'যেমন: 0-9, Green, Red, Violet, Big, Small',
        'icon' => 'fas fa-coins text-warning',
    ],

    // Moto Racing (Speed Motor Racing)
    'MotoRace_1M' => [
        'tab' => 'motorace_1m',
        'name_bn' => 'Moto Racing ১ মিনিট',
        'name_en' => 'Moto Racing 1M',
        'category' => 'মোটর বাইক স্পিড রেস',
        'category_badge' => 'Moto Racing',
        'badge_class' => 'bg-danger',
        'duration' => '1M',
        'duration_bn' => '১ মিনিট',
        'desc' => '১ মিনিটে ১০টি হাই-স্পিড মোটরবাইকের চ্যাম্পিয়ন পজিশন ও রেস র‍্যাংক প্রেডিকশন।',
        'override_hint' => 'যেমন: 1, 2, 3.. 10 (বাইক নম্বর)',
        'icon' => 'fas fa-motorcycle text-danger',
    ],
    'MotoRace_3M' => [
        'tab' => 'motorace_3m',
        'name_bn' => 'Moto Racing ৩ মিনিট',
        'name_en' => 'Moto Racing 3M',
        'category' => 'মোটর বাইক স্পিড রেস',
        'category_badge' => 'Moto Racing',
        'badge_class' => 'bg-danger',
        'duration' => '3M',
        'duration_bn' => '৩ মিনিট',
        'desc' => '৩ মিনিটে ১০টি হাই-স্পিড মোটরবাইকের চ্যাম্পিয়ন পজিশন ও রেস র‍্যাংক প্রেডিকশন।',
        'override_hint' => 'যেমন: 1, 2, 3.. 10 (বাইক নম্বর)',
        'icon' => 'fas fa-motorcycle text-danger',
    ],
    'MotoRace_5M' => [
        'tab' => 'motorace_5m',
        'name_bn' => 'Moto Racing ৫ মিনিট',
        'name_en' => 'Moto Racing 5M',
        'category' => 'মোটর বাইক স্পিড রেস',
        'category_badge' => 'Moto Racing',
        'badge_class' => 'bg-danger',
        'duration' => '5M',
        'duration_bn' => '৫ মিনিট',
        'desc' => '৫ মিনিটে ১০টি হাই-স্পিড মোটরবাইকের চ্যাম্পিয়ন পজিশন ও রেস র‍্যাংক প্রেডিকশন।',
        'override_hint' => 'যেমন: 1, 2, 3.. 10 (বাইক নম্বর)',
        'icon' => 'fas fa-motorcycle text-danger',
    ],
    'MotoRace_10M' => [
        'tab' => 'motorace_10m',
        'name_bn' => 'Moto Racing ১০ মিনিট',
        'name_en' => 'Moto Racing 10M',
        'category' => 'মোটর বাইক স্পিড রেস',
        'category_badge' => 'Moto Racing',
        'badge_class' => 'bg-danger',
        'duration' => '10M',
        'duration_bn' => '১০ মিনিট',
        'desc' => '১০ মিনিটে ১০টি হাই-স্পিড মোটরবাইকের চ্যাম্পিয়ন পজিশন ও রেস র‍্যাংক প্রেডিকশন।',
        'override_hint' => 'যেমন: 1, 2, 3.. 10 (বাইক নম্বর)',
        'icon' => 'fas fa-motorcycle text-danger',
    ],
];

// Include Header & Viewport Wrapper
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="<?php echo $csrfToken; ?>">
  <title><?php echo htmlspecialchars($adminSiteName); ?> Admin - Enterprise Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap5.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="assets/css/admin-theme.css" rel="stylesheet">
</head>
<body>
  <?php require __DIR__ . '/views/navbar.php'; ?>
  <div class="app-layout">
    <?php require __DIR__ . '/views/sidebar.php'; ?>
    <main class="app-viewport">
      
      <?php if (!$hasAccess): ?>
        <div class="glass-panel p-5 text-center mt-5">
            <div class="display-1 text-danger mb-4"><i class="fas fa-lock"></i></div>
            <h3 class="fw-bold">Access Denied</h3>
            <p class="text-secondary">Your administrator role does not possess the permissions required to access the <strong><?php echo htmlspecialchars($tab); ?></strong> panel.</p>
        </div>
      <?php else: ?>

        <!-- DYNAMIC PANEL ROUTING -->

        <?php if ($tab === 'dashboard'): ?>
          <div id="dashboard-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-chart-line text-gold me-2"></i> Operational Performance</h2>
            
            <!-- Quick Administrative Actions -->
            <h4 class="fw-bold mb-3 text-gold"><i class="fas fa-bolt text-gold me-2"></i> Quick Administrative Actions</h4>
            <div class="row g-4 mb-4">
              <div class="col-xl-3 col-sm-6">
                <a href="/admin/?tab=site_maintenance" class="text-decoration-none">
                  <div class="glass-panel p-3 text-center h-100 border-glow" style="border-color: rgba(239, 68, 68, 0.4) !important; cursor: pointer;">
                    <i class="fas fa-tools text-red fs-3 mb-2"></i>
                    <div class="text-white fw-bold">Site Maintenance</div>
                    <span class="text-muted small">Toggle offline mode</span>
                  </div>
                </a>
              </div>
              <div class="col-xl-3 col-sm-6">
                <a href="/admin/?tab=gift_code" class="text-decoration-none">
                  <div class="glass-panel p-3 text-center h-100 border-glow" style="border-color: rgba(249, 115, 22, 0.4) !important; cursor: pointer;">
                    <i class="fas fa-gift text-orange fs-3 mb-2"></i>
                    <div class="text-white fw-bold">Create Gift Code</div>
                    <span class="text-muted small">Distribute free bonuses</span>
                  </div>
                </a>
              </div>
              <div class="col-xl-3 col-sm-6">
                <a href="/admin/?tab=check_same_ip" class="text-decoration-none">
                  <div class="glass-panel p-3 text-center h-100 border-glow" style="border-color: rgba(59, 130, 246, 0.4) !important; cursor: pointer;">
                    <i class="fas fa-shield-alt text-blue fs-3 mb-2"></i>
                    <div class="text-white fw-bold">Check Same IP</div>
                    <span class="text-muted small">Detect multi-accounts</span>
                  </div>
                </a>
              </div>
              <div class="col-xl-3 col-sm-6">
                <a href="/admin/?tab=daily_salary" class="text-decoration-none">
                  <div class="glass-panel p-3 text-center h-100 border-glow" style="border-color: rgba(16, 185, 129, 0.4) !important; cursor: pointer;">
                    <i class="fas fa-money-bill-wave text-green fs-3 mb-2"></i>
                    <div class="text-white fw-bold">Manage Salary</div>
                    <span class="text-muted small">Config promoter payouts</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Stats grid -->
            <div class="stats-grid">
              <!-- 1. Total Users (Blue Accent) -->
              <div class="glass-panel stat-card" style="border-left: 4px solid var(--accent-blue);">
                <div class="stat-title text-blue">Total Registered Users</div>
                <div class="stat-value text-white" id="stat-total-users">0</div>
                <div class="stat-change text-blue" id="stat-today-users"><i class="fas fa-user-plus"></i> +0 today</div>
              </div>
              <!-- 2. User Wallet (Purple Accent) -->
              <div class="glass-panel stat-card" style="border-left: 4px solid var(--accent-purple);">
                <div class="stat-title text-purple">Total User Wallets</div>
                <div class="stat-value text-white" id="stat-user-wallet">৳0.00</div>
                <div class="stat-change text-purple"><i class="fas fa-wallet"></i> Database holdings</div>
              </div>
              <!-- 3. Today's Recharge (Green Accent) -->
              <div class="glass-panel stat-card" style="border-left: 4px solid var(--accent-green);">
                <div class="stat-title text-green">Today's Recharges</div>
                <div class="stat-value text-white" id="stat-today-recharges">৳0.00</div>
                <div class="stat-change text-green" id="stat-total-recharges"><i class="fas fa-arrow-circle-down"></i> Total: ৳0.00</div>
              </div>
              <!-- 4. Today's Withdrawal (Red Accent) -->
              <div class="glass-panel stat-card" style="border-left: 4px solid var(--accent-red);">
                <div class="stat-title text-red">Today's Withdrawals</div>
                <div class="stat-value text-white" id="stat-today-withdrawals">৳0.00</div>
                <div class="stat-change text-red" id="stat-total-withdrawals"><i class="fas fa-arrow-circle-up"></i> Total: ৳0.00</div>
              </div>
              <!-- 5. Pending Recharge (Orange Accent) -->
              <div class="glass-panel stat-card" style="border-left: 4px solid var(--accent-orange);">
                <div class="stat-title text-orange">Pending Deposits</div>
                <div class="stat-value text-white" id="stat-pending-recharges">৳0.00</div>
                <div class="stat-change text-orange" id="stat-pending-recharges-count"><i class="fas fa-clock"></i> 0 requests pending</div>
              </div>
              <!-- 6. Today's Profit (Gold Accent) -->
              <div class="glass-panel stat-card" style="border-left: 4px solid var(--accent-gold);">
                <div class="stat-title text-gold">Today's Net Profit</div>
                <div class="stat-value text-white" id="stat-today-profit">৳0.00</div>
                <div class="stat-change text-gold"><i class="fas fa-chart-line"></i> Financial net index</div>
              </div>
            </div>

            <!-- Charts & Action Panel -->
            <div class="row g-4">
              <div class="col-lg-6">
                <div class="glass-panel p-4 h-100">
                  <h4 class="fw-bold mb-3">User Growth Trend</h4>
                  <canvas id="chart-user-growth" style="max-height: 320px;"></canvas>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="glass-panel p-4 h-100">
                  <h4 class="fw-bold mb-3">Deposit vs Withdrawal Payouts</h4>
                  <canvas id="chart-finance" style="max-height: 320px;"></canvas>
                </div>
              </div>
            </div>

            <!-- Fast Global Site Control -->
            <div class="glass-panel p-4 mt-4">
              <h4 class="fw-bold mb-3"><i class="fas fa-sliders-h text-gold me-2"></i> Global Risk Controls</h4>
              <form action="api.php" method="post" id="form-quick-setting" class="row g-3">
                <input type="hidden" name="action" value="save_setting">
                <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                <div class="col-md-3">
                  <label class="form-label text-secondary small fw-bold">Settlement Mode</label>
                  <select name="setting_value" class="form-control form-control-premium" onchange="this.form.submit()">
                    <?php $mode = api_setting('settlement_mode', 'auto'); ?>
                    <option value="auto" <?php echo $mode === 'auto' ? 'selected' : ''; ?>>Standard Auto Draw</option>
                    <option value="auto_hedge" <?php echo $mode === 'auto_hedge' ? 'selected' : ''; ?>>Auto-Hedging (Min Payout)</option>
                    <option value="force_win" <?php echo $mode === 'force_win' ? 'selected' : ''; ?>>Force Win Mode</option>
                    <option value="force_loss" <?php echo $mode === 'force_loss' ? 'selected' : ''; ?>>Force Loss Mode</option>
                  </select>
                  <input type="hidden" name="setting_key" value="settlement_mode">
                </div>
              </form>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'live'): 
          $liveGames = [];
          $aviatorStats = ['bets' => 0, 'stakes' => 0.0, 'payouts' => 0.0, 'override' => 'Automatic (RNG)'];
          $pdo = api_pdo();
          if ($pdo) {
              $avBets = (int)$pdo->query("SELECT COUNT(*) FROM aviator_bets")->fetchColumn();
              $avStakes = (float)$pdo->query("SELECT SUM(stake_amount) FROM aviator_bets")->fetchColumn();
              $avPayouts = (float)$pdo->query("SELECT SUM(payout_amount) FROM aviator_bets WHERE status = 'won'")->fetchColumn();
              $avOverride = $pdo->query("SELECT value FROM aviator_settings WHERE key = 'next_crash_multiplier'")->fetchColumn();
              $aviatorStats = [
                  'bets' => $avBets,
                  'stakes' => $avStakes,
                  'payouts' => $avPayouts,
                  'override' => (!empty($avOverride) && is_numeric($avOverride)) ? $avOverride . 'x' : 'Auto (RNG)',
              ];

              foreach (api_lottery_game_list() as $game) {
                  $code = $game['gameCode'];
                  $issue = api_lottery_issue_data($code);
                  $stats = $pdo->query("
                      SELECT COUNT(*) AS bet_count, 
                             COALESCE(SUM(stake_amount),0) AS stake_total, 
                             COALESCE(SUM(win_amount),0) AS win_total 
                      FROM lottery_bets 
                      WHERE game_code = " . $pdo->quote($code) . " 
                        AND issue_number = " . $pdo->quote($issue['issueNumber'])
                  )->fetch();
                  $liveGames[] = [
                      'game' => $game,
                      'issue' => $issue,
                      'stats' => $stats ?: ['bet_count' => 0, 'stake_total' => 0, 'win_total' => 0],
                  ];
              }
          }
        ?>
          <div id="live-view">
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <h2 class="fw-bold mb-1"><i class="fas fa-tower-broadcast text-danger me-2"></i> গেম কন্ট্রোল হাব - ২১ টি লাইভ গেম (Game Control Hub)</h2>
                <p class="text-secondary mb-0">ওয়েবসাইটের মোট ২১টি গেমের লাইভ স্ট্যাটাস, চলতি রাউন্ড এবং বাজি পর্যবেক্ষণ ও ফলাফল নিয়ন্ত্রণ (Force Outcome) করুন।</p>
              </div>
              <span class="badge bg-gold text-dark fs-6 py-2 px-3 fw-bold">
                <i class="fas fa-gamepad me-1"></i> মোট ২১ টি অ্যাক্টিভ গেম
              </span>
            </div>

            <div class="row g-4">
              <!-- 1. AVIATOR CRASH ENGINE CARD -->
              <div class="col-xl-4 col-md-6">
                <div class="glass-panel p-4 h-100 border" style="border-color: rgba(239, 68, 68, 0.4) !important; background: rgba(26, 17, 24, 0.6);">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(239,68,68,0.2); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-plane text-danger fs-5"></i>
                      </div>
                      <div>
                        <h5 class="fw-bold mb-0 text-white">Aviator (এভিয়েটর ক্র্যাশ গেম)</h5>
                        <span class="badge bg-danger text-white mt-1" style="font-size: 10px;">Real-Time Crash Game</span>
                      </div>
                    </div>
                    <span class="pulse-green"></span>
                  </div>
                  
                  <p class="text-secondary small mb-3" style="font-size: 12px; line-height: 1.4;">
                    স্প্রাইব স্টাইল রিয়েল-টাইম এয়ারপ্লেন ফ্লাইট ও ক্র্যাশ মাল্টিপ্লায়ার কন্ট্রোল ইঞ্জিন।
                  </p>

                  <div class="p-3 mb-3 text-center border rounded" style="background: rgba(7,9,19,0.6); border-color: rgba(239,68,68,0.3) !important;">
                    <span class="text-secondary small d-block">NEXT ROUND CRASH POINT</span>
                    <strong class="fs-4 text-warning"><?php echo htmlspecialchars($aviatorStats['override']); ?></strong>
                    <span class="text-muted d-block small mt-1">Status: Live Engine Active</span>
                  </div>

                  <div class="row g-2 mb-3 text-center">
                    <div class="col-4 border-end" style="border-color: var(--border-light) !important;">
                      <span class="text-muted small">Total Bets</span>
                      <div class="fw-bold text-white"><?php echo number_format($aviatorStats['bets']); ?></div>
                    </div>
                    <div class="col-4 border-end" style="border-color: var(--border-light) !important;">
                      <span class="text-muted small">Total Pool</span>
                      <div class="fw-bold text-success">৳<?php echo number_format($aviatorStats['stakes'], 2); ?></div>
                    </div>
                    <div class="col-4">
                      <span class="text-muted small">Payouts</span>
                      <div class="fw-bold text-warning">৳<?php echo number_format($aviatorStats['payouts'], 2); ?></div>
                    </div>
                  </div>

                  <form action="api.php" method="post" class="mb-2">
                    <input type="hidden" name="action" value="set_aviator_multiplier">
                    <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                    <div class="input-group">
                      <input name="multiplier" step="0.01" min="1.00" class="form-control form-control-premium" placeholder="Next Crash (e.g. 1.50, 5.00)">
                      <button type="submit" class="btn btn-danger fw-bold">Set Crash</button>
                    </div>
                  </form>
                  <a href="/admin/aviator.php" class="btn btn-sm btn-outline-danger w-100">
                    <i class="fas fa-sliders-h me-1"></i> Open Aviator Full Desk
                  </a>
                </div>
              </div>

              <!-- 20 LOTTERY PREDICTION GAMES CARDS -->
              <?php foreach ($liveGames as $item): 
                $code = $item['game']['gameCode'];
                $meta = $allGameMeta[$code] ?? [
                    'name_bn' => str_replace('_', ' ', $code),
                    'name_en' => $code,
                    'category' => 'Lottery Prediction',
                    'category_badge' => 'Lottery',
                    'badge_class' => 'bg-secondary',
                    'duration' => '1M',
                    'duration_bn' => '১ মিনিট',
                    'desc' => 'অনলাইন প্রেডিকশন ড্র লটারি গেম।',
                    'override_hint' => 'e.g. 5, Green, Big',
                    'icon' => 'fas fa-gamepad text-gold',
                    'tab' => 'dashboard'
                ];
              ?>
                <div class="col-xl-4 col-md-6">
                  <div class="glass-panel p-4 h-100 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
                          <i class="<?php echo htmlspecialchars($meta['icon']); ?> fs-5"></i>
                        </div>
                        <div>
                          <h5 class="fw-bold mb-0 text-white"><?php echo htmlspecialchars($meta['name_bn']); ?></h5>
                          <span class="text-secondary small"><?php echo htmlspecialchars($meta['name_en']); ?></span>
                        </div>
                      </div>
                      <span class="pulse-green"></span>
                    </div>

                    <div class="d-flex align-items-center gap-2 mb-2">
                      <span class="badge <?php echo $meta['badge_class']; ?>" style="font-size: 10px;"><?php echo htmlspecialchars($meta['category_badge']); ?></span>
                      <span class="badge bg-secondary" style="font-size: 10px;"><?php echo htmlspecialchars($meta['duration_bn']); ?> ড্র</span>
                    </div>

                    <p class="text-secondary small mb-3" style="font-size: 12px; line-height: 1.4;">
                      <?php echo htmlspecialchars($meta['desc']); ?>
                    </p>

                    <div class="p-3 mb-3 text-center border rounded mt-auto" style="background: rgba(7,9,19,0.5); border-color: var(--border-light) !important;">
                      <span class="text-secondary small d-block">CURRENT ACTIVE PERIOD (চলতি পিরিয়ড)</span>
                      <strong class="fs-4 text-gold"><?php echo htmlspecialchars($item['issue']['issueNumber']); ?></strong>
                      <span class="text-muted d-block small mt-1">কাউন্টডাউন: <?php echo $item['issue']['countdown']; ?>s</span>
                    </div>

                    <div class="row g-2 mb-3 text-center">
                      <div class="col-4 border-end" style="border-color: var(--border-light) !important;">
                        <span class="text-muted small">Bets</span>
                        <div class="fw-bold text-white"><?php echo $item['stats']['bet_count']; ?></div>
                      </div>
                      <div class="col-4 border-end" style="border-color: var(--border-light) !important;">
                        <span class="text-muted small">Total Pool</span>
                        <div class="fw-bold text-success">৳<?php echo number_format((float)$item['stats']['stake_total'], 2); ?></div>
                      </div>
                      <div class="col-4">
                        <span class="text-muted small">Payout</span>
                        <div class="fw-bold text-warning">৳<?php echo number_format((float)$item['stats']['win_total'], 2); ?></div>
                      </div>
                    </div>

                    <form action="api.php" method="post" class="mb-2">
                      <input type="hidden" name="action" value="add_to_queue">
                      <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                      <input type="hidden" name="game_code" value="<?php echo htmlspecialchars($item['game']['gameCode']); ?>">
                      <input type="hidden" name="issue_number" value="<?php echo htmlspecialchars($item['issue']['issueNumber']); ?>">
                      <div class="input-group">
                        <input name="premium" class="form-control form-control-premium" placeholder="<?php echo htmlspecialchars($meta['override_hint']); ?>">
                        <button type="submit" class="btn btn-premium">Force</button>
                      </div>
                    </form>

                    <a href="/admin/?tab=<?php echo htmlspecialchars($meta['tab']); ?>" class="btn btn-sm btn-outline-gold w-100">
                      <i class="fas fa-sliders-h me-1"></i> কন্ট্রোল ডেস্কে যান (Open Desk)
                    </a>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'users'): ?>
          <div id="users-view">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold m-0"><i class="fas fa-users-cog text-gold me-2"></i> Member Directory</h2>
                <button class="btn-premium" data-bs-toggle="modal" data-bs-target="#modal-add-user">
                    <i class="fas fa-user-plus"></i> Create User
                </button>
            </div>
            
            <div class="glass-panel p-4">
                <div class="table-responsive table-responsive-premium">
                    <table class="table w-100" id="users-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Nickname</th>
                                <th>Phone</th>
                                <th>Wallet Bal</th>
                                <th>Game Bal</th>
                                <th>Can Bet</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

            <!-- Modals -->
            <!-- Modal: Adjust Balance -->
            <div class="modal fade" id="modal-adjust-balance" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-content-premium text-white">
                  <div class="modal-header modal-header-premium">
                    <h5 class="modal-title fw-bold"><i class="fas fa-wallet text-gold me-2"></i> Adjust Balance: <span id="adjust-balance-username"></span></h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <form id="form-adjust-balance">
                    <div class="modal-body p-4">
                      <input type="hidden" name="action" value="adjust_balance">
                      <input type="hidden" name="user_id" id="adjust-balance-user-id">
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Balance Type</label>
                        <select name="type" class="form-control form-control-premium">
                            <option value="game">Game Balance</option>
                            <option value="wallet">Main Wallet Balance</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Adjustment Amount</label>
                        <input type="number" name="amount" step="0.01" class="form-control form-control-premium" placeholder="e.g. 500 or -200" required>
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Reason / Remarks</label>
                        <textarea name="notes" class="form-control form-control-premium" style="min-height: 80px;" placeholder="Reason for adjusting" required></textarea>
                      </div>
                    </div>
                    <div class="modal-footer modal-footer-premium">
                      <button type="button" class="btn-secondary-premium" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" id="btn-submit-adjustment" class="btn-premium">Submit Adjust</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Modal: Target Control -->
            <div class="modal fade" id="modal-target-control" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-content-premium text-white">
                  <div class="modal-header modal-header-premium">
                    <h5 class="modal-title fw-bold"><i class="fas fa-bullseye text-gold me-2"></i> Targeted User Win-Rate Control</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <form id="form-target-control">
                    <div class="modal-body p-4">
                      <input type="hidden" name="action" value="set_target_control">
                      <input type="hidden" name="user_id" id="control-user-id">
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Win-Rate Percentage</label>
                        <input type="number" name="win_rate_percent" id="control-win-rate" class="form-control form-control-premium" min="0" max="100" placeholder="e.g. 30" required>
                        <span class="text-muted small mt-1 d-block">Target win-rate over time. Lower values force losses.</span>
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Targeting Status</label>
                        <select name="status" id="control-status" class="form-control form-control-premium">
                            <option value="1">Enabled (Force Control)</option>
                            <option value="0">Disabled (System Default)</option>
                        </select>
                      </div>
                    </div>
                    <div class="modal-footer modal-footer-premium">
                      <button type="button" class="btn-secondary-premium" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" id="btn-submit-control" class="btn-premium">Save target</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Modal: Add User -->
            <div class="modal fade" id="modal-add-user" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-content-premium text-white">
                  <div class="modal-header modal-header-premium">
                    <h5 class="modal-title fw-bold"><i class="fas fa-user-plus text-gold me-2"></i> Register New User</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <form id="form-add-user" action="api.php" method="post">
                    <div class="modal-body p-4">
                      <input type="hidden" name="action" value="save_user">
                      <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Username</label>
                        <input name="username" class="form-control form-control-premium" placeholder="Enter username/phone" required>
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Nickname</label>
                        <input name="nickname" class="form-control form-control-premium" placeholder="Leave empty for auto">
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Password</label>
                        <input name="password" type="password" class="form-control form-control-premium" placeholder="Leave empty for admin123">
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Contact Phone</label>
                        <input name="phone" class="form-control form-control-premium" placeholder="Enter phone number">
                      </div>
                    </div>
                    <div class="modal-footer modal-footer-premium">
                      <button type="button" class="btn-secondary-premium" data-bs-dismiss="modal">Cancel</button>
                      <button type="submit" class="btn-premium">Create</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'recharges'): ?>
          <div id="recharges-view">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold m-0"><i class="fas fa-arrow-alt-circle-down text-gold me-2"></i> Recharge Deposits</h2>
                <div class="d-flex gap-2">
                    <button id="btn-bulk-approve-recharge" class="btn btn-success"><i class="fas fa-check-double"></i> Bulk Approve</button>
                    <select id="recharge-status-filter" class="form-select form-control-premium" style="width: 180px;">
                        <option value="">All Statuses</option>
                        <option value="Pending" selected>Pending / Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div class="glass-panel p-4">
                <div class="table-responsive table-responsive-premium">
                    <table class="table w-100" id="recharges-table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Order No</th>
                                <th>Player ID</th>
                                <th>Username</th>
                                <th>Amount</th>
                                <th>Gateway</th>
                                <th>Status</th>
                                <th>UTR</th>
                                <th>Screenshot</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

            <!-- Modal: View Screenshot -->
            <div class="modal fade" id="modal-screenshot" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-content-premium text-white">
                  <div class="modal-header modal-header-premium">
                    <h5 class="modal-title fw-bold">Review Screenshot UTR</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body p-4 text-center">
                    <img id="screenshot-image" class="img-fluid rounded" style="max-height: 500px;" alt="Screenshot review">
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'withdrawals'): ?>
          <div id="withdrawals-view">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold m-0"><i class="fas fa-arrow-alt-circle-up text-gold me-2"></i> Withdrawal Payouts</h2>
                <select id="withdrawal-status-filter" class="form-select form-control-premium" style="width: 180px;">
                    <option value="">All Statuses</option>
                    <option value="Pending" selected>Pending / Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div class="glass-panel p-4">
                <div class="table-responsive table-responsive-premium">
                    <table class="table w-100" id="withdrawals-table">
                        <thead>
                            <tr>
                                <th>Order No</th>
                                <th>Player ID</th>
                                <th>Username</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Account</th>
                                <th>Remarks</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'agents'): 
          $agentCommissions = AgentController::listCommissions();
        ?>
          <div id="agents-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-project-diagram text-gold me-2"></i> Agent Trees & Commissions</h2>
            
            <div class="row g-4">
              <div class="col-lg-4">
                <div class="glass-panel p-4 h-100">
                  <h4 class="fw-bold mb-3">Inspect Agent Stats</h4>
                  <form method="get" class="mb-3">
                    <input type="hidden" name="tab" value="agents">
                    <div class="input-group">
                        <input name="inspect_id" class="form-control form-control-premium" placeholder="Enter User ID (e.g. 132257)" required>
                        <button type="submit" class="btn btn-premium">Inspect</button>
                    </div>
                  </form>

                  <?php 
                  $inspectId = (int)($_GET['inspect_id'] ?? 0);
                  if ($inspectId > 0): 
                      $stats = AgentController::getAgentSummary($inspectId);
                      if (isset($stats['error'])):
                  ?>
                      <div class="alert alert-danger border-0 small"><?php echo htmlspecialchars($stats['error']); ?></div>
                  <?php else: ?>
                      <div class="p-3 border rounded mb-3 bg-dark border-secondary">
                        <span class="text-secondary small d-block">INSPECTING USER</span>
                        <strong class="fs-5 text-white"><?php echo $stats['user_id']; ?></strong>
                        <div class="row g-2 mt-2 text-center text-secondary small">
                          <div class="col-6 border-end border-secondary">
                            <div>Total team size</div>
                            <strong class="text-white fs-6"><?php echo $stats['total_team']; ?></strong>
                          </div>
                          <div class="col-6">
                            <div>Total Commission</div>
                            <strong class="text-success fs-6">৳<?php echo number_format($stats['total_commission'], 2); ?></strong>
                          </div>
                        </div>
                      </div>
                      <div class="small">
                        <div class="fw-bold mb-2">Team Level Breakdown:</div>
                        <?php foreach ($stats['levels_count'] as $lv => $count): ?>
                            <div class="d-flex justify-content-between border-bottom border-secondary py-1 text-secondary">
                                <span><?php echo $lv; ?> Referrals</span>
                                <span class="text-white"><?php echo $count; ?></span>
                            </div>
                        <?php endforeach; ?>
                      </div>
                  <?php endif; endif; ?>
                </div>
              </div>
              <div class="col-lg-8">
                <div class="glass-panel p-4 h-100">
                  <h4 class="fw-bold mb-3">Recent Agent Commission Log</h4>
                  <div class="table-responsive table-responsive-premium">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Agent</th>
                                <th>From Player</th>
                                <th>Bet Order</th>
                                <th>Level</th>
                                <th>Stake</th>
                                <th>Commission</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($agentCommissions as $comm): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($comm['agent_name'] ?? 'Agent ' . $comm['user_id']); ?></td>
                                    <td><?php echo htmlspecialchars($comm['player_name'] ?? 'Player ' . $comm['from_user_id']); ?></td>
                                    <td><code><?php echo $comm['bet_order_no']; ?></code></td>
                                    <td>L<?php echo $comm['commission_level']; ?></td>
                                    <td>৳<?php echo number_format((float)$comm['bet_amount'], 2); ?></td>
                                    <td class="text-success fw-bold">+৳<?php echo number_format((float)$comm['commission_amount'], 4); ?></td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (empty($agentCommissions)): ?>
                                <tr><td colspan="6" class="text-center text-muted">No commissions logged yet</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'queue'): 
          $queue = GameController::listQueue();
        ?>
          <div id="results-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-list-ol text-gold me-2"></i> Result Overrides Queue</h2>
            
            <div class="row g-4">
              <div class="col-md-5">
                <div class="glass-panel p-4">
                  <h4 class="fw-bold mb-3">Schedule Result Override</h4>
                  <form action="api.php" method="post">
                    <input type="hidden" name="action" value="add_to_queue">
                    <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                    <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Select Game</label>
                        <select name="game_code" class="form-control form-control-premium" required>
                            <?php foreach (api_lottery_game_list() as $game): ?>
                                <option value="<?php echo htmlspecialchars($game['gameCode']); ?>"><?php echo htmlspecialchars($game['gameCode']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Period/Issue Number</label>
                        <input name="issue_number" class="form-control form-control-premium" placeholder="e.g. 20260603100012345" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label text-secondary small fw-bold">Forced Premium Result</label>
                        <input name="premium" class="form-control form-control-premium" placeholder="e.g. 0-9 for Wingo, 123 for K3, 01234 for 5D" required>
                    </div>
                    <button type="submit" class="btn-premium w-100 justify-content-center">Queue Override</button>
                  </form>
                </div>
              </div>
              <div class="col-md-7">
                <div class="glass-panel p-4">
                  <h4 class="fw-bold mb-3">Active Queued Overrides</h4>
                  <div class="table-responsive table-responsive-premium">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Game</th>
                                <th>Issue No</th>
                                <th>Forced Payout</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($queue as $q): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($q['game_code']); ?></td>
                                    <td><code><?php echo htmlspecialchars($q['issue_number']); ?></code></td>
                                    <td class="text-gold fw-bold"><?php echo htmlspecialchars($q['premium']); ?></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-danger btn-delete-queue" data-id="<?php echo $q['id']; ?>">Remove</button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (empty($queue)): ?>
                                <tr><td colspan="4" class="text-center text-muted">No scheduled overrides in queue</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'support'): ?>
          <div id="support-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-ticket-alt text-gold me-2"></i> Support Tickets Queue</h2>
            
            <div class="glass-panel p-4">
                <div class="table-responsive table-responsive-premium">
                    <table class="table w-100" id="support-tickets-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Last Update</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

            <!-- Modal: Ticket Chat dialogue -->
            <div class="modal fade" id="modal-chat" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content modal-content-premium text-white">
                  <div class="modal-header modal-header-premium">
                    <h5 class="modal-title fw-bold" id="chat-title">Ticket Chat</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body p-4">
                    <div id="chat-box-body" style="height: 350px; overflow-y: auto; background: rgba(7,9,19,0.3); padding: 15px; border-radius: 12px; border: 1px solid var(--border-light);">
                        <!-- Chat logs load dynamically -->
                    </div>
                    <input type="hidden" id="chat-ticket-id">
                    <div class="input-group mt-3">
                        <input id="chat-input-message" class="form-control form-control-premium" placeholder="Type administrator reply here...">
                        <button type="button" id="btn-send-reply" class="btn btn-premium">Send Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'gateways'): 
          $upiMethods = SettingsController::getPaymentMethods();
          $usdtMethods = SettingsController::getUsdtMethods();
        ?>
          <div id="gateways-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-credit-card text-gold me-2"></i> Gateway Rotations</h2>
            
            <!-- Payment Methods / Gateways (UPI, Bkash, Nagad) -->
            <div class="glass-panel p-4 mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="fw-bold m-0 text-gold"><i class="fas fa-wallet text-gold me-2"></i> Payment Methods (UPI, Bkash, Nagad)</h4>
                    <span class="badge bg-secondary">Multi-Currency (BDT / INR)</span>
                </div>
                <div class="table-responsive table-responsive-premium">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Method Name</th>
                                <th>Type</th>
                                <th>Currency</th>
                                <th>Account / Phone Number</th>
                                <th>Limits (Min/Max)</th>
                                <th>Sort</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($upiMethods as $upi): 
                                $curr = strtoupper((string)($upi['currency'] ?? 'ALL'));
                                $mType = strtoupper((string)($upi['method_type'] ?? 'UPI'));
                            ?>
                                <tr>
                                    <form action="api.php" method="post">
                                        <input type="hidden" name="action" value="save_payment">
                                        <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                                        <input type="hidden" name="id" value="<?php echo $upi['id']; ?>">
                                        <td><input name="method_name" class="form-control form-control-premium py-1" style="min-width: 100px;" value="<?php echo htmlspecialchars($upi['method_name']); ?>"></td>
                                        <td>
                                            <select name="method_type" class="form-control form-control-premium py-1" style="min-width: 105px;">
                                                <option value="BKASH" <?php echo $mType === 'BKASH' ? 'selected' : ''; ?>>Bkash (বিকাশ)</option>
                                                <option value="NAGAD" <?php echo $mType === 'NAGAD' ? 'selected' : ''; ?>>Nagad (নগদ)</option>
                                                <option value="UPI" <?php echo $mType === 'UPI' ? 'selected' : ''; ?>>UPI</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select name="currency" class="form-control form-control-premium py-1" style="min-width: 95px;">
                                                <option value="BDT" <?php echo $curr === 'BDT' ? 'selected' : ''; ?>>BDT (৳)</option>
                                                <option value="INR" <?php echo $curr === 'INR' ? 'selected' : ''; ?>>INR (₹)</option>
                                                <option value="ALL" <?php echo $curr === 'ALL' ? 'selected' : ''; ?>>ALL</option>
                                            </select>
                                        </td>
                                        <td><input name="account_value" class="form-control form-control-premium py-1" style="min-width: 140px;" value="<?php echo htmlspecialchars($upi['account_value']); ?>" placeholder="017XXXXXXXX or upi@id"></td>
                                        <td>
                                            <div class="d-flex align-items-center gap-1">
                                                <input name="min_amount" type="number" class="form-control form-control-premium py-1" style="width: 75px;" value="<?php echo (float)$upi['min_amount']; ?>">
                                                <span>-</span>
                                                <input name="max_amount" type="number" class="form-control form-control-premium py-1" style="width: 85px;" value="<?php echo (float)$upi['max_amount']; ?>">
                                            </div>
                                        </td>
                                        <td><input name="sort_order" type="number" class="form-control form-control-premium py-1" style="width: 55px;" value="<?php echo $upi['sort_order']; ?>"></td>
                                        <td>
                                            <select name="enabled" class="form-control form-control-premium py-1" style="min-width: 90px;">
                                                <option value="1" <?php echo $upi['enabled'] ? 'selected' : ''; ?>>Active</option>
                                                <option value="0" <?php echo !$upi['enabled'] ? 'selected' : ''; ?>>Paused</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div class="d-flex gap-1">
                                                <button type="submit" class="btn btn-sm btn-premium py-1">Save</button>
                                                <button type="submit" formaction="api.php" name="action" value="delete_payment" class="btn btn-sm btn-outline-danger py-1" onclick="return confirm('Delete this method?')">Del</button>
                                            </div>
                                        </td>
                                    </form>
                                </tr>
                            <?php endforeach; ?>
                            <!-- Add row -->
                            <tr style="background: rgba(255,255,255,0.02);">
                                <form action="api.php" method="post">
                                    <input type="hidden" name="action" value="save_payment">
                                    <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                                    <td><input name="method_name" class="form-control form-control-premium py-1" placeholder="Bkash / Nagad / PhonePe" required></td>
                                    <td>
                                        <select name="method_type" class="form-control form-control-premium py-1">
                                            <option value="BKASH">Bkash (বিকাশ)</option>
                                            <option value="NAGAD">Nagad (নগদ)</option>
                                            <option value="UPI">UPI</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select name="currency" class="form-control form-control-premium py-1">
                                            <option value="BDT" selected>BDT (৳)</option>
                                            <option value="INR">INR (₹)</option>
                                            <option value="ALL">ALL</option>
                                        </select>
                                    </td>
                                    <td><input name="account_value" class="form-control form-control-premium py-1" placeholder="017XXXXXXXX or VPA" required></td>
                                    <td>
                                        <div class="d-flex align-items-center gap-1">
                                            <input name="min_amount" type="number" class="form-control form-control-premium py-1" style="width: 75px;" value="100">
                                            <span>-</span>
                                            <input name="max_amount" type="number" class="form-control form-control-premium py-1" style="width: 85px;" value="25000">
                                        </div>
                                    </td>
                                    <td><input name="sort_order" type="number" class="form-control form-control-premium py-1" style="width: 55px;" value="0"></td>
                                    <td>
                                        <select name="enabled" class="form-control form-control-premium py-1">
                                            <option value="1">Active</option>
                                            <option value="0">Paused</option>
                                        </select>
                                    </td>
                                    <td><button type="submit" class="btn btn-sm btn-success py-1"><i class="fas fa-plus"></i> Add</button></td>
                                </form>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- USDT Gateways -->
            <div class="glass-panel p-4">
                <h4 class="fw-bold mb-3 text-gold">USDT Crypto Addresses</h4>
                <div class="table-responsive table-responsive-premium">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Wallet Name</th>
                                <th>Deposit Address</th>
                                <th>Network</th>
                                <th>Limits (Min/Max)</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($usdtMethods as $usdt): ?>
                                <tr>
                                    <form action="api.php" method="post">
                                        <input type="hidden" name="action" value="save_usdt">
                                        <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                                        <input type="hidden" name="id" value="<?php echo $usdt['id']; ?>">
                                        <td><input name="wallet_name" class="form-control form-control-premium py-1" value="<?php echo htmlspecialchars($usdt['wallet_name']); ?>"></td>
                                        <td><input name="wallet_address" class="form-control form-control-premium py-1" value="<?php echo htmlspecialchars($usdt['wallet_address']); ?>"></td>
                                        <td><input name="network" class="form-control form-control-premium py-1" style="width: 100px;" value="<?php echo htmlspecialchars($usdt['network']); ?>"></td>
                                        <td>
                                            <input name="min_amount" type="number" class="form-control form-control-premium py-1 d-inline-block" style="width: 70px;" value="<?php echo (float)$usdt['min_amount']; ?>"> - 
                                            <input name="max_amount" type="number" class="form-control form-control-premium py-1 d-inline-block" style="width: 90px;" value="<?php echo (float)$usdt['max_amount']; ?>">
                                        </td>
                                        <td>
                                            <select name="enabled" class="form-control form-control-premium py-1">
                                                <option value="1" <?php echo $usdt['enabled'] ? 'selected' : ''; ?>>Active</option>
                                                <option value="0" <?php echo !$usdt['enabled'] ? 'selected' : ''; ?>>Paused</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button type="submit" class="btn btn-sm btn-premium py-1">Save</button>
                                            <button type="submit" formaction="api.php" name="action" value="delete_usdt" class="btn btn-sm btn-outline-danger py-1">Del</button>
                                        </td>
                                    </form>
                                </tr>
                            <?php endforeach; ?>
                            <!-- Add row -->
                            <tr>
                                <form action="api.php" method="post">
                                    <input type="hidden" name="action" value="save_usdt">
                                    <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                                    <td><input name="wallet_name" class="form-control form-control-premium py-1" placeholder="Binance USDT"></td>
                                    <td><input name="wallet_address" class="form-control form-control-premium py-1" placeholder="T..."></td>
                                    <td><input name="network" class="form-control form-control-premium py-1" style="width: 100px;" value="TRC20"></td>
                                    <td>
                                        <input name="min_amount" type="number" class="form-control form-control-premium py-1 d-inline-block" style="width: 70px;" value="10"> - 
                                        <input name="max_amount" type="number" class="form-control form-control-premium py-1 d-inline-block" style="width: 90px;" value="10000">
                                    </td>
                                    <td>
                                        <select name="enabled" class="form-control form-control-premium py-1">
                                            <option value="1">Active</option>
                                            <option value="0">Paused</option>
                                        </select>
                                    </td>
                                    <td><button type="submit" class="btn btn-sm btn-success py-1">Add Address</button></td>
                                </form>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($tab === 'settings'): 
          $settings = admin_db_rows("SELECT * FROM api_settings ORDER BY setting_key");
          $currentSiteName = function_exists('api_setting') ? api_setting('site_name', 'Deshclub') : 'Deshclub';
          if (empty($currentSiteName)) $currentSiteName = 'Deshclub';
          $currentSiteDesc = function_exists('api_setting') ? api_setting('site_description', 'Deshclub – Where the wealth happens. Play top trending games like Wingo, Vortex, Chicken Road, and Aviator—all in one place.') : '';
          $currentTelegram = function_exists('api_setting') ? api_setting('telegram_url', 'https://t.me/deshclub') : 'https://t.me/deshclub';
          $currentGatewayName = function_exists('api_setting') ? api_setting('upi_display_name', $currentSiteName) : $currentSiteName;
          $saved = ($_GET['saved'] ?? '') === '1';
        ?>
          <div id="settings-view">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h2 class="fw-bold m-0"><i class="fas fa-globe text-gold me-2"></i> Website Branding & System Settings</h2>
              <span class="badge px-3 py-2" style="background: rgba(251, 191, 36, 0.15); color: var(--accent-gold); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 20px; font-size: 13px;">
                <i class="fas fa-check-circle me-1"></i> লাইভ নাম: <strong id="currentLiveBadge"><?php echo htmlspecialchars($currentSiteName); ?></strong>
              </span>
            </div>

            <?php if ($saved): ?>
              <div class="alert alert-success border-0 mb-4 d-flex align-items-center justify-content-between" style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border-radius: 14px; padding: 16px 20px;">
                <div>
                  <i class="fas fa-check-circle fa-lg me-2"></i>
                  <strong>অভিনন্দন!</strong> ওয়েবসাইটের নাম ও ব্র্যান্ডিং সফলভাবে পরিবর্তন করা হয়েছে এবং সর্বত্র আপডেট হয়েছে।
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            <?php endif; ?>

            <!-- DYNAMIC BRANDING CARD -->
            <div class="glass-panel p-4 mb-4" style="border: 1px solid rgba(251, 191, 36, 0.35); box-shadow: 0 8px 32px rgba(0,0,0,0.37);">
              <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3" style="border-color: rgba(255,255,255,0.08) !important;">
                <div>
                  <h4 class="fw-bold text-gold m-0"><i class="fas fa-pen-nib me-2"></i> ওয়েবসাইটের নাম ও ব্র্যান্ডিং কনফিগারেশন</h4>
                  <p class="text-secondary small m-0 mt-1">এখানে নাম পরিবর্তন করে সেভ করলেই ওয়েবসাইটের হেডার, পেজ টাইটেল, মেনুবার, এসপিএ কনফিগারেশন ও গেমের নাম সাথে সাথে পরিবর্তিত হয়ে যাবে।</p>
                </div>
                <div class="text-end d-none d-md-block">
                  <span class="badge bg-primary px-3 py-2" style="border-radius: 12px; font-size: 12px;">Dynamic Sync Active</span>
                </div>
              </div>

              <form id="brandingForm" action="api.php" method="post">
                <input type="hidden" name="action" value="save_branding">
                <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                <input type="hidden" name="redirect" value="/admin/?tab=settings">

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label text-light fw-bold small">
                      <i class="fas fa-signature text-gold me-1"></i> ওয়েবসাইটের নাম (Website Name) <span class="text-danger">*</span>
                    </label>
                    <input type="text" name="site_name" id="site_name_input" class="form-control form-control-premium form-control-lg fw-bold" 
                           value="<?php echo htmlspecialchars($currentSiteName); ?>" required placeholder="যেমন: Deshclub, BDG Club, ইত্যাদি">
                    <div class="form-text text-muted small mt-1">ওয়েবসাইটের প্রধান নাম যা হোমপেজ হেডার, ব্রাউজার ট্যাব ও অ্যাপে প্রদর্শিত হবে।</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-light fw-bold small">
                      <i class="fas fa-cash-register text-success me-1"></i> ক্যাশিয়ার / গেটওয়ে নাম (Payment Display Name)
                    </label>
                    <input type="text" name="upi_display_name" id="upi_display_name_input" class="form-control form-control-premium form-control-lg" 
                           value="<?php echo htmlspecialchars($currentGatewayName); ?>" placeholder="Payment Display Name">
                    <div class="form-text text-muted small mt-1">ডিপোজিট ক্যাশিয়ার ও পেমেন্ট রিসিটে মার্চেন্ট বা প্ল্যাটফর্ম নাম হিসেবে দেখাবে।</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-light fw-bold small">
                      <i class="fab fa-telegram text-info me-1"></i> অফিসিয়াল টেলিগ্রাম চ্যানেল / সাপোর্ট লিঙ্ক (Telegram Support URL)
                    </label>
                    <input type="url" name="telegram_url" class="form-control form-control-premium" 
                           value="<?php echo htmlspecialchars($currentTelegram); ?>" placeholder="https://t.me/yourchannel">
                    <div class="form-text text-muted small mt-1">গিফট কোড ও সাপোর্ট আইকনে ক্লিক করলে এই চ্যানেলে নিয়ে যাবে।</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-light fw-bold small">
                      <i class="fas fa-quote-left text-warning me-1"></i> ওয়েবসাইটের ট্যাগলাইন / বিবরণ (Site Description)
                    </label>
                    <input type="text" name="site_description" class="form-control form-control-premium" 
                           value="<?php echo htmlspecialchars($currentSiteDesc); ?>" placeholder="Where the wealth happens. Play top trending games...">
                    <div class="form-text text-muted small mt-1">এসইও (SEO), সোশ্যাল শেয়ার ও মেটা ডেসক্রিপশনে ব্যবহার হবে।</div>
                  </div>
                </div>

                <div class="d-flex align-items-center justify-content-between mt-4 pt-3 border-top" style="border-color: rgba(255,255,255,0.08) !important;">
                  <div class="text-secondary small">
                    <i class="fas fa-shield-alt text-gold me-1"></i> সেভ বাটনে ক্লিক করার সাথে সাথে ওয়েবসাইটের সকল ক্লায়েন্টে লাইভ আপডেট হবে।
                  </div>
                  <button type="submit" id="saveBrandingSubmitBtn" class="btn btn-premium px-4 py-2 fw-bold">
                    <i class="fas fa-save me-2"></i> নাম পরিবর্তন সেভ করুন (Save Branding)
                  </button>
                </div>
              </form>
            </div>

            <!-- RAW API_SETTINGS ADVANCED TABLE -->
            <div class="glass-panel p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h4 class="fw-bold m-0"><i class="fas fa-database text-gold me-2"></i> সকল সিস্টেম ভেরিয়েবল (All System Settings)</h4>
                <span class="text-muted small">মোট ভেরিয়েবল: <?php echo count($settings); ?> টি</span>
              </div>
                <div class="table-responsive table-responsive-premium">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Setting Key</th>
                                <th>Setting Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($settings as $set): ?>
                                <tr>
                                    <form action="api.php" method="post">
                                        <input type="hidden" name="action" value="save_setting">
                                        <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                                        <input type="hidden" name="redirect" value="/admin/?tab=settings">
                                        <input type="hidden" name="setting_key" value="<?php echo htmlspecialchars($set['setting_key']); ?>">
                                        <td>
                                            <strong><?php echo htmlspecialchars($set['setting_key']); ?></strong>
                                        </td>
                                        <td>
                                            <textarea name="setting_value" class="form-control form-control-premium py-1" style="min-height: 40px;"><?php echo htmlspecialchars($set['setting_value']); ?></textarea>
                                        </td>
                                        <td>
                                            <button type="submit" class="btn btn-premium btn-sm">Save</button>
                                        </td>
                                    </form>
                                </tr>
                            <?php endforeach; ?>
                            <tr>
                                <form action="api.php" method="post">
                                    <input type="hidden" name="action" value="save_setting">
                                    <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                                    <input type="hidden" name="redirect" value="/admin/?tab=settings">
                                    <td><input name="setting_key" class="form-control form-control-premium" placeholder="new_setting_key" required></td>
                                    <td><textarea name="setting_value" class="form-control form-control-premium" placeholder="Value..." required></textarea></td>
                                    <td><button type="submit" class="btn btn-success btn-sm">Add Setting</button></td>
                                </form>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>

          <script>
          document.addEventListener('DOMContentLoaded', function() {
              const bForm = document.getElementById('brandingForm');
              if (!bForm) return;

              bForm.addEventListener('submit', async function(e) {
                  e.preventDefault();
                  const submitBtn = document.getElementById('saveBrandingSubmitBtn');
                  const origHtml = submitBtn.innerHTML;
                  submitBtn.disabled = true;
                  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> সেভ হচ্ছে...';

                  try {
                      const formData = new FormData(bForm);
                      const res = await fetch('api.php', {
                          method: 'POST',
                          body: formData,
                          headers: { 'X-Requested-With': 'XMLHttpRequest' }
                      });
                      const data = await res.json();
                      if (data.success) {
                          const newName = document.getElementById('site_name_input').value.trim();
                          const badge = document.getElementById('currentLiveBadge');
                          if (badge) badge.textContent = newName;
                          alert('✅ ' + data.message);
                          window.location.reload();
                      } else {
                          alert('❌ ' + (data.message || 'Error saving branding'));
                      }
                  } catch (err) {
                      alert('Error: ' + err.message);
                  } finally {
                      submitBtn.disabled = false;
                      submitBtn.innerHTML = origHtml;
                  }
              });
          });
          </script>
        <?php endif; ?>

        <?php if ($tab === 'audit'): 
          $auditLogs = ReportController::listActivityLogs(50);
          $loginHistory = ReportController::listLoginHistory(50);
        ?>
          <div id="audit-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-clipboard-list text-gold me-2"></i> Audit & Login history</h2>
            
            <div class="row g-4">
              <!-- Left: Activity Logs -->
              <div class="col-lg-6">
                <div class="glass-panel p-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="fw-bold m-0 text-gold">Admin Activity Log</h4>
                    <a href="api.php?action=export_report&type=users" class="btn btn-sm btn-outline-info"><i class="fas fa-download"></i> CSV</a>
                  </div>
                  <div class="table-responsive table-responsive-premium" style="max-height: 500px; overflow-y: auto;">
                    <table class="table small">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Admin</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($auditLogs as $log): ?>
                                <tr>
                                    <td><?php echo $log['created_at']; ?></td>
                                    <td><strong><?php echo htmlspecialchars($log['username'] ?? 'System'); ?></strong></td>
                                    <td><span class="badge bg-primary"><?php echo htmlspecialchars($log['action']); ?></span></td>
                                    <td><code style="word-break: break-all;"><?php echo htmlspecialchars($log['after_state'] ?? $log['target'] ?? ''); ?></code></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Right: Login History -->
              <div class="col-lg-6">
                <div class="glass-panel p-4">
                  <h4 class="fw-bold mb-3 text-gold">Admin Login Audits</h4>
                  <div class="table-responsive table-responsive-premium" style="max-height: 500px; overflow-y: auto;">
                    <table class="table small">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Admin User</th>
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($loginHistory as $lh): ?>
                                <tr>
                                    <td><?php echo $lh['created_at']; ?></td>
                                    <td><strong><?php echo htmlspecialchars($lh['username'] ?? 'User ID: ' . $lh['admin_id']); ?></strong></td>
                                    <td><code><?php echo htmlspecialchars($lh['ip_address']); ?></code></td>
                                    <td>
                                        <?php 
                                            $isOk = (strpos(strtolower($lh['status']), 'success') !== false);
                                            $badgeClass = $isOk ? 'bg-success' : 'bg-danger';
                                        ?>
                                        <span class="badge <?php echo $badgeClass; ?>"><?php echo htmlspecialchars($lh['status']); ?></span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <!-- NEW COLLAPSIBLE TABS VIEWPORTS -->

        <!-- 1. Dedicated Game Manager View for all 20 Lottery Games -->
        <?php 
          $isGameTab = (
              strpos($tab, 'wingo_') === 0 || 
              strpos($tab, 'k3_') === 0 || 
              strpos($tab, 'd5_') === 0 || 
              strpos($tab, 'trxwingo_') === 0 || 
              strpos($tab, 'motorace_') === 0
          );
          if ($isGameTab): 
            $parts = explode('_', $tab);
            $prefix = strtolower($parts[0]);
            $base = match($prefix) {
                'd5' => 'D5',
                'k3' => 'K3',
                'trxwingo' => 'TrxWinGo',
                'motorace' => 'MotoRace',
                default => 'WinGo'
            };
            $interval = strtoupper($parts[1]);
            $gameCode = $base . '_' . $interval;
            $meta = $allGameMeta[$gameCode] ?? [
                'name_bn' => str_replace('_', ' ', $gameCode),
                'name_en' => $gameCode,
                'category' => 'Lottery Prediction',
                'category_badge' => 'Lottery',
                'badge_class' => 'bg-primary',
                'duration' => $interval,
                'duration_bn' => $interval,
                'desc' => 'রিয়েল-টাইম অনলাইন প্রেডিকশন ড্র লটারি গেম।',
                'override_hint' => 'যেমন: 5, Green, Big',
                'icon' => 'fas fa-gamepad text-gold',
            ];
        ?>
          <div id="game-manager-view" data-game-code="<?php echo htmlspecialchars($gameCode); ?>">
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="badge <?php echo $meta['badge_class']; ?>"><?php echo htmlspecialchars($meta['category_badge']); ?></span>
                        <span class="badge bg-secondary"><?php echo htmlspecialchars($meta['duration_bn']); ?> ড্র</span>
                        <span class="badge bg-dark border border-secondary text-gold">Code: <?php echo htmlspecialchars($gameCode); ?></span>
                    </div>
                    <h2 class="fw-bold m-0 text-white">
                        <i class="<?php echo htmlspecialchars($meta['icon']); ?> me-2"></i>
                        <?php echo htmlspecialchars($meta['name_bn']); ?> (<?php echo htmlspecialchars($meta['name_en']); ?>) - কন্ট্রোল ডেস্ক
                    </h2>
                    <p class="text-secondary small mt-1 mb-0">
                        <strong>খেলার নিয়ম ও বিবরণ:</strong> <?php echo htmlspecialchars($meta['desc']); ?>
                    </p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <a href="/admin/?tab=live" class="btn btn-secondary-premium btn-sm"><i class="fas fa-th-large me-1"></i> সকল ২১ গেম হাব</a>
                    <span class="badge bg-danger fs-6 py-2 px-3 shadow"><i class="fas fa-stopwatch me-1"></i> <span id="game-timer">00:00</span></span>
                </div>
            </div>

            <div class="row g-4">
              <!-- Left Column: Current Issue and Override -->
              <div class="col-lg-5">
                <div class="glass-panel p-4 mb-4">
                  <h4 class="fw-bold mb-3 text-gold">চলতি পিরিয়ড তথ্য (Current Issue Details)</h4>
                  <div class="p-3 mb-3 border rounded bg-dark border-secondary">
                    <span class="text-secondary small d-block">ACTIVE PERIOD NUMBER (চলতি রাউন্ড নম্বর)</span>
                    <strong class="fs-4 text-white" id="game-active-issue">--</strong>
                    <span class="text-muted d-block small mt-2">Next Forced Outcome: <span id="game-forced-status" class="text-warning fw-bold">None</span></span>
                  </div>

                  <h4 class="fw-bold mb-3 text-gold">ফলাফল নিয়ন্ত্রণ (Override Result)</h4>
                  <form id="form-game-override" class="row g-2 mb-2">
                    <div class="col-8">
                       <input name="premium" id="override-premium-value" class="form-control form-control-premium" placeholder="<?php echo htmlspecialchars($meta['override_hint']); ?>" required>
                    </div>
                    <div class="col-4 d-flex gap-2">
                       <button type="submit" class="btn btn-premium w-100 justify-content-center">SET</button>
                       <button type="button" id="btn-unset-override" class="btn btn-secondary-premium">UNSET</button>
                    </div>
                  </form>
                  <small class="text-muted d-block" style="font-size: 11px;">
                    <i class="fas fa-info-circle text-gold me-1"></i> <strong>উদাহরণ:</strong> <?php echo htmlspecialchars($meta['override_hint']); ?> লিখে <strong>SET</strong> চাপুন। স্বয়ংক্রিয় করতে <strong>UNSET</strong> চাপুন।
                  </small>
                </div>

                <div class="glass-panel p-4">
                  <h4 class="fw-bold mb-3 text-gold">পূর্ববর্তী ড্র ফলাফল (Recently Completed Periods)</h4>
                  <div class="table-responsive table-responsive-premium">
                    <table class="table small" id="game-history-table">
                      <thead>
                        <tr>
                          <th>পিরিয়ড (Period)</th>
                          <th>ফলাফল (Result Value)</th>
                          <th>কালার / যোগফল (Sum / Colors)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td colspan="3" class="text-center text-muted">Loading history...</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Right Column: Bets pool & Live Bets list -->
              <div class="col-lg-7">
                <div class="glass-panel p-4 mb-4">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="text-secondary small">ACTIVE STAKES POOL (চলতি রাউন্ডের মোট বাজি)</span>
                      <h3 class="fw-bold text-success m-0" id="game-total-pool">৳0.00</h3>
                    </div>
                    <i class="fas fa-coins text-gold fs-2"></i>
                  </div>
                </div>

                <div class="glass-panel p-4">
                  <h4 class="fw-bold mb-3 text-gold">চলতি পিরিয়ডের বাজি সমূহ (Stakes in Current Period)</h4>
                  <div class="table-responsive table-responsive-premium">
                    <table class="table small" id="game-bets-table">
                      <thead>
                        <tr>
                          <th>Player ID (প্লেয়ার আইডি)</th>
                          <th>Username (ইউজারনেম)</th>
                          <th>Bet Option (বাজির ধরণ)</th>
                          <th>Amount (টাকা)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td colspan="4" class="text-center text-muted">No active stakes</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <!-- 2. Gift Code Manager -->
        <?php if ($tab === 'gift_code'): ?>
          <div id="gift-code-view">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold m-0"><i class="fas fa-gift text-gold me-2"></i> Gift Code Manager</h2>
                <button class="btn-premium" data-bs-toggle="modal" data-bs-target="#modal-add-gift-code">
                    <i class="fas fa-plus"></i> Create Gift Code
                </button>
            </div>
            
            <div class="glass-panel p-4">
                <div class="table-responsive table-responsive-premium">
                    <table class="table w-100" id="gift-codes-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Prize Amount</th>
                                <th>Max Redeem</th>
                                <th>Redeemed Count</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded via AJAX -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal: Add Gift Code -->
            <div class="modal fade" id="modal-add-gift-code" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-content-premium text-white">
                  <div class="modal-header modal-header-premium">
                    <h5 class="modal-title fw-bold"><i class="fas fa-gift text-gold me-2"></i> Generate Gift Code</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <form id="form-add-gift-code">
                    <input type="hidden" name="action" value="save_gift_code">
                    <div class="modal-body p-4">
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Gift Code String</label>
                        <input name="code" class="form-control form-control-premium" placeholder="e.g. WELCOME500" required>
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Prize Value (৳)</label>
                        <input type="number" name="prize_amount" step="0.01" class="form-control form-control-premium" placeholder="e.g. 50" required>
                      </div>
                      <div class="mb-3">
                        <label class="form-label text-secondary small fw-bold">Max Redeem Limits</label>
                        <input type="number" name="max_redeem" class="form-control form-control-premium" value="1" required>
                      </div>
                    </div>
                    <div class="modal-footer modal-footer-premium">
                      <button type="button" class="btn-secondary-premium" data-bs-dismiss="modal">Cancel</button>
                      <button type="submit" class="btn-premium">Create Code</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        <?php endif; ?>

        <!-- 3. Same IP Checker -->
        <?php if ($tab === 'check_same_ip'): ?>
          <div id="check-same-ip-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-shield-alt text-gold me-2"></i> Duplicate IP Account Audits</h2>
            <div class="glass-panel p-4">
                <div class="table-responsive table-responsive-premium">
                    <table class="table w-100" id="same-ip-table">
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>Shared Users Count</th>
                                <th>Associated Accounts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded via AJAX -->
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        <?php endif; ?>

        <!-- 4. Daily Salary View -->
        <?php if ($tab === 'daily_salary'): ?>
          <div id="daily-salary-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-money-bill-wave text-gold me-2"></i> Daily Salary Manager</h2>
            <div class="glass-panel p-4">
                <h4 class="fw-bold mb-3 text-gold">Promoter Daily Salary Settings</h4>
                <form action="api.php" method="post" class="row g-3">
                    <input type="hidden" name="action" value="save_setting">
                    <input type="hidden" name="csrf" value="<?php echo $csrfToken; ?>">
                    
                    <div class="col-md-6">
                        <label class="form-label text-secondary small fw-bold">Active Members Requirement (Recharge >= ৳500)</label>
                        <?php $req = api_setting('salary_req_members', '5'); ?>
                        <input name="setting_value" class="form-control form-control-premium" value="<?php echo htmlspecialchars($req); ?>">
                        <input type="hidden" name="setting_key" value="salary_req_members">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-secondary small fw-bold">Daily Salary Payout (৳)</label>
                        <?php $pay = api_setting('salary_payout_amount', '500'); ?>
                        <input name="setting_value" class="form-control form-control-premium" value="<?php echo htmlspecialchars($pay); ?>">
                        <input type="hidden" name="setting_key" value="salary_payout_amount">
                    </div>
                    <div class="col-12 mt-4">
                        <button type="submit" class="btn btn-premium">Save Salary Configuration</button>
                    </div>
                </form>
            </div>
          </div>
        <?php endif; ?>

        <!-- 5. Site Maintenance View -->
        <?php if ($tab === 'site_maintenance'): ?>
          <div id="site-maintenance-view">
            <h2 class="fw-bold mb-4"><i class="fas fa-tools text-gold me-2"></i> Site Maintenance Controls</h2>
            <div class="glass-panel p-4 text-center">
                <div class="mb-4">
                    <i class="fas fa-power-off text-danger" style="font-size: 64px;"></i>
                </div>
                <h4 class="fw-bold mb-2">Emergency Under Maintenance Toggle</h4>
                <p class="text-secondary mb-4 mx-auto" style="max-width: 500px;">
                    Activating Site Maintenance will temporarily block all game bets and display a maintenance splash screen to all regular members.
                </p>
                
                <?php $maint = api_setting_bool('site_maintenance', false); ?>
                <button type="button" id="btn-toggle-maintenance" data-enabled="<?php echo $maint ? '1' : '0'; ?>" 
                        class="btn <?php echo $maint ? 'btn-danger' : 'btn-success'; ?> btn-lg px-5 py-3 fw-bold">
                    <?php echo $maint ? 'DISABLE SITE MAINTENANCE (LIVE)' : 'ENABLE SITE MAINTENANCE (OFFLINE)'; ?>
                </button>
            </div>
          </div>
        <?php endif; ?>

        <!-- Redirect Placeholders for remaining tabs -->
        <?php if (in_array($tab, ['add_upi', 'usdt_rate', 'add_usdt', 'add_upi_image', 'add_usdt_image', 'upi_withdraw', 'withdraw_sent', 'withdraw_reject'], true)): ?>
          <div class="glass-panel p-5 text-center mt-5">
              <div class="display-4 text-gold mb-3"><i class="fas fa-credit-card"></i></div>
              <h3 class="fw-bold">Gateway & Payout Management</h3>
              <p class="text-secondary mb-4">Please manage payment gateways, rates, and active methods from the main Gateway Rotations manager.</p>
              <a href="/admin/?tab=gateways" class="btn btn-premium">Go to Gateways</a>
          </div>
        <?php endif; ?>

        <?php if (in_array($tab, ['support_deposit', 'support_withdraw', 'support_ifsc', 'support_bank', 'support_game'], true)): ?>
          <div class="glass-panel p-5 text-center mt-5">
              <div class="display-4 text-gold mb-3"><i class="fas fa-headset"></i></div>
              <h3 class="fw-bold">Support Tickets Categorization</h3>
              <p class="text-secondary mb-4">Please manage support tickets and replies from the main Support Tickets panel.</p>
              <a href="/admin/?tab=support" class="btn btn-premium">Go to Tickets</a>
          </div>
        <?php endif; ?>

        <?php if (in_array($tab, ['bonus_manage', 'admin_password', 'banned_users', 'add_admin', 'demo_user', 'agent_user'], true)): ?>
          <div class="glass-panel p-5 text-center mt-5">
              <div class="display-4 text-gold mb-3"><i class="fas fa-sliders-h"></i></div>
              <h3 class="fw-bold">Configuration Parameters</h3>
              <p class="text-secondary mb-4">This administrative action is managed inside the site Settings & Configurations panel.</p>
              <a href="/admin/?tab=settings" class="btn btn-premium">Go to Settings</a>
          </div>
        <?php endif; ?>

      <?php endif; // hasAccess check ?>

    </main>
  </div>
  <?php require __DIR__ . '/views/footer.php'; ?>
