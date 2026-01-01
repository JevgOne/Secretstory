-- Create applications table for new girl applications
CREATE TABLE IF NOT EXISTS girl_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Personal Info
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  height INTEGER, -- in cm
  weight INTEGER, -- in kg
  bust INTEGER,
  waist INTEGER,
  hips INTEGER,

  -- Contact
  email TEXT,
  phone TEXT NOT NULL,
  telegram TEXT,

  -- Professional Info
  experience TEXT, -- beginner, intermediate, experienced
  languages TEXT, -- JSON array of languages
  availability TEXT, -- JSON array of days/times

  -- Bio
  bio_cs TEXT,
  bio_en TEXT,

  -- Photos (URLs to uploaded images)
  photo_main TEXT,
  photo_gallery TEXT, -- JSON array of photo URLs

  -- Services willing to provide
  services TEXT, -- JSON array of service IDs

  -- Status
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by INTEGER,
  reviewed_at TEXT,
  rejection_reason TEXT,

  -- Metadata
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  notes TEXT, -- Admin notes

  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_applications_status ON girl_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON girl_applications(created_at);
