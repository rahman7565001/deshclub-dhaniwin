<?php
require_once __DIR__ . '/api/_bootstrap.php';
$pdo = api_pdo();
if (!$pdo) {
    die("Database connection failed.\n");
}

$pdo->exec("
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER DEFAULT 1,
    status INTEGER DEFAULT 1,
    remember_token VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS admin_login_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    action VARCHAR(50),
    target VARCHAR(50),
    before_state TEXT,
    after_state TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

$stmt = $pdo->prepare('SELECT id FROM admin_users WHERE username = ?');
$stmt->execute(['admin']);
$exists = $stmt->fetchColumn();

$hash = password_hash('admin123', PASSWORD_DEFAULT);

if (!$exists) {
    $ins = $pdo->prepare('INSERT INTO admin_users (username, password_hash, role_id, status) VALUES (?, ?, 1, 1)');
    $ins->execute(['admin', $hash]);
    echo "SUCCESS: Admin user 'admin' created with password 'admin123'\n";
} else {
    $upd = $pdo->prepare('UPDATE admin_users SET password_hash = ?, status = 1 WHERE username = ?');
    $upd->execute([$hash, 'admin']);
    echo "SUCCESS: Admin user 'admin' password reset to 'admin123'\n";
}
