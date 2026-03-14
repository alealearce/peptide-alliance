import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { generateLongDescription } from '@/lib/ai/claude';

export async function POST(req: NextRequest) {
  try {
    const { business_id, name, city, province, category, subcategory, description, keywords } = await req.json();

    if (!business_id || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const result = await generateLongDescription({
      name,
      city,
      province,
      category,
      subcategory,
      description_en: description || null,
      keywords: keywords || null,
    } as Parameters<typeof generateLongDescription>[0]);

    if (!result.long_description_en) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

    const supabase = createAdminClient();
    await supabase
      .from('businesses')
      .update({
        long_description_en: result.long_description_en || null,
      })
      .eq('id', business_id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[business/long-description] error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
