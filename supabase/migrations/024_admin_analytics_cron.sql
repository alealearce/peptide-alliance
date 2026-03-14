-- ── Migration 024: Admin monthly analytics report ────────────────────────────
-- Creates a Postgres helper function that aggregates all search & platform
-- stats in a single RPC call, and schedules the admin email on the 2nd of
-- each month at 09:00 UTC (one day after business-owner reports fire).

-- ── Helper: get_admin_monthly_report(since) ───────────────────────────────────
CREATE OR REPLACE FUNCTION get_admin_monthly_report(since timestamptz)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(

    -- ── Search volume ────────────────────────────────────────────────────
    'total_searches', (
      SELECT COUNT(*) FROM search_events WHERE created_at >= since
    ),

    -- ── Top queries (with zero-result flag) ──────────────────────────────
    'top_queries', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      FROM (
        SELECT
          query,
          COUNT(*)                                                      AS count,
          SUM(CASE WHEN result_count = 0 THEN 1 ELSE 0 END)::int       AS zero_result_count
        FROM search_events
        WHERE created_at >= since
          AND query IS NOT NULL
          AND query <> ''
        GROUP BY query
        ORDER BY count DESC
        LIMIT 15
      ) t
    ),

    -- ── Searches that returned zero results ───────────────────────────────
    'zero_result_queries', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      FROM (
        SELECT query, COUNT(*) AS count
        FROM search_events
        WHERE created_at >= since
          AND result_count = 0
          AND query IS NOT NULL
          AND query <> ''
        GROUP BY query
        ORDER BY count DESC
        LIMIT 15
      ) t
    ),

    -- ── Most browsed categories ───────────────────────────────────────────
    'top_categories', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      FROM (
        SELECT category, COUNT(*) AS count
        FROM search_events
        WHERE created_at >= since
          AND category IS NOT NULL
          AND category <> ''
        GROUP BY category
        ORDER BY count DESC
        LIMIT 10
      ) t
    ),

    -- ── Most searched cities ─────────────────────────────────────────────
    'top_cities', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      FROM (
        SELECT city, COUNT(*) AS count
        FROM search_events
        WHERE created_at >= since
          AND city IS NOT NULL
          AND city <> ''
        GROUP BY city
        ORDER BY count DESC
        LIMIT 10
      ) t
    ),

    -- ── Platform stats ────────────────────────────────────────────────────
    'new_businesses', (
      SELECT COUNT(*) FROM businesses
      WHERE created_at >= since AND is_active = true
    ),
    'total_businesses', (
      SELECT COUNT(*) FROM businesses WHERE is_active = true
    ),
    'premium_count', (
      SELECT COUNT(*) FROM businesses
      WHERE subscription_tier IN ('premium', 'featured') AND is_active = true
    ),
    'new_leads', (
      SELECT COUNT(*) FROM leads WHERE created_at >= since
    ),
    'new_premium_upgrades', (
      SELECT COUNT(*) FROM subscription_events
      WHERE created_at >= since
        AND event_type ILIKE '%checkout.session.completed%'
    )

  ) INTO result;

  RETURN result;
END;
$$;

-- Allow the service-role (used by edge functions) to call this function
GRANT EXECUTE ON FUNCTION get_admin_monthly_report(timestamptz) TO service_role;


-- ── pg_cron: 2nd of month, 09:00 UTC ─────────────────────────────────────────
-- Runs one day after business-owner performance reports (1st at 08:00 UTC).
SELECT cron.schedule(
  'send-admin-analytics',
  '0 9 2 * *',
  $$
  SELECT extensions.http_post(
    url     := 'https://jypneygzfjwknimanvxm.supabase.co/functions/v1/send-admin-analytics',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cG5leWd6Zmp3a25pbWFudnhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2Mjg0OCwiZXhwIjoyMDg3NzM4ODQ4fQ.e49Kz9ZEOkdIUG7E5NYCpZRY46AIlUkQsjGYTHFH41E'
    ),
    body    := '{}'::jsonb
  ) AS request_id;
  $$
);
