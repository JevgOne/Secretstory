import { db } from '@/lib/db';

/**
 * Auto-publish scheduled blog posts
 * Checks for posts where scheduled_for <= current time and publishes them
 *
 * This function is called:
 * 1. On every public blog API request (passive auto-publishing)
 * 2. By a cron job endpoint (active auto-publishing)
 *
 * @returns Number of posts published
 */
export async function publishScheduledPosts(): Promise<number> {
  try {
    const now = new Date().toISOString();

    // Find posts that are scheduled and their time has arrived
    const scheduledPosts = await db.execute({
      sql: `
        SELECT id, title, scheduled_for
        FROM blog_posts
        WHERE scheduled_for IS NOT NULL
          AND scheduled_for <= ?
          AND is_published = 0
      `,
      args: [now]
    });

    if (scheduledPosts.rows.length === 0) {
      return 0;
    }

    // Publish each scheduled post
    for (const post of scheduledPosts.rows) {
      await db.execute({
        sql: `
          UPDATE blog_posts
          SET is_published = 1,
              published_at = scheduled_for,
              scheduled_for = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [post.id]
      });

      console.log(`[Blog Scheduler] Published post #${post.id}: "${post.title}" (scheduled for ${post.scheduled_for})`);
    }

    console.log(`[Blog Scheduler] Published ${scheduledPosts.rows.length} scheduled post(s)`);
    return scheduledPosts.rows.length;

  } catch (error) {
    console.error('[Blog Scheduler] Error publishing scheduled posts:', error);
    return 0;
  }
}
