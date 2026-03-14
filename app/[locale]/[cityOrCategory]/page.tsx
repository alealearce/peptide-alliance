import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BusinessCard } from '@/components/directory/BusinessCard';
import { CategoryGrid } from '@/components/directory/CategoryGrid';
import { getCategoryBySlug, getCategorySlug } from '@/lib/config/categories';
import { US_STATES, CA_PROVINCES } from '@/lib/config/geography';
import type { Business } from '@/lib/supabase/types';
import type { Metadata } from 'next';
import { SITE } from '@/lib/config/site';

interface Props {
  params: { locale: string; cityOrCategory: string };
  searchParams?: { city?: string; subcategory?: string; page?: string; category?: string; province?: string; country?: string };
}

const BASE = SITE.url;

// ISR: refresh every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.cityOrCategory;

  // ── Category page ──────────────────────────────────────────────────────────
  const cat = getCategoryBySlug(slug);
  if (cat) {
    const label = cat.label.en;
    return {
      title: `${label} — ${SITE.name}`,
      description: `Browse verified ${label.toLowerCase()} across the US and Canada. Find trusted peptide businesses on ${SITE.name}.`,
      alternates: {
        canonical: `${BASE}/${cat.slug.en}`,
        languages: { 'en': `${BASE}/${cat.slug.en}`, 'x-default': `${BASE}/${cat.slug.en}` },
      },
      openGraph: {
        title: `${label} — ${SITE.name}`,
        description: `Browse verified ${label.toLowerCase()} across the US and Canada.`,
        url: `${BASE}/${cat.slug.en}`,
        siteName: SITE.name,
        locale: 'en_US',
        type: 'website',
        images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: `${label} — ${SITE.name}` }],
      },
    };
  }

  // ── City/region page ───────────────────────────────────────────────────────
  const cityName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `Peptide Businesses in ${cityName} — ${SITE.name}`,
    description: `Find verified peptide businesses in ${cityName}. Clinics, compounding pharmacies, labs, and more on ${SITE.name}.`,
    alternates: {
      canonical: `${BASE}/${slug}`,
      languages: { 'en': `${BASE}/${slug}`, 'x-default': `${BASE}/${slug}` },
    },
    openGraph: {
      title: `Peptide Businesses in ${cityName} — ${SITE.name}`,
      description: `Find verified peptide businesses in ${cityName}.`,
      url: `${BASE}/${slug}`,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: `${cityName} — ${SITE.name}` }],
    },
  };
}

export default async function CityOrCategoryPage({ params, searchParams }: Props) {
  const { cityOrCategory: slug } = params;

  // ── Is this a category page? ───────────────────────────────────────────────
  const cat = getCategoryBySlug(slug);
  if (cat) {
    return <CategoryPageContent cat={cat} searchParams={searchParams} />;
  }

  // ── Otherwise treat as city page ───────────────────────────────────────────
  const supabase = await createClient();

  let cityCount = 0;
  const { count: c1 } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('city_slug', slug)
    .eq('is_active', true);
  cityCount = c1 ?? 0;

  if (cityCount === 0) {
    const cityName = slug.replace(/-/g, ' ');
    const { count: c2 } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .ilike('city', cityName)
      .eq('is_active', true);
    cityCount = c2 ?? 0;
  }

  if (cityCount === 0) {
    notFound();
  }

  return <CityPageContent citySlug={slug} searchParams={searchParams} />;
}

// ══════════════════════════════════════════════════════════════════════════════
// Category Page
// ══════════════════════════════════════════════════════════════════════════════

