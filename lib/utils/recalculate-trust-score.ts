import { createAdminClient } from '@/lib/supabase/server';
import { calculateTrustScore } from '@/lib/utils/trust-score';

/**
 * Fetches all relevant data for a business, recalculates its trust score
 * using the canonical calculateTrustScore() logic, and writes the result
 * back to businesses.trust_score.
 *
 * Safe to call fire-and-forget from any API route:
 *   void recalculateTrustScore(businessId).catch(console.error);
 */
export async function recalculateTrustScore(businessId: string): Promise<number> {
  try {
    const supabase = createAdminClient();

    const [bizRes, productsRes, certsRes, labsRes] = await Promise.all([
      supabase
        .from('businesses')
        .select('is_verified, subscription_tier, claimed_by, rating, review_count, phone, website, description_en, long_description_en, logo_url, address, created_at')
        .eq('id', businessId)
        .single(),
      supabase.from('products').select('id').eq('business_id', businessId).eq('is_active', true),
      supabase.from('certifications').select('id, verified_by_admin').eq('business_id', businessId),
      supabase.from('lab_results').select('id, verified_by_admin').eq('business_id', businessId),
    ]);

    const biz = bizRes.data;
    if (!biz) return 0;

    const products = productsRes.data ?? [];
    const certs = certsRes.data ?? [];
    const labs = labsRes.data ?? [];

    const { total } = calculateTrustScore({
      is_verified: biz.is_verified,
      subscription_tier: biz.subscription_tier,
      claimed_by: biz.claimed_by,
      rating: biz.rating,
      review_count: biz.review_count,
      trust_score_fields: {
        has_phone: !!biz.phone,
        has_website: !!biz.website,
        has_description: !!(biz.description_en || biz.long_description_en),
        has_logo: !!biz.logo_url,
        has_address: !!biz.address,
      },
      product_count: products.length,
      certification_count: certs.length,
      verified_cert_count: certs.filter((c) => c.verified_by_admin).length,
      lab_result_count: labs.length,
      verified_lab_count: labs.some((l) => l.verified_by_admin),
      created_at: biz.created_at,
    });

    await supabase.from('businesses').update({ trust_score: total }).eq('id', businessId);

    return total;
  } catch (err) {
    console.error('[recalculateTrustScore] error for', businessId, err);
    return 0;
  }
}
