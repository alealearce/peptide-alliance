// ── Upgrade offer email templates ────────────────────────────────────────────
// Used by the send-upgrade-offers edge function.
// Each function returns { subject, html } for use with Resend.

const SITE = 'https://peptidealliance.io';
const STYLE = {
  wrapper: 'font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;',
  h2: 'font-family: Nunito, sans-serif; color: #2B5EBE; margin-bottom: 8px;',
  card: 'background: #EAF4E8; border-radius: 12px; padding: 20px; margin: 20px 0;',
  btn: 'display: inline-block; background: #2B5EBE; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-top: 16px;',
  footer: 'color: #9CA3AF; font-size: 12px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;',
};

// ── "You have leads" email ────────────────────────────────────────────────────

export function upgradeLeadsEmail({
  lang,
  businessName,
  leadCount,
  upgradeUrl,
}: {
  lang: 'en' | 'es';
  businessName: string;
  leadCount: number;
  upgradeUrl: string;
}) {
  if (lang === 'es') {
    return {
      subject: `¡Tienes ${leadCount} ${leadCount === 1 ? 'contacto nuevo' : 'contactos nuevos'}! Mejora para responder más rápido`,
      html: `
        <div style="${STYLE.wrapper}">
          <h2 style="${STYLE.h2}">🧬 Hola desde Peptide Alliance</h2>
          <p>Tu negocio <strong>${businessName}</strong> ha recibido <strong>${leadCount} ${leadCount === 1 ? 'consulta' : 'consultas'}</strong> en los últimos 30 días.</p>
          <div style="${STYLE.card}">
            <p style="margin:0; font-size: 32px; font-weight: 700; color: #2B5EBE;">${leadCount}</p>
            <p style="margin:4px 0 0; color: #374151;">clientes potenciales están esperando</p>
          </div>
          <p>Con un perfil <strong>Premium</strong> recibirás una notificación por correo cada vez que alguien te contacte, para que puedas responder de inmediato.</p>
          <p>✅ Insignia verificada &nbsp; ✅ Notificaciones de consultas &nbsp; ✅ Informe mensual</p>
          <a href="${upgradeUrl}" style="${STYLE.btn}">Ver Mis Consultas y Mejorar →</a>
          <p style="${STYLE.footer}">Peptide Alliance — The Standard in Regenerative Health<br>
          <a href="${SITE}/es/unsubscribe" style="color:#9CA3AF;">Cancelar suscripción</a></p>
        </div>
      `,
    };
  }

  return {
    subject: `You have ${leadCount} new ${leadCount === 1 ? 'lead' : 'leads'}! Upgrade to respond faster`,
    html: `
      <div style="${STYLE.wrapper}">
        <h2 style="${STYLE.h2}">🧬 Hello from Peptide Alliance</h2>
        <p>Your listing <strong>${businessName}</strong> has received <strong>${leadCount} ${leadCount === 1 ? 'inquiry' : 'inquiries'}</strong> in the last 30 days.</p>
        <div style="${STYLE.card}">
          <p style="margin:0; font-size: 32px; font-weight: 700; color: #2B5EBE;">${leadCount}</p>
          <p style="margin:4px 0 0; color: #374151;">potential customers waiting</p>
        </div>
        <p>With a <strong>Premium</strong> listing, you'll get an email notification every time someone contacts you — so you can respond right away.</p>
        <p>✅ Verified badge &nbsp; ✅ Lead notifications &nbsp; ✅ Monthly report</p>
        <a href="${upgradeUrl}" style="${STYLE.btn}">See My Leads & Upgrade →</a>
        <p style="${STYLE.footer}">Peptide Alliance — The Standard in Regenerative Health<br>
        <a href="${SITE}/en/unsubscribe" style="color:#9CA3AF;">Unsubscribe</a></p>
      </div>
    `,
  };
}

// ── "Boost your visibility" email ────────────────────────────────────────────

export function upgradeBoostEmail({
  lang,
  businessName,
  categorySearchCount,
  upgradeUrl,
}: {
  lang: 'en' | 'es';
  businessName: string;
  categorySearchCount: number;
  upgradeUrl: string;
}) {
  if (lang === 'es') {
    return {
      subject: `Tu perfil en Peptide Alliance podría ser visto por más personas`,
      html: `
        <div style="${STYLE.wrapper}">
          <h2 style="${STYLE.h2}">🧬 Hola desde Peptide Alliance</h2>
          <p>Tu negocio <strong>${businessName}</strong> está activo en el directorio, pero hay algo que quiero contarte.</p>
          <div style="${STYLE.card}">
            <p style="margin:0; font-weight: 600; color: #374151;">En el último mes, <strong>${categorySearchCount} personas</strong> buscaron en tu categoría en Peptide Alliance.</p>
            <p style="margin: 8px 0 0; color: #6B7280;">Con un perfil Destacado, tu negocio aparecería primero en esas búsquedas.</p>
          </div>
          <p>🔍 Primero en resultados de búsqueda<br>⭐ Sección destacada en la página de inicio<br>✅ Insignia de negocio verificado</p>
          <a href="${upgradeUrl}" style="${STYLE.btn}">Prueba Premium Gratis 14 Días →</a>
          <p style="${STYLE.footer}">Peptide Alliance — The Standard in Regenerative Health<br>
          <a href="${SITE}/es/unsubscribe" style="color:#9CA3AF;">Cancelar suscripción</a></p>
        </div>
      `,
    };
  }

  return {
    subject: `Your Peptide Alliance listing could be seen by more people`,
    html: `
      <div style="${STYLE.wrapper}">
        <h2 style="${STYLE.h2}">🧬 Hello from Peptide Alliance</h2>
        <p>Your listing <strong>${businessName}</strong> is live in the directory — but here's something to know.</p>
        <div style="${STYLE.card}">
          <p style="margin:0; font-weight: 600; color: #374151;">Last month, <strong>${categorySearchCount} people</strong> searched in your category on Peptide Alliance.</p>
          <p style="margin: 8px 0 0; color: #6B7280;">With a Featured listing, your business would appear first in those searches.</p>
        </div>
        <p>🔍 Top of search results<br>⭐ Homepage featured section<br>✅ Verified business badge</p>
        <a href="${upgradeUrl}" style="${STYLE.btn}">Upgrade Your Listing →</a>
        <p style="${STYLE.footer}">Peptide Alliance — The Standard in Regenerative Health<br>
        <a href="${SITE}/en/unsubscribe" style="color:#9CA3AF;">Unsubscribe</a></p>
      </div>
    `,
  };
}
