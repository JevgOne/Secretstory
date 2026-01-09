-- Add multilingual tattoo and piercing description fields to girls table

-- Tattoo descriptions per language
ALTER TABLE girls ADD COLUMN tattoo_description_cs TEXT;
ALTER TABLE girls ADD COLUMN tattoo_description_en TEXT;
ALTER TABLE girls ADD COLUMN tattoo_description_de TEXT;
ALTER TABLE girls ADD COLUMN tattoo_description_uk TEXT;

-- Piercing descriptions per language
ALTER TABLE girls ADD COLUMN piercing_description_cs TEXT;
ALTER TABLE girls ADD COLUMN piercing_description_en TEXT;
ALTER TABLE girls ADD COLUMN piercing_description_de TEXT;
ALTER TABLE girls ADD COLUMN piercing_description_uk TEXT;

-- Copy existing descriptions to CS versions (assuming they were in Czech)
UPDATE girls SET tattoo_description_cs = tattoo_description WHERE tattoo_description IS NOT NULL AND tattoo_description != '';
UPDATE girls SET piercing_description_cs = piercing_description WHERE piercing_description IS NOT NULL AND piercing_description != '';
