-- Rollback Migration: Remove og_image_alt column from seo_metadata table
-- Date: 2026-01-03
-- Purpose: Rollback the addition of og_image_alt field
-- WARNING: This will permanently delete all og_image_alt data!

-- Step 1: Create backup of og_image_alt data (optional but recommended)
-- Run this before rollback if you want to preserve data:
-- CREATE TABLE seo_metadata_og_image_alt_backup AS
-- SELECT id, page_path, og_image_alt FROM seo_metadata WHERE og_image_alt IS NOT NULL;

-- Step 2: Remove the column
-- Note: SQLite doesn't support DROP COLUMN directly in older versions
-- We need to recreate the table without the column

-- Backup the current table
ALTER TABLE seo_metadata RENAME TO seo_metadata_backup;

-- Recreate the original table structure (without og_image_alt)
CREATE TABLE seo_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL,
  locale TEXT DEFAULT 'cs',

  -- SEO Fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,

  -- Open Graph
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',

  -- Twitter Card
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,

  -- Schema.org JSON-LD
  schema_type TEXT,
  schema_data TEXT,

  -- Canonical & Robots
  canonical_url TEXT,
  robots_index INTEGER DEFAULT 1,
  robots_follow INTEGER DEFAULT 1,

  -- Focus Keyword
  focus_keyword TEXT,
  seo_score INTEGER DEFAULT 0,

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Copy data back (excluding og_image_alt)
INSERT INTO seo_metadata (
  id, page_path, page_type, locale,
  meta_title, meta_description, meta_keywords,
  og_title, og_description, og_image, og_type,
  twitter_card, twitter_title, twitter_description, twitter_image,
  schema_type, schema_data, canonical_url,
  robots_index, robots_follow, focus_keyword, seo_score,
  created_at, updated_at
)
SELECT
  id, page_path, page_type, locale,
  meta_title, meta_description, meta_keywords,
  og_title, og_description, og_image, og_type,
  twitter_card, twitter_title, twitter_description, twitter_image,
  schema_type, schema_data, canonical_url,
  robots_index, robots_follow, focus_keyword, seo_score,
  created_at, updated_at
FROM seo_metadata_backup;

-- Recreate indexes
CREATE INDEX idx_seo_page_path ON seo_metadata(page_path);
CREATE INDEX idx_seo_locale ON seo_metadata(locale);
CREATE INDEX idx_seo_page_type ON seo_metadata(page_type);

-- Verify data integrity
-- SELECT COUNT(*) FROM seo_metadata;
-- SELECT COUNT(*) FROM seo_metadata_backup;
-- If counts match, you can drop the backup:
-- DROP TABLE seo_metadata_backup;
