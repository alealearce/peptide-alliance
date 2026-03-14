-- ============================================================
-- InfoSylvita — Migration 009: Newsletter Subscribers
-- ============================================================
-- Stores newsletter subscribers with unsubscribe tokens.
-- Each subscriber has a cryptographically random token used
-- in the one-click unsubscribe link (no login required).
-- ============================================================

-- pgcrypto is required for gen_random_bytes
-- Supabase installs extensions in the `extensions` schema; use fully-qualified name.
create extension if not exists pgcrypto with schema extensions;

create table if not exists newsletter_subscribers (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique not null,
  preferred_language  text default 'es'
    check (preferred_language in ('en', 'es')),
  city                text,
  subscribed          boolean default true,
  unsubscribe_token   text unique
    default encode(extensions.gen_random_bytes(32), 'hex'),
  created_at          timestamptz default now()
);

-- Lookup by email (enforce unique + fast inserts)
create index if not exists newsletter_email_idx
  on newsletter_subscribers (email);

-- Lookup by token for the unsubscribe route
create index if not exists newsletter_token_idx
  on newsletter_subscribers (unsubscribe_token);

-- Active subscribers by language for the monthly send
create index if not exists newsletter_active_lang_idx
  on newsletter_subscribers (preferred_language, subscribed)
  where subscribed = true;

alter table newsletter_subscribers enable row level security;

-- Anyone can subscribe (public insert)
drop policy if exists "Anyone can subscribe" on newsletter_subscribers;
create policy "Anyone can subscribe" on newsletter_subscribers
  for insert with check (true);

-- Unsubscribe by token — the app's API route uses service role,
-- so this policy covers direct Postgres access.
drop policy if exists "Unsubscribe by token" on newsletter_subscribers;
create policy "Unsubscribe by token" on newsletter_subscribers
  for update using (true);

-- Admins can view + manage all subscribers
drop policy if exists "Admin manages newsletter" on newsletter_subscribers;
create policy "Admin manages newsletter" on newsletter_subscribers
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
