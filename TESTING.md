# Directory Framework — Pre-Launch Testing Checklist

> Complete every section before adding real businesses.
> Mark each item ✅ PASS, ❌ FAIL, or ⏭️ SKIP (with reason).
> Last automated run: 2026-03-01 — 22/24 passed (2 bugs now fixed).

---

## 1. PUBLIC PAGES

### 1.1 Homepage (`/en` and `/es`)
- [ ] Page loads without errors
- [ ] Banner hero image displays correctly and fills width
- [ ] Search bar is visible at bottom-right of hero
- [ ] Category grid shows all 6 categories with correct icons
- [ ] "Featured Businesses" section shows empty-state CTA (no businesses yet)
- [ ] Newsletter signup section is present and visible
- [ ] CTA banner at bottom loads correctly
- [ ] Navbar shows InfoSylvita logo + links
- [ ] Footer is visible with links
- [ ] Chatbot button (Sylvita) is visible in bottom-right corner
- [ ] Language switcher changes between EN ↔ ES correctly
- [ ] All text is in the correct language per locale

### 1.2 Search Page (`/en/search`)
- [ ] Page loads without errors
- [ ] Search input is functional (type a query, results appear or empty state shows)
- [ ] Category filter dropdown works
- [ ] City filter dropdown works
- [ ] "Verified only" toggle works (should show 0 results until businesses are verified)
- [ ] Empty state message is shown when no results
- [ ] Pagination controls appear when results exceed 12
- [ ] Search event is logged (check Supabase `search_events` table after a search)

### 1.3 Category Pages (`/en/comida`, `/en/salud`, etc.)
- [ ] `/en/comida` loads (200)
- [ ] `/en/servicios_profesionales` loads (200)
- [ ] `/en/servicios_personales` loads (200)
- [ ] `/en/salud` loads (200)
- [ ] `/en/eventos` loads (200)
- [ ] `/en/trabajos` loads (200)
- [ ] Subcategory pages load (e.g. `/en/comida/restaurant`)
- [ ] Empty state is shown (no businesses yet)
- [ ] Spanish equivalents all load (`/es/comida`, etc.)

### 1.4 Blog (`/en/blog`)
- [ ] Blog index page loads
- [ ] Empty state message shows (no posts yet) or posts list appears
- [ ] Individual blog post pages load if any posts exist
- [ ] Newsletter signup appears in sidebar/bottom

### 1.5 Claim Page (`/en/claim`)
- [ ] Page loads correctly
- [ ] Search input for finding a business works
- [ ] "No results" state shows option to submit new business
- [ ] Step indicator is visible

### 1.6 Login Page (`/en/login`)
- [ ] Page loads
- [ ] Email/password fields are visible
- [ ] Sign up / Sign in toggle works
- [ ] Form validation fires on empty submit

### 1.7 Upgrade Page (`/en/upgrade`)
- [ ] Pricing cards display (Free, Premium, Featured tiers)
- [ ] Prices are shown in CAD
- [ ] "14-day free trial" badge is visible
- [ ] CTA buttons are present

### 1.8 Error & 404 Pages
- [ ] Visit `/en/this-does-not-exist` → custom 404 page shows (not a blank Next.js error)
- [ ] 404 page shows Sylvita mascot and links back to home
- [ ] English and Spanish 404 pages both work

### 1.9 SEO & Meta
- [ ] `https://infosylvita.com/sitemap.xml` returns XML with 90+ URLs ✅ (verified)
- [ ] `https://infosylvita.com/robots.txt` shows correct disallow rules ✅ (verified)
- [ ] `https://infosylvita.com/opengraph-image` returns an image (200) ✅ (now fixed)
- [ ] Paste `https://infosylvita.com/en` into https://opengraph.xyz — preview image shows
- [ ] Page `<title>` tags are correct in both EN and ES
- [ ] `<html lang="...">` attribute is `en` on `/en` and `es` on `/es`

---

## 2. AUTHENTICATION FLOWS

### 2.1 Sign Up (New User)
- [ ] Go to `/en/login`
- [ ] Click "Create account" / sign-up toggle
- [ ] Enter a **real email you can access** + password (min 8 chars)
- [ ] Submit — should show "Check your email" confirmation
- [ ] Check email inbox for Supabase confirmation email
- [ ] Click confirmation link — should redirect to app and be logged in
- [ ] Check Supabase Dashboard → Auth → Users — new user appears

