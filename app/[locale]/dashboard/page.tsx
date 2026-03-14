import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { lp } from '@/lib/utils/locale';
import { DashboardClient } from '@/components/business/DashboardClient';
import type { Review } from '@/lib/supabase/types';

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(lp(locale, '/login'));

  const t = await getTranslations('dashboard');

  // Fetch their claimed business(es)
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('claimed_by', user.id)
    .limit(5);

  // Fetch leads for those businesses
  const businessIds = (businesses ?? []).map((b: { id: string }) => b.id);
  const { data: leads } =
    businessIds.length > 0
      ? await supabase
          .from('leads')
          .select('*')
          .in('business_id', businessIds)
          .order('created_at', { ascending: false })
          .limit(20)
      : { data: [] };

  // Fetch reviews for those businesses
  const { data: allReviews } =
    businessIds.length > 0
      ? await supabase
          .from('reviews')
          .select('*')
          .in('business_id', businessIds)
          .order('created_at', { ascending: false })
      : { data: [] as Review[] };

  // Fetch reviewer names
  const reviewUserIds = ((allReviews ?? []) as Review[]).map((r) => r.user_id);
  const uniqueReviewerIds = Array.from(new Set(reviewUserIds));
  let reviewerProfiles: Record<string, string> = {};
  if (uniqueReviewerIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', uniqueReviewerIds);
    reviewerProfiles = ((profiles ?? []) as { id: string; full_name: string | null }[]).reduce(
      (acc, p) => { acc[p.id] = p.full_name ?? 'Anonymous'; return acc; },
      {} as Record<string, string>
    );
  }

  // Group reviews by business_id and attach reviewer names
  const reviewsByBiz: Record<string, Review[]> = {};
  ((allReviews ?? []) as Review[]).forEach((r) => {
    if (!reviewsByBiz[r.business_id]) reviewsByBiz[r.business_id] = [];
    reviewsByBiz[r.business_id]!.push({ ...r, reviewer_name: reviewerProfiles[r.user_id] ?? 'Anonymous' });
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-extrabold text-text mb-8">
        {t('title')}
      </h1>
      <DashboardClient
        user={user}
        businesses={businesses ?? []}
        leads={leads ?? []}
        reviews={reviewsByBiz}
        locale={locale}
      />
    </div>
  );
}
