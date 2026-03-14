import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    // Auth + admin check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title_en, title_es,
      excerpt_en, excerpt_es,
      content_en, content_es,
      meta_title_en, meta_title_es,
      meta_description_en, meta_description_es,
      category, city,
      slug: slugInput,
    } = body;

    if (!title_en) {
      return NextResponse.json({ error: 'title_en is required' }, { status: 400 });
    }

    // Generate slug from EN title if not provided, ensure uniqueness with suffix
    const baseSlug = slugInput?.trim() || slugify(title_en);
    const suffix = Math.random().toString(36).slice(2, 6);
    const slug = `${baseSlug}-${suffix}`;

    const { data, error } = await adminSupabase
      .from('blog_posts')
      .insert({
        title_en: title_en || null,
        title_es: title_es || null,
        excerpt_en: excerpt_en || null,
        excerpt_es: excerpt_es || null,
        content_en: content_en || null,
        content_es: content_es || null,
        meta_title_en: meta_title_en || title_en || null,
        meta_title_es: meta_title_es || title_es || null,
        meta_description_en: meta_description_en || excerpt_en || null,
        meta_description_es: meta_description_es || excerpt_es || null,
        category: category || null,
        city: city || null,
        slug,
        is_published: false,
      })
      .select('id, slug')
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
  } catch (err) {
    console.error('[admin/blog] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