### 2.2 Sign In (Existing User)
- [ ] Go to `/en/login`
- [ ] Enter credentials for the account created above
- [ ] Submit — should redirect to `/en/dashboard`
- [ ] Navbar should reflect logged-in state (if implemented)

### 2.3 Auth Guard — Dashboard
- [ ] While **logged out**, visit `/en/dashboard` → should redirect to `/en/login`
- [ ] While **logged in**, visit `/en/dashboard` → should load dashboard
- [ ] Dashboard shows "No active listing" state (no business claimed yet)

### 2.4 Auth Guard — Admin
- [ ] While **logged out**, visit `/en/admin` → should redirect to `/en/login`
- [ ] While **logged in as regular user**, visit `/en/admin` → should redirect to home
- [ ] While **logged in as admin**, visit `/en/admin` → should load admin dashboard

### 2.5 Sign Out
- [ ] Click sign out (if available in navbar/dashboard)
- [ ] Should return to login or homepage
- [ ] Visiting `/en/dashboard` after sign-out redirects to login

---

## 3. CHATBOT (SYLVITA)

- [ ] Chatbot button appears in bottom-right on all pages
- [ ] Clicking it opens the chat window
- [ ] InfoSylvita logo appears in the chat header
- [ ] Send a message in Spanish: *"Hola Sylvita, busco un restaurante latino en Toronto"*
  - Expected: Sylvita replies in Spanish with helpful info ✅ (verified in automated test)
- [ ] Send a message in English: *"Hi Sylvita, what services do you offer?"*
  - Expected: Sylvita replies in English maintaining her abuela persona
- [ ] Typing indicator (3 dots) appears while waiting for response
- [ ] Chat history scrolls correctly when multiple messages accumulate
- [ ] Close (X) button closes the chat window
- [ ] Reopening chat shows the greeting again (fresh session)

---

## 4. NEWSLETTER

### 4.1 Subscribe
- [ ] Newsletter signup form is visible on Homepage and Blog pages
- [ ] Enter a real email address + city
- [ ] Select language preference (EN or ES)
- [ ] Submit → success message appears
- [ ] Check Supabase Dashboard → `newsletter_subscribers` table — email is present with `subscribed: true`
- [ ] `unsubscribe_token` column is populated (UUID format)

### 4.2 Unsubscribe
- [ ] Go to `/en/unsubscribe?token=[TOKEN_FROM_DB]`
- [ ] Page shows confirmation of unsubscribe
- [ ] Check Supabase Dashboard → `newsletter_subscribers` — `subscribed` is now `false`
- [ ] Visiting with an invalid token shows an error message

### 4.3 Duplicate Email
- [ ] Try subscribing with the same email again
- [ ] Should show "already subscribed" message or silently succeed (no duplicate rows)

---

## 5. CLAIM A BUSINESS FLOW

### 5.1 Claim Existing Business (once businesses are added)
> Skip this section until at least one business is in the database.

- [ ] Go to `/en/claim`
- [ ] Search for a business name that exists in the DB
- [ ] Select it from results
- [ ] Proceeds to auth step (sign in or sign up)
- [ ] After auth, business is linked to the user's profile
- [ ] Dashboard shows the claimed business
- [ ] Supabase: `businesses.claimed_by` is set to the user's UUID
- [ ] Supabase: `profiles.business_id` is set to the business UUID

### 5.2 Submit New Business
- [ ] Go to `/en/claim`
- [ ] Search for a business that does NOT exist
- [ ] "Add my business" button appears
- [ ] Fill in: Name, Category, City, Province, Address, Phone, Website
- [ ] Proceed to auth step
- [ ] After auth, new business is created
- [ ] Check Supabase: new row in `businesses` with `is_active: false` (pending approval)
- [ ] Check Supabase: `source: 'claimed'`
- [ ] Logged-in user's dashboard shows the pending business
- [ ] Admin panel shows the new pending business for approval

---

## 6. BUSINESS OWNER DASHBOARD

> Requires a claimed business. Test after claiming one.

- [ ] Dashboard loads at `/en/dashboard`
- [ ] Business name and details are shown
- [ ] **UpgradeBanner** appears for free-tier businesses
- [ ] Lead messages section shows "No leads yet" (initially)
- [ ] Edit listing form is accessible (name, description, phone, website, etc.)
- [ ] Saving edited details updates the business in Supabase
- [ ] View count is displayed (may show 0 initially)

---

## 7. ADMIN PANEL

> Requires admin account. Admin email is set in migration `002_admin_user.sql`.

