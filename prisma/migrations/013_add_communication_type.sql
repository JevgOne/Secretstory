-- Migration 013: Add communication_type to bookings table
-- Description: Track how client contacted us (SMS/Phone Call/WhatsApp/Telegram)

-- Add communication_type column
ALTER TABLE bookings ADD COLUMN communication_type TEXT CHECK(communication_type IN ('sms', 'call', 'whatsapp', 'telegram'));

-- Add index for better filtering performance
CREATE INDEX IF NOT EXISTS idx_bookings_communication_type ON bookings(communication_type);
