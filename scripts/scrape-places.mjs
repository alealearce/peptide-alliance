#!/usr/bin/env node
// ─── InfoSylvita — Google Places Scraper ────────────────────────────────────
// Scrapes Google Places for Latin businesses by city + category and inserts
// them into the InfoSylvita directory.
//
// Usage:
//   npm run scrape -- --city "Toronto" --category "servicios_profesionales"
//   npm run scrape -- --city "Toronto" --category "comida" --subcategory "restaurant" --dry-run
//   npm run scrape -- --city "Vancouver" --category "comida" --skip-ai --limit 20
//
// Requires: GOOGLE_PLACES_API_KEY, SUPABASE vars, ANTHROPIC_API_KEY in .env.local

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local manually so empty shell vars don't shadow file values ────
function loadEnvFile(path) {
  try {
    const content = readFileSync(resolve(path), 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1);
      // Override even if already set (shell may have set empty value)
      process.env[key] = val;
    }
  } catch { /* ignore missing file */ }
}
loadEnvFile('.env.local');

// ── Config from env ─────────────────────────────────────────────────────────
const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const ANTHROPIC_KEY  = process.env.ANTHROPIC_API_KEY;
const PLACES_BASE    = 'https://places.googleapis.com/v1';

if (!SUPABASE_URL || !SERVICE_ROLE || !PLACES_API_KEY) {
  console.error('Missing required env vars. Run via: npm run scrape -- ...');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}
const hasFlag = (name) => args.includes(`--${name}`);

const CITY        = getArg('city');
const CATEGORY    = getArg('category');
const SUBCATEGORY = getArg('subcategory');
const DRY_RUN     = hasFlag('dry-run');
const SKIP_AI     = hasFlag('skip-ai');
const LIMIT       = getArg('limit') ? parseInt(getArg('limit'), 10) : Infinity;

if (!CITY || !CATEGORY) {
  console.error('Usage: npm run scrape -- --city "Toronto" --category "servicios_profesionales" [--subcategory "lawyer"] [--dry-run] [--skip-ai] [--limit 20]');
  process.exit(1);
}

// ── Cities ──────────────────────────────────────────────────────────────────
const TOP_CANADIAN_CITIES = [
  { name: 'Toronto', province: 'ON' }, { name: 'Montreal', province: 'QC' },
  { name: 'Vancouver', province: 'BC' }, { name: 'Calgary', province: 'AB' },
  { name: 'Edmonton', province: 'AB' }, { name: 'Ottawa', province: 'ON' },
  { name: 'Winnipeg', province: 'MB' }, { name: 'Hamilton', province: 'ON' },
  { name: 'Brampton', province: 'ON' }, { name: 'Mississauga', province: 'ON' },
  { name: 'Markham', province: 'ON' }, { name: 'Richmond Hill', province: 'ON' },
  { name: 'London', province: 'ON' }, { name: 'Kitchener', province: 'ON' },
  { name: 'Halifax', province: 'NS' }, { name: 'Victoria', province: 'BC' },
  { name: 'Surrey', province: 'BC' }, { name: 'Burnaby', province: 'BC' },
  { name: 'Laval', province: 'QC' }, { name: 'Quebec City', province: 'QC' },
  { name: 'Regina', province: 'SK' }, { name: 'Saskatoon', province: 'SK' },
];

const cityEntry = TOP_CANADIAN_CITIES.find(
  (c) => c.name.toLowerCase() === CITY.toLowerCase()
);
if (!cityEntry) {
  console.error(`City "${CITY}" not in TOP_CANADIAN_CITIES. Available: ${TOP_CANADIAN_CITIES.map(c => c.name).join(', ')}`);
  process.exit(1);
}
const province = cityEntry.province;

// ── Slug helpers (same as lib/utils/slug.ts + lib/config/categories.ts) ─────
function generateSlug(name, city) {
  const base = `${name}-${city}`.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').trim();
  const short = Math.random().toString(36).substring(2, 7);
  return `${base}-${short}`;
}

