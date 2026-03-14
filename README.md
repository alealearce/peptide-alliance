# Directory Framework

A config-driven local business directory built with Next.js, Supabase, and Stripe.
Spin up a new niche directory in a few hours by editing two files.

## What's included

- Business listings with categories, subcategories, cities, search, and SEO pages
- Business claim & ownership flow
- Premium / Featured subscription tiers (Stripe)
- Admin dashboard (approve, manage, newsletter)
- AI-powered chatbot widget (Claude)
- AI description generation for listings
- Lead contact forms with email notifications
- Photo gallery, reviews, map embed
- Instagram bot for daily carousel posts (see `/instagram-bot`)
- Bilingual support (optional — toggle in config)

---

## Quick start: spinning up a new niche

### 1. Edit `lib/config/site.ts`

This is the **only file** with niche-specific values. Fill in:
- `SITE` — name, tagline, domain, support email
- `COLORS` — brand colors (also update `tailwind.config.ts`)
- `GEO` — country and cities covered
- `I18N` — set `multilingual: false` for English-only directories
- `CHATBOT` — assistant name and persona
- `COPY` — homepage headlines and body copy

### 2. Edit `lib/config/categories.ts`

Replace the placeholder categories with your niche's real categories.
Each category becomes a URL segment and a filterable group in the directory.

### 3. Update `tailwind.config.ts`

Copy your brand colors from `site.ts` into the color constants at the top of
`tailwind.config.ts`. Both files need to stay in sync (Tailwind runs at build time).

### 4. Replace images

| File | Usage |
|------|-------|
| `/public/images/logo.png` | Nav logo (40×40) |
| `/public/images/og-image.png` | Social share preview (1200×630) |
| `/public/images/mascots/` | Category icons (optional) |

### 5. Create a new Supabase project

```bash
# Install Supabase CLI if needed
brew install supabase/tap/supabase

# Log in and link to your new project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Apply all migrations
supabase db push
```

> ⚠️ Each niche needs its own Supabase project. Never share a database between niches.

### 6. Set environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 7. Install and run

```bash
npm install
npm run dev
```

### 8. Deploy

Connect the repo to [Vercel](https://vercel.com), add environment variables, deploy.

---

## Project structure

```
lib/config/
  site.ts           ← START HERE — all niche-specific values
  categories.ts     ← Define your directory's categories

tailwind.config.ts  ← Copy brand colors from site.ts here too

app/                ← Next.js App Router pages
components/         ← UI components (all read from site.ts config)
lib/
  ai/claude.ts      ← Chatbot + AI description generation
  email/resend.ts   ← All email templates
  supabase/         ← DB client helpers
supabase/
  migrations/       ← Apply these to your new Supabase project
```

---

## Updating all niches when you improve the framework

Since each niche is a separate repo (not a shared instance), propagate updates manually:

1. Make your improvement in `directory-framework`
2. Copy changed files into the relevant niche repos
3. The two config files (`site.ts`, `categories.ts`) are per-niche — never overwrite them

---

## Directories built from this framework

| Directory | Domain | Niche | Status |
|-----------|--------|-------|--------|
| *(your first niche here)* | — | — | In progress |
