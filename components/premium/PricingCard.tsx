'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Tier = 'verified' | 'featured' | 'industry_leader';

interface PricingCardProps {
  tier: Tier;
  businessId?: string;
  isCurrentPlan?: boolean;
  isMostPopular?: boolean;
}

const TIER_CONFIG: Record<Tier, { price: string; nameKey: string; descKey: string; featuresPrefix: string; featureCount: number }> = {
  verified: { price: '49', nameKey: 'premiumTierName', descKey: 'premiumTierDesc', featuresPrefix: 'premiumFeature', featureCount: 6 },
  featured: { price: '99', nameKey: 'featuredTierName', descKey: 'featuredTierDesc', featuresPrefix: 'featuredFeature', featureCount: 6 },
  industry_leader: { price: '499', nameKey: 'industryLeaderTierName', descKey: 'industryLeaderTierDesc', featuresPrefix: 'industryLeaderFeature', featureCount: 6 },
};

export function PricingCard({
  tier,
  businessId,
  isCurrentPlan,
  isMostPopular,
}: PricingCardProps) {
  const t = useTranslations('upgrade');
  const [loading, setLoading] = useState(false);

  const config = TIER_CONFIG[tier];
  const isIndustryLeader = tier === 'industry_leader';

  const features = Array.from({ length: config.featureCount }, (_, i) =>
    t(`${config.featuresPrefix}${i + 1}`)
  );

  const tierName = t(config.nameKey);
  const tierDesc = t(config.descKey);

  const handleUpgrade = async () => {
    if (!businessId) {
      window.location.href = '/dashboard';
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-8 shadow-sm transition-shadow hover:shadow-lg ${
        isIndustryLeader
          ? 'border-gold bg-gradient-to-b from-amber-50/50 to-white'
          : isMostPopular
          ? 'border-primary bg-white'
          : 'border-muted/20 bg-white'
      }`}
    >
      {isMostPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
          {t('mostPopular')}
        </span>
      )}

      {isIndustryLeader && !isMostPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
          Best Value
        </span>
      )}

      <h3 className="text-2xl font-heading font-extrabold text-text mb-1">
        {tierName}
      </h3>
      <p className="text-muted text-sm mb-6">{tierDesc}</p>

      <div className="flex items-end gap-1 mb-8">
        <span className="text-4xl font-heading font-extrabold text-text">
          ${config.price}
        </span>
        <span className="text-muted text-sm pb-1">{t('perMonth')}</span>
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isIndustryLeader ? 'text-gold' : 'text-primary'}`} />
            <span className="text-text text-sm">{feat}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <div className="text-center py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary font-semibold text-sm">
          {t('currentPlan')}
        </div>
      ) : isIndustryLeader ? (
        <Button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full justify-center bg-gold hover:bg-gold/90 text-white"
          size="lg"
        >
          {loading ? '...' : 'Get Started'}
        </Button>
      ) : (
        <Button
          onClick={handleUpgrade}
          disabled={loading}
          variant={isMostPopular ? 'primary' : 'secondary'}
          className="w-full justify-center"
          size="lg"
        >
          {loading ? '...' : 'Get Started'}
        </Button>
      )}
    </div>
  );
}
