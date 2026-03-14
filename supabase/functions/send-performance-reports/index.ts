// Supabase Edge Function: send-performance-reports
// Scheduled: 1st of every month at 8am UTC via pg_cron
// Sends monthly performance reports to Premium and Featured business owners.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@3';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const FROM = Deno.env.get('RESEND_FROM_EMAIL') ?? 'hola@infosylvita.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const resend = new Resend(RESEND_API_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const now = new Date();
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let sent = 0;

  // ── 1. Get all Premium / Featured businesses with owners ─────────────────
  const { data: businesses } = await supabase
    .from('businesses')
    .select(`
      id, name, category, subcategory, city, claimed_by,
      profiles!inner(email, preferred_language)
    `)
    .in('subscription_tier', ['premium', 'featured'])
    .not('claimed_by', 'is', null);

  if (!businesses?.length) {
    return new Response(JSON.stringify({ success: true, sent: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  for (const biz of businesses) {
    const profile = Array.isArray(biz.profiles) ? biz.profiles[0] : biz.profiles;
    const ownerEmail = profile?.email;
    if (!ownerEmail) continue;

    const lang: 'en' | 'es' = profile?.preferred_language === 'en' ? 'en' : 'es';

    // ── 2. Gather stats ───────────────────────────────────────────────────
    const [
      { count: viewsThisMonth },
      { count: viewsLastMonth },
      { count: leadsThisMonth },
      { count: leadsLastMonth },
      { count: searchesThisMonth },
    ] = await Promise.all([
      supabase.from('listing_views').select('id', { count: 'exact', head: true })
        .eq('business_id', biz.id).gt('created_at', thirtyDaysAgo),
      supabase.from('listing_views').select('id', { count: 'exact', head: true })
        .eq('business_id', biz.id).gt('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
      supabase.from('leads').select('id', { count: 'exact', head: true })
        .eq('business_id', biz.id).gt('created_at', thirtyDaysAgo),
      supabase.from('leads').select('id', { count: 'exact', head: true })
        .eq('business_id', biz.id).gt('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
      supabase.from('search_events').select('id', { count: 'exact', head: true })
        .eq('category', biz.category).gt('created_at', thirtyDaysAgo),
    ]);

    // % change
    const viewChange = calcChange(viewsThisMonth ?? 0, viewsLastMonth ?? 0);
    const leadChange = calcChange(leadsThisMonth ?? 0, leadsLastMonth ?? 0);

    // ── 3. Top cities viewing this listing ────────────────────────────────
    // (simplified — just use the business's own city for now)
    const topCity = biz.city;

    // ── 4. Generate AI tip ────────────────────────────────────────────────
    let tip = '';
    try {
      const tipMsg = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `Give one specific, actionable business tip for a ${biz.subcategory} owner in Canada in 2-3 sentences. Focus on what Latin business owners can do to attract more local customers. Be warm and practical. ${lang === 'es' ? 'Respond in Spanish.' : 'Respond in English.'}`,
        }],
      });
      tip = (tipMsg.content[0] as { text: string }).text ?? '';
    } catch {
      tip = lang === 'es'
        ? 'Recuerda responder rápido a los mensajes de tus clientes — ¡la velocidad de respuesta es clave para ganar confianza!'
        : 'Remember to respond quickly to customer inquiries — response speed is key to building trust!';
    }

    // ── 5. Build and send report email ────────────────────────────────────
    const monthName = lang === 'es'
      ? MONTHS_ES[now.getMonth()]
      : MONTHS_EN[now.getMonth()];

    const html = buildReportHtml({
      lang,
      businessName: biz.name,
      monthName,
      viewsThisMonth: viewsThisMonth ?? 0,
      viewChange,
      leadsThisMonth: leadsThisMonth ?? 0,
      leadChange,
      searchesThisMonth: searchesThisMonth ?? 0,
      topCity,
      tip,
    });

    const subject = lang === 'es'
      ? `Tu informe de ${monthName} — ${biz.name}`
      : `Your ${monthName} performance report — ${biz.name}`;

    await resend.emails.send({ from: FROM, to: ownerEmail, subject, html });
    sent++;

    await new Promise((r) => setTimeout(r, 200));
  }

  return new Response(JSON.stringify({ success: true, sent }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// ── Helpers ────────────────────────────────────────────────────────────────

function calcChange(current: number, previous: number): string {
  if (previous === 0 && current === 0) return '–';
  if (previous === 0) return '+100%';
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

function buildReportHtml({
  lang, businessName, monthName,
  viewsThisMonth, viewChange,
  leadsThisMonth, leadChange,
  searchesThisMonth, topCity, tip,
}: {
  lang: 'en' | 'es';
  businessName: string;
  monthName: string;
  viewsThisMonth: number;
  viewChange: string;
  leadsThisMonth: number;
  leadChange: string;
  searchesThisMonth: number;
  topCity: string;
  tip: string;
}) {
  const stat = (n: number, change: string) =>
    `<p style="font-size:28px;font-weight:700;color:#2B5EBE;margin:0">${n}</p>
     <p style="font-size:13px;color:#6B7280;margin:4px 0 0">${change} vs last month</p>`;

  if (lang === 'es') {
    return `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#2B5EBE;font-family:Nunito,sans-serif">📊 Tu Informe de ${monthName}</h2>
      <p>Hola, aquí está el resumen de <strong>${businessName}</strong> este mes.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:20px 0">
        <div style="background:#EAF4E8;border-radius:12px;padding:16px;text-align:center">
          <p style="font-size:12px;font-weight:600;color:#374151;margin:0 0 8px">Visitas</p>
          ${stat(viewsThisMonth, viewChange)}
        </div>
        <div style="background:#EAF4E8;border-radius:12px;padding:16px;text-align:center">
          <p style="font-size:12px;font-weight:600;color:#374151;margin:0 0 8px">Consultas</p>
          ${stat(leadsThisMonth, leadChange)}
        </div>
        <div style="background:#EAF4E8;border-radius:12px;padding:16px;text-align:center">
          <p style="font-size:12px;font-weight:600;color:#374151;margin:0 0 8px">Búsquedas en tu categoría</p>
          <p style="font-size:28px;font-weight:700;color:#2B5EBE;margin:0">${searchesThisMonth}</p>
        </div>
      </div>
      <p>🏙️ <strong>Ciudad principal:</strong> ${topCity}</p>
      <div style="background:#FEFAF4;border:1px solid #C4873A30;border-radius:12px;padding:16px;margin:20px 0">
        <p style="font-weight:600;color:#C4873A;margin:0 0 8px">💡 Consejo del mes</p>
        <p style="color:#374151;margin:0">${tip}</p>
      </div>
      <a href="https://infosylvita.com/es/dashboard" style="display:inline-block;background:#2B5EBE;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:700">Ver Mi Panel →</a>
      <p style="color:#9CA3AF;font-size:12px;margin-top:24px">InfoSylvita — Conectando la comunidad latina en Canadá</p>
    </div>`;
  }

  return `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
    <h2 style="color:#2B5EBE;font-family:Nunito,sans-serif">📊 Your ${monthName} Performance Report</h2>
    <p>Here's how <strong>${businessName}</strong> performed this month.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:20px 0">
      <div style="background:#EAF4E8;border-radius:12px;padding:16px;text-align:center">
        <p style="font-size:12px;font-weight:600;color:#374151;margin:0 0 8px">Listing Views</p>
        ${stat(viewsThisMonth, viewChange)}
      </div>
      <div style="background:#EAF4E8;border-radius:12px;padding:16px;text-align:center">
        <p style="font-size:12px;font-weight:600;color:#374151;margin:0 0 8px">Leads Received</p>
        ${stat(leadsThisMonth, leadChange)}
      </div>
      <div style="background:#EAF4E8;border-radius:12px;padding:16px;text-align:center">
        <p style="font-size:12px;font-weight:600;color:#374151;margin:0 0 8px">Category Searches</p>
        <p style="font-size:28px;font-weight:700;color:#2B5EBE;margin:0">${searchesThisMonth}</p>
      </div>
    </div>
    <p>🏙️ <strong>Top city viewing your listing:</strong> ${topCity}</p>
    <div style="background:#FEFAF4;border:1px solid #C4873A30;border-radius:12px;padding:16px;margin:20px 0">
      <p style="font-weight:600;color:#C4873A;margin:0 0 8px">💡 Tip of the month</p>
      <p style="color:#374151;margin:0">${tip}</p>
    </div>
    <a href="https://infosylvita.com/en/dashboard" style="display:inline-block;background:#2B5EBE;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:700">Go to My Dashboard →</a>
    <p style="color:#9CA3AF;font-size:12px;margin-top:24px">InfoSylvita — Connecting the Latin community across Canada</p>
  </div>`;
}
