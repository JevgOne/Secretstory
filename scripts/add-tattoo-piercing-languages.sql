-- Add tattoo, piercing and languages fields to girls table

ALTER TABLE girls ADD COLUMN tattoo_percentage INTEGER DEFAULT 0; -- 0-100%
ALTER TABLE girls ADD COLUMN tattoo_description TEXT;
ALTER TABLE girls ADD COLUMN piercing BOOLEAN DEFAULT 0;
ALTER TABLE girls ADD COLUMN piercing_description TEXT;
ALTER TABLE girls ADD COLUMN languages TEXT; -- JSON array: ["cs", "en", "de", "uk"]
