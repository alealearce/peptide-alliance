-- ============================================================
-- InfoSylvita — Migration 007: Listing Views
-- ============================================================
-- Tracks page views for each business profile.
-- Used by the monthly performance report edge function.
-- The business owner's own views are NOT counted (filtered in code).
-- ============================================================

create table if not exists listing_views (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid references businesses(id) on delete cascade not null,
  viewer_ip    text,                -- hashed before storage in the app layer
  referrer     text,               -- HTTP referrer (truncated to 500 chars)
  created_at   timestamptz default now()
);

-- Fast aggregation: count views for a business in a date range
create index if not exists listing_views_business_date_idx
  on listing_views (business_id, created_at desc);

-- Allow bulk deletes of old rows without full-table scan
create index if not exists listing_views_date_idx
  on listing_views (created_at desc);

alter table listing_views enable row level security;

-- Owners can see view counts for their own listings
drop policy if exists "Owner reads own listing views" on listing_views;
create policy "Owner reads own listing views" on listing_views
  for select using (
    exists (
      select 1 from businesses b
      where b.id = listing_views.business_id
        and b.claimed_by = auth.uid()
    )
  );

-- Admins see everything
drop policy if exists "Admin reads all listing views" on listing_views;
create policy "Admin reads all listing views" on listing_views
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Inserts are done server-side only via service role — no public insert.
