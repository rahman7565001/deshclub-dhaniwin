<?php
declare(strict_types=1);

class AuthController
{
    public static function login(string $username, string $password, bool $remember = false): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            $err = $GLOBALS['db_connection_error'] ?? 'Connection failed';
            return ['success' => false, 'message' => 'Database not available: ' . $err];
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? LIMIT 1");
            $stmt->execute([$username]);
            $admin = $stmt->fetch();

            if (!$admin) {
                self::logLogin(0, $username, 'failed', 'Invalid username');
                return ['success' => false, 'message' => 'Invalid username or password'];
            }

            if ((int)$admin['status'] !== 1) {
                self::logLogin((int)$admin['id'], $username, 'failed', 'Account disabled');
                return ['success' => false, 'message' => 'Account is disabled'];
            }

            if (!password_verify($password, $admin['password_hash'])) {
                self::logLogin((int)$admin['id'], $username, 'failed', 'Wrong password');
                return ['success' => false, 'message' => 'Invalid username or password'];
            }

            // Successful login
            if (session_status() === PHP_SESSION_NONE) {
                @session_start();
            }
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = (int)$admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['admin_role_id'] = (int)$admin['role_id'];

            self::logLogin((int)$admin['id'], $username, 'success', 'Login successful');

            if ($remember) {
                $token = bin2hex(random_bytes(32));
                $stmt = $pdo->prepare("UPDATE admin_users SET remember_token = ? WHERE id = ?");
                $stmt->execute([$token, $admin['id']]);
                setcookie('admin_remember', $token, time() + (86400 * 30), '/'); // 30 days
            }

            // Activity Log
            self::logActivity((int)$admin['id'], 'login', 'admin_users', null, null);

            return ['success' => true, 'message' => 'Logged in successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function logout(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            @session_start();
        }
        $adminId = $_SESSION['admin_id'] ?? 0;
        if ($adminId > 0) {
            self::logActivity((int)$adminId, 'logout', 'admin_users', null, null);
        }

        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        @session_destroy();

        if (isset($_COOKIE['admin_remember'])) {
            $pdo = api_pdo();
            if ($pdo) {
                try {
                    $stmt = $pdo->prepare("UPDATE admin_users SET remember_token = NULL WHERE remember_token = ?");
                    $stmt->execute([$_COOKIE['admin_remember']]);
                } catch (Throwable $e) {}
            }
            setcookie('admin_remember', '', time() - 3600, '/');
        }
    }

    public static function checkRememberMe(): bool
    {
        if (!empty($_SESSION['admin_logged_in'])) {
            return true;
        }

        $token = $_COOKIE['admin_remember'] ?? null;
        if (!$token) {
            return false;
        }

        $pdo = api_pdo();
        if (!$pdo) {
            return false;
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE remember_token = ? LIMIT 1");
            $stmt->execute([$token]);
            $admin = $stmt->fetch();

            if ($admin && (int)$admin['status'] === 1) {
                if (session_status() === PHP_SESSION_NONE) {
                    @session_start();
                }
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = (int)$admin['id'];
                $_SESSION['admin_username'] = $admin['username'];
                $_SESSION['admin_role_id'] = (int)$admin['role_id'];

                self::logLogin((int)$admin['id'], $admin['username'], 'success', 'Remember-Me auto login');
                return true;
            }
        } catch (Throwable $e) {}

        return false;
    }

    public static function changePassword(int $adminId, string $oldPassword, string $newPassword): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database not available'];
        }

        try {
            $stmt = $pdo->prepare("SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1");
            $stmt->execute([$adminId]);
            $hash = $stmt->fetchColumn();

            if (!$hash || !password_verify($oldPassword, $hash)) {
                return ['success' => false, 'message' => 'Incorrect old password'];
            }

            $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$newHash, $adminId]);

            self::logActivity($adminId, 'change_password', 'admin_users', 'Password changed', null);

            return ['success' => true, 'message' => 'Password updated successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    private static function logLogin(int $adminId, string $username, string $status, string $message): void
    {
        $pdo = api_pdo();
        if (!$pdo) return;
        try {
            $ip = api_client_ip();
            $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
            $stmt = $pdo->prepare("INSERT INTO admin_login_history (admin_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)");
            $stmt->execute([$adminId, $ip, $ua, $status . ': ' . $message]);
        } catch (Throwable $e) {}
    }

    public static function logActivity(int $adminId, string $action, string $target, ?string $before = null, ?string $after = null): void
    {
        $pdo = api_pdo();
        if (!$pdo) return;
        try {
            $stmt = $pdo->prepare("INSERT INTO admin_activity_logs (admin_id, action, target, before_state, after_state) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$adminId, $action, $target, $before, $after]);
        } catch (Throwable $e) {}
    }
}
