import { Resend } from 'resend';
import { SITE, COLORS, CHATBOT } from '@/lib/config/site';

// Lazy-init so the constructor doesn't run at build time (when env vars aren't present)
let _resend: Resend | null = null;
export const getResend = () => {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
};
export const FROM = () => process.env.RESEND_FROM_EMAIL ?? SITE.supportEmail;

// Shared email footer snippet
const emailFooter = `
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
  <p style="color:#9CA3AF;font-size:12px">${SITE.name} — ${SITE.tagline}</p>
`;

// ── Send lead notification to business owner ───────────────────────────────

interface LeadEmailParams {
  ownerEmail: string;
  businessName: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  message: string;
}

export async function sendLeadNotification({
  ownerEmail,
  businessName,
  leadName,
  leadEmail,
  leadPhone,
  message,
}: LeadEmailParams) {
  await getResend().emails.send({
    from: FROM(),
    to: ownerEmail,
    replyTo: leadEmail || SITE.adminEmail,
    subject: `New message for ${businessName} — ${SITE.name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: ${COLORS.primary}; font-family: sans-serif;">New message for ${businessName}</h2>
        <p>Someone found your listing on ${SITE.name} and wants to connect!</p>
        <div style="background: ${COLORS.bg}; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p><strong>From:</strong> ${leadName}</p>
          <p><strong>Email:</strong> <a href="mailto:${leadEmail}">${leadEmail}</a></p>
          ${leadPhone ? `<p><strong>Phone:</strong> ${leadPhone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="color: #374151;">${message}</p>
        </div>
        <p style="color: #6B7280; font-size: 14px;">
          Reply directly to this email to respond to ${leadName}.
        </p>
        ${emailFooter}
      </div>
    `,
  });
}

// ── Payment failed notification ───────────────────────────────────────────

export async function sendPaymentFailedEmail({
  to,
  businessName,
}: {
  to: string;
  businessName: string;
}) {
  await getResend().emails.send({
    from: FROM(),
    to,
    replyTo: SITE.adminEmail,
    subject: `Action needed: Payment failed for ${businessName} — ${SITE.name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: ${COLORS.accent}; font-family: sans-serif;">⚠️ Payment failed for ${businessName}</h2>
        <p>We were unable to process your monthly payment for your ${SITE.name} listing.</p>
        <p>To keep your subscription features active, please update your payment method:</p>
        <a href="${SITE.url}/dashboard"
           style="display: inline-block; background: ${COLORS.primary}; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Update Payment Method
        </a>
        <p style="color: #6B7280; font-size: 14px; margin-top: 16px;">
          If we're unable to process payment after 3 attempts, your listing will revert to the free tier.
        </p>
        ${emailFooter}
      </div>
    `,
  });
}

// ── Expiry warning email for Jobs & Events ────────────────────────────────

export async function sendExpiryWarning({
  ownerEmail,
  businessName,
  expiresAt,
}: {
  ownerEmail: string;
  businessName: string;
  expiresAt: string;
}) {
  const expDate = new Date(expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await getResend().emails.send({
    from: FROM(),
    to: ownerEmail,
    replyTo: SITE.adminEmail,
    subject: `Your listing "${businessName}" is expiring soon — ${SITE.name}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:${COLORS.accent};font-family:sans-serif">
          Your listing is expiring soon
        </h2>
        <p>
          Your listing <strong>${businessName}</strong> on ${SITE.name} will expire on <strong>${expDate}</strong>.
        </p>
        <p>
          After this date it will no longer appear in active listings (the page stays live for SEO).
        </p>
        <p>
          Want to extend it? Log in to your dashboard and pick a new expiry date.
        </p>
        <a href="${SITE.url}/dashboard"
           style="display:inline-block;background:${COLORS.primary};color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">
          Go to Dashboard
        </a>
        ${emailFooter}
      </div>
    `,
  });
}

// ── Escalation email — sent when chatbot can't help ───────────────────────

export async function sendEscalationEmail({
  sessionId,
  messages,
}: {
  sessionId: string;
  messages: { role: string; content: string }[];
}) {
  const transcript = messages
    .map(
      (m) =>
        `<p style="margin:8px 0"><strong>${m.role === 'user' ? '👤 User' : `🤖 ${CHATBOT.name}`}:</strong> ${m.content}</p>`
    )
    .join('');

  await getResend().emails.send({
    from: FROM(),
    to: SITE.supportEmail,
    subject: `⚠️ ${CHATBOT.name} escalated a conversation — ${SITE.name}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:${COLORS.accent};font-family:sans-serif">⚠️ Conversation Needs Human Follow-Up</h2>
        <p>${CHATBOT.name} was unable to fully help a user and directed them to contact support.</p>
        <div style="background:#FEF3C7;border-radius:12px;padding:16px;margin:16px 0;font-size:13px">
          <p style="margin:4px 0"><strong>Session ID:</strong> ${sessionId}</p>
          <p style="margin:4px 0"><strong>Time:</strong> ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET</p>
        </div>
        <h3 style="color:#374151">Conversation Transcript</h3>
        <div style="background:#F9FAFB;border-radius:12px;padding:16px;margin:16px 0;font-size:14px;line-height:1.6">
          ${transcript}
        </div>
        ${emailFooter}
      </div>
    `,
  });
}

// ── Suggestion notification to admin ──────────────────────────────────────

export async function sendSuggestionNotification({
  type,
  content,
  email,
}: {
  type: string;
  content: string;
  email?: string;
}) {
  const typeLabels: Record<string, string> = {
    city: '🏙️ City',
    category: '📂 Category',
    business_type: '🏪 Business Type',
    other: '💬 Other',
  };
  await getResend().emails.send({
    from: FROM(),
    to: SITE.adminEmail,
    replyTo: email || SITE.adminEmail,
    subject: `New suggestion on ${SITE.name}: ${typeLabels[type] ?? type}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:${COLORS.primary};font-family:sans-serif">💡 New Suggestion</h2>
        <div style="background:${COLORS.bg};border-radius:12px;padding:20px;margin:20px 0">
          <p><strong>Type:</strong> ${typeLabels[type] ?? type}</p>
          <p><strong>Suggestion:</strong> ${content}</p>
          ${email ? `<p><strong>From:</strong> <a href="mailto:${email}">${email}</a></p>` : '<p><em>No email provided</em></p>'}
        </div>
        ${emailFooter}
      </div>
    `,
  });
}

// ── Listing is now live — activation email ────────────────────────────────

export async function sendListingLiveEmail({
  ownerEmail,
  ownerName,
  businessName,
  slug,
}: {
  ownerEmail: string;
  ownerName: string | null;
  businessName: string;
  slug: string;
}) {
  const listingUrl  = `${SITE.url}/business/${slug}`;
  const dashboardUrl = `${SITE.url}/dashboard`;
  const firstName   = ownerName ? ownerName.split(' ')[0] : 'there';

  await getResend().emails.send({
    from: FROM(),
    to: ownerEmail,
    replyTo: SITE.adminEmail,
    subject: `🎉 Your listing is live on ${SITE.name} — ${businessName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0">

        <!-- Header -->
        <tr><td style="background:${COLORS.primary};padding:36px 40px;text-align:center">
          <div style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:0.3px">${SITE.name}</div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:6px;letter-spacing:0.5px">${SITE.tagline.toUpperCase()}</div>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:40px 40px 0;text-align:center">
          <div style="font-size:48px;margin-bottom:16px">🎉</div>
          <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#1a202c">You're live, ${firstName}!</h1>
          <p style="margin:0;font-size:16px;color:#4a5568;line-height:1.6"><strong>${businessName}</strong> is now listed on ${SITE.name} and visible to people searching in your area.</p>
        </td></tr>

        <!-- View listing CTA -->
        <tr><td style="padding:28px 40px;text-align:center">
          <a href="${listingUrl}" style="display:inline-block;background:${COLORS.primary};color:#ffffff;font-size:16px;font-weight:700;padding:16px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px">
            🔍 See Your Listing
          </a>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0"></td></tr>

        <!-- Tips section header -->
        <tr><td style="padding:32px 40px 16px">
          <h2 style="margin:0 0 6px;font-size:18px;font-weight:800;color:#1a202c">3 things to do right now to rank higher 🚀</h2>
          <p style="margin:0;font-size:14px;color:#718096">These help your business get found on ${SITE.name}, Google, and AI tools like ChatGPT.</p>
        </td></tr>

        <!-- Tip 1 -->
        <tr><td style="padding:8px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:14px;padding:20px;border-left:4px solid ${COLORS.primary}">
            <tr>
              <td width="44" valign="top" style="padding:0 14px 0 0;font-size:28px">📍</td>
              <td>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a202c">Match your Google Business Profile</p>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.6">Make sure your business name, address, phone number, and website on ${SITE.name} <strong>exactly match</strong> your Google Business Profile. Consistent information across the web tells Google your business is legitimate and trustworthy.</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Tip 2 -->
        <tr><td style="padding:8px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:14px;padding:20px;border-left:4px solid ${COLORS.primary}">
            <tr>
              <td width="44" valign="top" style="padding:0 14px 0 0;font-size:28px">📲</td>
              <td>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a202c">Add your social media handles</p>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.6">Link your Instagram, Facebook, and other profiles from your dashboard. Social links boost your credibility and give customers more ways to discover you.</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Tip 3 -->
        <tr><td style="padding:8px 40px 28px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9ec;border-radius:14px;padding:20px;border-left:4px solid ${COLORS.accent}">
            <tr>
              <td width="44" valign="top" style="padding:0 14px 0 0;font-size:28px">🤖</td>
              <td>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a202c">Write a full description to get found by AI</p>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.6">Tools like ChatGPT and Google AI Overviews now answer questions like "best peptide clinic in Dallas." A rich, detailed description with your services and location is how you show up in those answers.</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Dashboard CTA -->
        <tr><td style="padding:28px 40px;text-align:center">
          <p style="margin:0 0 16px;font-size:15px;color:#4a5568">Update everything from your dashboard — it only takes a few minutes.</p>
          <a href="${dashboardUrl}" style="display:inline-block;background:${COLORS.primary};color:#ffffff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none">
            ✏️ Complete My Profile
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;color:#718096">${CHATBOT.name} · ${SITE.name} · <a href="mailto:${SITE.supportEmail}" style="color:${COLORS.primary};text-decoration:none">${SITE.supportEmail}</a></p>
          <p style="margin:0;font-size:11px;color:#a0aec0">${SITE.name} — ${SITE.tagline}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    text: `🎉 You're live, ${firstName}!

${businessName} is now listed on ${SITE.name}.

See your listing: ${listingUrl}

─────────────────────────────────────
3 things to do right now to rank higher
─────────────────────────────────────

📍 Match your Google Business Profile
📲 Add your social media handles
🤖 Write a full description to get found by AI

Update everything from your dashboard:
${dashboardUrl}

─────────────────────────────────────
${CHATBOT.name} · ${SITE.name} · ${SITE.supportEmail}`,
  });
}

// ── Welcome email for new business claim ──────────────────────────────────

export async function sendClaimConfirmation({
  ownerEmail,
  businessName,
}: {
  ownerEmail: string;
  businessName: string;
}) {
  await getResend().emails.send({
    from: FROM(),
    to: ownerEmail,
    replyTo: SITE.adminEmail,
    subject: `Welcome to ${SITE.name} — ${businessName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: ${COLORS.primary}; font-family: sans-serif;">Welcome to ${SITE.name}! 👋</h2>
        <p>Your claim request for <strong>${businessName}</strong> has been received.</p>
        <p>Our team will review it and get back to you within <strong>24 hours</strong>.</p>
        <p>In the meantime, you can log in to your dashboard to update your business information.</p>
        <a href="${SITE.url}/dashboard"
           style="display: inline-block; background: ${COLORS.primary}; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Go to Dashboard
        </a>
        ${emailFooter}
      </div>
    `,
  });
}
