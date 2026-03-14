// POST  /api/newsletter/approve   — called from the admin edit page with (possibly edited) content
// GET   /api/newsletter/approve   — called directly from the email "Approve & Send" button link

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

// Allow up to 60 s on Vercel so large subscriber lists don't time out
export const maxDuration = 60;

// Lazy-init so the constructor doesn't run at build time
let _resend: Resend | null = null;
const getResend = () => {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
};
const FROM   = () => process.env.RESEND_FROM_EMAIL ?? 'hello@peptidealliance.io';
const SITE_URL = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://peptidealliance.io';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── Shared send logic ─────────────────────────────────────────────────────────

async function sendToSubscribers(draft: {
  id: string;
  subject_en: string;
  body_en: string;
}): Promise<number> {
  const admin   = createAdminClient();
  const now     = new Date();
  const month   = MONTHS[now.getMonth()];
  const year    = now.getFullYear();

  const { data: subscribers } = await admin
    .from('newsletter_subscribers')
    .select('email, unsubscribe_token')
    .eq('subscribed', true);

  if (!subscribers?.length) return 0;

  let sent       = 0;
  const BATCH    = 50;

  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH);

    await Promise.all(batch.map(async (sub) => {
      const unsubUrl = `${SITE_URL()}/en/unsubscribe?token=${sub.unsubscribe_token}`;

      const bodyHtml = draft.body_en
        .split('\n')
        .map((p: string) => p.trim() ? `<p>${p}</p>` : '')
        .join('');

      const html = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0A1F44;font-family:Inter,sans-serif">The Peptide Alliance — ${month} ${year}</h2>
          ${bodyHtml}
          <div style="margin:24px 0">
            <a href="${SITE_URL()}"
               style="display:inline-block;background:#0A1F44;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:700">
              Explore The Peptide Alliance &rarr;
            </a>
          </div>
          <p style="color:#9CA3AF;font-size:12px;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:24px">
            The Peptide Alliance — The Standard in Regenerative Health<br>
            <a href="${unsubUrl}" style="color:#9CA3AF">Unsubscribe</a>
          </p>
        </div>
      `;

      await getResend().emails.send({ from: FROM(), to: sub.email, subject: draft.subject_en, html });
      sent++;
    }));

    // Pause between batches to stay within Resend rate limits
    if (i + BATCH < subscribers.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Mark draft as sent
  await admin
    .from('newsletter_drafts')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', draft.id);

  return sent;
}

// ── GET — triggered by clicking "Approve & Send" link in admin preview email ──

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/en/admin/newsletter?error=missing-token', req.url));
  }

  const admin = createAdminClient();
  const { data: draft, error } = await admin
    .from('newsletter_drafts')
    .select('id, subject_en, body_en')
    .eq('approval_token', token)
    .eq('status', 'pending')
    .single();

  if (error || !draft) {
    return NextResponse.redirect(
      new URL('/en/admin/newsletter?error=invalid-token', req.url),
    );
  }

  try {
    const sent = await sendToSubscribers(draft);
    return NextResponse.redirect(
      new URL(`/en/admin/newsletter?sent=${sent}`, req.url),
    );
  } catch (err) {
    console.error('[newsletter/approve GET] send error:', err);
    return NextResponse.redirect(
      new URL('/en/admin/newsletter?error=send-failed', req.url),
    );
  }
}

// ── POST — triggered from the admin edit page with (possibly edited) content ──

export async function POST(req: NextRequest) {
  // Must be a logged-in admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { token, subject_en, body_en } = body;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const { data: draft, error } = await admin
    .from('newsletter_drafts')
    .select('id, subject_en, body_en, approval_token')
    .eq('approval_token', token)
    .eq('status', 'pending')
    .single();

  if (error || !draft) {
    return NextResponse.json(
      { error: 'Draft not found or already sent' },
      { status: 404 },
    );
  }

  // Merge any edits the admin made in the editor
  const finalDraft = {
    ...draft,
    subject_en: subject_en ?? draft.subject_en,
    body_en:    body_en    ?? draft.body_en,
  };

  // Persist edits before sending
  await admin
    .from('newsletter_drafts')
    .update({
      subject_en: finalDraft.subject_en,
      body_en:    finalDraft.body_en,
    })
    .eq('id', draft.id);

  try {
    const sent = await sendToSubscribers(finalDraft);
    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error('[newsletter/approve POST] send error:', err);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}
