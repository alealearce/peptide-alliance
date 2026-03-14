import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BusinessCard } from '@/components/directory/BusinessCard';
import { Badge } from '@/components/ui/Badge';
import { LeadForm } from '@/components/business/LeadForm';
import { ClaimButton } from '@/components/business/ClaimButton';
import { PhotoGalleryDisplay } from '@/components/business/PhotoGallery';
import { ReviewForm } from '@/components/business/ReviewForm';
import { ViewTracker } from '@/components/business/ViewTracker';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import { getCategoryBySlug, getCategorySlug, CATEGORIES } from '@/lib/config/categories';
import type { Business } from '@/lib/supabase/types';
import type { Metadata } from 'next';
import { Phone, Globe, MapPin, Clock, Instagram, Facebook, Linkedin, ExternalLink } from 'lucide-react';
import { SITE } from '@/lib/config/site';

interface Props {
  params: { locale: string; cityOrCategory: string; slugOrSub: string };
  searchParams?: { page?: string };
}

const BASE = SITE.url;

// Dynamic — always serve fresh HTML (avoids stale ISR cache after tier changes)
export const dynamic = 'force-dynamic';

// ── Determine what kind of page this is ──────────────────────────────────────

async function resolvePageType(params: Props['params']) {
  const { cityOrCategory, slugOrSub } = params;

  // 1. Check if first segment is a category slug
  const cat = getCategoryBySlug(cityOrCategory);
  if (cat) {
    // Second segment is a subcategory ID
    const sub = cat.subcategories.find((s) => s.id === slugOrSub);
    if (sub) {
      return { type: 'subcategory' as const, cat, sub };
    }
    return { type: 'notfound' as const };
  }

  // 2. First segment is a city slug → second segment is a business slug
  const supabase = await createClient();
  const { data: biz } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slugOrSub)
    .single();

  if (biz) {
    return { type: 'business' as const, biz };
  }

  return { type: 'notfound' as const };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await resolvePageType(params);

  // ── Subcategory metadata ───────────────────────────────────────────────────
  if (resolved.type === 'subcategory') {
    const { cat, sub } = resolved;
    const subLabel = sub.label.en;
    const catLabel = cat.label.en;
    return {
      title: `${subLabel} · ${catLabel} — ${SITE.name}`,
      description: `Find verified ${subLabel.toLowerCase()} across the US and Canada. ${SITE.name} peptide business directory.`,
      alternates: {
        canonical: `${BASE}/${cat.slug.en}/${params.slugOrSub}`,
        languages: { 'en': `${BASE}/${cat.slug.en}/${params.slugOrSub}`, 'x-default': `${BASE}/${cat.slug.en}/${params.slugOrSub}` },
      },
      openGraph: {
        title: `${subLabel} · ${catLabel} — ${SITE.name}`,
        description: `Find verified ${subLabel.toLowerCase()} across the US and Canada.`,
        url: `${BASE}/${cat.slug.en}/${params.slugOrSub}`,
        siteName: SITE.name,
        locale: 'en_US',
        type: 'website',
        images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: `${subLabel} — ${SITE.name}` }],
      },
    };
  }

  // ── Business metadata ──────────────────────────────────────────────────────
  if (resolved.type === 'business') {
    const biz = resolved.biz;
    const description = biz.description_en;

    return {
      title: `${biz.name} · ${biz.city}, ${biz.province}`,
      description: description ?? undefined,
      alternates: {
        canonical: `${BASE}/${biz.city_slug}/${biz.slug}`,
        languages: { 'en': `${BASE}/${biz.city_slug}/${biz.slug}`, 'x-default': `${BASE}/${biz.city_slug}/${biz.slug}` },
      },
      openGraph: {
        title: `${biz.name} · ${biz.city}, ${biz.province}`,
        description: description ?? undefined,
        url: `${BASE}/${biz.city_slug}/${biz.slug}`,
        siteName: SITE.name,
        locale: 'en_US',
        type: 'website',
        images: biz.logo_url
          ? [{ url: biz.logo_url, alt: biz.name }]
          : [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: biz.name }],
      },
    };
  }

  return {};
}

