import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// GET /api/business/blog?businessId=xxx
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');
  if (!businessId) return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('business_blog_posts')
    .select('*')
    .eq('business_id', businessId)
    .order('published_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [] });
}

// POST /api/business/blog — generate a new blog post
export async function POST(req: NextRequest) {
  const supabaseUser = await createClient();
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { business_id } = await req.json();
  if (!business_id) return NextResponse.json({ error: 'Missing business_id' }, { status: 400 });

  const supabase = createAdminClient();

  // Verify ownership + tier
  const { data: biz } = await supabase
    .from('businesses')
    .select('id, claimed_by, name, description_en, subscription_tier, category')
    .eq('id', business_id)
    .single();

  if (!biz || biz.claimed_by !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!['featured', 'industry_leader'].includes(biz.subscription_tier ?? '')) {
    return NextResponse.json({ error: 'Blog posts require Featured or Industry Leader tier' }, { status: 403 });
  }

  // Gather products + certifications for context
  const [{ data: products }, { data: certs }] = await Promise.all([
    supabase.from('products').select('name, product_type, description').eq('business_id', business_id).eq('is_active', true).limit(10),
    supabase.from('certifications').select('name, issuing_body').eq('business_id', business_id).limit(5),
  ]);

  const productList = (products ?? []).map((p) => `- ${p.name} (${p.product_type})${p.description ? ': ' + p.description : ''}`).join('\n');
  const certList = (certs ?? []).map((c) => `- ${c.name}${c.issuing_body ? ' by ' + c.issuing_body : ''}`).join('\n');

  const prompt = `You are writing an SEO-optimized blog post for a peptide industry business directory.

Business: ${biz.name}
Category: ${biz.category}
Description: ${biz.description_en ?? 'Not provided'}

Products/Services:
${productList || 'Not specified'}

Certifications:
${certList || 'Not specified'}

Write a professional, educational blog post (400-600 words) that:
1. Highlights this business's products or services in an educational context
2. Provides value to readers interested in peptides and regenerative health
3. Naturally incorporates SEO-friendly language for the peptide industry
4. Ends with a clear description of what this business offers

Format your response as JSON with exactly two fields:
- "title": A compelling, SEO-optimized title (50-70 characters)
- "content": The full blog post in plain text paragraphs (no markdown headers, use paragraph breaks)

Return only the JSON object, no other text.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    const parsed = JSON.parse(raw);

    if (!parsed.title || !parsed.content) {
      return NextResponse.json({ error: 'Failed to generate post content' }, { status: 500 });
    }

    const { data: post, error: insertError } = await supabase
      .from('business_blog_posts')
      .insert({
        business_id,
        title: parsed.title,
        content: parsed.content,
        auto_generated: true,
      })
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 });
  }
}