async function CategoryPageContent({
  cat,
  searchParams,
}: {
  cat: NonNullable<ReturnType<typeof getCategoryBySlug>>;
  searchParams?: Props['searchParams'];
}) {
  const t = await getTranslations('search');
  const label = cat.label.en;
  const catSlug = getCategorySlug(cat.id);

  const page = Number(searchParams?.page ?? 1);
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  const now = new Date().toISOString();

  let query = supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .eq('category', cat.id)
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('is_verified', { ascending: false })
    .order('rating', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (searchParams?.city) {
    query = query.ilike('city', searchParams.city);
  }
  if (searchParams?.subcategory) {
    query = query.eq('subcategory', searchParams.subcategory);
  }
  if (searchParams?.province) {
    query = query.eq('province', searchParams.province);
  }
  if (searchParams?.country) {
    query = query.eq('country', searchParams.country);
  }

  const { data: businesses, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  // SEO descriptions per category
  const descriptions: Record<string, string> = {
    peptide_brands: `Browse verified peptide brands across the US and Canada. ${SITE.name} connects you with research, pharmaceutical, cosmetic, and custom synthesis peptide companies. All businesses are reviewed by our team.`,
    clinics: `Find peptide therapy clinics, longevity centers, sports medicine practices, hormone therapy providers, and functional medicine clinics across the US and Canada. Verified by ${SITE.name}.`,
    compounding_pharmacies: `Discover verified compounding pharmacies specializing in peptides. Sterile compounding, non-sterile compounding, and 503B outsourcing facilities across the US and Canada.`,
    research_labs: `Find third-party testing labs, peptide research facilities, and clinical trial centers. Verified research labs listed on ${SITE.name}.`,
    wholesale_suppliers: `Browse wholesale peptide suppliers for raw materials, finished products, and equipment. Verified suppliers serving the US and Canada.`,
    manufacturers: `Find GMP, contract, and API peptide manufacturers. Verified manufacturing facilities listed on ${SITE.name}.`,
  };

  // FAQs per category for SEO
  const categoryFaqs: Record<string, Array<{ q: string; a: string }>> = {
    peptide_brands: [
      { q: 'How do I find verified peptide brands?', a: `Browse ${SITE.name}'s Peptide Brands category. All listed brands are reviewed for quality and legitimacy.` },
      { q: 'Are there research peptide companies in the US?', a: `Yes — ${SITE.name} lists verified research peptide companies across the US and Canada. Filter by "Research Peptides" to find them.` },
    ],
    clinics: [
      { q: 'How do I find a peptide therapy clinic near me?', a: `Browse ${SITE.name}'s Clinics category and filter by your state or province. We list verified peptide therapy, longevity, and functional medicine clinics.` },
      { q: 'Are there peptide therapy clinics in the US and Canada?', a: `Yes — ${SITE.name} lists verified peptide therapy clinics across both the US and Canada. Filter by specialty to find the right clinic.` },
    ],
    compounding_pharmacies: [
      { q: 'How do I find a compounding pharmacy for peptides?', a: `Browse ${SITE.name}'s Compounding Pharmacies category. Filter by sterile compounding, non-sterile, or 503B outsourcing facilities.` },
      { q: 'Are there 503B outsourcing facilities for peptides?', a: `Yes — ${SITE.name} lists verified 503B outsourcing facilities that compound peptides. Browse the Compounding Pharmacies category.` },
    ],
  };

  const desc = descriptions[cat.id];
  const faqs = categoryFaqs[cat.id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-text">{label}</span>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text flex items-center gap-3">
              <span>{cat.icon}</span> {label}
            </h1>
            {count !== null && (
              <p className="text-muted mt-1">
                {count} {t('results')}
              </p>
            )}
          </div>
          <Link
            href={`/claim?new=true&category=${cat.id}`}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            + Add your business
          </Link>
        </div>
      </div>

      {/* Category description for SEO */}
      {desc && (
        <p className="text-muted text-sm leading-relaxed mb-6 max-w-3xl">
          {desc}
        </p>
      )}

      {/* Subcategory filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href={`/${catSlug}${searchParams?.city ? `?city=${searchParams.city}` : ''}`}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            !searchParams?.subcategory
              ? 'bg-primary text-white border-primary'
              : 'border-muted/40 text-muted hover:border-primary hover:text-primary'
          }`}
        >
          All
        </Link>
        {cat.subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/${catSlug}?subcategory=${sub.id}${searchParams?.city ? `&city=${searchParams.city}` : ''}`}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              searchParams?.subcategory === sub.id
                ? 'bg-primary text-white border-primary'
                : 'border-muted/40 text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {sub.label.en}
          </Link>
        ))}
      </div>

      {/* Region filter — US states + CA provinces */}
      <div className="mb-8 flex flex-wrap gap-1.5">
        <Link
          href={`/${catSlug}${searchParams?.subcategory ? `?subcategory=${searchParams.subcategory}` : ''}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
            !searchParams?.province
              ? 'bg-accent/20 text-accent border-accent/40'
              : 'border-muted/30 text-muted hover:border-accent hover:text-accent'
          }`}
        >
          All regions
        </Link>
        <details className="inline-block align-top">
          <summary className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer list-none select-none transition-colors border-muted/30 text-muted hover:border-accent hover:text-accent">
            🇺🇸 US States
          </summary>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(US_STATES).map(([code, name]) => (
              <Link
                key={code}
                href={`/${catSlug}?province=${code}&country=US${searchParams?.subcategory ? `&subcategory=${searchParams.subcategory}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  searchParams?.province === code
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : 'border-muted/30 text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {name}
              </Link>
            ))}
          </div>
        </details>
        <details className="inline-block align-top">
          <summary className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer list-none select-none transition-colors border-muted/30 text-muted hover:border-accent hover:text-accent">
            🇨🇦 Canadian Provinces
          </summary>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(CA_PROVINCES).map(([code, name]) => (
              <Link
                key={code}
                href={`/${catSlug}?province=${code}&country=CA${searchParams?.subcategory ? `&subcategory=${searchParams.subcategory}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  searchParams?.province === code
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : 'border-muted/30 text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {name}
              </Link>
            ))}
          </div>
        </details>
      </div>

      {/* Category BreadcrumbList + FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
              { '@type': 'ListItem', position: 2, name: label, item: `${BASE}/${catSlug}` },
            ],
          }),
        }}
      />
      {faqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            }),
          }}
        />
      )}

      {/* Business Grid */}
      {businesses && businesses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {businesses.map((biz: Business) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (() => {
            const buildPageUrl = (p: number) => {
              const qs = new URLSearchParams();
              if (p > 1) qs.set('page', String(p));
              if (searchParams?.subcategory) qs.set('subcategory', searchParams.subcategory);
              if (searchParams?.city) qs.set('city', searchParams.city);
              if (searchParams?.province) qs.set('province', searchParams.province);
              if (searchParams?.country) qs.set('country', searchParams.country);
              const q = qs.toString();
              return `/${catSlug}${q ? `?${q}` : ''}`;
            };

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
                  <Link href={buildPageUrl(page - 1)} className={`${btnBase} border-muted/30 text-muted hover:border-primary hover:text-primary`} aria-label="Previous page">&#8249;</Link>
                )}
                {pages.map((p, i) =>
                  p === 'ellipsis' ? (
                    <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-muted text-sm select-none">&hellip;</span>
                  ) : (
                    <Link key={p} href={buildPageUrl(p)} className={`${btnBase} ${p === page ? 'bg-primary text-white border-primary' : 'border-muted/30 text-muted hover:border-primary hover:text-primary'}`}>{p}</Link>
                  )
                )}
                {page < totalPages && (
                  <Link href={buildPageUrl(page + 1)} className={`${btnBase} border-muted/30 text-muted hover:border-primary hover:text-primary`} aria-label="Next page">&#8250;</Link>
                )}
              </div>
            );
          })()}
        </>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-4">{cat.icon}</p>
          <p className="text-lg font-semibold">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// City Page — shows all businesses in a city
// ══════════════════════════════════════════════════════════════════════════════

async function CityPageContent({
  citySlug,
  searchParams,
}: {
  citySlug: string;
  searchParams?: Props['searchParams'];
}) {
  const t = await getTranslations('search');
  const cityName = citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const page = Number(searchParams?.page ?? 1);
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  const now = new Date().toISOString();

  let query = supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .ilike('city', cityName)
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('is_verified', { ascending: false })
    .order('rating', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (searchParams?.category) {
    query = query.eq('category', searchParams.category);
  }

  const { data: businesses, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-text">{cityName}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text">
            Peptide Businesses in {cityName}
          </h1>
          {count !== null && (
            <p className="text-muted mt-1">
              {count} {t('results')}
            </p>
          )}
        </div>
        <Link
          href="/claim?new=true"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
        >
          + Add your business
        </Link>
      </div>

      {/* Category filter section */}
      <section className="mb-10">
        <CategoryGrid city={cityName} />
      </section>

      {/* Business Grid */}
      {businesses && businesses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {businesses.map((biz: Business) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>

          {totalPages > 1 && (() => {
            const buildPageUrl = (p: number) => {
              const qs = new URLSearchParams();
              if (p > 1) qs.set('page', String(p));
              if (searchParams?.category) qs.set('category', searchParams.category);
              const q = qs.toString();
              return `/${citySlug}${q ? `?${q}` : ''}`;
            };
            const delta = 2;
            const btnBase = 'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-colors';
            const pages: (number | 'ellipsis')[] = [];
            const addPage = (p: number) => pages.push(p);
            const addEllipsis = () => { if (pages[pages.length - 1] !== 'ellipsis') pages.push('ellipsis'); };
            addPage(1);
            const rangeStart = Math.max(2, page - delta);
            const rangeEnd   = Math.min(totalPages - 1, page + delta);
            if (rangeStart > 2) addEllipsis();
            for (let p = rangeStart; p <= rangeEnd; p++) addPage(p);
            if (rangeEnd < totalPages - 1) addEllipsis();
            if (totalPages > 1) addPage(totalPages);
            return (
              <div className="flex justify-center gap-2 flex-wrap">
                {page > 1 && (
                  <Link href={buildPageUrl(page - 1)} className={`${btnBase} border-muted/30 text-muted hover:border-primary hover:text-primary`} aria-label="Previous page">&#8249;</Link>
                )}
                {pages.map((p, i) =>
                  p === 'ellipsis'
                    ? <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-muted text-sm">&hellip;</span>
                    : <Link key={p} href={buildPageUrl(p)} className={`${btnBase} ${p === page ? 'bg-primary text-white border-primary' : 'border-muted/30 text-muted hover:border-primary hover:text-primary'}`}>{p}</Link>
                )}
                {page < totalPages && (
                  <Link href={buildPageUrl(page + 1)} className={`${btnBase} border-muted/30 text-muted hover:border-primary hover:text-primary`} aria-label="Next page">&#8250;</Link>
                )}
              </div>
            );
          })()}
        </>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-4">🏙️</p>
          <p className="text-lg font-semibold">{t('noResults')}</p>
          <p className="text-sm mt-2">
            Be the first to add your business in {cityName}.
          </p>
        </div>
      )}

      {/* City JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              '@id': `${BASE}/${citySlug}#collection`,
              name: `Peptide Businesses in ${cityName}`,
              url: `${BASE}/${citySlug}`,
              description: `Directory of verified peptide businesses in ${cityName}`,
              isPartOf: {
                '@type': 'WebSite',
                '@id': `${BASE}/#website`,
                name: SITE.name,
                url: BASE,
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
                { '@type': 'ListItem', position: 2, name: `Peptide Businesses in ${cityName}`, item: `${BASE}/${citySlug}` },
              ],
            },
          ]),
        }}
      />
    </div>
  );
}
