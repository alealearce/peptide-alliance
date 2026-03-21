import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getResend, FROM } from '@/lib/email/resend';

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', false)
    .not('claimed_by', 'is', null);

  if (error) {
    console.error('[pending-check] supabase error:', error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  if (!count || count === 0) {
    return NextResponse.json({ ok: true, pending: 0, emailSent: false });
  }

  const resend = getResend();
  await resend.emails.send({
    from: FROM(),
    to: 'hi@arce.ca',
    subject: `${count} business${count > 1 ? 'es' : ''} waiting for approval — Peptide Alliance`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#0A1F44;font-family:Inter,sans-serif">Pending Business Approvals</h2>
        <p>You have <strong>${count} business${count > 1 ? 'es' : ''}</strong> waiting for approval on Peptide Alliance.</p>
        <a href="https://peptidealliance.io/admin"
           style="display:inline-block;background:#0A1F44;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">
          Review in Admin Panel →
        </a>
        <p style="color:#9CA3AF;font-size:12px;margin-top:24px">Peptide Alliance — Automated notification</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, pending: count, emailSent: true });
}
