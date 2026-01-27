-- Add scheduled publishing support to blog posts
-- Migration 014: Blog Scheduled Publishing

-- Add scheduled_for column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN scheduled_for DATETIME DEFAULT NULL;

-- Create index for efficient scheduled posts lookup
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_for ON blog_posts(scheduled_for);

-- Add comment for clarity (SQLite doesn't support column comments, so documenting here):
--
-- Logic for publication status:
-- 1. scheduled_for IS NULL, is_published = 1 → Published (live)
-- 2. scheduled_for IS NULL, is_published = 0 → Draft (not published)
-- 3. scheduled_for IS NOT NULL, scheduled_for > NOW → Scheduled (waiting)
-- 4. scheduled_for IS NOT NULL, scheduled_for <= NOW → Auto-publish pending (will be published by cron/api check)
--
-- When a scheduled post's time arrives, the system will:
-- - Set is_published = 1
-- - Set published_at = scheduled_for
-- - Set scheduled_for = NULL (to mark as published)
