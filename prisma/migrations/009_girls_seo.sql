-- Add SEO fields to girls table for quick access
-- These will be synced with seo_metadata table

ALTER TABLE girls ADD COLUMN meta_title TEXT DEFAULT NULL;
ALTER TABLE girls ADD COLUMN meta_description TEXT DEFAULT NULL;
ALTER TABLE girls ADD COLUMN og_image TEXT DEFAULT NULL;
