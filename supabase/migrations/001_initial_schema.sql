-- ============================================================
-- InfoSylvita — Initial Schema Migration
-- ============================================================

-- Extensions
create extension if not exists pg_trgm;
create extension if not exists pg_cron;

-- ============================================================
-- Table: businesses
-- ============================================================
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description_en text,
  description_es text,
  category text not null check (category in (
    'comida', 'servicios_profesionales', 'servicios_personales',
    'salud', 'eventos', 'trabajos'
  )),
  subcategory text not null,
  city text not null,
  province text not null,
  address text,
  phone text,
  email text,
  website text,
  instagram text,
  google_maps_url text,
  rating numeric(3,1),
  review_count integer default 0,
  is_verified boolean default false,
  is_premium boolean default false,
  is_active boolean default true,
  latin_confidence integer default 0 check (latin_confidence between 0 and 100),
  claimed_by uuid references auth.users(id),
  source text default 'google_places' check (source in ('google_places','manual','claimed')),
  source_id text,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_scraped_at timestamptz
);

-- Full text search index
create index if not exists businesses_search_idx on businesses
  using gin((
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description_en,'') || ' ' ||
    coalesce(city,'') || ' ' || coalesce(subcategory,''))
  ));

create index if not exists businesses_trgm_idx on businesses using gin(name gin_trgm_ops);

-- ============================================================
-- Table: profiles
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'user' check (role in ('admin','business_owner','user')),
  business_id uuid references businesses(id),
  email text,
  created_at timestamptz default now()
);

-- ============================================================
-- Table: leads
-- ============================================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  user_phone text,
  message text,
  notified boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Table: scrape_jobs
-- ============================================================
create table if not exists scrape_jobs (
  id uuid primary key default gen_random_uuid(),
  status text default 'pending' check (status in ('pending','running','complete','failed')),
  category text,
  subcategory text,
  city text,
  records_found integer default 0,
  records_added integer default 0,
  records_updated integer default 0,
  error_log text,
  run_at timestamptz default now()
);

-- ============================================================
-- RLS Policies — businesses
-- ============================================================
alter table businesses enable row level security;

drop policy if exists "Public read active" on businesses;
create policy "Public read active" on businesses
  for select using (is_active = true);

drop policy if exists "Owner update own" on businesses;
create policy "Owner update own" on businesses
  for update using (auth.uid() = claimed_by);

drop policy if exists "Admin full access" on businesses;
create policy "Admin full access" on businesses
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- RLS Policies — leads
-- ============================================================
alter table leads enable row level security;

drop policy if exists "Owner reads leads" on leads;
create policy "Owner reads leads" on leads
  for select using (
    exists (
      select 1 from businesses b
      where b.id = leads.business_id and b.claimed_by = auth.uid()
    )
  );

drop policy if exists "Anyone can insert lead" on leads;
create policy "Anyone can insert lead" on leads
  for insert with check (true);

drop policy if exists "Admin reads all leads" on leads;
create policy "Admin reads all leads" on leads
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- RLS Policies — profiles
-- ============================================================
alter table profiles enable row level security;

drop policy if exists "Own profile" on profiles;
create policy "Own profile" on profiles
  for all using (auth.uid() = id);

drop policy if exists "Admin reads all" on profiles;
create policy "Admin reads all" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- RLS Policies — scrape_jobs
-- ============================================================
alter table scrape_jobs enable row level security;

drop policy if exists "Admin only" on scrape_jobs;
create policy "Admin only" on scrape_jobs
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_updated_at on businesses;
create trigger businesses_updated_at
  before update on businesses
  for each row execute function update_updated_at();

-- ============================================================
-- Trigger: auto-create profile on new user signup
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
