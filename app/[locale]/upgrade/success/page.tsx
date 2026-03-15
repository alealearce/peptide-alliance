import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { lp } from '@/lib/utils/locale';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';

export default async function UpgradeSuccessPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session_id?: string };
}) {
  const t = await getTranslations('upgradeSuccess');
  const tUpgrade = await getTranslations('upgrade');

  // ── Fulfillment fallback: upgrade the business directly from the session ──
  // This runs server-side on every success page load so the business is
  // upgraded even if the Stripe webhook hasn't fired yet.
  const { session_id } = searchParams;
  let tier: string | null = null;

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const businessId = session.metadata?.businessId;
      tier = session.metadata?.tier ?? null;

      if (businessId && tier && session.payment_status === 'paid') {
        const supabase = createAdminClient();

        // Only update if not already at the correct tier (idempotent)
        const { data: biz } = await supabase
          .from('businesses')
          .select('subscription_tier')
          .eq('id', businessId)
          .single();

        if (biz && biz.subscription_tier !== tier) {
          await supabase.from('businesses').update({
            subscription_tier: tier,
            stripe_subscription_id: session.subscription as string ?? null,
            stripe_customer_id: session.customer as string ?? null,
            subscription_started_at: new Date().toISOString(),
            is_premium: true,
            is_verified: true,
          }).eq('id', businessId);
        }
      }
    } catch (err) {
      // Non-fatal — webhook will handle it if this fails
      console.error('[upgrade/success] fulfillment error:', err);
    }
  }

  const isFeatured = tier === 'featured';

  const activeFeatures = isFeatured
    ? [
        tUpgrade('featuredFeature1'),
        tUpgrade('featuredFeature2'),
        tUpgrade('featuredFeature3'),
        tUpgrade('featuredFeature4'),
      ]
    : [
        tUpgrade('premiumFeature1'),
        tUpgrade('premiumFeature2'),
        tUpgrade('premiumFeature3'),
        tUpgrade('premiumFeature4'),
      ];

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-card rounded-3xl border border-muted/10 shadow-lg p-10 text-center">
        {/* Celebration mascot */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src="/images/mascots/brand-logo.png"
              alt="Sylvita celebrating"
              width={120}
              height={120}
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {isFeatured && (
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 mb-4">
            Featured Listing Active
          </div>
        )}

        <h1 className="text-3xl font-heading font-extrabold text-text mb-3">
          {t('title')}
        </h1>
        <p className="text-muted mb-8">{t('subtitle')}</p>

        {/* What's now active */}
        <div className={`rounded-xl p-5 mb-8 text-left ${isFeatured ? 'bg-amber-50 border border-amber-200' : 'bg-bg'}`}>
          <p className="text-sm font-semibold text-text mb-3">
            {t('whatIsActive')}
          </p>
          <ul className="flex flex-col gap-2">
            {activeFeatures.map((feat) => (
              <li key={feat} className="flex items-center gap-2 text-sm text-text">
                <Check className={`w-4 h-4 flex-shrink-0 ${isFeatured ? 'text-amber-600' : 'text-primary'}`} />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={lp(locale, '/dashboard')} className="flex-1">
            <Button variant="primary" className="w-full justify-center" size="lg">
              {t('gotoDashboard')}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
