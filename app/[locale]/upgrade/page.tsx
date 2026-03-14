import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import { PricingCard } from '@/components/premium/PricingCard';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'upgrade' });
  return { title: t('pageTitle') };
}

export default async function UpgradePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { businessId?: string };
}) {
  const t = await getTranslations({ locale, namespace: 'upgrade' });
  const supabase = await createServerClient();

  // Find the user's claimed business if not provided via query param
  let businessId = searchParams.businessId;
  let currentTier: 'free' | 'verified' | 'featured' | 'industry_leader' = 'free';

  if (!businessId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: biz } = await supabase
        .from('businesses')
        .select('id, subscription_tier')
        .eq('claimed_by', user.id)
        .limit(1)
        .single();
      if (biz) {
        businessId = biz.id;
        currentTier = biz.subscription_tier ?? 'free';
      }
    }
  }

  const freeFeatures = [
    t('freeFeature1'),
    t('freeFeature2'),
    t('freeFeature3'),
    t('freeFeature4'),
    t('freeFeature5'),
  ];

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-heading font-extrabold mb-3">
            {t('pageTitle')}
          </h1>
          <p className="text-white/80 text-lg">{t('pageSubtitle')}</p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {/* Free — static card */}
          <div className="flex flex-col rounded-2xl border-2 border-muted/20 bg-card p-8 opacity-80">
            <h3 className="text-2xl font-heading font-extrabold text-text mb-1">
              {t('freeTierName')}
            </h3>
            <p className="text-muted text-sm mb-6">{t('freeTierDesc')}</p>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-4xl font-heading font-extrabold text-text">
                {t('freeTierPrice')}
              </span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {freeFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-muted text-sm">
                  <span className="w-5 h-5 flex-shrink-0 mt-0.5">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
            {currentTier === 'free' && (
              <div className="text-center py-3 rounded-xl border border-muted/30 bg-muted/10 text-muted font-semibold text-sm">
                {t('currentPlan')}
              </div>
            )}
          </div>

          {/* Verified */}
          <PricingCard
            tier="verified"
            businessId={businessId}
            isCurrentPlan={currentTier === 'verified'}
          />

          {/* Featured */}
          <PricingCard
            tier="featured"
            businessId={businessId}
            isCurrentPlan={currentTier === 'featured'}
            isMostPopular
          />

          {/* Industry Leader */}
          <PricingCard
            tier="industry_leader"
            businessId={businessId}
            isCurrentPlan={currentTier === 'industry_leader'}
          />
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-text text-center mb-8">
            {t('faqTitle')}
          </h2>
          <div className="flex flex-col gap-6">
            {[
              { q: t('faq1Q'), a: t('faq1A') },
              { q: t('faq2Q'), a: t('faq2A') },
              { q: t('faq3Q'), a: t('faq3A') },
            ].map(({ q, a }) => (
              <div key={q} className="bg-card rounded-xl p-6 border border-muted/10">
                <p className="font-semibold text-text mb-2">{q}</p>
                <p className="text-muted text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQPage JSON-LD — for AI answer engines and Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: t('faq1Q'),
                acceptedAnswer: { '@type': 'Answer', text: t('faq1A') },
              },
              {
                '@type': 'Question',
                name: t('faq2Q'),
                acceptedAnswer: { '@type': 'Answer', text: t('faq2A') },
              },
              {
                '@type': 'Question',
                name: t('faq3Q'),
                acceptedAnswer: { '@type': 'Answer', text: t('faq3A') },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
