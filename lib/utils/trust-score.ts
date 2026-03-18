import type { SubscriptionTier } from '@/lib/supabase/types';

export type TrustScoreItem = {
  label: string;
  points: number;
  earned: boolean;
  max: number;
};

export type TrustScoreBreakdown = {
  total: number;
  items: TrustScoreItem[];
};

export function calculateTrustScore(data: {
  is_verified: boolean;
  subscription_tier: SubscriptionTier;
  claimed_by: string | null;
  rating: number | null;
  review_count: number;
  trust_score_fields: {
    has_phone: boolean;
    has_website: boolean;
    has_description: boolean;
    has_logo: boolean;
    has_address: boolean;
  };
  product_count: number;
  certification_count: number;
  verified_cert_count: number;
  lab_result_count: number;
  verified_lab_count: boolean;
  created_at: string;
}): TrustScoreBreakdown {
  const items: TrustScoreItem[] = [];

  // Verified certifications: +20
  const certPoints = data.verified_cert_count > 0 ? 20 : data.certification_count > 0 ? 5 : 0;
  items.push({
    label: data.verified_cert_count > 0
      ? `Verified certifications (${data.verified_cert_count})`
      : data.certification_count > 0
        ? `Certifications uploaded (pending review)`
        : 'Certifications',
    points: certPoints,
    earned: data.certification_count > 0,
    max: 20,
  });

  // Lab results uploaded: +15
  const labPoints = data.verified_lab_count ? 15 : data.lab_result_count > 0 ? 5 : 0;
  items.push({
    label: data.verified_lab_count
      ? `Verified lab results (${data.lab_result_count})`
      : data.lab_result_count > 0
        ? `Lab results uploaded (pending review)`
        : 'Lab results',
    points: labPoints,
    earned: data.lab_result_count > 0,
    max: 15,
  });

  // Claimed/owned profile: +10
  items.push({
    label: 'Claimed by owner',
    points: data.claimed_by ? 10 : 0,
    earned: !!data.claimed_by,
    max: 10,
  });

  // Reviews avg 4+: +15
  const reviewPoints = data.review_count > 0 && (data.rating ?? 0) >= 4 ? 15
    : data.review_count > 0 ? 5 : 0;
  items.push({
    label: data.review_count > 0
      ? `Reviews (${data.review_count}, avg ${(data.rating ?? 0).toFixed(1)}★)`
      : 'Customer reviews',
    points: reviewPoints,
    earned: data.review_count > 0,
    max: 15,
  });

  // Complete profile: +10
  const { has_phone, has_website, has_description, has_logo, has_address } = data.trust_score_fields;
  const filledFields = [has_phone, has_website, has_description, has_logo, has_address].filter(Boolean).length;
  const profilePoints = filledFields >= 5 ? 10 : filledFields >= 3 ? 5 : 0;
  items.push({
    label: `Complete profile (${filledFields}/5 fields)`,
    points: profilePoints,
    earned: filledFields > 0,
    max: 10,
  });

  // Tier bonus
  const tierBonus = data.subscription_tier === 'industry_leader' ? 20
    : data.subscription_tier === 'featured' ? 15
    : data.subscription_tier === 'verified' ? 10 : 0;
  const tierLabel = data.subscription_tier === 'free' ? 'Standard (Free)'
    : data.subscription_tier === 'verified' ? 'Verified'
    : data.subscription_tier === 'featured' ? 'Featured'
    : 'Industry Leader';
  items.push({
    label: `Subscription tier: ${tierLabel}`,
    points: tierBonus,
    earned: tierBonus > 0,
    max: 20,
  });

  // Products listed: +5
  items.push({
    label: data.product_count > 0 ? `Products listed (${data.product_count})` : 'Products listed',
    points: data.product_count > 0 ? 5 : 0,
    earned: data.product_count > 0,
    max: 5,
  });

  // Account age >6mo: +5
  const ageMs = Date.now() - new Date(data.created_at).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  items.push({
    label: ageDays >= 180 ? 'Established listing (6+ months)' : 'Account age',
    points: ageDays >= 180 ? 5 : 0,
    earned: ageDays >= 180,
    max: 5,
  });

  const total = Math.min(100, items.reduce((sum, item) => sum + item.points, 0));

  return { total, items };
}