### 7.1 Access
- [ ] Sign in with admin credentials
- [ ] Navigate to `/en/admin`
- [ ] Admin dashboard loads (not redirected away)
- [ ] Stats cards show: Blog Drafts count, Pending Businesses count, Subscriber count

### 7.2 Blog Post Management
- [ ] Blog drafts table is visible (empty until edge function runs or manual insert)
- [ ] **Publish** button on a draft → post moves to published
  - Check: `blog_posts.is_published = true` in Supabase
  - Check: post appears at `/en/blog`
- [ ] **Delete** button on a draft → post is removed
  - Check: row is deleted from `blog_posts` in Supabase

### 7.3 Business Approval
- [ ] Submit a new business via claim flow (5.2 above)
- [ ] Pending business appears in admin panel table
- [ ] **Approve** button → business becomes active
  - Check: `businesses.is_active = true` in Supabase
  - Check: business appears in search/category pages
- [ ] **Reject** button → business record is deleted
  - Check: row removed from `businesses` in Supabase

---

## 8. STRIPE / UPGRADE FLOW

> Use Stripe **test mode** cards. Never use real card data for testing.
> Test card: `4242 4242 4242 4242` | Any future expiry | Any CVC

### 8.1 Upgrade Page
- [ ] Visit `/en/upgrade` while logged in with a claimed business
- [ ] Both Premium and Featured tier cards display with prices
- [ ] Clicking upgrade button creates a Stripe Checkout session
- [ ] Redirected to Stripe-hosted checkout page
- [ ] Enter test card details and complete checkout
- [ ] Redirected to `/en/upgrade/success`
- [ ] Success page shows correct tier name and next steps

### 8.2 Post-Upgrade Verification
- [ ] Dashboard shows updated subscription tier (Premium or Featured)
- [ ] **UpgradeBanner is no longer shown** for paid tier businesses
- [ ] Check Supabase: `businesses.subscription_tier` = `'premium'` or `'featured'`
- [ ] Check Supabase: `businesses.stripe_subscription_id` is populated
- [ ] Check Supabase: `subscription_events` table has a new row for the event

### 8.3 Stripe Webhook (Verify in Stripe Dashboard)
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Confirm `checkout.session.completed` event was received and processed (200 response)
- [ ] Confirm endpoint URL is `https://infosylvita.com/api/stripe/webhook`

---

## 9. LEAD FORM (CONTACT BUSINESS)

> Requires at least one active, claimed business in the database.

- [ ] Visit a business profile page (`/en/business/[slug]`)
- [ ] Lead contact form is visible in the sidebar
- [ ] Fill in: Name, Email, Phone (optional), Message
- [ ] Submit form
- [ ] Success message appears ("Message sent!" or similar)
- [ ] Check Supabase: new row in `leads` table with `business_id` matching the business
- [ ] If business has a claimed owner with email: owner receives email notification
  - Check Resend Dashboard → Emails for the notification

---

## 10. VIEW TRACKING

- [ ] Visit any business profile page
- [ ] Check Supabase: new row in `listing_views` with the correct `business_id`
- [ ] `viewer_ip` is hashed (not stored as plain text)
- [ ] Refresh the same page — should NOT add a duplicate view (debounce check)
- [ ] View count on business dashboard increments after a visit

---

## 11. RESPONSIVE DESIGN

Test at these viewport sizes (use Chrome DevTools or resize browser):

| Size | Width | Test |
|------|-------|------|
| Mobile S | 375px | [ ] Hero image, navbar, search bar visible and usable |
| Mobile L | 425px | [ ] Same as above |
| Tablet | 768px | [ ] Layout shifts to tablet view, category grid is 2-3 cols |
| Laptop | 1024px | [ ] Full navbar visible, hero 3-col layout |
| Desktop | 1440px | [ ] Full desktop layout, hero at max width |

### Hero Image Responsive Check
- [ ] At 1440px: full image visible, no height cropping
- [ ] At 1024px: image scales proportionally with full height visible
- [ ] At 768px: sides of image start to crop, height maintained
- [ ] At 375px: sides cropped, search bar accessible at bottom

### Chatbot
- [ ] Chatbot button is visible on mobile
- [ ] Chat window doesn't overflow screen on mobile (375px)

---

## 12. BILINGUAL (EN / ES)

- [ ] `/en/...` routes display English text throughout
- [ ] `/es/...` routes display Spanish text throughout
- [ ] Language switcher in navbar toggles between both
- [ ] Switching language preserves the current page (e.g., `/en/blog` → `/es/blog`)
- [ ] Category names translate correctly (e.g., "Food" → "Comida")
- [ ] Search placeholder text is in the correct language
- [ ] Chatbot responds in the appropriate language
- [ ] Newsletter subscribe form shows in the locale's language
- [ ] Error messages and validation text are translated

