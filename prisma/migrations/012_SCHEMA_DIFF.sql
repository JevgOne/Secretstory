-- Schema Diff: Before and After Migration 012
-- Purpose: Visual comparison of schema changes
-- Date: 2026-01-03

-- ============================================
-- BEFORE MIGRATION
-- ============================================

-- Current schema (without og_image_alt):
/*
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
  og_type TEXT DEFAULT 'website',            <-- og_image_alt missing here

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
*/

-- ============================================
-- AFTER MIGRATION
-- ============================================

-- New schema (with og_image_alt):
/*
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
  og_image_alt TEXT,                          <-- NEW COLUMN ADDED HERE
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
*/

-- ============================================
-- CHANGE SUMMARY
-- ============================================

-- 1. Added column: og_image_alt TEXT
--    - Position: After og_image, before og_type
--    - Type: TEXT (nullable)
--    - Default: NULL
--    - Purpose: Store alt text for OpenGraph images
--
-- 2. No changes to:
--    - Table name
--    - Primary key
--    - Indexes
--    - Constraints
--    - Other columns
--    - Existing data

-- ============================================
-- IMPACT ON EXISTING DATA
-- ============================================

-- Before migration:
-- SELECT id, page_path, og_image FROM seo_metadata LIMIT 3;
-- | id | page_path | og_image |
-- |----|-----------|----------|
-- | 1  | /cs       | NULL     |
-- | 2  | /en       | NULL     |
-- | 3  | /cs/divky | NULL     |

-- After migration:
-- SELECT id, page_path, og_image, og_image_alt FROM seo_metadata LIMIT 3;
-- | id | page_path | og_image | og_image_alt |
-- |----|-----------|----------|--------------|
-- | 1  | /cs       | NULL     | NULL         |
-- | 2  | /en       | NULL     | NULL         |
-- | 3  | /cs/divky | NULL     | NULL         |

-- ============================================
-- QUERIES TO VERIFY MIGRATION
-- ============================================

-- Check column exists:
-- PRAGMA table_info(seo_metadata);
-- Expected: Row with name='og_image_alt', type='TEXT', notnull=0

-- Count records (should be unchanged):
-- SELECT COUNT(*) FROM seo_metadata;
-- Expected: 14

-- Verify all og_image_alt are NULL after migration:
-- SELECT COUNT(*) FROM seo_metadata WHERE og_image_alt IS NULL;
-- Expected: 14

-- Test insert with new column:
-- INSERT INTO seo_metadata (page_path, page_type, locale, og_image, og_image_alt)
-- VALUES ('/test', 'static', 'cs', '/test.jpg', 'Test alt text');
-- Expected: Success

-- Test update with new column:
-- UPDATE seo_metadata SET og_image_alt = 'Homepage banner' WHERE page_path = '/cs';
-- Expected: Success

-- ============================================
-- COLUMN POSITION VERIFICATION
-- ============================================

-- Before migration (column 16 = og_type):
-- 13|og_title|TEXT|0||0
-- 14|og_description|TEXT|0||0
-- 15|og_image|TEXT|0||0
-- 16|og_type|TEXT|0|'website'|0

-- After migration (column 16 = og_image_alt, column 17 = og_type):
-- 13|og_title|TEXT|0||0
-- 14|og_description|TEXT|0||0
-- 15|og_image|TEXT|0||0
-- 16|og_image_alt|TEXT|0||0          <-- NEW
-- 17|og_type|TEXT|0|'website'|0      <-- Position shifted by 1
