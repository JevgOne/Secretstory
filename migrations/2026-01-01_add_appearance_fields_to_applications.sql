-- Add appearance fields to girl_applications table
ALTER TABLE girl_applications ADD COLUMN hair TEXT;
ALTER TABLE girl_applications ADD COLUMN eyes TEXT;
ALTER TABLE girl_applications ADD COLUMN tattoo INTEGER DEFAULT 0;
ALTER TABLE girl_applications ADD COLUMN tattoo_description TEXT;
ALTER TABLE girl_applications ADD COLUMN piercing INTEGER DEFAULT 0;
