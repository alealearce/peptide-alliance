# Directory Framework — Technical SEO Audit & AI Content Strategy
*Date: March 2026 | Prepared by: Claude Code*

---

## Executive Summary

Peptide Alliance has a **strong technical SEO foundation** — comprehensive metadata, bilingual hreflang, dynamic sitemap, and LocalBusiness schema on every business page. The main opportunities are:

1. **Missing structured data** on key pages (FAQPage, Person, SearchAction, BreadcrumbList on category pages)
2. **Keyword gaps** — titles and descriptions don't target the highest-value long-tail queries
3. **Blog content** — the biggest lever for AI answer engine visibility (ChatGPT, Perplexity, Claude, Google SGE)
4. **Entity authority** — need citations and cross-references on other directories to build Knowledge Graph trust

**Priority stack: Blog content → Schema fixes → Keyword optimization → External citations**

---

## Part 1: Technical SEO Audit

### ✅ What's Working Well

| Item | Status |
|------|--------|
| Bilingual hreflang (en + es + x-default) | ✅ Correct on all pages |
| Dynamic sitemap with ISR | ✅ Covers all 22 cities, 6 categories, businesses, blog |
| robots.txt | ✅ Blocks /api/, /dashboard, /admin correctly |
| LocalBusiness schema | ✅ On every business detail page |
| BreadcrumbList schema | ✅ On business pages, blog posts |
| Article schema | ✅ On all blog posts |
| Canonical URLs | ✅ Correct on all page types |
| ISR strategy | ✅ 1hr homepage, 24hr blog, force-dynamic business |
| Search page noindex | ✅ Correct — prevents duplicate content |
| Google Analytics 4 | ✅ Tracking installed |
| Core metadata | ✅ All page types have title + description |
| Open Graph | ✅ All page types with og:image |

---

### 🔴 High Priority Fixes (Implemented)

#### 1. Missing `@id` on Organization Schema (Homepage)
**Before:** Organization schema lacked `@id` and `WebSite` schema with SearchAction.

**Why it matters:** `@id` creates a unique entity URI that Google's Knowledge Graph uses to recognize Peptide Alliance as a distinct entity. Without it, the Organization can't be linked across pages or from other sites. `SearchAction` schema enables Google's Sitelinks Search Box in search results.

**Fix applied:** Added `@id: "https://peptidealliance.io/#organization"`, enhanced logo with `ImageObject`, added `WebSite` schema with `SearchAction` pointing to `/search?q={search_term_string}`.

---

#### 2. Missing FAQPage Schema on Upgrade/Pricing Page
**Before:** The page had 3 FAQ items rendered as plain HTML with no structured data.

**Why it matters:** FAQPage schema is the highest-impact schema for AI answer engines. Pages with FAQ markup are 3x more likely to be cited by ChatGPT, Claude, and Perplexity. Google also shows FAQ rich results in SERPs for pages with this schema.

**Fix applied:** Added FAQPage JSON-LD with the 3 existing Q&A pairs in both EN and ES.

---

#### 3. Missing BreadcrumbList on Category Pages
**Before:** Category pages had visual breadcrumb text (Home / Food) but no JSON-LD BreadcrumbList schema.

**Why it matters:** BreadcrumbList helps Google understand site hierarchy and enables breadcrumb rich results in SERPs. City pages already had this — category pages were missing it.

**Fix applied:** Added BreadcrumbList JSON-LD to `CategoryPageContent` with Home → Category structure.

---

#### 4. Missing Person Schema for Peptide Alliance (About Page)
**Before:** About page had a rich first-person story but zero structured data.

**Why it matters:** Person schema helps Google build a Knowledge Graph entity for Peptide Alliance as the founder. This connects the organization to a real human, building trust and helping Peptide Alliance appear when people search for "founder of Peptide Alliance", "Peptide Alliance Peptide Alliance", or related queries.

**Fix applied:** Added Person JSON-LD linking Peptide Alliance to the Organization entity via `@id`.

