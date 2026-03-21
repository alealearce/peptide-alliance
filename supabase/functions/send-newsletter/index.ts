// Supabase Edge Function: send-newsletter
// Scheduled: 12th of every month at 10:00 UTC via pg_cron
//
// NEW FLOW (approval-gated):
//   1. Fetches newest verified listings
//   2. Generates EN + ES content with Claude Haiku
//   3. Saves draft to newsletter_drafts (status = 'pending')
//   4. Emails admin a full preview with "Approve & Send" and "Edit Draft" buttons
//
// Actual subscriber send happens in /api/newsletter/approve after admin review.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@3';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!;
const ANTHROPIC_API_KEY    = Deno.env.get('ANTHROPIC_API_KEY')!;
const FROM                 = Deno.env.get('RESEND_FROM_EMAIL') ?? 'hi@peptidealliance.io';
const SITE                 = 'https://peptidealliance.io';
const ADMIN_EMAIL          = 'hi@arce.ca';

const supabase  = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const resend    = new Resend(RESEND_API_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const now     = new Date();
  const monthEN = MONTHS_EN[now.getMonth()];
  const monthES = MONTHS_ES[now.getMonth()];
  const year    = now.getFullYear();

  // ── 1. Fetch newest verified listings for the newsletter ───────────────────
  const { data: newBusinesses } = await supabase
    .from('businesses')
    .select('name, city, province, category, slug')
    .eq('is_verified', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const bizList = newBusinesses?.map((b) => `${b.name} (${b.city}, ${b.province})`).join(', ')
    ?? 'various peptide and regenerative health providers';

  // ── 2. Get subscriber count ────────────────────────────────────────────────
  const { count: subscriberCount } = await supabase
    .from('newsletter_subscribers')
    .select('id', { count: 'exact', head: true })
    .eq('subscribed', true);

  // ── 3. Generate content with Claude ───────────────────────────────────────
  let subject_en = `Peptide Alliance Newsletter — ${monthEN} ${year}`;
  let body_en    = `Hello from Peptide Alliance! Discover the latest in regenerative health this ${monthEN}. Visit us at ${SITE}`;
  let subject_es = `Boletín Peptide Alliance — ${monthES} ${year}`;
  let body_es    = `¡Hola desde Peptide Alliance! Descubre lo último en salud regenerativa este ${monthES}. Visítanos en ${SITE}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Generate a monthly newsletter for Peptide Alliance for ${monthEN} ${year}.

Featured new providers this month: ${bizList}

Include:
1. A warm greeting welcoming readers
2. 3 featured new providers added this month (names: ${bizList})
3. One tip for regenerative health practitioners
4. One tip for people looking for peptide therapy services
5. A closing CTA to explore Peptide Alliance

Keep it warm, concise, community-focused. Under 400 words per language.

Return ONLY valid JSON with this structure:
{
  "subject_en": "",
  "body_en": "",
  "subject_es": "",
  "body_es": ""
}`,
      }],
    });

    const raw       = (message.content[0] as { text: string }).text ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      subject_en = parsed.subject_en || subject_en;
      body_en    = parsed.body_en    || body_en;
      subject_es = parsed.subject_es || subject_es;
      body_es    = parsed.body_es    || body_es;
    }
  } catch (err) {
    console.error('[send-newsletter] Claude error:', err);
    // Continue with fallback content
  }

  // ── 4. Save draft to DB ────────────────────────────────────────────────────
  const { data: draft, error: draftErr } = await supabase
    .from('newsletter_drafts')
    .insert({
      subject_en,
      body_en,
      subject_es,
      body_es,
      subscriber_count: subscriberCount ?? 0,
    })
    .select('id, approval_token')
    .single();

  if (draftErr || !draft) {
    console.error('[send-newsletter] Failed to save draft:', draftErr);
    return new Response(JSON.stringify({ error: 'Failed to save draft' }), { status: 500 });
  }

  // ── 5. Email admin a preview with Approve + Edit buttons ──────────────────
  const approveUrl = `${SITE}/api/newsletter/approve?token=${draft.approval_token}`;
  const editUrl    = `${SITE}/en/admin/newsletter`;

  const previewHtml = buildAdminPreviewEmail({
    subject_en,
    body_en,
    monthEN,
    year,
    approveUrl,
    editUrl,
    subscriberCount: subscriberCount ?? 0,
  });

  await resend.emails.send({
    from,
    to:      ADMIN_EMAIL,
    subject: `📋 Newsletter Draft Ready for Approval — ${monthEN} ${year}`,
    html:    previewHtml,
  });

  console.log(`[send-newsletter] Draft saved (id: ${draft.id}), preview sent to admin.`);

  return new Response(
    JSON.stringify({ success: true, draft_id: draft.id }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});


