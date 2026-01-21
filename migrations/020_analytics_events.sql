-- Analytics Events table for tracking user interactions
-- Created: 2026-01-20

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,        -- 'click_call', 'click_whatsapp', 'click_sms', 'click_telegram', 'profile_view'
  girl_id INTEGER,                  -- NULL for global buttons, ID for profile-specific events
  page_url TEXT,                    -- where the event occurred
  referrer TEXT,                    -- where the user came from
  utm_source TEXT,                  -- UTM parameters
  utm_medium TEXT,
  utm_campaign TEXT,
  visitor_id TEXT,                  -- anonymous fingerprint (hash of IP + User-Agent)
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE SET NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_girl_id ON analytics_events(girl_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_utm_source ON analytics_events(utm_source);