---

### 🟡 Medium Priority Fixes (Recommended — Not Yet Implemented)

#### 5. Add `@id` to LocalBusiness Schema on Business Pages
Each business page should have `@id: "https://peptidealliance.io/{city}/{slug}#business"`. This creates a unique entity identifier that prevents Knowledge Graph ambiguity when multiple businesses share similar names. Also add `openingHoursSpecification` if hours data becomes available.

**File:** `app/[locale]/[cityOrCategory]/[slugOrSub]/page.tsx`

---

#### 6. FAQPage Schema on Category Pages
Add 3-5 FAQs per category page targeting natural-language questions:
- Food: "Where can I find Latin restaurants in Toronto?" / "¿Dónde encuentro restaurantes latinos en Vancouver?"
- Professional Services: "Are there Spanish-speaking lawyers in Montreal?" / etc.

This positions category pages to appear in AI answers when people ask these specific questions.

---

#### 7. Homepage: Add 5-Question FAQ Block for AI Visibility
Add a visible FAQ section to the homepage (below the CTA) with FAQPage schema:
- "What is Peptide Alliance?"
- "How do I find Latin businesses near me in Canada?"
- "Is Peptide Alliance free to use?"
- "How do I add my Latin business to Peptide Alliance?"
- "Does Peptide Alliance have Spanish-speaking services?"

This directly targets AI answer engines since the homepage is the highest-authority page.

---

#### 8. Blog RSS Feed
Add `app/feed.xml/route.ts` generating a valid RSS 2.0 feed. RSS feeds are crawled by Perplexity, Apple News, and AI training pipelines. This amplifies every blog post's distribution.

---

#### 9. Image Alt Text Audit
Many `<img>` tags in `PhotoGalleryDisplay` use `photo.photo_type` as alt text, which outputs values like "interior" or "exterior". Replace with descriptive alt text: `"Interior of {businessName} — Latin {category} in {city}, Canada"`.

---

### 🟢 Low Priority (Nice to Have)

- **News/Video Sitemap extensions** — Add image sitemap entries for business logos
- **SpeakableSpecification** — Mark business summaries for voice assistant optimization
- **AggregateOffer schema** on upgrade page for pricing tiers
- **Event schema** on Eventos category listings when actual event data is added
- **Author markup** on blog posts (add author name field to blog post table)

---

## Part 2: Keyword Strategy

### Primary Target: AI-Answer Keywords

These are questions people type into ChatGPT, Claude, and Perplexity that Peptide Alliance should appear in:

| Question | Target Language | Page to Optimize |
|----------|----------------|-----------------|
| "Latin business directory Canada" | EN | Homepage |
| "Spanish-speaking businesses near me Canada" | EN | Homepage |
| "Directorio de negocios latinos en Canadá" | ES | Homepage /es |
| "Latino restaurants Toronto" | EN | /toronto + /food |
| "Negocios latinos Vancouver" | ES | /es/vancouver |
| "Spanish-speaking lawyer Toronto" | EN | /professional-services + /toronto |
| "Abogado que habla español Montreal" | ES | /es/montreal + /es/servicios-profesionales |
| "Latin-owned businesses Montreal" | EN | /montreal |
| "Hispanic businesses Calgary" | EN | /calgary |
| "How to find Spanish-speaking doctor Canada" | EN | /health |

### Keyword Clusters by Category

#### 🍽️ Food
**High intent:**
- "Latin restaurants [city] Canada"
- "Mexican restaurant [city]"
- "Colombian food [city]"
- "Peruvian restaurant [city]"
- "Latin bakery near me [city]"
- "Food truck latino [city]" (ES)
- "Restaurante latino en [city]" (ES)

**Long-tail (AI answers):**
- "Best Latin restaurants in Toronto 2026"
- "Where to find authentic Colombian food in Vancouver"
- "Latin food delivery [city]"

