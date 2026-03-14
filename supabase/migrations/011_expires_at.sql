-- ── Migration 011: expires_at for Jobs & Events listings ─────────────────
-- Adds an optional expiry date for businesses in the 'eventos' and 'trabajos'
-- categories. Expired listings stay in the DB for SEO but are filtered from
-- active listing pages.

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Index for fast filtering in category / search queries
CREATE INDEX IF NOT EXISTS idx_businesses_expires_at
  ON businesses (expires_at)
  WHERE expires_at IS NOT NULL;
