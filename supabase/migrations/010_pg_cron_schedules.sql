-- ── Migration 010: pg_cron schedules for automated edge functions ─────────────
-- Requires: pg_cron and pg_net extensions (enabled via Supabase dashboard)
-- Edge functions must be deployed before these schedules will work.
--
-- Schedule summary:
--   send-upgrade-offers   → Every Monday at 09:00 UTC
--   send-performance-reports → 1st of month at 08:00 UTC
--   generate-blog-posts   → 1st of month at 00:00 UTC
--   send-newsletter       → 15th of month at 10:00 UTC

-- Enable required extensions
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net  with schema extensions;

-- Grant cron usage to postgres role (required by Supabase)
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- ── 1. Weekly upgrade offer emails (every Monday 09:00 UTC) ──────────────────
select cron.schedule(
  'send-upgrade-offers',
  '0 9 * * 1',
  $$
  select extensions.http_post(
    url    := 'https://jypneygzfjwknimanvxm.supabase.co/functions/v1/send-upgrade-offers',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cG5leWd6Zmp3a25pbWFudnhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2Mjg0OCwiZXhwIjoyMDg3NzM4ODQ4fQ.e49Kz9ZEOkdIUG7E5NYCpZRY46AIlUkQsjGYTHFH41E'
    ),
    body   := '{}'::jsonb
  ) as request_id;
  $$
);

-- ── 2. Monthly performance reports (1st of month 08:00 UTC) ─────────────────
select cron.schedule(
  'send-performance-reports',
  '0 8 1 * *',
  $$
  select extensions.http_post(
    url    := 'https://jypneygzfjwknimanvxm.supabase.co/functions/v1/send-performance-reports',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cG5leWd6Zmp3a25pbWFudnhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2Mjg0OCwiZXhwIjoyMDg3NzM4ODQ4fQ.e49Kz9ZEOkdIUG7E5NYCpZRY46AIlUkQsjGYTHFH41E'
    ),
    body   := '{}'::jsonb
  ) as request_id;
  $$
);

-- ── 3. Monthly blog generation (1st of month 00:00 UTC) ─────────────────────
select cron.schedule(
  'generate-blog-posts',
  '0 0 1 * *',
  $$
  select extensions.http_post(
    url    := 'https://jypneygzfjwknimanvxm.supabase.co/functions/v1/generate-blog-posts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cG5leWd6Zmp3a25pbWFudnhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2Mjg0OCwiZXhwIjoyMDg3NzM4ODQ4fQ.e49Kz9ZEOkdIUG7E5NYCpZRY46AIlUkQsjGYTHFH41E'
    ),
    body   := '{}'::jsonb
  ) as request_id;
  $$
);

-- ── 4. Monthly newsletter send (15th of month 10:00 UTC) ────────────────────
select cron.schedule(
  'send-newsletter',
  '0 10 15 * *',
  $$
  select extensions.http_post(
    url    := 'https://jypneygzfjwknimanvxm.supabase.co/functions/v1/send-newsletter',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cG5leWd6Zmp3a25pbWFudnhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2Mjg0OCwiZXhwIjoyMDg3NzM4ODQ4fQ.e49Kz9ZEOkdIUG7E5NYCpZRY46AIlUkQsjGYTHFH41E'
    ),
    body   := '{}'::jsonb
  ) as request_id;
  $$
);
