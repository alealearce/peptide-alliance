-- Add product_url to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_url text;

-- Business blog posts (Featured + Industry Leader perk)
CREATE TABLE IF NOT EXISTS business_blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  auto_generated boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view business blog posts"
  ON business_blog_posts FOR SELECT USING (true);

CREATE POLICY "Owner can manage business blog posts"
  ON business_blog_posts FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = business_id
        AND businesses.claimed_by = auth.uid()
    )
  );
