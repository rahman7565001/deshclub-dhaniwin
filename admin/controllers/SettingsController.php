<?php
declare(strict_types=1);

class SettingsController
{
    public static function saveSetting(string $key, string $value): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database not available'];
        }

        try {
            $driver = api_db_driver($pdo);
            if ($driver === 'mysql') {
                $stmt = $pdo->prepare("INSERT INTO api_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP");
                $stmt->execute([$key, $value]);
            } else {
                $exists = $pdo->prepare("SELECT id FROM api_settings WHERE setting_key = ? LIMIT 1");
                $exists->execute([$key]);
                if ($exists->fetchColumn()) {
                    $stmt = $pdo->prepare("UPDATE api_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?");
                    $stmt->execute([$value, $key]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO api_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");
                    $stmt->execute([$key, $value]);
                }
            }
            if ($key === 'site_name') {
                self::syncSiteFiles($value);
            }
            return ['success' => true, 'message' => "Setting '$key' saved successfully"];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function saveBranding(array $post): array
    {
        $siteName = trim((string)($post['site_name'] ?? ''));
        if ($siteName === '') {
            return ['success' => false, 'message' => 'ওয়েবসাইটের নাম অবশ্যই পূরণ করতে হবে (Site name is required)'];
        }

        $description = trim((string)($post['site_description'] ?? ''));
        $telegramUrl = trim((string)($post['telegram_url'] ?? ''));
        $gatewayName = trim((string)($post['upi_display_name'] ?? $siteName));

        self::saveSetting('site_name', $siteName);
        if ($description !== '') {
            self::saveSetting('site_description', $description);
        }
        if ($telegramUrl !== '') {
            self::saveSetting('telegram_url', $telegramUrl);
        }
        if ($gatewayName !== '') {
            self::saveSetting('upi_display_name', $gatewayName);
        }
        $shareContent = "👉Invite your friends to join {$siteName} and easily unlock free bonus! 🔗 #inviteLink#";
        self::saveSetting('share_content', $shareContent);

        self::syncSiteFiles($siteName, $description, $telegramUrl);

        return [
            'success' => true,
            'message' => "ওয়েবসাইট নাম সফলভাবে '{$siteName}' এ পরিবর্তন করা হয়েছে এবং সর্বত্র আপডেট হয়েছে!",
            'site_name' => $siteName
        ];
    }

    public static function syncSiteFiles(string $siteName, string $description = '', string $telegramUrl = ''): bool
    {
        $siteName = trim($siteName);
        if ($siteName === '') {
            return false;
        }

        $docRoot = dirname(__DIR__, 2);
        $siteNameEscaped = str_replace(['\\', '"'], ['\\\\', '\"'], $siteName);
        $siteNameHtml = htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8');

        // 1. Update webapi/kv/config.js and webapi2/kv/config.js
        $configFiles = [
            $docRoot . '/webapi/kv/config.js',
            $docRoot . '/webapi2/kv/config.js',
        ];
        foreach ($configFiles as $cfgFile) {
            if (is_file($cfgFile) && is_writable($cfgFile)) {
                $content = (string)file_get_contents($cfgFile);
                $content = preg_replace('/"webSiteName":\s*"[^"]*"/', '"webSiteName": "' . $siteNameEscaped . '"', $content);
                $content = preg_replace('/"seoHomeTitle":\s*"[^"]*"/', '"seoHomeTitle": "' . $siteNameEscaped . '"', $content);
                if ($description !== '') {
                    $descEscaped = str_replace(['\\', '"', "\r", "\n"], ['\\\\', '\"', '', '\n'], $description);
                    $content = preg_replace('/"seoHomeDescription":\s*"[^"]*"/', '"seoHomeDescription": "' . $descEscaped . '"', $content);
                }
                if ($telegramUrl !== '') {
                    $tgEscaped = str_replace(['\\', '"'], ['\\\\', '\"'], $telegramUrl);
                    $content = preg_replace('/("jumpUrl":\s*")https:\/\/t\.me\/[^"]*(")/', '${1}' . $tgEscaped . '${2}', $content);
                }
                file_put_contents($cfgFile, $content);
            }
        }

        // 2. Update index.html and css/undefined.html
        $htmlFiles = [
            $docRoot . '/index.html',
            $docRoot . '/css/undefined.html',
        ];
        foreach ($htmlFiles as $hPath) {
            if (is_file($hPath) && is_writable($hPath)) {
                $html = (string)file_get_contents($hPath);
                $html = preg_replace('/<title>.*?<\/title>/i', '<title>' . $siteNameHtml . '</title>', $html);
                $html = preg_replace('/(<meta\s+property=["\']og:title["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $siteNameHtml . '$2', $html);
                $html = preg_replace('/(<meta\s+property=["\']og:site_name["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $siteNameHtml . '$2', $html);
                $html = preg_replace('/(<meta\s+name=["\']twitter:title["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $siteNameHtml . '$2', $html);
                $html = preg_replace('/(<meta\s+name=["\']keywords["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $siteNameHtml . '$2', $html);
                if ($description !== '') {
                    $descHtml = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
                    $html = preg_replace('/(<meta\s+name=["\']description["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $descHtml . '$2', $html);
                    $html = preg_replace('/(<meta\s+property=["\']og:description["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $descHtml . '$2', $html);
                    $html = preg_replace('/(<meta\s+name=["\']twitter:description["\']\s+content=["\'])[^"\']*(["\'])/i', '$1' . $descHtml . '$2', $html);
                }
                file_put_contents($hPath, $html);
            }
        }

        // 3. Update payment gateway page (pay/index.php)
        $payIndex = $docRoot . '/pay/index.php';
        if (is_file($payIndex) && is_writable($payIndex)) {
            $payContent = (string)file_get_contents($payIndex);
            $payContent = preg_replace("/'account_name'\s*=>\s*'[^']*'/", "'account_name' => '" . addslashes($siteName) . "'", $payContent);
            $payContent = preg_replace('/<title>.*?<\/title>/i', '<title>' . $siteNameHtml . ' - Premium Payment Gateway</title>', $payContent);
            $payContent = preg_replace('/<div class="gateway-logo mt-2">.*?<\/div>/i', '<div class="gateway-logo mt-2">' . $siteNameHtml . ' Gateway</div>', $payContent);
            file_put_contents($payIndex, $payContent);
        }

        // 4. Update Aviator title (aviator/index.php)
        $aviatorIndex = $docRoot . '/aviator/index.php';
        if (is_file($aviatorIndex) && is_writable($aviatorIndex)) {
            $aviatorContent = (string)file_get_contents($aviatorIndex);
            $aviatorContent = preg_replace('/<title>.*?<\/title>/i', '<title>' . $siteNameHtml . ' Aviator - Crash Game</title>', $aviatorContent);
            file_put_contents($aviatorIndex, $aviatorContent);
        }

        // 5. Update Chicken Road title (chicken/index.php)
        $chickenIndex = $docRoot . '/chicken/index.php';
        if (is_file($chickenIndex) && is_writable($chickenIndex)) {
            $chickenContent = (string)file_get_contents($chickenIndex);
            $chickenContent = preg_replace('/<title>.*?<\/title>/i', '<title>Chicken Road 1 - ' . $siteNameHtml . '</title>', $chickenContent);
            file_put_contents($chickenIndex, $chickenContent);
        }

        return true;
    }


    public static function savePaymentMethod(array $post): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database not available'];
        }

        $id = (int)($post['id'] ?? 0);
        $name = trim((string)($post['method_name'] ?? 'UPI'));
        $type = trim((string)($post['method_type'] ?? 'UPI'));
        $accountName = trim((string)($post['account_name'] ?? ''));
        $accountValue = trim((string)($post['account_value'] ?? ''));
        $min = (float)($post['min_amount'] ?? 100);
        $max = (float)($post['max_amount'] ?? 50000);
        $sort = (int)($post['sort_order'] ?? 0);
        $enabled = isset($post['enabled']) ? (int)$post['enabled'] : 1;
        $qrText = trim((string)($post['qr_text'] ?? ''));

        $currency = strtoupper(trim((string)($post['currency'] ?? 'ALL')));
        if ($currency === '') {
            $currency = 'ALL';
        }

        if ($name === '' || $accountValue === '') {
            return ['success' => false, 'message' => 'Method name and Account value are required'];
        }

        if ($qrText === '' && strtoupper($type) === 'UPI') {
            $qrText = 'upi://pay?pa=' . rawurlencode($accountValue) . '&pn=' . rawurlencode($accountName) . '&cu=INR';
        }

        try {
            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE payment_methods SET method_name = ?, method_type = ?, account_name = ?, account_value = ?, qr_text = ?, min_amount = ?, max_amount = ?, sort_order = ?, enabled = ?, currency = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->execute([$name, $type, $accountName, $accountValue, $qrText, $min, $max, $sort, $enabled, $currency, $id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO payment_methods (method_name, method_type, account_name, account_value, qr_text, min_amount, max_amount, sort_order, enabled, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $type, $accountName, $accountValue, $qrText, $min, $max, $sort, $enabled, $currency]);
            }
            return ['success' => true, 'message' => 'Payment method saved successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function saveUsdtMethod(array $post): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database not available'];
        }

        $id = (int)($post['id'] ?? 0);
        $name = trim((string)($post['wallet_name'] ?? 'USDT'));
        $address = trim((string)($post['wallet_address'] ?? ''));
        $network = trim((string)($post['network'] ?? 'TRC20'));
        $min = (float)($post['min_amount'] ?? 10);
        $max = (float)($post['max_amount'] ?? 10000);
        $sort = (int)($post['sort_order'] ?? 0);
        $enabled = isset($post['enabled']) ? (int)$post['enabled'] : 1;
        $qrText = trim((string)($post['qr_text'] ?? ''));

        if ($name === '' || $address === '') {
            return ['success' => false, 'message' => 'Wallet name and address are required'];
        }

        try {
            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE usdt_methods SET wallet_name = ?, wallet_address = ?, network = ?, qr_text = ?, min_amount = ?, max_amount = ?, sort_order = ?, enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->execute([$name, $address, $network, $qrText, $min, $max, $sort, $enabled, $id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO usdt_methods (wallet_name, wallet_address, network, qr_text, min_amount, max_amount, sort_order, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $address, $network, $qrText, $min, $max, $sort, $enabled]);
            }
            return ['success' => true, 'message' => 'USDT method saved successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function getPaymentMethods(): array
    {
        $pdo = api_pdo();
        if (!$pdo) return [];
        try {
            return $pdo->query("SELECT * FROM payment_methods ORDER BY sort_order DESC, id ASC")->fetchAll() ?: [];
        } catch (Throwable $e) {
            return [];
        }
    }

    public static function getUsdtMethods(): array
    {
        $pdo = api_pdo();
        if (!$pdo) return [];
        try {
            return $pdo->query("SELECT * FROM usdt_methods ORDER BY sort_order DESC, id ASC")->fetchAll() ?: [];
        } catch (Throwable $e) {
            return [];
        }
    }

    public static function deletePaymentMethod(int $id): array
    {
        $pdo = api_pdo();
        if (!$pdo) return ['success' => false, 'message' => 'Database not available'];
        try {
            $stmt = $pdo->prepare("DELETE FROM payment_methods WHERE id = ?");
            $stmt->execute([$id]);
            return ['success' => true, 'message' => 'UPI method deleted successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public static function deleteUsdtMethod(int $id): array
    {
        $pdo = api_pdo();
        if (!$pdo) return ['success' => false, 'message' => 'Database not available'];
        try {
            $stmt = $pdo->prepare("DELETE FROM usdt_methods WHERE id = ?");
            $stmt->execute([$id]);
            return ['success' => true, 'message' => 'USDT method deleted successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