// ── Admin preview email ────────────────────────────────────────────────────────

function buildAdminPreviewEmail({
  subject_en, body_en, monthEN, year,
  approveUrl, editUrl, subscriberCount,
}: {
  subject_en:      string;
  body_en:         string;
  monthEN:         string;
  year:            number;
  approveUrl:      string;
  editUrl:         string;
  subscriberCount: number;
}) {
  const bodyHtml = body_en
    .split('\n')
    .map((p: string) => p.trim() ? `<p style="margin:0 0 12px;font-size:14px;color:#374151;line-height:1.6;">${p}</p>` : '')
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f3f4f6;margin:0;padding:24px;">
<div style="max-width:640px;margin:0 auto;">

  <!-- Admin header -->
  <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;border-radius:12px 12px 0 0;padding:24px 28px;">
    <p style="margin:0;font-size:12px;opacity:0.7;text-transform:uppercase;letter-spacing:0.08em;">Peptide Alliance Admin</p>
    <h1 style="margin:6px 0 4px;font-size:22px;font-weight:800;">📋 Newsletter Draft Ready</h1>
    <p style="margin:0;opacity:0.85;font-size:14px;">${monthEN} ${year} &nbsp;·&nbsp; ${subscriberCount} subscribers</p>
  </div>

  <!-- Action buttons -->
  <div style="background:#fff;padding:20px 28px;border-bottom:2px solid #e5e7eb;">
    <p style="margin:0 0 14px;font-size:13px;color:#6b7280;">Review the preview below, then approve or edit before it goes out.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <a href="${approveUrl}"
         style="display:inline-block;background:#16a34a;color:white;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
        ✅ Approve &amp; Send to ${subscriberCount} subscribers
      </a>
      <a href="${editUrl}"
         style="display:inline-block;background:#2563eb;color:white;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
        ✏️ Edit Draft
      </a>
    </div>
  </div>

  <!-- Preview label -->
  <div style="background:#fefce8;border:1px solid #fde047;border-top:none;padding:10px 28px;font-size:13px;color:#854d0e;">
    👇 English preview — exactly what subscribers will receive
  </div>

  <!-- Newsletter preview -->
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:28px 28px 20px;">

      <!-- Subject preview chip -->
      <p style="font-size:12px;color:#6b7280;background:#f9fafb;padding:8px 12px;border-radius:6px;margin:0 0 20px;border:1px solid #e5e7eb;">
        <strong>Subject:</strong> ${subject_en}
      </p>

      <h2 style="color:#2B5EBE;margin:0 0 16px;font-size:20px;">Peptide Alliance — ${monthEN} ${year}</h2>

      ${bodyHtml}

      <div style="margin:24px 0">
        <span style="display:inline-block;background:#2B5EBE;color:white;padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;">
          Explore Peptide Alliance →
        </span>
      </div>

      <p style="color:#9CA3AF;font-size:12px;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:8px;">
        Peptide Alliance — The Standard in Regenerative Health<br>
        <span style="color:#d1d5db;">Unsubscribe</span>
      </p>
    </div>
  </div>

</div>
</body>
</html>`;
}