function cityToSlug(city) {
  return city.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
}

// ── Search query map ────────────────────────────────────────────────────────
const SEARCH_QUERIES = {
  comida: {
    restaurant: [
      { q: 'colombian restaurant',   confidence: 90 },
      { q: 'mexican restaurant',     confidence: 90 },
      { q: 'peruvian restaurant',    confidence: 90 },
      { q: 'salvadoran restaurant',  confidence: 90 },
      { q: 'venezuelan restaurant',  confidence: 90 },
      { q: 'guatemalan restaurant',  confidence: 85 },
      { q: 'cuban restaurant',       confidence: 85 },
      { q: 'argentinian restaurant', confidence: 85 },
      { q: 'brazilian restaurant',   confidence: 85 },
      { q: 'dominican restaurant',   confidence: 85 },
      { q: 'chilean restaurant',     confidence: 85 },
      { q: 'ecuadorian restaurant',  confidence: 85 },
      { q: 'latin restaurant',       confidence: 70 },
      { q: 'hispanic restaurant',    confidence: 70 },
    ],
    food_truck: [
      { q: 'latin food truck',   confidence: 75 },
      { q: 'mexican food truck', confidence: 85 },
      { q: 'taco truck',         confidence: 80 },
    ],
    bakery: [
      { q: 'latin bakery',      confidence: 80 },
      { q: 'panaderia',         confidence: 90 },
      { q: 'colombian bakery',  confidence: 90 },
      { q: 'mexican bakery',    confidence: 90 },
    ],
    caterer: [
      { q: 'latin catering',     confidence: 75 },
      { q: 'mexican catering',   confidence: 85 },
      { q: 'colombian catering', confidence: 85 },
    ],
    coffee_shop: [
      { q: 'latin coffee shop',  confidence: 75 },
      { q: 'colombian coffee',   confidence: 80 },
    ],
    specialty_grocery: [
      { q: 'latin grocery store',    confidence: 80 },
      { q: 'hispanic supermarket',   confidence: 80 },
      { q: 'latin supermarket',      confidence: 80 },
      { q: 'tienda latina',          confidence: 90 },
      { q: 'mexican grocery',        confidence: 85 },
      { q: 'colombian grocery',      confidence: 85 },
    ],
  },

  servicios_profesionales: {
    lawyer: [
      { q: 'spanish speaking lawyer',    confidence: 80 },
      { q: 'latin lawyer',               confidence: 85 },
      { q: 'colombian lawyer',           confidence: 90 },
      { q: 'hispanic attorney',          confidence: 80 },
      { q: 'abogado',                    confidence: 90 },
      { q: 'immigration lawyer spanish', confidence: 80 },
    ],
    accountant: [
      { q: 'spanish speaking accountant', confidence: 80 },
      { q: 'latin accountant',           confidence: 85 },
      { q: 'hispanic CPA',              confidence: 80 },
      { q: 'contador',                  confidence: 90 },
    ],
    realtor: [
      { q: 'spanish speaking realtor',    confidence: 80 },
      { q: 'latin real estate agent',     confidence: 80 },
      { q: 'hispanic realtor',           confidence: 80 },
    ],
    mortgage_broker: [
      { q: 'spanish speaking mortgage broker', confidence: 80 },
      { q: 'latin mortgage broker',           confidence: 80 },
    ],
    immigration_consultant: [
      { q: 'latin immigration consultant',     confidence: 85 },
      { q: 'spanish speaking immigration',     confidence: 80 },
      { q: 'consultor de inmigracion',        confidence: 90 },
      { q: 'hispanic immigration services',    confidence: 80 },
    ],
    insurance_agent: [
      { q: 'spanish speaking insurance agent', confidence: 80 },
      { q: 'latin insurance broker',          confidence: 80 },
    ],
    business_consultant: [
      { q: 'latin business consultant',   confidence: 80 },
      { q: 'hispanic business advisor',   confidence: 80 },
    ],
    money_exchange: [
      { q: 'latin money exchange', confidence: 80 },
      { q: 'envio de dinero',      confidence: 90 },
      { q: 'remesas',             confidence: 90 },
      { q: 'latin remittance',    confidence: 80 },
    ],
    technology: [
      { q: 'latin tech company',     confidence: 75 },
      { q: 'hispanic IT services',   confidence: 75 },
    ],
  },

  servicios_personales: {
    barber_salon: [
      { q: 'latin barber shop',     confidence: 85 },
      { q: 'latin beauty salon',    confidence: 85 },
      { q: 'hispanic barber',       confidence: 80 },
      { q: 'barberia latina',       confidence: 90 },
      { q: 'salon latino',          confidence: 90 },
      { q: 'peluqueria latina',     confidence: 90 },
    ],
    cleaning: [
      { q: 'latin cleaning service',    confidence: 75 },
      { q: 'hispanic cleaning company', confidence: 75 },
    ],
    contractor: [
      { q: 'latin contractor',    confidence: 75 },
      { q: 'hispanic contractor', confidence: 75 },
    ],
    plumber: [
      { q: 'spanish speaking plumber', confidence: 75 },
      { q: 'latin plumber',           confidence: 75 },
    ],
    electrician: [
      { q: 'spanish speaking electrician', confidence: 75 },
      { q: 'latin electrician',           confidence: 75 },
    ],
    mechanic: [
      { q: 'latin mechanic',      confidence: 80 },
      { q: 'hispanic auto repair', confidence: 75 },
      { q: 'mecanico latino',     confidence: 90 },
    ],
    mover: [
      { q: 'latin movers',            confidence: 75 },
      { q: 'hispanic moving company', confidence: 75 },
      { q: 'mudanzas',               confidence: 85 },
    ],
  },

  salud: {
    doctor: [
      { q: 'spanish speaking doctor', confidence: 80 },
      { q: 'latin doctor',           confidence: 80 },
      { q: 'medico latino',          confidence: 90 },
    ],
    dentist: [
      { q: 'spanish speaking dentist', confidence: 80 },
      { q: 'latin dentist',           confidence: 80 },
      { q: 'dentista latino',         confidence: 90 },
    ],
    therapist: [
      { q: 'spanish speaking therapist', confidence: 80 },
      { q: 'terapia en espanol',        confidence: 90 },
      { q: 'latin psychologist',        confidence: 80 },
    ],
    fitness_trainer: [
      { q: 'latin personal trainer', confidence: 75 },
      { q: 'hispanic fitness',      confidence: 75 },
    ],
    massage_therapist: [
      { q: 'latin massage therapist', confidence: 75 },
    ],
    nutrition_coach: [
      { q: 'latin nutritionist',          confidence: 75 },
      { q: 'spanish speaking dietitian',  confidence: 80 },
    ],
  },
};