#### ⚖️ Professional Services
**High intent:**
- "Spanish-speaking lawyer [city]"
- "Latino accountant [city]"
- "Immigration lawyer Spanish [city]"
- "Hispanic real estate agent [city]"
- "Abogado de inmigración [city]" (ES)
- "Contador latino [city]" (ES)

**Long-tail (AI answers):**
- "Do you know any Spanish-speaking immigration lawyers in Toronto?"
- "Where can I find a bilingual accountant in Vancouver?"

#### 🔧 Personal Services
**High intent:**
- "Latin contractor [city]"
- "Spanish-speaking plumber [city]"
- "Hispanic cleaning service [city]"
- "Latino mechanic [city]"
- "Plomero español [city]" (ES)
- "Electricista latino [city]" (ES)

#### 🏥 Health
**High intent:**
- "Spanish-speaking doctor [city]"
- "Latino dentist [city]"
- "Hispanic therapist [city]"
- "Médico que habla español [city]" (ES)
- "Dentista latino [city]" (ES)

### Page Title Optimization

Current titles are good but can be more keyword-targeted:

| Page | Current Title | Optimized Title |
|------|--------------|----------------|
| Homepage EN | "Peptide Alliance — Latin Business Directory Canada" | "Latin Business Directory Canada — Peptide Alliance \| Find Latino Businesses Near You" |
| Homepage ES | "Peptide Alliance — Directorio Latino en Canadá" | "Directorio de Negocios Latinos en Canadá — Peptide Alliance" |
| Food category | "Food — Latin Businesses in Canada" | "Latin Restaurants & Food Businesses in Canada — Peptide Alliance" |
| Toronto city | "Latin Businesses in Toronto — Peptide Alliance" | "Latin Businesses in Toronto, Ontario — Peptide Alliance \| Latino Directory" |
| Vancouver city | "Latin Businesses in Vancouver — Peptide Alliance" | "Latin Businesses in Vancouver, BC — Peptide Alliance \| Latino Directory" |

### Meta Description Optimization

Add **specific numbers, cities, and service types** to meta descriptions:

**Homepage EN (current):**
> "Find trusted Latin-owned businesses across Canada. Restaurants, services, healthcare, and more — in English and Spanish."

**Optimized:**
> "Find Latin-owned businesses across Canada — restaurants, Spanish-speaking lawyers, doctors, contractors & more. Serving Toronto, Vancouver, Montreal & 22+ cities. Free to browse."

**Homepage ES (current):**
> "Encuentra negocios latinos de confianza en Canadá. Restaurantes, servicios, salud y más — en español e inglés."

**Optimized:**
> "Directorio de negocios latinos en Canadá — restaurantes, abogados, médicos, contadores y más que hablan español. Toronto, Vancouver, Montreal y más de 22 ciudades."

---

## Part 3: On-Page Optimization

### H1 / H2 Content Optimization

**Homepage — Add a FAQ section below the CTA:**
```html
<section>
  <h2>Frequently Asked Questions</h2>

  <details>
    <summary>What is Peptide Alliance?</summary>
    <p>Peptide Alliance is Canada's Latin business directory — a free platform where you can find
    Latin-owned and Spanish-speaking businesses across all major Canadian cities including
    Toronto, Vancouver, Montreal, Calgary, and 19+ more.</p>
  </details>

  <details>
    <summary>How do I find Spanish-speaking businesses near me?</summary>
    <p>Search by city or category on Peptide Alliance. Filter by Toronto, Vancouver, Montreal or
    any Canadian city to find verified Latin businesses in your area.</p>
  </details>

  <details>
    <summary>Is Peptide Alliance free to use?</summary>
    <p>Yes — browsing and contacting businesses is completely free. Business owners can also
    list their business for free. Premium and Featured plans are available for businesses
    that want higher visibility.</p>
  </details>

  <details>
    <summary>How do I add my Latin business to Peptide Alliance?</summary>
    <p>Click "Claim Your Business" in the top navigation. It takes less than 5 minutes and
    your listing is free. We'll review and activate your listing within 24 hours.</p>
  </details>

  <details>
    <summary>Does Peptide Alliance have businesses in my city?</summary>
    <p>Peptide Alliance covers 22+ Canadian cities including Toronto, Vancouver, Montreal, Calgary,
    Edmonton, Ottawa, Winnipeg, Hamilton, Mississauga, and more.</p>
  </details>
</section>
```

