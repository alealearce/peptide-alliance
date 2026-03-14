import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { sendSuggestionNotification } from '@/lib/email/resend';
import { rateLimit } from '@/lib/rateLimit';

const SuggestionSchema = z.object({
  type: z.enum(['city', 'category', 'business_type', 'other']),
  content: z.string().min(2).max(500),
  email: z.string().email().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  // Rate limit: 10 suggestions per hour per IP
  const rl = rateLimit(req, { limit: 10, windowMs: 60 * 60_000, prefix: 'suggestions' });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = SuggestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { type, content, email } = parsed.data;
    const supabase = createAdminClient();

    const { error } = await supabase.from('suggestions').insert({
      type,
      content,
      email: email || null,
    });

    if (error) {
      console.error('[suggestions] insert error:', error);
      return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 });
    }

    // Fire-and-forget admin notification — don't fail if email errors
    sendSuggestionNotification({ type, content, email: email || undefined }).catch(
      (err) => console.error('[suggestions] email error:', err)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[suggestions] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