export default async function SlugOrSubPage({ params, searchParams }: Props) {
  const resolved = await resolvePageType(params);

  if (resolved.type === 'notfound') {
    notFound();
  }

  if (resolved.type === 'subcategory') {
    return (
      <SubcategoryPageContent
        cat={resolved.cat}
        sub={resolved.sub}
        searchParams={searchParams}
      />
    );
  }

  // Business detail page
  return (
    <BusinessDetailContent
      biz={resolved.biz}
      citySlug={params.cityOrCategory}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Subcategory Listing
// ══════════════════════════════════════════════════════════════════════════════

async function SubcategoryPageContent({
  cat,
  sub,
  searchParams,
}: {
  cat: NonNullable<ReturnType<typeof getCategoryBySlug>>;
  sub: { id: string; label: { en: string } };
  searchParams?: Props['searchParams'];
}) {
  const t = await getTranslations('search');
  const catLabel = cat.label.en;
  const subLabel = sub.label.en;
  const catSlug = getCategorySlug(cat.id);

  const page = Number(searchParams?.page ?? 1);
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  const supabase = await createClient();
  const { data: businesses, count } = await supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .eq('category', cat.id)
    .eq('subcategory', sub.id)
    .eq('is_active', true)
    .order('is_verified', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-4">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href={`/${catSlug}`} className="hover:text-primary">{catLabel}</Link>
        <span>/</span>
        <span className="text-text">{subLabel}</span>
      </div>

      <h1 className="text-3xl font-heading font-bold text-text mb-1">
        {cat.icon} {subLabel}
      </h1>
      {count !== null && (
        <p className="text-muted mb-8">{count} {t('results')}</p>
      )}

      {businesses && businesses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {businesses.map((biz: Business) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/${catSlug}/${sub.id}?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-colors ${
                    p === page
                      ? 'bg-primary text-white border-primary'
                      : 'border-muted/30 text-muted hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
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
// Business Detail
// ══════════════════════════════════════════════════════════════════════════════

async function BusinessDetailContent({
  biz,
  citySlug,
}: {
  biz: Business;
  citySlug: string;
}) {
  const t = await getTranslations('business');
  const supabaseDetail = await createClient();

  // Fetch business photos
  const { data: photos } = await supabaseDetail
    .from('business_photos')
    .select('*')
    .eq('business_id', biz.id)
    .order('sort_order');

  // Fetch related businesses in same city
  const { data: relatedBizs } = await supabaseDetail
    .from('businesses')
    .select('*')
    .eq('city_slug', biz.city_slug ?? citySlug)
    .eq('is_active', true)
    .neq('id', biz.id)
    .order('is_verified', { ascending: false })
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(3);

  // Fetch reviews
  const { data: reviews } = await supabaseDetail
    .from('reviews')
    .select('*')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false });

  // Fetch reviewer names
  const reviewerIds = (reviews ?? []).map((r: { user_id: string }) => r.user_id);
  let reviewerNames: Record<string, string> = {};
  if (reviewerIds.length > 0) {
    const { data: profiles } = await supabaseDetail
      .from('profiles')
      .select('id, full_name')
      .in('id', reviewerIds);
    reviewerNames = (profiles ?? []).reduce((acc: Record<string, string>, p: { id: string; full_name: string | null }) => {
      acc[p.id] = p.full_name ?? 'Anonymous';
      return acc;
    }, {} as Record<string, string>);
  }

  const cat = CATEGORIES.find((c) => c.id === biz.category);
  const catLabel = cat ? cat.label.en : biz.category;
  const catSlug = cat ? getCategorySlug(cat.id) : biz.category;
  const description = biz.description_en;

  const isExpired = biz.expires_at ? new Date(biz.expires_at) < new Date() : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Silent view tracker */}
      <ViewTracker businessId={biz.id} />

      {/* LocalBusiness JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${BASE}/${citySlug}/${biz.slug}#business`,
            name: biz.name,
            description: description ?? undefined,
            url: `${BASE}/${citySlug}/${biz.slug}`,
            ...(biz.phone ? { telephone: biz.phone } : {}),
            ...((() => {
              const links: string[] = [];
              if (biz.website) links.push(biz.website);
              if (biz.instagram) links.push(biz.instagram.startsWith('http') ? biz.instagram : `https://instagram.com/${biz.instagram.replace('@', '')}`);
              if (biz.facebook) links.push(biz.facebook.startsWith('http') ? biz.facebook : `https://facebook.com/${biz.facebook}`);
              if (biz.tiktok) links.push(biz.tiktok.startsWith('http') ? biz.tiktok : `https://tiktok.com/${biz.tiktok.replace('@', '')}`);
              if (biz.linkedin) links.push(biz.linkedin.startsWith('http') ? biz.linkedin : `https://linkedin.com/company/${biz.linkedin}`);
              return links.length > 0 ? { sameAs: links } : {};
            })()),
            ...(biz.logo_url ? { image: biz.logo_url } : {}),
            address: {
              '@type': 'PostalAddress',
              addressLocality: biz.city,
              addressRegion: biz.province,
              addressCountry: biz.country ?? 'US',
              ...(biz.address ? { streetAddress: biz.address } : {}),
            },
            ...(biz.latitude && biz.longitude ? {
              geo: { '@type': 'GeoCoordinates', latitude: biz.latitude, longitude: biz.longitude },
            } : {}),
            ...(biz.rating ? {
              aggregateRating: { '@type': 'AggregateRating', ratingValue: biz.rating, reviewCount: biz.review_count ?? 1 },
            } : {}),
          }),
        }}
      />
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
              { '@type': 'ListItem', position: 2, name: biz.city, item: `${BASE}/${citySlug}` },
              ...(cat ? [{ '@type': 'ListItem', position: 3, name: catLabel, item: `${BASE}/${catSlug}` }] : []),
              { '@type': 'ListItem', position: cat ? 4 : 3, name: biz.name },
            ],
          }),
        }}
      />

      {/* Expired banner */}
      {isExpired && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <p className="font-semibold">This listing has expired</p>
          <p className="mt-0.5 text-amber-700">
            It no longer appears in active listings, but this page stays live for SEO.
          </p>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href={`/${citySlug}`} className="hover:text-primary">{biz.city}</Link>
        <span>/</span>
        {cat && (
          <>
            <Link href={`/${catSlug}`} className="hover:text-primary">{catLabel}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-text truncate max-w-[200px]">{biz.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Left Column: Main Info ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title block */}
          <div>
            <div className="flex items-start gap-4 flex-wrap">
              {biz.logo_url && (
                <img
                  src={biz.logo_url}
                  alt={`${biz.name} logo`}
                  className="w-20 h-20 rounded-2xl object-cover border border-muted/10 flex-shrink-0 bg-muted/5"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-text">
                      {biz.name}
                    </h1>
                    <p className="text-muted mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {biz.address ?? `${biz.city}, ${biz.province}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {biz.is_verified && (
                      <Badge variant="verified">{t('verified')}</Badge>
                    )}
                    {cat && (
                      <Badge variant="category">{catLabel}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="prose prose-sm max-w-none text-text/80 leading-relaxed">
              <p>{description}</p>
            </div>
          )}

          {/* Long Description */}
          {biz.long_description_en && (
            <div className="prose prose-sm max-w-none text-text/70 leading-relaxed">
              {biz.long_description_en.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* Photo Gallery */}
          {photos && photos.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-lg text-text mb-3">Photos</h2>
              <PhotoGalleryDisplay photos={photos} />
            </div>
          )}

          {/* Contact Details */}
          <div className="bg-card rounded-2xl border border-muted/10 p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-text">{t('contact')}</h2>

            {biz.phone && (
              <a href={`tel:${biz.phone}`} className="flex items-center gap-3 text-text hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                <span>{biz.phone}</span>
              </a>
            )}
            {biz.website && (
              <a href={biz.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text hover:text-primary transition-colors">
                <Globe className="w-5 h-5 text-primary" />
                <span className="truncate">{biz.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {biz.google_maps_url && (
              <a href={biz.google_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text hover:text-primary transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="flex items-center gap-1">
                  View on Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>
            )}
            {biz.instagram && (
              <a href={biz.instagram.startsWith('http') ? biz.instagram : `https://instagram.com/${biz.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text hover:text-primary transition-colors">
                <Instagram className="w-5 h-5 text-primary" />
                <span>{biz.instagram.startsWith('@') ? biz.instagram : `@${biz.instagram}`}</span>
              </a>
            )}
            {biz.tiktok && (
              <a href={biz.tiktok.startsWith('http') ? biz.tiktok : `https://tiktok.com/${biz.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text hover:text-primary transition-colors">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.83a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.24z"/></svg>
                <span>{biz.tiktok.startsWith('@') ? biz.tiktok : `@${biz.tiktok}`}</span>
              </a>
            )}
            {biz.facebook && (
              <a href={biz.facebook.startsWith('http') ? biz.facebook : `https://facebook.com/${biz.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text hover:text-primary transition-colors">
                <Facebook className="w-5 h-5 text-primary" />
                <span className="truncate">{biz.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')}</span>
              </a>
            )}
            {biz.linkedin && (
              <a href={biz.linkedin.startsWith('http') ? biz.linkedin : `https://linkedin.com/company/${biz.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5 text-primary" />
                <span className="truncate">{biz.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, '')}</span>
              </a>
            )}
            {biz.hours && (
              <div className="flex items-start gap-3 text-muted text-sm">
                <Clock className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <pre className="font-body whitespace-pre-wrap">{JSON.stringify(biz.hours, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Keywords */}
          {biz.keywords && biz.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {biz.keywords.map((kw, i) => (
                <span key={i} className="inline-block bg-primary/5 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Reviews Section */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-text">Reviews</h2>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review: { id: string; user_id: string; rating: number; comment: string | null; owner_reply: string | null; created_at: string }) => (
                  <div key={review.id} className="bg-card rounded-xl border border-muted/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-text">
                          {reviewerNames[review.user_id] ?? 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-lg ${i < review.rating ? 'text-amber-400' : 'opacity-20'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-text/80">{review.comment}</p>
                    )}
                    {review.owner_reply && (
                      <div className="mt-3 ml-4 pl-3 border-l-2 border-primary/30">
                        <p className="text-xs font-semibold text-primary mb-1">Business Reply</p>
                        <p className="text-sm text-text/70">{review.owner_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-4">
                No reviews yet. Be the first!
              </p>
            )}

            <ReviewForm businessId={biz.id} locale="en" />
          </div>

          {/* Claim button for unclaimed listings */}
          {!biz.claimed_by && (
            <ClaimButton locale="en" businessId={biz.id} businessName={biz.name} />
          )}
        </div>

        {/* ── Right Column: Lead Form + Newsletter ────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-card rounded-2xl border border-muted/10 p-6">
              <h2 className="font-heading font-bold text-xl text-text mb-4">
                {t('sendMessage')}
              </h2>
              <LeadForm businessId={biz.id} businessName={biz.name} />
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* ── More businesses in this city ─────────────────────────────────── */}
      {relatedBizs && relatedBizs.length > 0 && (
        <div className="mt-12 border-t border-muted/10 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl text-text">
              More businesses in {biz.city}
            </h2>
            <Link
              href={`/${citySlug}`}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBizs.map((rb: Business) => (
              <BusinessCard key={rb.id} business={rb} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
