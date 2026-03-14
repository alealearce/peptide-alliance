import { generateSlug } from '@/lib/utils/slug';

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const PLACES_BASE = 'https://places.googleapis.com/v1';

interface PlaceResult {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  lat?: number;
  lng?: number;
  placeId: string;
}

// ── New Places API (v1) text search ───────────────────────────────────────

export async function searchPlaces(
  textQuery: string,
  city: string
): Promise<PlaceResult[]> {
  const url = `${PLACES_BASE}/places:searchText`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': [
        'places.displayName',
        'places.formattedAddress',
        'places.nationalPhoneNumber',
        'places.websiteUri',
        'places.rating',
        'places.userRatingCount',
        'places.location',
        'places.id',
      ].join(','),
    },
    body: JSON.stringify({
      textQuery: `${textQuery} ${city} Canada`,
      languageCode: 'en',
      maxResultCount: 20,
    }),
  });

  if (!res.ok) {
    console.error('Places API error:', await res.text());
    return [];
  }

  const data = await res.json();
  const places = data.places ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return places.map((p: any): PlaceResult => ({
    placeId: p.id,
    name: p.displayName?.text ?? '',
    address: p.formattedAddress ?? '',
    phone: p.nationalPhoneNumber,
    website: p.websiteUri,
    rating: p.rating,
    reviewCount: p.userRatingCount,
    lat: p.location?.latitude,
    lng: p.location?.longitude,
  }));
}

// ── Build a business record from a PlaceResult ─────────────────────────────

export function placeToBusinessRecord(
  place: PlaceResult,
  category: string,
  subcategory: string,
  city: string,
  province: string
) {
  return {
    name: place.name,
    slug: generateSlug(place.name, city),
    category,
    subcategory,
    city,
    province,
    address: place.address,
    phone: place.phone ?? null,
    website: place.website ?? null,
    rating: place.rating ?? null,
    review_count: place.reviewCount ?? null,
    latitude: place.lat ?? null,
    longitude: place.lng ?? null,
    source: 'google_places',
    source_id: place.placeId,
    is_verified: false,
    // claimed_by remains null (not claimed)
  };
}
