-- Migration: Add multi-language support for SEO fields and ALT texts
-- Date: 2025-12-26
-- Description: Adds language-specific columns for SEO metadata (cs, en, de, uk)
--              to girls table and ALT text columns to girl_photos table

-- ============================================================================
-- 1. Add multi-language SEO fields to girls table
-- ============================================================================

-- Meta Title fields (CS, EN, DE, UK)
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_title_cs TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_title_en TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_title_de TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_title_uk TEXT;

-- Meta Description fields (CS, EN, DE, UK)
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_description_cs TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_description_en TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_description_de TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS meta_description_uk TEXT;

-- OG Title fields (CS, EN, DE, UK)
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_title_cs TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_title_en TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_title_de TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_title_uk TEXT;

-- OG Description fields (CS, EN, DE, UK)
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_description_cs TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_description_en TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_description_de TEXT;
ALTER TABLE girls ADD COLUMN IF NOT EXISTS og_description_uk TEXT;

-- ============================================================================
-- 2. Add multi-language ALT text fields to girl_photos table
-- ============================================================================

ALTER TABLE girl_photos ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE girl_photos ADD COLUMN IF NOT EXISTS alt_text_cs TEXT;
ALTER TABLE girl_photos ADD COLUMN IF NOT EXISTS alt_text_en TEXT;
ALTER TABLE girl_photos ADD COLUMN IF NOT EXISTS alt_text_de TEXT;
ALTER TABLE girl_photos ADD COLUMN IF NOT EXISTS alt_text_uk TEXT;

-- ============================================================================
-- 3. Migrate existing data (if any legacy SEO fields exist)
-- ============================================================================

-- Migrate existing meta_title to meta_title_cs (Czech as default language)
UPDATE girls
SET meta_title_cs = meta_title
WHERE meta_title IS NOT NULL AND meta_title != '' AND (meta_title_cs IS NULL OR meta_title_cs = '');

-- Migrate existing meta_description to meta_description_cs
UPDATE girls
SET meta_description_cs = meta_description
WHERE meta_description IS NOT NULL AND meta_description != '' AND (meta_description_cs IS NULL OR meta_description_cs = '');

-- Migrate existing og_title to og_title_cs
UPDATE girls
SET og_title_cs = og_title
WHERE og_title IS NOT NULL AND og_title != '' AND (og_title_cs IS NULL OR og_title_cs = '');

-- Migrate existing og_description to og_description_cs
UPDATE girls
SET og_description_cs = og_description
WHERE og_description IS NOT NULL AND og_description != '' AND (og_description_cs IS NULL OR og_description_cs = '');

-- ============================================================================
-- 4. Create indexes for performance (optional but recommended)
-- ============================================================================

-- Index for SEO metadata lookups
CREATE INDEX IF NOT EXISTS idx_girls_meta_title_cs ON girls(meta_title_cs);
CREATE INDEX IF NOT EXISTS idx_girls_meta_title_en ON girls(meta_title_en);
CREATE INDEX IF NOT EXISTS idx_girls_meta_title_de ON girls(meta_title_de);
CREATE INDEX IF NOT EXISTS idx_girls_meta_title_uk ON girls(meta_title_uk);

-- ============================================================================
-- NOTES:
-- ============================================================================
--
-- - Legacy fields (meta_title, meta_description, og_title, og_description)
--   are kept for backward compatibility
--
-- - New fields use naming convention: {field_name}_{language_code}
--   Example: meta_title_cs, meta_title_en, meta_title_de, meta_title_uk
--
-- - ALT text fields added to girl_photos table for SEO optimization of images
--
-- - All fields are TEXT type to accommodate variable-length content
--
-- - Migration is safe to run multiple times (uses IF NOT EXISTS)
--
-- ============================================================================

-- Run this migration with:
-- turso db shell lovelygirls < migrations/2025-12-26_add_multilang_seo_alt_text.sql
