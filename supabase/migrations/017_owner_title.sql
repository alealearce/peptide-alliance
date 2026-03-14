-- ============================================================
-- InfoSylvita — Migration 017: Owner title on businesses
-- ============================================================
-- Adds owner_title to businesses so we know the submitter's
-- role in the company (Owner, CEO, Manager, etc.).
-- The name comes from profiles.full_name via claimed_by.
-- ============================================================

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS owner_title text;

-- Index useful for admin filters
CREATE INDEX IF NOT EXISTS idx_businesses_owner_title
  ON businesses (owner_title)
  WHERE owner_title IS NOT NULL;