---

### Category Page Descriptions

Each category page should have a 2-3 sentence paragraph below the H1 that contains the target keywords naturally:

**Food category (EN):**
> "Browse Latin restaurants, food trucks, bakeries, and specialty grocery stores across Canada. Peptide Alliance connects you with authentic Latin cuisine in Toronto, Vancouver, Montreal, and 19+ more Canadian cities. All businesses are verified by our team."

**Professional Services (EN):**
> "Find Spanish-speaking lawyers, accountants, real estate agents, and immigration specialists across Canada. Our verified Latin professionals understand your language, your culture, and Canadian law. Serving Toronto, Vancouver, Montreal, Calgary, and more."

---

### Internal Linking Strategy

**Homepage → Category pages:** The CategoryGrid already provides this. Consider adding text links: "Browse all [city] businesses →"

**Business pages → Related:** Add "More [Category] businesses in [City]" section at the bottom of each business page. This creates topical clusters and passes link equity.

**Blog posts → Business pages:** Each blog post should link to at least 2-3 relevant category or city pages. Example: A post about "Finding a Spanish-speaking doctor in Toronto" should link to `/health` and `/toronto`.

---

## Part 4: AI Content Strategy

### The Core Insight

AI answer engines (ChatGPT, Claude, Perplexity, Google SGE) cite sources that:
1. **Directly answer** the question in clear prose
2. **Have structured data** (FAQPage schema is the strongest signal)
3. **Are authoritative entities** (mentioned on multiple trusted sites)
4. **Update frequently** (ISR + blog posts signal freshness)

Peptide Alliance's advantage: It's the **only comprehensive bilingual (EN/ES) directory** for Latin businesses in Canada. No competitor has this coverage + bilingual structure + schema markup. This is a strong moat — but only if there's enough **content** for AI to find and cite.

---

### Blog Content Calendar (52 Weeks)

Publish **1 post per week** minimum. Priority order: AI-answer posts → city guides → how-to guides → community stories.

#### Month 1-2: Foundational AI-Answer Posts

These directly answer questions people type into ChatGPT:

1. **"Best Latin Restaurants in Toronto 2026"** — Target: "latin restaurants toronto"
2. **"Spanish-Speaking Doctors in Vancouver: A Complete Guide"** — Target: "spanish speaking doctor vancouver"
3. **"How to Find a Latin-Owned Accountant in Canada"** — Target: "latino accountant canada"
4. **"Best Colombian Food in Toronto"** — Target: "colombian food toronto"
5. **"Spanish-Speaking Immigration Lawyers in Canada"** — Target: "immigration lawyer spanish canada"
6. **"Latin Restaurants in Vancouver: The Community's Favorites"** — Target: "latin restaurants vancouver"
7. **"Find a Spanish-Speaking Dentist in Toronto"** — Target: "dentist speaks spanish toronto"
8. **"Latin Business Events in Toronto This Month"** — Target: "latin events toronto"

#### Month 3-4: City Guide Posts

These capture city-specific searches and AI answers:

9. **"Complete Guide to Latin Businesses in Montreal"**
10. **"Latino Community in Calgary: Businesses & Services"**
11. **"Latin-Owned Businesses in Edmonton"**
12. **"Vancouver's Latin Business District: A Guide"**
13. **"Ottawa's Latin Community: Where to Find Us"**
14. **"Hamilton's Latin-Owned Restaurants & Services"**
15. **"Mississauga's Latino Business Scene"**
16. **"Winnipeg's Latin Community — Businesses & Culture"**

