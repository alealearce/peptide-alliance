import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendLeadNotification, sendLeadAdminNotification } from '@/lib/email/resend';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const LeadSchema = z.object({
  businessId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  // Rate limit: 10 lead submissions per hour per IP
  const rl = rateLimit(req, { limit: 10, windowMs: 60 * 60_000, prefix: 'leads' });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { businessId, name, email, phone, message } = parsed.data;
    const supabase = await createServiceClient();

    // Verify the business exists and is active before inserting a lead
    const { data: bizCheck, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('is_active', true)
      .single();

    if (bizError || !bizCheck) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Insert lead (DB columns: user_name, user_email, user_phone)
    const { error: insertError } = await supabase.from('leads').insert({
      business_id: businessId,
      user_name: name,
      user_email: email,
      user_phone: phone ?? null,
      message,
    });

    if (insertError) {
      console.error('Lead insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // Fetch business + owner email for notification
    const { data: biz } = await supabase
      .from('businesses')
      .select('name, claimed_by')
      .eq('id', businessId)
      .single();

    const isClaimed = !!biz?.claimed_by;

    if (isClaimed) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', biz!.claimed_by)
        .single();

      if (profile?.email) {
        void sendLeadNotification({
          ownerEmail: profile.email,
          businessName: biz!.name,
          leadName: name,
          leadEmail: email,
          leadPhone: phone,
          message,
        }).catch((err) => console.error('[leads] owner email error:', err));
      }
    }

    // Always notify admin — includes a flag if business is unclaimed
    void sendLeadAdminNotification({
      businessName: biz?.name ?? 'Unknown Business',
      businessId,
      leadName: name,
      leadEmail: email,
      leadPhone: phone,
      message,
      isClaimed,
    }).catch((err) => console.error('[leads] admin notification error:', err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Leads API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
