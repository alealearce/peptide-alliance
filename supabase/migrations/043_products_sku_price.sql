-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 043: Products — add SKU, price, quantity_duration
--                Lab Results — add description for text-only entries
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Products: new fields ──────────────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS price numeric(10, 2),
  ADD COLUMN IF NOT EXISTS quantity_duration text;

-- ── Lab Results: optional text description (no file required) ────────────────
ALTER TABLE lab_results
  ALTER COLUMN result_url DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS description text;