// ── Google Places API (same logic as lib/scraper/google-places.ts) ──────────
async function searchPlaces(textQuery, city) {
  const url = `${PLACES_BASE}/places:searchText`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': [
        'places.displayName', 'places.formattedAddress',
        'places.nationalPhoneNumber', 'places.websiteUri',
        'places.rating', 'places.userRatingCount',
        'places.location', 'places.id',
      ].join(','),
    },
    body: JSON.stringify({
      textQuery: `${textQuery} ${city} Canada`,
      languageCode: 'en',
      maxResultCount: 20,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  ✗ Places API error for "${textQuery}": ${res.status} ${text.slice(0, 200)}`);
    return [];
  }

  const data = await res.json();
  return (data.places ?? []).map((p) => ({
    placeId:     p.id,
    name:        p.displayName?.text ?? '',
    address:     p.formattedAddress ?? '',
    phone:       p.nationalPhoneNumber ?? null,
    website:     p.websiteUri ?? null,
    rating:      p.rating ?? null,
    reviewCount: p.userRatingCount ?? 0,
    lat:         p.location?.latitude ?? null,
    lng:         p.location?.longitude ?? null,
  }));
}

// ── AI description generation ───────────────────────────────────────────────
async function generateDescription(name, city, category, subcategory) {
  if (!ANTHROPIC_KEY) return { en: null, es: null };

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Write two short business descriptions (2-3 sentences each) for "${name}", a ${subcategory} business in ${city}, Canada, listed under the "${category}" category on InfoSylvita (a Latin business directory).

Return ONLY valid JSON:
{"en": "English description here", "es": "Spanish description here"}

Be warm, professional, and community-focused. Do not make up specific details — keep it general enough to be accurate.`,
        }],
      }),
    });

    if (!res.ok) return { en: null, es: null };
    const data = await res.json();
    const raw = data.content?.[0]?.text ?? '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {
    // Silently continue without descriptions
  }
  return { en: null, es: null };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const categoryQueries = SEARCH_QUERIES[CATEGORY];
  if (!categoryQueries) {
    console.error(`Unknown category "${CATEGORY}". Available: ${Object.keys(SEARCH_QUERIES).join(', ')}`);
    process.exit(1);
  }

  // Filter to specific subcategory if provided
  const subcategories = SUBCATEGORY
    ? { [SUBCATEGORY]: categoryQueries[SUBCATEGORY] }
    : categoryQueries;

  if (SUBCATEGORY && !categoryQueries[SUBCATEGORY]) {
    console.error(`Unknown subcategory "${SUBCATEGORY}" for ${CATEGORY}. Available: ${Object.keys(categoryQueries).join(', ')}`);
    process.exit(1);
  }

  const citySlug = cityToSlug(CITY);

  console.log(`\n🔍 InfoSylvita Scraper`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`  City:        ${CITY}, ${province}`);
  console.log(`  Category:    ${CATEGORY}`);
  console.log(`  Subcategory: ${SUBCATEGORY ?? 'all'}`);
  console.log(`  Dry run:     ${DRY_RUN ? 'YES' : 'no'}`);
  console.log(`  AI desc:     ${SKIP_AI ? 'skipped' : 'enabled'}`);
  console.log(`  Limit:       ${LIMIT === Infinity ? 'unlimited' : LIMIT}`);
  console.log(`${'─'.repeat(50)}\n`);

  // Collect all unique places across all queries (dedup by placeId)
  const allPlaces = new Map(); // placeId → { place, subcategory, confidence }
  let apiCalls = 0;

  for (const [sub, queries] of Object.entries(subcategories)) {
    if (!queries) continue;
    console.log(`📂 ${sub}`);

    for (const { q, confidence } of queries) {
      process.stdout.write(`   🌐 "${q} ${CITY} Canada" ... `);
      const results = await searchPlaces(q, CITY);
      apiCalls++;

      let newInBatch = 0;
      for (const place of results) {
        if (!allPlaces.has(place.placeId)) {
          allPlaces.set(place.placeId, { place, subcategory: sub, confidence });
          newInBatch++;
        }
      }
      console.log(`${results.length} results (${newInBatch} new)`);

      // Rate limit: 200ms between API calls
      await sleep(200);
    }
    console.log();
  }

  console.log(`${'─'.repeat(50)}`);
  console.log(`📊 Total unique places found: ${allPlaces.size} (${apiCalls} API calls)`);
  console.log(`${'─'.repeat(50)}\n`);

  // Check which ones already exist in DB
  const placeIds = [...allPlaces.keys()];
  const { data: existing } = await supabase
    .from('businesses')
    .select('source_id')
    .in('source_id', placeIds);

  const existingIds = new Set((existing ?? []).map((e) => e.source_id));
  const newPlaces = [...allPlaces.entries()].filter(([id]) => !existingIds.has(id));

  console.log(`  Already in DB: ${existingIds.size}`);
  console.log(`  New to insert:  ${newPlaces.length}`);

  if (LIMIT < newPlaces.length) {
    console.log(`  Limiting to:    ${LIMIT}`);
    newPlaces.splice(LIMIT);
  }

  if (DRY_RUN) {
    console.log(`\n🧪 DRY RUN — listing new businesses (not inserting):\n`);
    for (const [, { place, subcategory, confidence }] of newPlaces) {
      console.log(`  [${subcategory}] ${place.name}`);
      console.log(`    📍 ${place.address}`);
      console.log(`    📞 ${place.phone ?? 'n/a'}  🌐 ${place.website ?? 'n/a'}  ⭐ ${place.rating ?? 'n/a'} (${place.reviewCount} reviews)  🎯 confidence: ${confidence}`);
      console.log();
    }
    console.log(`Total: ${newPlaces.length} new businesses would be inserted.`);
    return;
  }

  // Insert new businesses
  let inserted = 0;
  let errors = 0;

  for (const [, { place, subcategory, confidence }] of newPlaces) {
    // Generate AI description (unless --skip-ai)
    let descEn = null;
    let descEs = null;
    if (!SKIP_AI) {
      process.stdout.write(`  🤖 Generating description for "${place.name}" ... `);
      const desc = await generateDescription(place.name, CITY, CATEGORY, subcategory);
      descEn = desc.en;
      descEs = desc.es;
      console.log('done');
      await sleep(300); // Rate limit Anthropic
    }

    const slug = generateSlug(place.name, CITY);

    const record = {
      name:             place.name,
      slug,
      category:         CATEGORY,
      subcategory,
      city:             CITY,
      city_slug:        citySlug,
      province,
      address:          place.address,
      phone:            place.phone,
      website:          place.website,
      rating:           place.rating,
      review_count:     place.reviewCount,
      latitude:         place.lat,
      longitude:        place.lng,
      source:           'google_places',
      source_id:        place.placeId,
      google_maps_url:  `https://www.google.com/maps/place/?q=place_id:${place.placeId}`,
      is_active:        true,
      is_verified:      false,
      is_premium:       false,
      latin_confidence: confidence,
      subscription_tier: 'free',
      description_en:   descEn,
      description_es:   descEs,
    };

    const { error } = await supabase
      .from('businesses')
      .insert(record);

    if (error) {
      // Handle duplicate slug — regenerate and retry once
      if (error.code === '23505' && error.message?.includes('slug')) {
        record.slug = generateSlug(place.name + ' ' + subcategory, CITY);
        const { error: err2 } = await supabase.from('businesses').insert(record);
        if (err2) {
          console.error(`  ✗ ${place.name}: ${err2.message}`);
          errors++;
          continue;
        }
      } else {
        console.error(`  ✗ ${place.name}: ${error.message}`);
        errors++;
        continue;
      }
    }

    console.log(`  ✓ ${place.name} → /${citySlug}/${record.slug}`);
    inserted++;
  }

  // Summary
  console.log(`\n${'═'.repeat(50)}`);
  console.log('✅ SCRAPE COMPLETE');
  console.log(`${'═'.repeat(50)}`);
  console.log(`  City:       ${CITY}, ${province}`);
  console.log(`  Category:   ${CATEGORY}`);
  console.log(`  API calls:  ${apiCalls}`);
  console.log(`  Found:      ${allPlaces.size} unique places`);
  console.log(`  Skipped:    ${existingIds.size} (already in DB)`);
  console.log(`  Inserted:   ${inserted}`);
  if (errors) console.log(`  Errors:     ${errors}`);
  console.log(`\n  View: https://infosylvita.com/en/${citySlug}\n`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
