-- ============================================================
-- InfoSylvita — Migration 016: Fix infinite RLS recursion
-- ============================================================
-- PROBLEM:
--   The "Admin reads all" policy on `profiles` did:
--     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
--   Querying profiles under RLS triggers that same policy, which
--   queries profiles again → infinite recursion.
--   This broke EVERY query that evaluated any admin policy across
--   businesses, leads, blog_posts, listing_views, newsletter, etc.
--
-- FIX:
--   Create a SECURITY DEFINER function `public.is_admin()` that
--   bypasses RLS (runs as the DB owner). All admin RLS policies
--   now call is_admin() instead of subquerying profiles directly.
-- ============================================================

-- ── Helper: admin check that bypasses RLS ────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── businesses ────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access" ON businesses;
CREATE POLICY "Admin full access" ON businesses
  FOR ALL USING (public.is_admin());

-- ── leads ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin reads all leads" ON leads;
CREATE POLICY "Admin reads all leads" ON leads
  FOR SELECT USING (public.is_admin());

-- ── profiles ──────────────────────────────────────────────────
-- THIS was the root cause — now uses is_admin() (no self-reference)
DROP POLICY IF EXISTS "Admin reads all" ON profiles;
CREATE POLICY "Admin reads all" ON profiles
  FOR SELECT USING (public.is_admin());

-- ── scrape_jobs ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin only" ON scrape_jobs;
CREATE POLICY "Admin only" ON scrape_jobs
  FOR ALL USING (public.is_admin());

-- ── subscription_events ───────────────────────────────────────
DROP POLICY IF EXISTS "Admin only subscription events" ON subscription_events;
CREATE POLICY "Admin only subscription events" ON subscription_events
  FOR ALL USING (public.is_admin());

-- ── upgrade_emails_sent ───────────────────────────────────────
DROP POLICY IF EXISTS "Admin only upgrade emails" ON upgrade_emails_sent;
CREATE POLICY "Admin only upgrade emails" ON upgrade_emails_sent
  FOR ALL USING (public.is_admin());

-- ── search_events ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin reads search events" ON search_events;
CREATE POLICY "Admin reads search events" ON search_events
  FOR ALL USING (public.is_admin());

-- ── listing_views ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin reads all listing views" ON listing_views;
CREATE POLICY "Admin reads all listing views" ON listing_views
  FOR ALL USING (public.is_admin());

-- ── blog_posts ────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin manages blog posts" ON blog_posts;
CREATE POLICY "Admin manages blog posts" ON blog_posts
  FOR ALL USING (public.is_admin());

-- ── newsletter_subscribers ────────────────────────────────────
DROP POLICY IF EXISTS "Admin manages newsletter" ON newsletter_subscribers;
CREATE POLICY "Admin manages newsletter" ON newsletter_subscribers
  FOR ALL USING (public.is_admin());
