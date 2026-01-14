-- Rollback Migration 013: Remove communication_type from bookings table

-- Drop index
DROP INDEX IF EXISTS idx_bookings_communication_type;

-- Remove communication_type column
-- Note: SQLite doesn't support DROP COLUMN directly in older versions
-- This script assumes SQLite 3.35.0+ which supports DROP COLUMN
-- For older versions, you'd need to recreate the table

ALTER TABLE bookings DROP COLUMN communication_type;
