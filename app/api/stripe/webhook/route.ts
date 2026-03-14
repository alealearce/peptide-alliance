import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, getTierFromPriceId } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';

// In App Router, req.text() always returns the raw body — no bodyParser config needed.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  // ── 1. Verify webhook signature ───────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ── 2. Return 200 immediately, process async ──────────────────────────────
  // (Stripe retries if it doesn't get a 200 fast enough)
  void handleEvent(event);
  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event) {
  const supabase = createAdminClient();

  try {
    switch (event.type) {

      // ── checkout.session.completed ─────────────────────────────────────────
      // Fired when a customer completes the Stripe-hosted checkout form.
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { businessId, tier } = session.metadata ?? {};
        if (!businessId || !tier) break;

        await supabase.from('businesses').update({
          subscription_tier: tier,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          subscription_started_at: new Date().toISOString(),
          is_verified: ['verified', 'featured', 'industry_leader'].includes(tier),
        }).eq('id', businessId);

        await logEvent(supabase, {
          businessId,
          stripeEventId: event.id,
          eventType: event.type,
          tier,
        });
        break;
      }

      // ── customer.subscription.updated ─────────────────────────────────────
      // Fired when a subscription changes (upgrade / downgrade / trial ends).
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id;
        const tier = priceId ? getTierFromPriceId(priceId) : null;

        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('stripe_subscription_id', sub.id)
          .single();

        if (!business) break;

        const updates: Record<string, unknown> = {
          subscription_ends_at: sub.cancel_at
            ? new Date(sub.cancel_at * 1000).toISOString()
            : null,
        };
        if (tier) {
          updates.subscription_tier = tier;
          updates.is_verified = ['verified', 'featured', 'industry_leader'].includes(tier);
        }

        await supabase.from('businesses').update(updates).eq('id', business.id);

        await logEvent(supabase, {
          businessId: business.id,
          stripeEventId: event.id,
          eventType: event.type,
          tier: tier ?? undefined,
        });
        break;
      }

      // ── customer.subscription.deleted ─────────────────────────────────────
      // Fired when a subscription is fully cancelled.
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('stripe_subscription_id', sub.id)
          .single();

        if (!business) break;

        await supabase.from('businesses').update({
          subscription_tier: 'free',
          stripe_subscription_id: null,
          subscription_ends_at: new Date().toISOString(),
          is_verified: false,
        }).eq('id', business.id);

        await logEvent(supabase, {
          businessId: business.id,
          stripeEventId: event.id,
          eventType: event.type,
          tier: 'free',
        });
        break;
      }

      // ── invoice.payment_failed ─────────────────────────────────────────────
      // Fired when a renewal charge fails.
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: business } = await supabase
          .from('businesses')
          .select('id, name')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!business) break;

        // Look up owner email to send notification
        const { data: biz } = await supabase
          .from('businesses')
          .select('claimed_by')
          .eq('id', business.id)
          .single();

        if (biz?.claimed_by) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', biz.claimed_by)
            .single();

          if (profile?.email) {
            // Fire-and-forget — import lazily to avoid build-time Resend init
            const { sendPaymentFailedEmail } = await import('@/lib/email/resend');
            await sendPaymentFailedEmail({
              to: profile.email,
              businessName: business.name,
            });
          }
        }

        await logEvent(supabase, {
          businessId: business.id,
          stripeEventId: event.id,
          eventType: event.type,
        });
        break;
      }

      default:
        // Unhandled event — log and ignore
        console.log(`[webhook] unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[webhook] error handling ${event.type}:`, err);
  }
}

// ── Helper: log to subscription_events ────────────────────────────────────────
async function logEvent(
  supabase: ReturnType<typeof createAdminClient>,
  params: {
    businessId: string;
    stripeEventId: string;
    eventType: string;
    tier?: string;
    amount?: number;
  }
) {
  await supabase.from('subscription_events').insert({
    business_id: params.businessId,
    stripe_event_id: params.stripeEventId,
    event_type: params.eventType,
    tier: params.tier ?? null,
    amount: params.amount ?? null,
  });
}
