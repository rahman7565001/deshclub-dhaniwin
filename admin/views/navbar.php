<?php
declare(strict_types=1);
$adminUser = admin_get_logged_in_user();
?>
<?php 
$navSiteName = function_exists('api_setting') ? api_setting('site_name', 'Deshclub') : 'Deshclub';
if (empty($navSiteName)) $navSiteName = 'Deshclub';
?>
<header class="app-header">
    <div class="brand-container">
        <div class="brand-logo">✦</div>
        <span><?php echo htmlspecialchars($navSiteName); ?><span> Admin</span></span>
    </div>
    <div class="header-meta">
        <span class="badge-db">DB: <?php echo htmlspecialchars(api_db_driver()); ?></span>
        <?php if ($adminUser): ?>
            <span class="text-secondary d-none d-md-inline">
                Welcome, <strong><?php echo htmlspecialchars($adminUser['username']); ?></strong> 
                (<span class="text-gold"><?php echo htmlspecialchars($adminUser['role_label'] ?? 'Admin'); ?></span>)
            </span>
        <?php endif; ?>
        <a href="/admin/?logout=1" class="btn-secondary-premium">
            <i class="fas fa-sign-out-alt me-1"></i> Logout
        </a>
    </div>
</header>
