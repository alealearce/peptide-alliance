// Supabase Edge Function: send-upgrade-offers
// Scheduled: every Monday at 9am UTC via pg_cron
// Identifies free-tier business owners who should receive upgrade offer emails.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SITE = 'https://infosylvita.com';
const FROM = Deno.env.get('RESEND_FROM_EMAIL') ?? 'hola@infosylvita.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const resend = new Resend(RESEND_API_KEY);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let sent = 0;
  let skipped = 0;

  // ── 1. Find eligible businesses ──────────────────────────────────────────
  // Free tier, has an owner, listed for 30+ days, not emailed in 60 days.
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select(`
      id, name, category, email,
      claimed_by,
      profiles!inner(email, preferred_language)
    `)
    .eq('subscription_tier', 'free')
    .not('claimed_by', 'is', null)
    .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error || !businesses?.length) {
    return new Response(
      JSON.stringify({ success: true, sent: 0, skipped: 0, reason: 'no eligible businesses' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── 2. Filter out recently emailed businesses ─────────────────────────────
  for (const biz of businesses) {
    // Check 60-day cooldown
    const { data: recentEmail } = await supabase
      .from('upgrade_emails_sent')
      .select('id')
      .eq('business_id', biz.id)
      .gt('sent_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .single();

    if (recentEmail) { skipped++; continue; }

    // ── 3. Count leads in last 30 days ────────────────────────────────────
    const { count: leadCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', biz.id)
      .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // ── 4. Count category searches in last 30 days ────────────────────────
    const { count: searchCount } = await supabase
      .from('search_events')
      .select('id', { count: 'exact', head: true })
      .eq('category', biz.category)
      .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Get owner email + language
    // profiles is a join, may be array or object depending on query
    const profile = Array.isArray(biz.profiles) ? biz.profiles[0] : biz.profiles;
    const ownerEmail = profile?.email;
    if (!ownerEmail) { skipped++; continue; }

    const lang: 'en' | 'es' = profile?.preferred_language === 'en' ? 'en' : 'es';
    const upgradeUrl = `${SITE}/${lang}/upgrade?businessId=${biz.id}`;

    // ── 5. Choose email type and send ─────────────────────────────────────
    let emailType: string;
    let subject: string;
    let html: string;

    if ((leadCount ?? 0) >= 3) {
      // "You have leads waiting"
      emailType = 'leads_waiting';
      ({ subject, html } = buildLeadsEmail({ lang, businessName: biz.name, leadCount: leadCount ?? 0, upgradeUrl }));
    } else {
      // "Boost your visibility"
      emailType = 'boost_visibility';
      ({ subject, html } = buildBoostEmail({ lang, businessName: biz.name, categorySearchCount: searchCount ?? 0, upgradeUrl }));
    }

    await resend.emails.send({ from: FROM, to: ownerEmail, subject, html });

    // ── 6. Log the send ───────────────────────────────────────────────────
    await supabase.from('upgrade_emails_sent').insert({
      business_id: biz.id,
      email_type: emailType,
    });

    sent++;

    // Small delay to respect Resend rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  return new Response(
    JSON.stringify({ success: true, sent, skipped }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});

// ── Email builders ────────────────────────────────────────────────────────────

function buildLeadsEmail({
  lang, businessName, leadCount, upgradeUrl,
}: { lang: 'en' | 'es'; businessName: string; leadCount: number; upgradeUrl: string }) {
  if (lang === 'es') {
    return {
      subject: `¡Tienes ${leadCount} ${leadCount === 1 ? 'contacto nuevo' : 'contactos nuevos'}! Mejora para responder más rápido`,
      html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#2B5EBE;font-family:Nunito,sans-serif">👵🏽 Hola desde InfoSylvita</h2>
        <p>Tu negocio <strong>${businessName}</strong> recibió <strong>${leadCount} ${leadCount === 1 ? 'consulta' : 'consultas'}</strong> en los últimos 30 días.</p>
        <div style="background:#EAF4E8;border-radius:12px;padding:20px;margin:20px 0">
          <p style="margin:0;font-size:32px;font-weight:700;color:#2B5EBE">${leadCount}</p>
          <p style="margin:4px 0 0;color:#374151">clientes potenciales esperando respuesta</p>
        </div>
        <p>Con <strong>Premium</strong> recibirás notificación por cada consulta al instante.</p>
        <p>✅ Insignia verificada &nbsp; ✅ Notificaciones &nbsp; ✅ Informe mensual</p>
        <a href="${upgradeUrl}" style="display:inline-block;background:#2B5EBE;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">Ver Mis Consultas y Mejorar →</a>
        <p style="color:#9CA3AF;font-size:12px;margin-top:24px">InfoSylvita — Conectando la comunidad latina en Canadá</p>
      </div>`,
    };
  }
  return {
    subject: `You have ${leadCount} new ${leadCount === 1 ? 'lead' : 'leads'}! Upgrade to respond faster`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#2B5EBE;font-family:Nunito,sans-serif">👵🏽 Hello from InfoSylvita</h2>
      <p>Your listing <strong>${businessName}</strong> received <strong>${leadCount} ${leadCount === 1 ? 'inquiry' : 'inquiries'}</strong> in the last 30 days.</p>
      <div style="background:#EAF4E8;border-radius:12px;padding:20px;margin:20px 0">
        <p style="margin:0;font-size:32px;font-weight:700;color:#2B5EBE">${leadCount}</p>
        <p style="margin:4px 0 0;color:#374151">potential customers waiting</p>
      </div>
      <p>With <strong>Premium</strong>, get email notifications for every inquiry instantly.</p>
      <p>✅ Verified badge &nbsp; ✅ Lead notifications &nbsp; ✅ Monthly report</p>
      <a href="${upgradeUrl}" style="display:inline-block;background:#2B5EBE;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">See My Leads & Upgrade →</a>
      <p style="color:#9CA3AF;font-size:12px;margin-top:24px">InfoSylvita — Connecting the Latin community across Canada</p>
    </div>`,
  };
}

function buildBoostEmail({
  lang, businessName, categorySearchCount, upgradeUrl,
}: { lang: 'en' | 'es'; businessName: string; categorySearchCount: number; upgradeUrl: string }) {
  if (lang === 'es') {
    return {
      subject: `Tu perfil en InfoSylvita podría ser visto por más personas`,
      html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#2B5EBE;font-family:Nunito,sans-serif">👵🏽 Hola desde InfoSylvita</h2>
        <p>Tu negocio <strong>${businessName}</strong> está activo en el directorio.</p>
        <div style="background:#EAF4E8;border-radius:12px;padding:20px;margin:20px 0">
          <p style="font-weight:600;color:#374151">El mes pasado, <strong>${categorySearchCount} personas</strong> buscaron en tu categoría en InfoSylvita.</p>
          <p style="margin:8px 0 0;color:#6B7280">Con perfil Destacado, aparecerías primero en esas búsquedas.</p>
        </div>
        <p>🔍 Primero en resultados &nbsp; ⭐ Sección de inicio &nbsp; ✅ Insignia verificada</p>
        <a href="${upgradeUrl}" style="display:inline-block;background:#2B5EBE;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">Prueba Premium Gratis 14 Días →</a>
        <p style="color:#9CA3AF;font-size:12px;margin-top:24px">InfoSylvita — Conectando la comunidad latina en Canadá</p>
      </div>`,
    };
  }
  return {
    subject: `Your InfoSylvita listing could be seen by more people`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#2B5EBE;font-family:Nunito,sans-serif">👵🏽 Hello from InfoSylvita</h2>
      <p>Your listing <strong>${businessName}</strong> is live in the directory.</p>
      <div style="background:#EAF4E8;border-radius:12px;padding:20px;margin:20px 0">
        <p style="font-weight:600;color:#374151">Last month, <strong>${categorySearchCount} people</strong> searched in your category on InfoSylvita.</p>
        <p style="margin:8px 0 0;color:#6B7280">With a Featured listing, your business would appear first.</p>
      </div>
      <p>🔍 Top of search results &nbsp; ⭐ Homepage featured &nbsp; ✅ Verified badge</p>
      <a href="${upgradeUrl}" style="display:inline-block;background:#2B5EBE;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">Upgrade Your Listing →</a>
      <p style="color:#9CA3AF;font-size:12px;margin-top:24px">InfoSylvita — Connecting the Latin community across Canada</p>
    </div>`,
  };
}
