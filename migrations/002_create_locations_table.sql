-- Migration: Create locations table for branch management
-- Created: 2025-12-12

CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT NOT NULL,
  district TEXT,
  coordinates TEXT,
  phone TEXT,
  email TEXT,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  is_primary INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert default location (Praha 2)
INSERT INTO locations (name, display_name, address, postal_code, city, district, is_active, is_primary)
VALUES ('praha-2', 'Praha 2', 'Vinohrady', '120 00', 'Praha', 'Praha 2', 1, 1);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
