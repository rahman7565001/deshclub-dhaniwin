<?php
declare(strict_types=1);

class ReportController
{
    public static function listActivityLogs(int $limit = 100): array
    {
        $pdo = api_pdo();
        if (!$pdo) return [];
        try {
            $stmt = $pdo->prepare("
                SELECT al.*, u.username 
                FROM admin_activity_logs al
                LEFT JOIN admin_users u ON u.id = al.admin_id
                ORDER BY al.id DESC LIMIT ?
            ");
            $stmt->execute([$limit]);
            return $stmt->fetchAll() ?: [];
        } catch (Throwable $e) {
            return [];
        }
    }

    public static function listLoginHistory(int $limit = 100): array
    {
        $pdo = api_pdo();
        if (!$pdo) return [];
        try {
            $stmt = $pdo->prepare("
                SELECT lh.*, u.username 
                FROM admin_login_history lh
                LEFT JOIN admin_users u ON u.id = lh.admin_id
                ORDER BY lh.id DESC LIMIT ?
            ");
            $stmt->execute([$limit]);
            return $stmt->fetchAll() ?: [];
        } catch (Throwable $e) {
            return [];
        }
    }

    public static function exportCSV(string $type, array $filters = []): void
    {
        $pdo = api_pdo();
        if (!$pdo) {
            http_response_code(500);
            echo "Database not available";
            exit;
        }

        $filename = $type . "_report_" . date('Ymd_His') . ".csv";
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);

        $output = fopen('php://output', 'w');
        if (!$output) exit;

        try {
            if ($type === 'recharges') {
                fputcsv($output, ['ID', 'Order No', 'User ID', 'Method', 'Amount', 'Status', 'UTR', 'Date']);
                $stmt = $pdo->query("
                    SELECT r.id, r.order_no, u.user_id, r.method_name, r.amount, r.status, r.utr, r.created_at 
                    FROM recharge_orders r
                    LEFT JOIN api_users u ON u.id = r.user_id
                    ORDER BY r.id DESC
                ");
                while ($row = $stmt->fetch()) {
                    fputcsv($output, $row);
                }
            } elseif ($type === 'withdrawals') {
                fputcsv($output, ['ID', 'Order No', 'User ID', 'Withdraw Type', 'Amount', 'Status', 'Remarks', 'Date']);
                $stmt = $pdo->query("
                    SELECT w.id, w.order_no, u.user_id, w.withdraw_type, w.amount, w.status, w.remarks, w.created_at 
                    FROM withdraw_orders w
                    LEFT JOIN api_users u ON u.id = w.user_id
                    ORDER BY w.id DESC
                ");
                while ($row = $stmt->fetch()) {
                    fputcsv($output, $row);
                }
            } elseif ($type === 'users') {
                fputcsv($output, ['ID', 'User ID', 'Username', 'Nickname', 'Phone', 'Wallet Balance', 'Game Balance', 'Can Bet', 'Status', 'Date Registered']);
                $stmt = $pdo->query("
                    SELECT id, user_id, username, nickname, phone, wallet_balance, game_balance, can_bet, status, created_at 
                    FROM api_users
                    ORDER BY id DESC
                ");
                while ($row = $stmt->fetch()) {
                    fputcsv($output, $row);
                }
            } elseif ($type === 'bets') {
                fputcsv($output, ['ID', 'Order No', 'User ID', 'Game Code', 'Issue Number', 'Stake Amount', 'Win Amount', 'Profit', 'Status', 'Date']);
                $stmt = $pdo->query("
                    SELECT b.id, b.order_no, u.user_id, b.game_code, b.issue_number, b.stake_amount, b.win_amount, b.profit_amount, b.status, b.created_at 
                    FROM lottery_bets b
                    LEFT JOIN api_users u ON u.id = b.user_id
                    ORDER BY b.id DESC
                ");
                while ($row = $stmt->fetch()) {
                    fputcsv($output, $row);
                }
            }
        } catch (Throwable $e) {
            fputcsv($output, ['Error exporting report: ' . $e->getMessage()]);
        }

        fclose($output);
        exit;
    }
}
