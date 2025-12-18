import { db } from '@/lib/db'

export interface CreateNotificationParams {
  userId: number
  type: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'review_new' | 'review_approved'
  title: string
  message: string
  link?: string
}

export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, link } = params

  try {
    await db.execute({
      sql: `
        INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
      `,
      args: [userId, type, title, message, link || null]
    })
  } catch (error) {
    console.error('Failed to create notification (table may not exist):', error)
    // Don't throw - notifications are not critical for review submission
  }
}

export async function markAsRead(notificationId: number) {
  try {
    await db.execute({
      sql: 'UPDATE notifications SET is_read = 1 WHERE id = ?',
      args: [notificationId]
    })
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    throw error
  }
}

export async function getUnreadCount(userId: number): Promise<number> {
  try {
    const result = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      args: [userId]
    })
    return (result.rows[0] as any).count || 0
  } catch (error) {
    console.error('Failed to get unread count:', error)
    return 0
  }
}
