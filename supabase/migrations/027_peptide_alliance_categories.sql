-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 027: Peptide Alliance — Categories, Geography, Schema Changes
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Update category constraint for peptide industry categories
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_category_check;
ALTER TABLE businesses ADD CONSTRAINT businesses_category_check
  CHECK (category IN (
    'peptide_brands', 'clinics', 'compounding_pharmacies',
    'research_labs', 'wholesale_suppliers', 'manufacturers'
  ));

-- 2. Add country column (US or CA)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS country text DEFAULT 'US'
  CHECK (country IN ('US', 'CA'));

-- 3. Add service_area for national/online businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS service_area text DEFAULT 'local'
  CHECK (service_area IN ('national', 'online_only', 'regional', 'local'));

-- 4. Add trust_score column
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS trust_score integer DEFAULT 0
  CHECK (trust_score BETWEEN 0 AND 100);

-- 5. Update source constraint to include web scraping
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_source_check;
ALTER TABLE businesses ADD CONSTRAINT businesses_source_check
  CHECK (source IN ('google_places', 'web_scrape', 'manual', 'claimed'));

-- 6. Remove InfoSylvita-specific columns (CASCADE handles dependent generated columns)
ALTER TABLE businesses DROP COLUMN IF EXISTS latin_confidence CASCADE;
ALTER TABLE businesses DROP COLUMN IF EXISTS description_es CASCADE;
ALTER TABLE businesses DROP COLUMN IF EXISTS long_description_es CASCADE;

-- 7. Rebuild search index (English only, add country)
DROP INDEX IF EXISTS businesses_search_idx;
CREATE INDEX businesses_search_idx ON businesses
  USING gin((
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(description_en, '') || ' ' ||
      coalesce(city, '') || ' ' ||
      coalesce(subcategory, '') || ' ' ||
      coalesce(country, '')
    )
  ));

-- 8. Add index on country + category for filtered browsing
CREATE INDEX IF NOT EXISTS businesses_country_category_idx
  ON businesses(country, category) WHERE is_active = true;

-- 9. Add index on service_area
CREATE INDEX IF NOT EXISTS businesses_service_area_idx
  ON businesses(service_area) WHERE is_active = true;

-- 10. Clear existing data (fresh start for new niche)
-- TRUNCATE businesses CASCADE;  -- Uncomment only on fresh DB
