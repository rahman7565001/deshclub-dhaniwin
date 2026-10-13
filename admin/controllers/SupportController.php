<?php
declare(strict_types=1);

class SupportController
{
    public static function listTickets(array $params): array
    {
        $pdo = api_pdo();
        if (!$pdo) {
            return ['data' => [], 'recordsTotal' => 0, 'recordsFiltered' => 0];
        }

        try {
            $stmt = $pdo->query("
                SELECT t.*, u.username, u.nickname 
                FROM support_tickets t 
                LEFT JOIN api_users u ON u.id = t.user_id 
                ORDER BY t.updated_at DESC
            ");
            $rows = $stmt->fetchAll() ?: [];
            return [
                'data' => $rows,
                'recordsTotal' => count($rows),
                'recordsFiltered' => count($rows)
            ];
        } catch (Throwable $e) {
            return ['error' => $e->getMessage(), 'data' => []];
        }
    }

    public static function getTicketDetails(int $ticketId): array
    {
        $pdo = api_pdo();
        if (!$pdo) return [];

        try {
            $stmt = $pdo->prepare("
                SELECT t.*, u.username, u.nickname 
                FROM support_tickets t 
                LEFT JOIN api_users u ON u.id = t.user_id 
                WHERE t.id = ? LIMIT 1
            ");
            $stmt->execute([$ticketId]);
            $ticket = $stmt->fetch();
            if (!$ticket) return [];

            $stmt = $pdo->prepare("SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY id ASC");
            $stmt->execute([$ticketId]);
            $replies = $stmt->fetchAll() ?: [];

            return [
                'ticket' => $ticket,
                'replies' => $replies
            ];
        } catch (Throwable $e) {
            return [];
        }
    }

    public static function replyToTicket(int $ticketId, int $adminId, string $message): array
    {
        $pdo = api_pdo();
        if (!$pdo) return ['success' => false, 'message' => 'Database not available'];

        if (trim($message) === '') {
            return ['success' => false, 'message' => 'Message cannot be empty'];
        }

        try {
            $pdo->beginTransaction();

            // Insert reply
            $stmt = $pdo->prepare("INSERT INTO ticket_replies (ticket_id, sender_type, sender_id, message) VALUES (?, 'admin', ?, ?)");
            $stmt->execute([$ticketId, $adminId, $message]);

            // Update ticket status
            $stmt = $pdo->prepare("UPDATE support_tickets SET status = 'replied', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$ticketId]);

            $pdo->commit();
            return ['success' => true, 'message' => 'Reply sent successfully'];
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public static function closeTicket(int $ticketId): array
    {
        $pdo = api_pdo();
        if (!$pdo) return ['success' => false, 'message' => 'Database not available'];

        try {
            $stmt = $pdo->prepare("UPDATE support_tickets SET status = 'closed', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$ticketId]);
            return ['success' => true, 'message' => 'Ticket closed successfully'];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}
