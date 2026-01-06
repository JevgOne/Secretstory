-- Migration: Add og_image_alt column to seo_metadata table
-- Date: 2026-01-03
-- Purpose: Add OpenGraph image alt text field for better accessibility and SEO
-- Safe: This is a backward-compatible change (adds nullable column)

-- Step 1: Add the new column (nullable, so it won't break existing records)
ALTER TABLE seo_metadata ADD COLUMN og_image_alt TEXT;

-- Step 2: Verify the column was added
-- You can verify with: PRAGMA table_info(seo_metadata);

-- Note: The API route already handles this field (lines 80, 120, 149, 192, 213)
-- No changes to application code are needed.
