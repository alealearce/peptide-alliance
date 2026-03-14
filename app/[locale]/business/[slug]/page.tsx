import { permanentRedirect, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cityToSlug } from '@/lib/utils/slug';
import { lp } from '@/lib/utils/locale';

interface Props {
  params: { locale: string; slug: string };
}

/**
 * Legacy route: /{locale}/business/{slug}
 * 301 permanent redirect to the new city-based URL: /{locale}/{city_slug}/{slug}
 */
export default async function LegacyBusinessRedirect({ params }: Props) {
  const { locale, slug } = params;
  const supabase = await createClient();

  // Select only columns guaranteed to exist; city_slug may not exist pre-migration
  const { data: biz } = await supabase
    .from('businesses')
    .select('slug, city')
    .eq('slug', slug)
    .single();

  if (!biz) {
    redirect(lp(locale, '/'));
  }

  // Compute city slug from city name (works before and after migration)
  const resolvedCitySlug = cityToSlug(biz.city);

  // 308 permanent redirect to new URL structure
  permanentRedirect(lp(locale, `/${resolvedCitySlug}/${biz.slug}`));
}
