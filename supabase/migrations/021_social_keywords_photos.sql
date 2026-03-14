-- ============================================================
-- Migration 021: Social media, keywords, photos, reviews
-- ============================================================

-- Social media fields
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS tiktok text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS linkedin text;

-- Keywords for SEO
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS keywords text[];

-- Long description fields (500-800 word AI-generated)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS long_description_en text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS long_description_es text;

-- ============================================================
-- Table: business_photos (multiple photos per business)
-- ============================================================
CREATE TABLE IF NOT EXISTS business_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  photo_type text NOT NULL CHECK (photo_type IN ('logo', 'storefront', 'products', 'team', 'other')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS business_photos_biz_idx ON business_photos(business_id);

-- RLS for business_photos
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read photos" ON business_photos
  FOR SELECT USING (true);

CREATE POLICY "Owner manage photos" ON business_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM businesses b WHERE b.id = business_photos.business_id AND b.claimed_by = auth.uid())
  );

CREATE POLICY "Admin manage all photos" ON business_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- Table: reviews (pupusa rating system)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  owner_reply text,
  owner_replied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

CREATE INDEX IF NOT EXISTS reviews_biz_idx ON reviews(business_id);
CREATE INDEX IF NOT EXISTS reviews_user_idx ON reviews(user_id);

-- RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated insert review" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Own review update" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owner reply to reviews" ON reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = reviews.business_id
        AND b.claimed_by = auth.uid()
        AND b.subscription_tier IN ('premium', 'featured')
    )
  );

CREATE POLICY "Owner delete reviews" ON reviews
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = reviews.business_id
        AND b.claimed_by = auth.uid()
        AND b.subscription_tier IN ('premium', 'featured')
    )
  );

CREATE POLICY "Admin manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger for reviews updated_at
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
