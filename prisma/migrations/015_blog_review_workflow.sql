-- Add editorial review workflow to blog posts
-- Migration 015: Blog Review Workflow with Copywriter

-- Add review-related columns to blog_posts table
ALTER TABLE blog_posts ADD COLUMN review_status TEXT DEFAULT 'draft';
-- review_status values:
-- 'draft' - just created, not submitted for review
-- 'pending_review' - submitted to copywriter for review
-- 'approved' - copywriter approved, ready to publish/schedule
-- 'rejected' - copywriter rejected, needs changes
-- 'published' - live on website

ALTER TABLE blog_posts ADD COLUMN assigned_copywriter_id INTEGER DEFAULT NULL;
ALTER TABLE blog_posts ADD COLUMN reviewed_at DATETIME DEFAULT NULL;
ALTER TABLE blog_posts ADD COLUMN reviewed_by INTEGER DEFAULT NULL;
ALTER TABLE blog_posts ADD COLUMN review_notes TEXT DEFAULT NULL;

-- Create copywriters table
CREATE TABLE IF NOT EXISTS copywriters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  languages TEXT NOT NULL, -- Comma-separated: 'cs,en,de,uk'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_review_status ON blog_posts(review_status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_assigned_copywriter ON blog_posts(assigned_copywriter_id);

-- Sample copywriters (one for each language)
INSERT OR IGNORE INTO copywriters (id, name, email, languages) VALUES
  (1, 'Copywriter CS', 'copywriter-cs@lovelygirls.cz', 'cs'),
  (2, 'Copywriter EN', 'copywriter-en@lovelygirls.cz', 'en'),
  (3, 'Copywriter DE', 'copywriter-de@lovelygirls.cz', 'de'),
  (4, 'Copywriter UK', 'copywriter-uk@lovelygirls.cz', 'uk');

-- Add comment for clarity:
--
-- Workflow:
-- 1. Admin creates article → review_status = 'draft'
-- 2. Admin submits for review → review_status = 'pending_review', assigns copywriter
-- 3. Copywriter reviews:
--    - Approves → review_status = 'approved' (can now schedule/publish)
--    - Rejects → review_status = 'rejected' (back to admin with notes)
-- 4. Admin schedules/publishes approved article → review_status = 'published'
