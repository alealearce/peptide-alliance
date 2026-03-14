-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 028: Peptide Alliance — 4-Tier Subscription Model
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Update subscription_tier constraint for 4 tiers
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_subscription_tier_check;
ALTER TABLE businesses ADD CONSTRAINT businesses_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'verified', 'featured', 'industry_leader'));

-- 2. Migrate existing premium → verified
UPDATE businesses SET subscription_tier = 'verified' WHERE subscription_tier = 'premium';

-- 3. Update currency default to USD
ALTER TABLE subscription_events ALTER COLUMN currency SET DEFAULT 'usd';

-- 4. Simplify preferred_language to English only (UPDATE first, then add constraint)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_preferred_language_check;
UPDATE profiles SET preferred_language = 'en' WHERE preferred_language != 'en';
ALTER TABLE profiles ADD CONSTRAINT profiles_preferred_language_check
  CHECK (preferred_language IN ('en'));

-- 5. Remove Spanish fields from blog_posts
ALTER TABLE blog_posts DROP COLUMN IF EXISTS title_es;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS content_es;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS excerpt_es;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS meta_title_es;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS meta_description_es;

-- 6. Add index for tier-based sorting (industry_leader first)
CREATE INDEX IF NOT EXISTS businesses_tier_idx
  ON businesses(subscription_tier DESC, is_verified DESC, rating DESC NULLS LAST)
  WHERE is_active = true;
