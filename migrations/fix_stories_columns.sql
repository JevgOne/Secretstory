-- Fix stories table columns
-- Add missing columns if they don't exist and fix NULL values

-- First, update any existing stories that have NULL is_active to 1
UPDATE stories SET is_active = 1 WHERE is_active IS NULL;

-- Update any existing stories that have NULL views_count to 0
UPDATE stories SET views_count = 0 WHERE views_count IS NULL;

-- Update any existing stories that have NULL created_at to current timestamp
UPDATE stories SET created_at = datetime('now') WHERE created_at IS NULL;
