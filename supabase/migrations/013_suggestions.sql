-- Suggestions table — lets users recommend cities, categories, business types, etc.
CREATE TABLE IF NOT EXISTS suggestions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type       text        NOT NULL CHECK (type IN ('city', 'category', 'business_type', 'other')),
  content    text        NOT NULL CHECK (char_length(content) BETWEEN 2 AND 500),
  email      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a suggestion (anon or authenticated)
CREATE POLICY "Anyone can insert suggestions"
  ON suggestions FOR INSERT
  WITH CHECK (true);

-- Only service role (admin) can read
CREATE POLICY "Admins can read suggestions"
  ON suggestions FOR SELECT
  USING (auth.role() = 'service_role');
