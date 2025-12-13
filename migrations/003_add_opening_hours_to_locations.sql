-- Migration: Add opening_hours column to locations table
-- Created: 2025-12-13

-- Add opening_hours column
ALTER TABLE locations ADD COLUMN opening_hours TEXT;

-- Update existing Praha 2 location with hours
UPDATE locations
SET opening_hours = '10:00 — 22:00'
WHERE name = 'praha-2';
