-- Add missing columns to girls table
-- Run this if columns don't exist yet

-- Tattoo and piercing fields
ALTER TABLE girls ADD COLUMN tattoo_percentage INTEGER DEFAULT 0; -- 0-100%
ALTER TABLE girls ADD COLUMN tattoo_description TEXT;
ALTER TABLE girls ADD COLUMN piercing BOOLEAN DEFAULT 0;
ALTER TABLE girls ADD COLUMN piercing_description TEXT;

-- Language support
ALTER TABLE girls ADD COLUMN languages TEXT; -- JSON array: ["cs", "en", "de", "uk"]

-- Badge and featured fields (if not already added)
ALTER TABLE girls ADD COLUMN is_new BOOLEAN DEFAULT 0;
ALTER TABLE girls ADD COLUMN is_top BOOLEAN DEFAULT 0;
ALTER TABLE girls ADD COLUMN is_featured BOOLEAN DEFAULT 0;
ALTER TABLE girls ADD COLUMN featured_section TEXT;
ALTER TABLE girls ADD COLUMN badge_type TEXT;
