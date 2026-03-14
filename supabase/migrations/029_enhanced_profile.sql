-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 029: Peptide Alliance — Enhanced Business Profiles
-- Products, Certifications, Lab Results
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Products Table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  product_type text CHECK (product_type IN (
    'peptide', 'supplement', 'pharmaceutical', 'equipment', 'service', 'other'
  )),
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_biz_idx ON products(business_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owner manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM businesses b WHERE b.id = products.business_id AND b.claimed_by = auth.uid())
  );

CREATE POLICY "Admin manage all products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Certifications Table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  issuing_body text,
  certificate_url text,
  verified_by_admin boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS certifications_biz_idx ON certifications(business_id);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read certifications" ON certifications
  FOR SELECT USING (true);

CREATE POLICY "Owner manage certifications" ON certifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM businesses b WHERE b.id = certifications.business_id AND b.claimed_by = auth.uid())
  );

CREATE POLICY "Admin manage all certifications" ON certifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Lab Results Table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  product_name text,
  test_type text CHECK (test_type IN (
    'identity', 'purity', 'potency', 'sterility', 'endotoxin', 'heavy_metals', 'other'
  )),
  result_url text NOT NULL,
  testing_lab text,
  test_date date,
  verified_by_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lab_results_biz_idx ON lab_results(business_id);

ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read lab results" ON lab_results
  FOR SELECT USING (true);

CREATE POLICY "Owner manage lab results" ON lab_results
  FOR ALL USING (
    EXISTS (SELECT 1 FROM businesses b WHERE b.id = lab_results.business_id AND b.claimed_by = auth.uid())
  );

CREATE POLICY "Admin manage all lab results" ON lab_results
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
