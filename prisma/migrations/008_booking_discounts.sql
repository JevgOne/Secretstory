-- Add discount fields to bookings table

-- Add columns for discount system
ALTER TABLE bookings ADD COLUMN discount_type TEXT DEFAULT NULL; -- 'firsttimer', 'loyalty', 'weekend', 'custom'
ALTER TABLE bookings ADD COLUMN discount_percentage INTEGER DEFAULT 0; -- e.g., 10 for 10% off
ALTER TABLE bookings ADD COLUMN discount_amount INTEGER DEFAULT 0; -- Fixed amount discount in CZK
ALTER TABLE bookings ADD COLUMN original_price INTEGER DEFAULT NULL; -- Price before discount
ALTER TABLE bookings ADD COLUMN final_price INTEGER DEFAULT NULL; -- Price after discount (what customer actually pays)

-- Update existing bookings to set final_price = price where final_price is NULL
UPDATE bookings SET final_price = price WHERE final_price IS NULL;
UPDATE bookings SET original_price = price WHERE original_price IS NULL;

-- Create discounts reference table
CREATE TABLE IF NOT EXISTS discount_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'percentage', 'fixed'
  value INTEGER NOT NULL, -- Percentage (1-100) or fixed amount in CZK
  min_duration INTEGER DEFAULT NULL, -- Minimum booking duration in minutes
  valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
  valid_until DATETIME DEFAULT NULL,
  max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default firsttimer discount
INSERT OR IGNORE INTO discount_codes (code, name, type, value) VALUES
  ('FIRSTTIMER', 'First Timer Discount', 'percentage', 10),
  ('WEEKEND20', 'Weekend Special', 'percentage', 20),
  ('LOYALTY15', 'Loyalty Discount', 'percentage', 15);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
