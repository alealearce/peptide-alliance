import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { getResend, FROM } from '@/lib/email/resend';
import { rateLimit } from '@/lib/rateLimit';

const SubscribeSchema = z.object({
  email: z.string().email(),
  city: z.string().max(100).optional(),
  preferred_language: z.enum(['en', 'es']).default('es'),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 subscribe attempts per hour per IP
  const rl = rateLimit(req, { limit: 5, windowMs: 60 * 60_000, prefix: 'newsletter' });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { email, city, preferred_language } = parsed.data;
    const supabase = createAdminClient();

    // Rate limit: check if this email was inserted in the last 24 hours
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, subscribed, created_at')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.subscribed) {
        // Already subscribed — silently return success (don't leak info)
        return NextResponse.json({ ok: true });
      }
      // Was unsubscribed — re-subscribe them
      await supabase
        .from('newsletter_subscribers')
        .update({ subscribed: true, city: city ?? null, preferred_language })
        .eq('email', email);
    } else {
      // New subscriber
      await supabase.from('newsletter_subscribers').insert({
        email,
        city: city ?? null,
        preferred_language,
      });
    }

    // Send welcome email
    const resend = getResend();
    const fromAddr = FROM();

    await resend.emails.send({
      from: fromAddr,
      to: email,
      replyTo: 'hi@arce.ca',
      subject: 'Welcome to Peptide Alliance!',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0A1F44;font-family:Inter,sans-serif">Welcome to the Peptide Alliance community!</h2>
          <p>Thanks for subscribing. Each month we'll send you:</p>
          <ul>
            <li>🧬 Latest peptide research and insights</li>
            <li>🏥 New verified suppliers and sources</li>
            <li>💡 Tips for regenerative health</li>
            <li>🔍 The best of the directory</li>
          </ul>
          <a href="https://peptidealliance.io" style="display:inline-block;background:#0A1F44;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:16px">Explore the Directory →</a>
          <p style="color:#9CA3AF;font-size:12px;margin-top:24px">Peptide Alliance — The Standard in Regenerative Health</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('[newsletter/subscribe] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
