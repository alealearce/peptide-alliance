import { createClient } from '@/lib/supabase/server';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';
import { calculateTrustScore } from '@/lib/utils/trust-score';
import type { Business } from '@/lib/supabase/types';

interface Props {
  biz: Business;
}

export async function TrustScoreBreakdown({ biz }: Props) {
  const supabase = await createClient();

  const [productsRes, certsRes, labsRes] = await Promise.all([
    supabase.from('products').select('id').eq('business_id', biz.id).eq('is_active', true),
    supabase.from('certifications').select('id, verified_by_admin').eq('business_id', biz.id),
    supabase.from('lab_results').select('id, verified_by_admin').eq('business_id', biz.id),
  ]);

  const products = productsRes.data ?? [];
  const certs = certsRes.data ?? [];
  const labs = labsRes.data ?? [];

  const breakdown = calculateTrustScore({
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

  const score = breakdown.total;
  const scoreColor = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-500';
  const barColor = score >= 70 ? 'from-emerald-500 to-emerald-400' : score >= 40 ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400';

  return (
    <div className="bg-card rounded-2xl border border-muted/10 p-5">
      <h3 className="font-semibold text-sm text-text mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        Trust Score
      </h3>

      {/* Score bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-muted/10 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`text-2xl font-bold w-10 text-right ${scoreColor}`}>{score}</span>
      </div>

      {/* Breakdown */}
      <div className="space-y-1.5">
        {breakdown.items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {item.earned ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-muted/40 shrink-0" />
              )}
              <span className={`text-xs truncate ${item.earned ? 'text-text' : 'text-muted'}`}>
                {item.label}
              </span>
            </div>
            <span className={`text-xs font-semibold shrink-0 ${item.earned ? scoreColor : 'text-muted/40'}`}>
              +{item.points}/{item.max}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted mt-3 pt-3 border-t border-muted/10">
        Score is based on verifications, reviews, certifications, lab results & profile completeness.
      </p>
    </div>
  );
}
