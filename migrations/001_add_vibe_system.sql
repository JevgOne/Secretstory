-- Migration: Add Vibe System to Reviews
-- Date: 2025-12-18
-- Description: Adds vibe-based rating system, tags, helpful votes, and IP address tracking

-- Add new columns to reviews table
ALTER TABLE reviews ADD COLUMN vibe TEXT CHECK(vibe IN ('unforgettable', 'magical', 'great', 'nice', 'meh'));
ALTER TABLE reviews ADD COLUMN tags TEXT DEFAULT '[]'; -- JSON array of tags
ALTER TABLE reviews ADD COLUMN helpful_count INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN ip_address TEXT;

-- Create helpful votes tracking table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL,
  voter_fingerprint TEXT NOT NULL, -- SHA256 hash of IP + user agent
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  UNIQUE(review_id, voter_fingerprint)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_vibe ON reviews(vibe);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_fingerprint ON review_helpful_votes(voter_fingerprint);

-- Update existing reviews to have default vibe based on rating
-- 5 stars → unforgettable, 4 stars → great, 3 stars → nice, <3 → meh
UPDATE reviews
SET vibe = CASE
  WHEN rating = 5 THEN 'unforgettable'
  WHEN rating = 4 THEN 'great'
  WHEN rating = 3 THEN 'nice'
  ELSE 'meh'
END
WHERE vibe IS NULL;
