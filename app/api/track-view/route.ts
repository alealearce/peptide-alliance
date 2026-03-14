import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json() as { businessId: string };
    // Validate UUID format to prevent junk data insertion
    if (!businessId || !UUID_RE.test(businessId)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Don't track views from the business owner
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (user) {
      const supabaseAdmin = createAdminClient();
      const { data: biz } = await supabaseAdmin
        .from('businesses')
        .select('claimed_by')
        .eq('id', businessId)
        .single();

      if (biz?.claimed_by === user.id) {
        return NextResponse.json({ ok: true, tracked: false });
      }
    }

    // Hash the IP for PIPEDA/GDPR compliance — no raw PII stored
    const forwarded = req.headers.get('x-forwarded-for');
    const rawIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const salt = process.env.IP_HASH_SALT ?? 'infosylvita-default-salt';
    const hashedIp = rawIp !== 'unknown'
      ? createHash('sha256').update(rawIp + salt).digest('hex').slice(0, 16)
      : 'unknown';
    const referrer = (req.headers.get('referer') ?? '').slice(0, 500);

    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from('listing_views').insert({
      business_id: businessId,
      viewer_ip: hashedIp,
      referrer: referrer || null,
    });

    return NextResponse.json({ ok: true, tracked: true });
  } catch (err) {
    console.error('[track-view] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
