-- Enable unaccent extension (idempotent)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create an IMMUTABLE wrapper so we can use unaccent in generated columns and indexes
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
  RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
AS $$ SELECT unaccent($1) $$;

-- Add generated columns that store lowercased, accent-stripped versions.
-- These update automatically whenever the source column changes.
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS name_search TEXT
    GENERATED ALWAYS AS (lower(immutable_unaccent(name))) STORED;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS desc_en_search TEXT
    GENERATED ALWAYS AS (lower(immutable_unaccent(COALESCE(description_en, '')))) STORED;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS desc_es_search TEXT
    GENERATED ALWAYS AS (lower(immutable_unaccent(COALESCE(description_es, '')))) STORED;
