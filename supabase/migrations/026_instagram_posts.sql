-- Track Instagram posts for the InfoSylvita social automation bot.
-- Each row = one carousel post featuring a claimed business.

CREATE TABLE IF NOT EXISTS instagram_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    ig_media_id TEXT,
    caption TEXT,
    posted_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'failed', 'skipped')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_business ON instagram_posts(business_id);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_posted_at ON instagram_posts(posted_at DESC);

-- Allow the service role to read/write (bot uses service key, bypasses RLS).
-- Public reads are not needed — this table is internal.
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON instagram_posts
    FOR ALL
    USING (true)
    WITH CHECK (true);
