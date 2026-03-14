// Supabase Edge Function: scrape-businesses
// Triggered monthly by pg_cron or manually via POST
// Searches Google Places for Latin businesses in top Canadian cities

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const SEARCH_QUERIES = [
  'Latin restaurant',
  'Mexican restaurant',
  'Colombian restaurant',
  'Salvadoran restaurant',
  'Guatemalan restaurant',
  'Peruvian restaurant',
  'Latin immigration consultant',
  'Spanish speaking lawyer',
  'Latin barber shop',
  'Latin beauty salon',
];

const CITIES = [
  { name: 'Toronto', province: 'ON' },
  { name: 'Vancouver', province: 'BC' },
  { name: 'Montreal', province: 'QC' },
  { name: 'Calgary', province: 'AB' },
  { name: 'Edmonton', province: 'AB' },
];

const CATEGORY_MAP: Record<string, { category: string; subcategory: string }> = {
  restaurant: { category: 'comida', subcategory: 'restaurant' },
  'food truck': { category: 'comida', subcategory: 'food_truck' },
  'immigration consultant': { category: 'servicios_profesionales', subcategory: 'immigration_consultant' },
  lawyer: { category: 'servicios_profesionales', subcategory: 'lawyer' },
  'barber shop': { category: 'servicios_personales', subcategory: 'barber_salon' },
  'beauty salon': { category: 'servicios_personales', subcategory: 'barber_salon' },
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function generateSlug(name: string, city: string): string {
  const base = slugify(`${name}-${city}`);
  const short = Math.random().toString(36).substring(2, 7);
  return `${base}-${short}`;
}

function inferCategoryFromQuery(query: string): { category: string; subcategory: string } {
  for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
    if (query.toLowerCase().includes(keyword)) return cat;
  }
  return { category: 'comida', subcategory: 'restaurant' };
}

async function searchPlaces(textQuery: string, city: string): Promise<any[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.id',
    },
    body: JSON.stringify({
      textQuery: `${textQuery} ${city} Canada`,
      languageCode: 'en',
      maxResultCount: 10,
    }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.places ?? [];
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  let inserted = 0;
  let skipped = 0;

  for (const city of CITIES) {
    for (const query of SEARCH_QUERIES) {
      const places = await searchPlaces(query, city.name);
      const catInfo = inferCategoryFromQuery(query);

      for (const place of places) {
        // Skip if already in DB (by source_id)
        const { data: existing } = await supabase
          .from('businesses')
          .select('id')
          .eq('source_id', place.id)
          .single();

        if (existing) { skipped++; continue; }

        await supabase.from('businesses').insert({
          name: place.displayName?.text ?? 'Unknown',
          slug: generateSlug(place.displayName?.text ?? 'business', city.name),
          category: catInfo.category,
          subcategory: catInfo.subcategory,
          city: city.name,
          province: city.province,
          address: place.formattedAddress ?? null,
          phone: place.nationalPhoneNumber ?? null,
          website: place.websiteUri ?? null,
          rating: place.rating ?? null,
          review_count: place.userRatingCount ?? null,
          latitude: place.location?.latitude ?? null,
          longitude: place.location?.longitude ?? null,
          source: 'google_places',
          source_id: place.id,
          is_verified: false,
          // claimed_by remains null (not claimed)
        });
        inserted++;
      }

      // Rate limit: 50ms between requests
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  return new Response(
    JSON.stringify({ success: true, inserted, skipped }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