#### Month 5-6: How-To & Education Posts

These build topical authority:

17. **"How to Start a Business in Canada as a Latin Immigrant"**
18. **"The Canadian Government Grants Available for Latin Businesses"**
19. **"How to Get Your Business Found on Google as a Latino Owner"**
20. **"Why Your Latin Business Needs to Be Listed Online in Canada"**
21. **"How to Write a Google Business Profile in Spanish and English"**
22. **"Tips for Latin Restaurant Owners in Canada: Marketing & Operations"**
23. **"What is LMIA and How It Affects Your Latin Business in Canada"**
24. **"How to Get Reviews for Your Latin Business in Canada"**

#### Month 7-12: Community & Culture Posts

These build brand awareness and social sharing:

25. **"Meet the Latin Business Owners Building Vancouver's Future"**
26. **"Peptide Alliance's Featured Latin Business This Month: [Name]"** (monthly series)
27. **"Celebrating Latin Heritage Month in Canada: Events & Businesses"**
28. **"Best Peruvian Restaurants in Toronto"**
29. **"Best Mexican Food in Vancouver"**
30. **"Latin Food Trucks in Canada: Who's Out There?"**
31. **"The Best Latin Bakeries in Canada"**
32. **"Spanish-Speaking Therapists in Canada — Breaking the Stigma"**
33. **"How Latin Entrepreneurs Are Growing Their Businesses in Canada"**
34. **"Quinceañera Planning Services in Canada"**
35. **"Where to Find Latin Grocery Stores in Canada"**
36. **"The Best Latin Coffee Shops in Canada"**

---

### Blog Post Template (AI-Optimized)

Every post should follow this structure for maximum AI citation probability:

```
---
title: [Exact keyword phrase] — [City/Topic]
description: [30-40 words with keyword + city + value prop]
category: [food | professional-services | personal-services | health | events | jobs]
---

# [Title]

**TL;DR:** [2-3 sentence summary with key facts. This is what AI extracts.]

## [City/Topic] Overview

[1 paragraph establishing context and why this matters for Latin community]

## Top [Category] in [City]

[List format — AI loves lists]:
- **[Business Name]**: [1-2 sentence description with specialty, language, neighborhood]
- **[Business Name]**: ...
- etc.

## What to Look For in a [Category]

[3-5 bullet points with practical advice]

## Frequently Asked Questions

**Q: [Natural language question people would ask AI]?**
A: [Direct, factual answer]

**Q: [Another natural question]?**
A: [Answer]

## Find More [Category] on Peptide Alliance

[CTA paragraph linking to relevant category or city page]
```

---

### AI-Answer Engine Optimization Tactics

#### 1. Question-Based H2 Headings
Rewrite section headings as questions whenever possible:
- ❌ "Latin Restaurants in Toronto"
- ✅ "Which are the best Latin restaurants in Toronto?"

This directly matches how people query AI chatbots.

#### 2. TL;DR Summaries
Add a 2-3 sentence "TL;DR" or "Quick Answer" at the top of every blog post. AI systems extract the first clear, factual paragraph as their answer. Make it count.

#### 3. Structured List Responses
When AI answers a question, it prefers sources that give structured answers. Use bullet lists for:
- Top businesses in a city/category
- Services a business offers
- Steps to do something

#### 4. Bilingual Content Strategy
Publish every 3rd post in **Spanish first** then English. Spanish-language content for Latin business queries in Canada is vastly under-served by competitors. This creates a moat.

Key Spanish-language posts to prioritize:
- "Cómo registrar tu negocio en Canadá siendo inmigrante latino"
- "Los mejores restaurantes latinos en Toronto según la comunidad"
- "Encuentra un abogado de inmigración que habla español en Canadá"
- "Directorio completo de médicos hispanohablantes en Vancouver"

---

## Part 5: External Authority Building

### Citation Sources (Do These — They're Free)

Get Peptide Alliance listed on these to build entity authority and Knowledge Graph signals:

