import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateShortDescription } from '@/lib/ai/claude';

export async function POST(req: NextRequest) {
  try {
    // Must be logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, city, category, subcategory, website, instagram, tiktok, facebook, linkedin, google_maps_url, keywords } = body;

    if (!name || !city || !category) {
      return NextResponse.json(
        { error: 'Business name, city, and category are required to generate a description.' },
        { status: 400 }
      );
    }

    const result = await generateShortDescription({
      name,
      city,
      category,
      subcategory: subcategory || undefined,
      website: website || undefined,
      instagram: instagram || undefined,
      tiktok: tiktok || undefined,
      facebook: facebook || undefined,
      linkedin: linkedin || undefined,
      google_maps_url: google_maps_url || undefined,
      keywords: keywords || undefined,
    });

    return NextResponse.json({ description: result.description });
  } catch (err) {
    console.error('[generate-description] error:', err);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
