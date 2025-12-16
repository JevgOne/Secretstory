-- Girl Schedules (Rozvrhy dívek)
-- Defines when girls are available for bookings

-- Weekly recurring schedule
CREATE TABLE IF NOT EXISTS girl_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  girl_id INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6), -- 0=Monday, 6=Sunday
  start_time TEXT NOT NULL, -- Format: "HH:MM" (e.g., "10:00")
  end_time TEXT NOT NULL,   -- Format: "HH:MM" (e.g., "22:00")
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);

-- Schedule exceptions (holidays, sick days, special hours)
CREATE TABLE IF NOT EXISTS schedule_exceptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  girl_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- Format: "YYYY-MM-DD"
  exception_type TEXT NOT NULL CHECK(exception_type IN ('unavailable', 'custom_hours')),
  start_time TEXT, -- NULL if unavailable, or custom start time
  end_time TEXT,   -- NULL if unavailable, or custom end time
  reason TEXT,     -- Optional: "Dovolená", "Nemoc", etc.
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_girl_schedules_girl_id ON girl_schedules(girl_id);
CREATE INDEX IF NOT EXISTS idx_girl_schedules_day ON girl_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_girl_date ON schedule_exceptions(girl_id, date);
