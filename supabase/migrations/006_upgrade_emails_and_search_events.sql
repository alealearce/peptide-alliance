-- ============================================================
-- InfoSylvita — Migration 006: Upgrade Emails + Search Events
-- ============================================================
-- upgrade_emails_sent: tracks which businesses received upgrade
--   offer emails so we don't spam them more than once per 60 days.
-- search_events: lightweight log of searches used to show
--   "X people searched your category this month" in upgrade emails.
-- profiles.preferred_language: used to send emails in the right
--   language (default 'es' for the InfoSylvita audience).
-- ============================================================

-- ── Extend profiles table ─────────────────────────────────────
alter table profiles
  add column if not exists preferred_language text default 'es'
    check (preferred_language in ('en', 'es'));

-- ── Table: upgrade_emails_sent ────────────────────────────────
create table if not exists upgrade_emails_sent (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid references businesses(id) on delete cascade,
  email_type   text not null,  -- 'leads_waiting' | 'boost_visibility'
  sent_at      timestamptz default now()
);

create index if not exists upgrade_emails_business_sent_idx
  on upgrade_emails_sent (business_id, sent_at desc);

alter table upgrade_emails_sent enable row level security;

drop policy if exists "Admin only upgrade emails" on upgrade_emails_sent;
create policy "Admin only upgrade emails" on upgrade_emails_sent
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ── Table: search_events ─────────────────────────────────────
-- Lightweight record of every search — used for stats in emails
-- and performance reports. Soft-capped by the server (no PII stored).
create table if not exists search_events (
  id          uuid primary key default gen_random_uuid(),
  query       text,
  category    text,
  city        text,
  result_count integer default 0,
  created_at  timestamptz default now()
);

-- Partition-friendly index: filter by category + date
create index if not exists search_events_category_date_idx
  on search_events (category, created_at desc);

-- Auto-purge rows older than 12 months to keep the table lean.
-- Wire this up with pg_cron after deployment.
-- select cron.schedule('purge-old-search-events','0 3 1 * *',
--   $$delete from search_events where created_at < now() - interval '12 months'$$);

alter table search_events enable row level security;

drop policy if exists "Admin reads search events" on search_events;
create policy "Admin reads search events" on search_events
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Search events are inserted server-side only (service role bypasses RLS).
-- No public insert policy needed.
