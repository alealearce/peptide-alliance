import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getStripe, getPriceId } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { businessId, tier } = await req.json() as {
      businessId: string;
      tier: 'verified' | 'featured' | 'industry_leader';
    };

    if (!businessId || !tier) {
      return NextResponse.json({ error: 'Missing businessId or tier' }, { status: 400 });
    }

    // ── 1. Verify user is authenticated ──────────────────────────────────────
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Verify user owns this business ─────────────────────────────────────
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id, name, stripe_customer_id, claimed_by')
      .eq('id', businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (business.claimed_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden: you do not own this business' }, { status: 403 });
    }

    const stripe = getStripe();

    // ── 3. Create or retrieve Stripe customer ─────────────────────────────────
    let customerId = business.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: business.name,
        metadata: { businessId, userId: user.id },
      });
      customerId = customer.id;

      // Persist customer ID immediately so we don't create duplicates
      await supabase
        .from('businesses')
        .update({ stripe_customer_id: customerId })
        .eq('id', businessId);
    }

    // ── 4. Create checkout session ────────────────────────────────────────────
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://peptidealliance.io';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: getPriceId(tier),
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: { businessId, tier, userId: user.id },
      },
      metadata: { businessId, tier, userId: user.id },
      success_url: `${siteUrl}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/upgrade`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[stripe/checkout] error:', message, err);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
