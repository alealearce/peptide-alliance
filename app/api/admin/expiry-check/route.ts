import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendExpiryWarning } from '@/lib/email/resend';

// Runs daily via Vercel Cron. Finds Jobs & Events listings expiring in the
// next 3 days (but not yet expired) and emails the owner a heads-up.
// The 3-day window prevents duplicate emails on consecutive runs because
// each listing only enters the window once (unless the owner extends it).

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Window: expiring between 2 and 3 days from now
  const warningStart = new Date();
  warningStart.setDate(warningStart.getDate() + 2);

  const warningEnd = new Date();
  warningEnd.setDate(warningEnd.getDate() + 3);

  const { data: expiring, error } = await supabase
    .from('businesses')
    .select('id, name, expires_at, claimed_by, category')
    .in('category', ['eventos', 'trabajos'])
    .not('expires_at', 'is', null)
    .gte('expires_at', warningStart.toISOString())
    .lt('expires_at', warningEnd.toISOString());

  if (error) {
    console.error('[expiry-check] supabase error:', error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  if (!expiring || expiring.length === 0) {
    return NextResponse.json({ ok: true, notified: 0 });
  }

  // Fetch owner emails from profiles
  const ownerIds = expiring
    .map((b) => b.claimed_by)
    .filter(Boolean) as string[];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, preferred_language')
    .in('id', ownerIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  let notified = 0;
  for (const biz of expiring) {
    if (!biz.claimed_by || !biz.expires_at) continue;
    const profile = profileMap.get(biz.claimed_by);
    if (!profile?.email) continue;

    try {
      await sendExpiryWarning({
        ownerEmail: profile.email,
        businessName: biz.name,
        expiresAt: biz.expires_at,
      });
      notified++;
    } catch (err) {
      console.error(`[expiry-check] failed to email owner of ${biz.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, notified });
}
