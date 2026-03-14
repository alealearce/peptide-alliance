-- ============================================================
-- InfoSylvita — Migration 008: AI Blog Posts
-- ============================================================
-- Stores AI-generated bilingual blog posts. All posts are
-- draft (is_published = false) until an admin reviews and
-- approves them in Supabase Studio or the admin panel.
-- ============================================================

create table if not exists blog_posts (
  id                  uuid primary key default gen_random_uuid(),
  title_en            text not null,
  title_es            text not null,
  slug                text unique not null,
  content_en          text not null,
  content_es          text not null,
  excerpt_en          text,
  excerpt_es          text,
  category            text,
  city                text,
  is_published        boolean default false,
  meta_title_en       text,
  meta_title_es       text,
  meta_description_en text,
  meta_description_es text,
  generated_by        text default 'claude',
  reviewed_by         uuid references auth.users(id),
  published_at        timestamptz,
  created_at          timestamptz default now()
);

-- Fast lookup: published posts sorted by date (blog index page)
create index if not exists blog_posts_published_date_idx
  on blog_posts (is_published, published_at desc)
  where is_published = true;

-- Slug lookup for ISR blog post pages
create index if not exists blog_posts_slug_idx
  on blog_posts (slug);

-- Category + city filter for blog index
create index if not exists blog_posts_category_city_idx
  on blog_posts (category, city)
  where is_published = true;

alter table blog_posts enable row level security;

-- Anyone can read published posts (used by blog index + ISR pages)
drop policy if exists "Public reads published blog posts" on blog_posts;
create policy "Public reads published blog posts" on blog_posts
  for select using (is_published = true);

-- Admins can do everything (review, publish, delete)
drop policy if exists "Admin manages blog posts" on blog_posts;
create policy "Admin manages blog posts" on blog_posts
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
