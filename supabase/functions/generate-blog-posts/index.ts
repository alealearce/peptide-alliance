// Supabase Edge Function: generate-blog-posts
// Scheduled: monthly (1st of month) via pg_cron
// Generates 4 bilingual SEO blog posts using Claude API and saves as drafts.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@3';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM = Deno.env.get('RESEND_FROM_EMAIL') ?? 'hola@infosylvita.com';
const ADMIN_EMAIL = 'hi@arce.ca';
const SITE = 'https://infosylvita.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const resend = new Resend(RESEND_API_KEY);

// Rotate through cities and categories for variety
const CITIES = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton'];
const CATEGORIES = ['comida', 'servicios_profesionales', 'servicios_personales', 'salud', 'eventos'];
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

// Generate 4 post specs to rotate through types
function getPostSpecs(): Array<{ type: string; topic: string; city: string; category: string }> {
  const cityIdx = new Date().getMonth() % CITIES.length;
  const catIdx = new Date().getMonth() % CATEGORIES.length;
  const season = SEASONS[Math.floor(new Date().getMonth() / 3)];
  const city = CITIES[cityIdx];
  const category = CATEGORIES[catIdx];

  return [
    {
      type: 'City spotlight',
      topic: `Best Latin restaurants in ${city} — InfoSylvita Guide`,
      city,
      category: 'comida',
    },
    {
      type: 'Category guide',
      topic: `How to find a Latin immigration consultant in Canada`,
      city: 'Canada',
      category: 'servicios_profesionales',
    },
    {
      type: 'Community story',
      topic: `Growing the Latin business community in ${city}`,
      city,
      category,
    },
    {
      type: 'Seasonal',
      topic: `Latin events in Canada this ${season}`,
      city: 'Canada',
      category: 'eventos',
    },
  ];
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const generated: string[] = [];
  const specs = getPostSpecs();

  for (const spec of specs) {
    try {
      const prompt = `Write a blog post with these specs:
- Type: ${spec.type}
- Topic: ${spec.topic}
- Target city: ${spec.city} (or national if applicable)
- Category focus: ${spec.category}
- Target length: 600-800 words
- Include: natural keyword usage, 2-3 H2 subheadings (use ## prefix), a call to action linking to the relevant InfoSylvita directory page at https://infosylvita.com
- Tone: warm, community-focused, bilingual audience (some readers prefer Spanish, some English)

Return ONLY valid JSON (no markdown wrapper), exactly this structure:
{
  "title_en": "",
  "title_es": "",
  "content_en": "",
  "content_es": "",
  "excerpt_en": "",
  "excerpt_es": "",
  "meta_title_en": "",
  "meta_title_es": "",
  "meta_description_en": "",
  "meta_description_es": ""
}`;

      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 4000,
        system: 'You are a bilingual content writer for InfoSylvita, a Latin business directory in Canada. Write warm, SEO-optimized content that serves the Latin community. Always write in a voice that feels like advice from a trusted community member, not a corporate blog. Return only valid JSON.',
        messages: [{ role: 'user', content: prompt }],
      });

      const raw = (message.content[0] as { text: string }).text ?? '';

      // Extract JSON from response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response for:', spec.topic);
        continue;
      }

      const post = JSON.parse(jsonMatch[0]);
      const slug = `${slugify(post.title_en)}-${Date.now()}`;

      const { data, error } = await supabase.from('blog_posts').insert({
        title_en: post.title_en,
        title_es: post.title_es,
        slug,
        content_en: post.content_en,
        content_es: post.content_es,
        excerpt_en: post.excerpt_en,
        excerpt_es: post.excerpt_es,
        category: spec.category === 'Canada' ? null : spec.category,
        city: spec.city === 'Canada' ? null : spec.city,
        meta_title_en: post.meta_title_en,
        meta_title_es: post.meta_title_es,
        meta_description_en: post.meta_description_en,
        meta_description_es: post.meta_description_es,
        is_published: false,
        generated_by: 'claude',
      }).select('id').single();

      if (error) {
        console.error('Insert error:', error.message);
        continue;
      }

      generated.push(post.title_en);
      console.log('Generated:', post.title_en);

      // Rate limit
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error('Error generating post for:', spec.topic, err);
    }
  }

  // ── Notify admin via email ─────────────────────────────────────────────────
  if (generated.length > 0) {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `InfoSylvita: ${generated.length} new blog posts ready for review`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#2B5EBE">📝 New blog posts ready for review</h2>
          <p>${generated.length} posts have been generated and saved as drafts. Review and publish them in Supabase Studio.</p>
          <ul>${generated.map((t) => `<li>${t}</li>`).join('')}</ul>
          <a href="https://supabase.com/dashboard/project/jypneygzfjwknimanvxm/editor" style="display:inline-block;background:#2B5EBE;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">
            Open Supabase Studio →
          </a>
        </div>
      `,
    });
  }

  return new Response(
    JSON.stringify({ success: true, generated: generated.length, titles: generated }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
