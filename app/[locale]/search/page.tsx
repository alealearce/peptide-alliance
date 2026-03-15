import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { BusinessCard } from '@/components/directory/BusinessCard';
import { SearchBar } from '@/components/directory/SearchBar';
import { CATEGORIES } from '@/lib/config/categories';
import { US_STATES, CA_PROVINCES } from '@/lib/config/geography';
import type { Business } from '@/lib/supabase/types';
import type { Metadata } from 'next';
import { SITE } from '@/lib/config/site';

interface Props {
  params: { locale: string };
  searchParams?: {
    q?: string;
    city?: string;
    category?: string;
    subcategory?: string;
    verified?: string;
    page?: string;
    province?: string;
    country?: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Search Peptide Businesses — ${SITE.name}`,
    description:
      'Search verified peptide brands, clinics, compounding pharmacies, research labs, and suppliers across the US and Canada.',
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${SITE.url}/search`,
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams?.q?.trim() ?? '';
  const city = searchParams?.city ?? '';
  const category = searchParams?.category ?? '';
  const subcategory = searchParams?.subcategory ?? '';
  const verifiedOnly = searchParams?.verified === 'true';
  const province = searchParams?.province ?? '';
  const country = searchParams?.country ?? '';
  const page = Number(searchParams?.page ?? 1);
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  const t = await getTranslations('search');

  const supabase = createAdminClient();

  const now = new Date().toISOString();

  let query = supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('is_verified', { ascending: false })
    .order('rating', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (q) {
    const qNorm = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    query = query.or(
      `name_search.ilike.%${qNorm}%,desc_en_search.ilike.%${qNorm}%,city.ilike.%${q}%`
    );
  }
  if (city) query = query.ilike('city', city);
  if (category) query = query.eq('category', category);
  if (subcategory) query = query.eq('subcategory', subcategory);
  if (verifiedOnly) query = query.eq('is_verified', true);
  if (province) query = query.eq('province', province);
  if (country) query = query.eq('country', country);

  const { data: businesses, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  // Log search event (fire-and-forget, page 1 only)
  if (page === 1 && (q || city || category)) {
    void supabase.from('search_events').insert({
      query: q || null,
      category: category || null,
      city: city || null,
      result_count: count ?? 0,
    });
  }

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q, city, category, subcategory, verified: verifiedOnly ? 'true' : '', province, country, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/search?${params.toString()}`;
  };

  // Build region list for sidebar
  const regionGroups = [
    { label: '🇺🇸 United States', regions: Object.entries(US_STATES).map(([code, name]) => ({ code, name, country: 'US' })) },
    { label: '🇨🇦 Canada', regions: Object.entries(CA_PROVINCES).map(([code, name]) => ({ code, name, country: 'CA' })) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search bar */}
      <div className="mb-8">
        <SearchBar defaultValue={q} />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ── Sidebar Filters ────────────────────────────────────────────── */}
        <aside className="w-full lg:w-56 flex-shrink-0 space-y-6">
          {/* Region filter */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-muted mb-2">
              {t('searchIn')}
            </h3>
            <div className="space-y-0.5">
              <Link
                href={buildUrl({ province: '', country: '', city: '', page: '1' })}
                className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  !province && !city ? 'bg-primary/10 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-primary/5'
                }`}
              >
                {t('allCities')}
              </Link>
              {regionGroups.map((group) => {
                const isActiveGroup = group.regions.some((r) => r.code === province && r.country === country);
                return (
                  <details key={group.label} open={isActiveGroup} suppressHydrationWarning className="group">
                    <summary className={`flex items-center justify-between cursor-pointer list-none px-3 py-1.5 rounded-lg text-sm transition-colors select-none ${
                      isActiveGroup ? 'text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-primary/5'
                    }`}>
                      <span>{group.label}</span>
                      <span className="text-xs opacity-50">{group.regions.length}</span>
                    </summary>
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-muted/20 pl-2">
                      {group.regions.map((r) => (
                        <Link
                          key={r.code}
                          href={buildUrl({ province: r.code, country: r.country, city: '', page: '1' })}
                          className={`block text-sm px-3 py-1 rounded-lg transition-colors ${
                            province === r.code && country === r.country ? 'bg-primary/10 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          {r.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-muted mb-2">
              {t('allCategories')}
            </h3>
            <div className="space-y-1">
              <Link
                href={buildUrl({ category: '' })}
                className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  !category ? 'bg-primary/10 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-primary/5'
                }`}
              >
                {t('allCategories')}
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.id })}
                  className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    category === cat.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {cat.icon} {cat.label.en}
                </Link>
              ))}
            </div>
          </div>

          {/* Subcategory filter */}
          {category && (() => {
            const selectedCat = CATEGORIES.find(c => c.id === category);
            if (!selectedCat?.subcategories?.length) return null;
            return (
              <div>
                <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-muted mb-2">
                  Specialty
                </h3>
                <div className="space-y-1">
                  <Link
                    href={buildUrl({ subcategory: '', page: '1' })}
                    className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      !subcategory ? 'bg-primary/10 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    All
                  </Link>
                  {selectedCat.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={buildUrl({ subcategory: sub.id, page: '1' })}
                      className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        subcategory === sub.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {sub.label.en}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Verified toggle */}
          <div>
            <Link
              href={buildUrl({ verified: verifiedOnly ? '' : 'true' })}
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors ${
                verifiedOnly
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-muted/30 text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {t('verified')}
            </Link>
          </div>
        </aside>

        {/* ── Results ────────────────────────────────────────────────────── */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted">
              {q ? (
                <>
                  <span className="font-semibold text-text">&ldquo;{q}&rdquo;</span> —{' '}
                </>
              ) : null}
              {count ?? 0} {t('results')}
            </p>
          </div>

          {businesses && businesses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {businesses.map((biz: Business) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (() => {
                const pages: (number | 'ellipsis')[] = [];
                const delta = 2;
                const addPage = (p: number) => pages.push(p);
                const addEllipsis = () => { if (pages[pages.length - 1] !== 'ellipsis') pages.push('ellipsis'); };

                addPage(1);
                const rangeStart = Math.max(2, page - delta);
                const rangeEnd   = Math.min(totalPages - 1, page + delta);
                if (rangeStart > 2) addEllipsis();
                for (let p = rangeStart; p <= rangeEnd; p++) addPage(p);
                if (rangeEnd < totalPages - 1) addEllipsis();
                if (totalPages > 1) addPage(totalPages);

                const btnBase = 'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-colors';

                return (
                  <div className="flex justify-center items-center gap-1.5 flex-wrap">
                    {page > 1 && (
                      <Link href={buildUrl({ page: String(page - 1) })} className={`${btnBase} border-muted/30 text-muted hover:border-primary hover:text-primary`} aria-label="Previous page">&#8249;</Link>
                    )}
                    {pages.map((p, i) =>
                      p === 'ellipsis' ? (
                        <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-muted text-sm select-none">&hellip;</span>
                      ) : (
                        <Link key={p} href={buildUrl({ page: String(p) })} className={`${btnBase} ${p === page ? 'bg-primary text-white border-primary' : 'border-muted/30 text-muted hover:border-primary hover:text-primary'}`}>{p}</Link>
                      )
                    )}
                    {page < totalPages && (
                      <Link href={buildUrl({ page: String(page + 1) })} className={`${btnBase} border-muted/30 text-muted hover:border-primary hover:text-primary`} aria-label="Next page">&#8250;</Link>
                    )}
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="text-center py-24 text-muted">
              <p className="text-lg font-semibold">{t('noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
