import Stripe from 'stripe';

// Lazy singleton — never instantiated at build time
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' });
  }
  return _stripe;
}

// Tier → Price ID mapping (server-side only)
export function getPriceId(tier: 'verified' | 'featured' | 'industry_leader'): string {
  const ids: Record<string, string | undefined> = {
    verified:        process.env.STRIPE_VERIFIED_PRICE_ID,
    featured:        process.env.STRIPE_FEATURED_PRICE_ID,
    industry_leader: process.env.STRIPE_INDUSTRY_LEADER_PRICE_ID,
  };
  const id = ids[tier];
  if (!id) throw new Error(`No price ID configured for tier: ${tier}`);
  return id;
}

// Price ID → Tier (used in webhook to map subscription prices back)
export function getTierFromPriceId(priceId: string): 'verified' | 'featured' | 'industry_leader' | null {
  if (priceId === process.env.STRIPE_VERIFIED_PRICE_ID) return 'verified';
  if (priceId === process.env.STRIPE_FEATURED_PRICE_ID) return 'featured';
  if (priceId === process.env.STRIPE_INDUSTRY_LEADER_PRICE_ID) return 'industry_leader';
  return null;
}
