-- LovelyGirls Database Schema
-- Turso (SQLite) Database

-- Users table (Admin, Manager, Girl accounts)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'girl')),
  girl_id INTEGER, -- FK to girls table (only for role='girl')
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Girls profiles
CREATE TABLE IF NOT EXISTS girls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  age INTEGER,
  nationality TEXT,
  height INTEGER,
  weight INTEGER,
  bust TEXT,
  hair TEXT,
  eyes TEXT,
  color TEXT, -- Calendar color (16 colors from palette)
  status TEXT DEFAULT 'pending' CHECK(status IN ('active', 'pending', 'inactive')),
  verified BOOLEAN DEFAULT 0,
  online BOOLEAN DEFAULT 0,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  services TEXT, -- JSON array of services
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings (Rezervace)
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  girl_id INTEGER NOT NULL,
  created_by INTEGER NOT NULL, -- FK to users (manager/admin who created)
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  date TEXT NOT NULL, -- ISO date string
  start_time TEXT NOT NULL, -- HH:MM format
  end_time TEXT NOT NULL, -- HH:MM format
  duration INTEGER, -- minutes
  location TEXT, -- incall/outcall address
  location_type TEXT CHECK(location_type IN ('incall', 'outcall')),
  services TEXT, -- JSON array of services
  price INTEGER,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Reviews (Recenze)
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  girl_id INTEGER NOT NULL,
  booking_id INTEGER, -- Optional FK to booking
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  approved_by INTEGER, -- FK to users (admin who approved)
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Notifications (Upozornění)
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, -- FK to users
  type TEXT NOT NULL CHECK(type IN ('booking_created', 'booking_updated', 'booking_cancelled', 'review_new', 'review_approved')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- URL to relevant page
  read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_girls_status ON girls(status);
CREATE INDEX IF NOT EXISTS idx_girls_slug ON girls(slug);
CREATE INDEX IF NOT EXISTS idx_bookings_girl_id ON bookings(girl_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_girl_id ON reviews(girl_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Initial data will be inserted via separate script after tables are created
