-- ── Migration 012: logo_url column + business-images storage bucket ──────────

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS logo_url text;

-- ── Supabase Storage: business-images bucket ─────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-images',
  'business-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read images (public bucket)
CREATE POLICY "Public read business images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated upload business images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'business-images');
