-- Migration: Google Calendar Integration + Booking Source
-- Date: 2026-01-13

-- 1. Add booking_source column to track where reservation came from
ALTER TABLE bookings ADD COLUMN booking_source TEXT
  CHECK(booking_source IN ('sms', 'call', 'whatsapp', 'telegram', 'web', 'google_calendar'));

-- 2. Add Google Calendar event tracking columns
ALTER TABLE bookings ADD COLUMN google_event_id TEXT;
ALTER TABLE bookings ADD COLUMN sync_status TEXT DEFAULT 'pending'
  CHECK(sync_status IN ('pending', 'synced', 'error', 'local_only'));
ALTER TABLE bookings ADD COLUMN last_synced_at DATETIME;

-- 3. Create Google Calendar tokens table for OAuth
CREATE TABLE IF NOT EXISTS google_calendar_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  expires_at DATETIME NOT NULL,
  scope TEXT NOT NULL,
  calendar_id TEXT,
  sync_enabled BOOLEAN DEFAULT 1,
  last_sync_at DATETIME,
  sync_token TEXT,
  webhook_channel_id TEXT,
  webhook_expiration DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create OAuth states table for CSRF protection
CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_google_event ON bookings(google_event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_sync_status ON bookings(sync_status);
CREATE INDEX IF NOT EXISTS idx_gcal_tokens_user ON google_calendar_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_gcal_tokens_webhook ON google_calendar_tokens(webhook_channel_id);
