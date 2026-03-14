// Supabase Edge Function: enrich-business
// Accepts a business ID, fetches it, generates AI descriptions via Claude

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.24.3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { businessId } = await req.json();
  if (!businessId) {
    return new Response(JSON.stringify({ error: 'businessId required' }), { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  const { data: biz, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();

  if (error || !biz) {
    return new Response(JSON.stringify({ error: 'Business not found' }), { status: 404 });
  }

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const prompt = `You are enriching a Latin business directory listing for: "${biz.name}" in ${biz.city}, ${biz.province}, Canada.
Category: ${biz.category}

Write two SHORT business descriptions (2-3 sentences each):
1. In English — warm, welcoming, highlights the Latin heritage
2. In Spanish — equally warm and welcoming

Also suggest 3-5 relevant tags (comma-separated, lowercase).

Respond in this exact JSON format:
{
  "description_en": "...",
  "description_es": "...",
  "tags": ["tag1", "tag2"]
}`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';

  let enriched: any = {};
  try {
    enriched = JSON.parse(text);
  } catch {
    enriched = {
      description_en: `${biz.name} is a Latin-owned business in ${biz.city}, Canada.`,
      description_es: `${biz.name} es un negocio latino en ${biz.city}, Canadá.`,
      tags: [],
    };
  }

  await supabase
    .from('businesses')
    .update({
      description_en: enriched.description_en,
      description_es: enriched.description_es,
    })
    .eq('id', businessId);

  return new Response(JSON.stringify({ success: true, enriched }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
