-- Migration 011: Girl Photos and Videos Tables
-- Created: 2025-12-15

-- Girl photos table
CREATE TABLE IF NOT EXISTS girl_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  girl_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT 0,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);

-- Girl videos table
CREATE TABLE IF NOT EXISTS girl_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  girl_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  duration INTEGER, -- in seconds
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_girl_photos_girl_id ON girl_photos(girl_id);
CREATE INDEX IF NOT EXISTS idx_girl_photos_is_primary ON girl_photos(is_primary);
CREATE INDEX IF NOT EXISTS idx_girl_photos_display_order ON girl_photos(display_order);
CREATE INDEX IF NOT EXISTS idx_girl_videos_girl_id ON girl_videos(girl_id);
CREATE INDEX IF NOT EXISTS idx_girl_videos_display_order ON girl_videos(display_order);
