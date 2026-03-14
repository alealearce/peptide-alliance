-- ============================================================
-- InfoSylvita — Migration 020: City Slug for URL Structure
-- ============================================================
-- Adds city_slug column for city-based URL routing:
--   /{locale}/{city-slug}/{business-slug}
-- ============================================================

-- Add city_slug column
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS city_slug text;

-- Backfill city_slug from existing city values
UPDATE businesses SET city_slug = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(city, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '^-+|-+$', '', 'g'
  )
)
WHERE city_slug IS NULL;

-- Set NOT NULL after backfill
ALTER TABLE businesses ALTER COLUMN city_slug SET NOT NULL;

-- Index for city page queries
CREATE INDEX IF NOT EXISTS idx_businesses_city_slug
  ON businesses (city_slug);

-- Composite index for city + category filtering
CREATE INDEX IF NOT EXISTS idx_businesses_city_category
  ON businesses (city_slug, category) WHERE is_active = true;