---

## 13. EDGE FUNCTIONS (SCHEDULED — MANUAL TRIGGER)

> These run on a schedule (pg_cron). To test manually, invoke them via Supabase Dashboard → Edge Functions.

### 13.1 `generate-blog-posts`
- [ ] Invoke manually from Supabase Dashboard
- [ ] Check Supabase: 4 new rows in `blog_posts` with `is_published: false`
- [ ] Posts have `title_en`, `title_es`, `content_en`, `content_es` populated
- [ ] Posts appear in Admin Panel as drafts

### 13.2 `send-newsletter`
- [ ] Add yourself as a test subscriber (via the newsletter form)
- [ ] Invoke function manually
- [ ] Check your email inbox for the newsletter
- [ ] Email is in the correct language (matches your `preferred_language`)
- [ ] Unsubscribe link works

### 13.3 `enrich-business`
- [ ] Add a test business to Supabase with empty descriptions
- [ ] Invoke `enrich-business` with the business UUID
- [ ] Check Supabase: `description_en` and `description_es` are populated

### 13.4 `send-lead-notification`
> This fires automatically when a lead is submitted. Tested implicitly in Section 9.

---

## 14. SUPABASE ROW-LEVEL SECURITY

Verify data access rules are enforced:

- [ ] **Anonymous user** can: read active businesses, read published blog posts, subscribe to newsletter, submit leads
- [ ] **Anonymous user** cannot: read leads, read other users' profiles, write to businesses table directly
- [ ] **Authenticated user** can: read their own profile, read their own leads, update their own claimed business
- [ ] **Admin user** can: read/write all tables (via service role key, not RLS bypass from client)

Quick checks via Supabase Dashboard → Table Editor (while viewing as anon):
- [ ] `businesses` table: only `is_active = true` rows visible
- [ ] `leads` table: no rows visible to anonymous viewer
- [ ] `profiles` table: no rows visible to anonymous viewer

---

## 15. PERFORMANCE & SEO FINAL CHECK

- [ ] Run https://pagespeed.web.dev on `https://infosylvita.com/en`
  - Target: Performance ≥ 80, Accessibility ≥ 90
- [ ] Run https://www.seobility.net/en/seocheck/ on the homepage
- [ ] Check Google Search Console (after adding the property) — no crawl errors
- [ ] Confirm `<meta name="description">` tags on homepage, blog posts, business pages
- [ ] Confirm OG image appears when pasting URL into Slack / WhatsApp / iMessage

---

## AUTOMATED TEST RESULTS (2026-03-01)

| Test | Result |
|------|--------|
| `/en` homepage | ✅ 200 |
| `/es` homepage | ✅ 200 |
| `/en/search` | ✅ 200 |
| `/en/blog` | ✅ 200 |
| `/en/claim` | ✅ 200 |
| `/en/login` | ✅ 200 |
| `/en/upgrade` | ✅ 200 |
| `/en/dashboard` → redirects to login | ✅ 307 → 200 |
| `/en/admin` → redirects to login | ✅ 307 → 200 |
| `/sitemap.xml` — 98 URLs | ✅ 200 XML |
| `/robots.txt` | ✅ 200 |
| `/opengraph-image` | ✅ Fixed (middleware updated) |
| `/en/comida` | ✅ 200 |
| `/en/salud` | ✅ 200 |
| `/nonexistent-page` → 404 | ✅ Correct |
| `POST /api/chat` — AI response | ✅ 200 |
| `POST /api/newsletter/subscribe` | ✅ 200 |
| `POST /api/track-view` | ✅ 200 |
| `POST /api/leads` — invalid business | ✅ Fixed (now 404) |
| `POST /api/business/submit` — bad body | ✅ 400 validation |
| `POST /api/admin/action` — no auth | ✅ 401 |
| `POST /api/stripe/checkout` — no auth | ✅ 401 |
| Homepage response time | ✅ 297ms |

---

## BUGS FOUND & FIXED

| # | Bug | Fix Applied |
|---|-----|-------------|
| 1 | `/opengraph-image` returned 404 after locale middleware redirect | Excluded `opengraph-image` from middleware matcher |
| 2 | `POST /api/leads` returned 500 on unknown businessId | Added business existence check → now returns 404 |
| 3 | `/en/admin` not in `robots.txt` disallow list | Added `/en/admin` and `/es/admin` to disallow |
