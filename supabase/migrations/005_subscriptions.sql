-- ============================================================
-- InfoSylvita — Migration 005: Subscription Tracking
-- ============================================================
-- Adds subscription columns to businesses and creates the
-- subscription_events audit log table.
-- ============================================================

-- ── Extend businesses table ───────────────────────────────────
alter table businesses
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_tier text default 'free'
    check (subscription_tier in ('free', 'premium', 'featured')),
  add column if not exists subscription_started_at timestamptz,
  add column if not exists subscription_ends_at timestamptz;

-- Back-fill existing rows: any business already marked is_premium
-- gets 'premium' tier so data is consistent.
update businesses
  set subscription_tier = 'premium'
  where is_premium = true
    and subscription_tier = 'free';

-- ── Table: subscription_events ────────────────────────────────
-- Immutable audit log of every Stripe event we process.
create table if not exists subscription_events (
  id               uuid primary key default gen_random_uuid(),
  business_id      uuid references businesses(id) on delete cascade,
  stripe_event_id  text unique not null,
  event_type       text not null,
  tier             text,
  amount           numeric,
  currency         text default 'cad',
  created_at       timestamptz default now()
);

create index if not exists subscription_events_business_idx
  on subscription_events (business_id, created_at desc);

-- ── RLS ───────────────────────────────────────────────────────
alter table subscription_events enable row level security;

drop policy if exists "Admin only subscription events" on subscription_events;
create policy "Admin only subscription events" on subscription_events
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Owner reads own events" on subscription_events;
create policy "Owner reads own events" on subscription_events
  for select using (
    exists (
      select 1 from businesses b
      where b.id = subscription_events.business_id
        and b.claimed_by = auth.uid()
    )
  );
