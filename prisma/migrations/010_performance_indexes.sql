-- Performance optimization: Add indexes for frequently queried columns
-- This will significantly speed up database queries

-- Girls table indexes
CREATE INDEX IF NOT EXISTS idx_girls_status ON girls(status);
CREATE INDEX IF NOT EXISTS idx_girls_slug ON girls(slug);
CREATE INDEX IF NOT EXISTS idx_girls_age ON girls(age);
CREATE INDEX IF NOT EXISTS idx_girls_nationality ON girls(nationality);
CREATE INDEX IF NOT EXISTS idx_girls_is_deleted ON girls(is_deleted);
CREATE INDEX IF NOT EXISTS idx_girls_status_deleted ON girls(status, is_deleted);

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_girl_id ON bookings(girl_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_girl_id ON reviews(girl_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_locale ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_locale_category ON blog_posts(locale, category);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

-- Schedules indexes
CREATE INDEX IF NOT EXISTS idx_schedules_girl_id ON schedules(girl_id);
CREATE INDEX IF NOT EXISTS idx_schedules_location_id ON schedules(location_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
CREATE INDEX IF NOT EXISTS idx_schedules_is_active ON schedules(is_active);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
