import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { sendClaimConfirmation, sendClaimAdminNotification } from '@/lib/email/resend';
import { recalculateTrustScore } from '@/lib/utils/recalculate-trust-score';

const ClaimSchema = z.object({
  business_id: z.string().uuid(),
  owner_title: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  try {
    // ── Must be logged in ─────────────────────────────────────────────────────
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ClaimSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { business_id, owner_title } = parsed.data;
    const admin = createAdminClient();

    // ── Verify the business exists and is unclaimed ───────────────────────────
    const { data: biz, error: fetchErr } = await admin
      .from('businesses')
      .select('id, name, claimed_by')
      .eq('id', business_id)
      .single();

    if (fetchErr || !biz) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    if (biz.claimed_by !== null) {
      return NextResponse.json({ error: 'Business is already claimed' }, { status: 409 });
    }

    // ── Claim it (admin client bypasses RLS — safe because we validated above) ─
    const { error: updateErr } = await admin
      .from('businesses')
      .update({
        claimed_by: user.id,
        owner_title,
        is_active: false, // Pending admin approval
        source: 'claimed' as const,
      })
      .eq('id', business_id);

    if (updateErr) {
      console.error('[business/claim] update error:', updateErr);
      return NextResponse.json({ error: 'Failed to claim business' }, { status: 500 });
    }

    // Send confirmation to claimant + admin notification (fire-and-forget)
    if (user.email) {
      void sendClaimConfirmation({
        ownerEmail: user.email,
        businessName: biz.name,
      }).catch((err) => console.error('[business/claim] confirmation email error:', err));

      // Look up full name from profile for the admin notification
      const { data: claimantProfile } = await admin
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      void sendClaimAdminNotification({
        claimantEmail: user.email,
        claimantName: claimantProfile?.full_name ?? null,
        businessName: biz.name,
        businessId: business_id,
        ownerTitle: owner_title,
      }).catch((err) => console.error('[business/claim] admin notification error:', err));
    }

    // Recalculate trust score — claiming a business earns +10 points
    void recalculateTrustScore(business_id).catch((err) => console.error('[business/claim] trust score error:', err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[business/claim] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