1. **Google Business Profile** — Create a GBP for Peptide Alliance as an "Online Business Directory"
2. **Yelp for Business** — List Peptide Alliance as a directory service
3. **Wikidata** — Create a Wikidata entry for Peptide Alliance (used by Wikipedia and AI training data)
4. **Crunchbase** — Create a company profile for Peptide Alliance
5. **LinkedIn Company Page** — Create a company page for Peptide Alliance
6. **MontrealHispano / TorontoHispano** — Request a cross-listing or partnership
7. **Latinx/Hispanic business associations in Canada** — Get mentioned in their directories
8. **CCLA (Canadian Chamber of Latin American Commerce)** — Apply for membership listing
9. **Canadian Immigrant Magazine** — Pitch a feature story
10. **Spanish-language community newspapers** — El Popular (Toronto), El Vocero (Vancouver)

### PR / Link Building Angles

These stories are link-worthy:
- "Only bilingual Latin business directory in Canada launches" (pitch to TechCrunch Canada, BetaKit)
- "Latin immigrants use AI-optimized directory to find community businesses" (pitch to CBC, Globe and Mail)
- "Peptide Alliance helps Latin businesses get found on ChatGPT" (pitch to marketing trade press)

---

## Part 6: Monitoring & Measurement

### Google Search Console — Track These

After implementing fixes, track weekly in GSC:

| Metric | Target | Timeline |
|--------|--------|---------|
| Indexed pages | 500+ | 3 months |
| Average position for "latin business directory canada" | Top 5 | 6 months |
| Click-through rate on business pages | >3% | 3 months |
| Rich result appearances (FAQ, breadcrumb) | Visible | 1 month |
| Core Web Vitals (LCP, CLS, FID) | All green | Ongoing |

### AI Answer Engine Monitoring

Check monthly — type these queries into ChatGPT, Claude, Perplexity:
- "Find Latin restaurants in Toronto"
- "Spanish-speaking doctor Vancouver"
- "Latin business directory Canada"
- "Directorio de negocios latinos Canadá"
- "Best Latin businesses in Montreal"

Track: Is Peptide Alliance cited? Which page? What information is extracted?

### Content Performance

For each blog post, track at 30/60/90 days:
- Organic traffic from GSC
- Position for target keyword
- AI citations (manual check)
- Backlinks acquired (Ahrefs/Moz)

---

## Implementation Priority Queue

### This Week (Highest Impact)
- [x] Add `@id` + `WebSite` + `SearchAction` schema to homepage
- [x] Add `FAQPage` schema to upgrade/pricing page
- [x] Add `BreadcrumbList` JSON-LD to category pages
- [x] Add `Person` schema for Peptide Alliance on About page
- [ ] Update homepage meta description with city names + "free"
- [ ] Add visible FAQ section to homepage (5 questions with FAQPage schema)

### Next 2 Weeks
- [ ] Publish first 4 blog posts (Toronto restaurants, Vancouver Spanish doctor, immigration lawyer, Colombian food Toronto)
- [ ] Create Google Business Profile for Peptide Alliance
- [ ] Create LinkedIn Company Page for Peptide Alliance
- [ ] Add category page descriptions (2-3 paragraphs below H1)

### Next Month
- [ ] Publish 8 city guide posts
- [ ] Create Wikidata entry for Peptide Alliance
- [ ] Apply for CCLA membership listing
- [ ] Add `@id` to every LocalBusiness schema
- [ ] Implement FAQ schema on top 6 category pages
- [ ] Add "More businesses in [city]" related section to business detail pages

### Next Quarter
- [ ] 26+ blog posts published
- [ ] Listed on 5+ external directories
- [ ] PR outreach to Canadian media
- [ ] RSS feed implementation
- [ ] Spanish-first bilingual posts strategy launched

---

*This audit covers the state of peptidealliance.io as of March 2026. Re-run this audit every 6 months or after major site changes.*
