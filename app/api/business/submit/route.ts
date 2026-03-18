import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { cityToSlug } from '@/lib/utils/slug';
import { recalculateTrustScore } from '@/lib/utils/recalculate-trust-score';

const SubmitSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum([
    'peptide_brands',
    'clinics',
    'compounding_pharmacies',
    'research_labs',
    'wholesale_suppliers',
    'manufacturers',
  ]),
  city: z.string().min(2).max(100),
  province: z.string().min(2).max(3),
  country: z.enum(['US', 'CA']).default('US'),
  service_area: z.string().max(200).optional().nullable(),
  address: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal('')),
  claimed_by: z.string().uuid(),
  owner_title: z.string().min(1).max(100),
  subcategory: z.string().max(100).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  instagram: z.string().max(200).optional().nullable(),
  tiktok: z.string().max(200).optional().nullable(),
  facebook: z.string().max(200).optional().nullable(),
  linkedin: z.string().max(200).optional().nullable(),
  google_maps_url: z.string().url().optional().nullable().or(z.literal('')),
  keywords: z.array(z.string().max(100)).max(10).optional().nullable(),
});

function slugify(name: string, city: string): string {
  const base = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth check — user must be logged in ───────────────────────────────────
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const field = firstIssue?.path?.join('.') ?? 'unknown';
      const msg = firstIssue?.message ?? 'Invalid input';
      console.error('[business/submit] validation error:', parsed.error.issues);
      return NextResponse.json(
        { error: `Invalid input: ${field} — ${msg}` },
        { status: 400 }
      );
    }

    // ── Ownership check — claimed_by must match the logged-in user ────────────
    if (parsed.data.claimed_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, category, subcategory, city, province, country, service_area, address, phone, website, claimed_by, owner_title, description, logo_url, instagram, tiktok, facebook, linkedin, google_maps_url, keywords } = parsed.data;
    const supabase = createAdminClient();
    const slug = slugify(name, city);

    const { error } = await supabase.from('businesses').insert({
      name,
      slug,
      category,
      subcategory: subcategory || '',
      city,
      city_slug: cityToSlug(city),
      province,
      country: country || 'US',
      service_area: service_area || null,
      address: address || null,
      phone: phone || null,
      website: website || null,
      is_active: false,         // Pending admin approval
      is_verified: false,
      source: 'claimed' as const,
      claimed_by,
      owner_title,
      subscription_tier: 'free' as const,
      review_count: 0,
      trust_score: 0,
      description_en: description || null,
      logo_url: logo_url || null,
      instagram: instagram || null,
      tiktok: tiktok || null,
      facebook: facebook || null,
      linkedin: linkedin || null,
      google_maps_url: google_maps_url || null,
      keywords: keywords || null,
    });

    if (error) {
      console.error('[business/submit] insert error:', error);
      return NextResponse.json({ error: `DB error: ${error.message} (code: ${error.code})` }, { status: 500 });
    }

    // Fire-and-forget: generate long description
    const { data: newBiz } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .single();

    if (newBiz) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      // Calculate accurate initial trust score from submitted data
      void recalculateTrustScore(newBiz.id).catch((err) => console.error('[business/submit] trust score error:', err));

      // Generate AI long description
      fetch(`${baseUrl}/api/business/long-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: newBiz.id,
          name,
          city,
          province,
          country: country || 'US',
          category,
          subcategory: subcategory || '',
          description: description || '',
          keywords: keywords || [],
        }),
      }).catch((err) => console.error('[business/submit] long description trigger error:', err));
    }

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error('[business/submit] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
