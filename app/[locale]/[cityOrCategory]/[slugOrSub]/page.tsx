import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BusinessCard } from '@/components/directory/BusinessCard';
import { LeadForm } from '@/components/business/LeadForm';
import { ClaimButton } from '@/components/business/ClaimButton';
import { PhotoGalleryDisplay } from '@/components/business/PhotoGallery';
import { ReviewForm } from '@/components/business/ReviewForm';
import { ViewTracker } from '@/components/business/ViewTracker';
import { TrustScoreBreakdown } from '@/components/business/TrustScoreBreakdown';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import { getCategoryBySlug, getCategorySlug, CATEGORIES } from '@/lib/config/categories';
import type { Business } from '@/lib/supabase/types';
import type { Metadata } from 'next';
import { Phone, Globe, MapPin, Clock, Instagram, Facebook, Linkedin, ExternalLink, Mail, CheckCircle, Star, Award, Shield, FlaskConical, Building2, Package, Microscope, Truck, Factory } from 'lucide-react';
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
// Business Detail — Landing Page Style
// ══════════════════════════════════════════════════════════════════════════════

// Category accent colours (tailwind-safe strings)
const CATEGORY_STYLES: Record<string, { gradient: string; accent: string; iconBg: string }> = {
  peptide_brands:          { gradient: 'from-blue-950 via-blue-900 to-blue-800',       accent: 'text-blue-300',   iconBg: 'bg-blue-500/20' },
  clinics:                 { gradient: 'from-emerald-950 via-emerald-900 to-teal-800', accent: 'text-emerald-300', iconBg: 'bg-emerald-500/20' },
  compounding_pharmacies:  { gradient: 'from-violet-950 via-violet-900 to-purple-800', accent: 'text-violet-300',  iconBg: 'bg-violet-500/20' },
  research_labs:           { gradient: 'from-cyan-950 via-cyan-900 to-sky-800',        accent: 'text-cyan-300',    iconBg: 'bg-cyan-500/20' },
  wholesale_suppliers:     { gradient: 'from-orange-950 via-orange-900 to-amber-800',  accent: 'text-orange-300',  iconBg: 'bg-orange-500/20' },
  manufacturers:           { gradient: 'from-rose-950 via-rose-900 to-red-800',        accent: 'text-rose-300',    iconBg: 'bg-rose-500/20' },
};

const CATEGORY_HIGHLIGHTS: Record<string, { icon: React.ReactNode; label: string }[]> = {
  peptide_brands: [
    { icon: <FlaskConical className="w-5 h-5" />, label: 'Third-Party Tested' },
    { icon: <Shield className="w-5 h-5" />, label: 'Certificate of Analysis' },
    { icon: <CheckCircle className="w-5 h-5" />, label: '99%+ Purity Standards' },
    { icon: <Package className="w-5 h-5" />, label: 'Domestic US / CA Shipping' },
  ],
  clinics: [
    { icon: <CheckCircle className="w-5 h-5" />, label: 'Physician-Supervised' },
    { icon: <Shield className="w-5 h-5" />, label: 'Personalized Protocols' },
    { icon: <Star className="w-5 h-5" />, label: 'Hormone Optimization' },
    { icon: <Award className="w-5 h-5" />, label: 'Functional Medicine' },
  ],
  compounding_pharmacies: [
    { icon: <Shield className="w-5 h-5" />, label: 'PCAB Accredited' },
    { icon: <FlaskConical className="w-5 h-5" />, label: 'Sterile Compounding' },
    { icon: <CheckCircle className="w-5 h-5" />, label: 'Ships Nationwide' },
    { icon: <Award className="w-5 h-5" />, label: 'Custom Formulations' },
  ],
  research_labs: [
    { icon: <Microscope className="w-5 h-5" />, label: 'HPLC / LC-MS Testing' },
    { icon: <Shield className="w-5 h-5" />, label: 'GLP/GCP Compliant' },
    { icon: <FlaskConical className="w-5 h-5" />, label: 'Custom Synthesis' },
    { icon: <Award className="w-5 h-5" />, label: 'COA Reporting' },
  ],
  wholesale_suppliers: [
    { icon: <Truck className="w-5 h-5" />, label: 'Bulk Pricing Available' },
    { icon: <Package className="w-5 h-5" />, label: 'Fast Fulfillment' },
    { icon: <Shield className="w-5 h-5" />, label: 'cGMP Quality Standards' },
    { icon: <CheckCircle className="w-5 h-5" />, label: 'B2B Supply Chain' },
  ],
  manufacturers: [
    { icon: <Factory className="w-5 h-5" />, label: 'GMP Certified Facility' },
    { icon: <FlaskConical className="w-5 h-5" />, label: 'Custom API Synthesis' },
    { icon: <Shield className="w-5 h-5" />, label: 'FDA Registered' },
    { icon: <Building2 className="w-5 h-5" />, label: 'Full CMC Support' },
  ],
};

async function BusinessDetailContent({
  biz,
  citySlug,
}: {
  biz: Business;
  citySlug: string;
}) {
  const t = await getTranslations('business');
  const supabaseDetail = await createClient();

  const [{ data: photos }, { data: relatedBizs }, { data: reviews }] = await Promise.all([
    supabaseDetail.from('business_photos').select('*').eq('business_id', biz.id).order('sort_order'),
    supabaseDetail.from('businesses').select('*').eq('category', biz.category).eq('is_active', true).neq('id', biz.id).order('trust_score', { ascending: false }).limit(3),
    supabaseDetail.from('reviews').select('*').eq('business_id', biz.id).order('created_at', { ascending: false }),
  ]);

  // Reviewer names
  const reviewerIds = (reviews ?? []).map((r: { user_id: string }) => r.user_id);
  let reviewerNames: Record<string, string> = {};
  if (reviewerIds.length > 0) {
    const { data: profiles } = await supabaseDetail.from('profiles').select('id, full_name').in('id', reviewerIds);
    reviewerNames = (profiles ?? []).reduce((acc: Record<string, string>, p: { id: string; full_name: string | null }) => {
      acc[p.id] = p.full_name ?? 'Anonymous';
      return acc;
    }, {});
  }

  const cat = CATEGORIES.find((c) => c.id === biz.category);
  const catLabel = cat ? cat.label.en : biz.category;
  const catSlug = cat ? getCategorySlug(cat.id) : biz.category;
  const description = biz.description_en;
  const isExpired = biz.expires_at ? new Date(biz.expires_at) < new Date() : false;
  const style = CATEGORY_STYLES[biz.category] ?? CATEGORY_STYLES.peptide_brands;
  const highlights = CATEGORY_HIGHLIGHTS[biz.category] ?? [];

  const socialLinks = [
    biz.instagram && { href: biz.instagram.startsWith('http') ? biz.instagram : `https://instagram.com/${biz.instagram.replace('@', '')}`, icon: <Instagram className="w-4 h-4" />, label: biz.instagram.startsWith('@') ? biz.instagram : `@${biz.instagram}` },
    biz.tiktok && { href: biz.tiktok.startsWith('http') ? biz.tiktok : `https://tiktok.com/${biz.tiktok.replace('@', '')}`, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.83a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.24z"/></svg>, label: biz.tiktok.startsWith('@') ? biz.tiktok : `@${biz.tiktok}` },
    biz.facebook && { href: biz.facebook.startsWith('http') ? biz.facebook : `https://facebook.com/${biz.facebook}`, icon: <Facebook className="w-4 h-4" />, label: 'Facebook' },
    biz.linkedin && { href: biz.linkedin.startsWith('http') ? biz.linkedin : `https://linkedin.com/company/${biz.linkedin}`, icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  return (
    <>
      <ViewTracker businessId={biz.id} />

      {/* ── JSON-LD ─────────────────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'LocalBusiness',
        '@id': `${BASE}/${citySlug}/${biz.slug}#business`,
        name: biz.name, description: description ?? undefined,
        url: `${BASE}/${citySlug}/${biz.slug}`,
        ...(biz.phone ? { telephone: biz.phone } : {}),
        ...(biz.logo_url ? { image: biz.logo_url } : {}),
        address: { '@type': 'PostalAddress', addressLocality: biz.city, addressRegion: biz.province, addressCountry: biz.country ?? 'US', ...(biz.address ? { streetAddress: biz.address } : {}) },
        ...(biz.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: biz.rating, reviewCount: biz.review_count ?? 1 } } : {}),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: catLabel, item: `${BASE}/${catSlug}` },
          { '@type': 'ListItem', position: 3, name: biz.name },
        ],
      }) }} />

      {/* ── Expired Banner ──────────────────────────────────────────────── */}
      {isExpired && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800 text-center">
          This listing has expired — it no longer appears in active search results.
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <div className={`bg-gradient-to-br ${style.gradient} text-white`}>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${catSlug}`} className="hover:text-white/80 transition-colors">{catLabel}</Link>
            <span>/</span>
            <span className="text-white/70 truncate max-w-[200px]">{biz.name}</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

            {/* Left: Info */}
            <div className="flex-1 min-w-0">
              {/* Tier + Category badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {biz.subscription_tier === 'industry_leader' && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    <Award className="w-3.5 h-3.5" /> Industry Leader
                  </span>
                )}
                {biz.subscription_tier === 'featured' && (
                  <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    <Star className="w-3.5 h-3.5" /> Featured
                  </span>
                )}
                {(biz.subscription_tier === 'verified' || biz.subscription_tier === 'featured' || biz.subscription_tier === 'industry_leader') && (
                  <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${style.iconBg} ${style.accent}`}>
                  {catLabel}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-3">
                {biz.name}
              </h1>

              {/* Subcategory */}
              {biz.subcategory && (
                <p className={`text-base font-medium mb-3 ${style.accent}`}>{biz.subcategory}</p>
              )}

              {/* Location */}
              <p className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {biz.address ?? `${biz.city}, ${biz.province}, ${biz.country}`}
              </p>

              {/* Service area */}
              {biz.service_area && biz.service_area !== 'local' && (
                <p className="flex items-center gap-2 text-white/60 text-xs mb-6">
                  <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                  {biz.service_area === 'national' ? 'Ships / Serves Nationally' : biz.service_area === 'online_only' ? 'Online Only' : 'Regional Service'}
                </p>
              )}

              {/* Rating */}
              {biz.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(biz.rating!) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                    ))}
                  </div>
                  <span className="text-white font-semibold text-sm">{biz.rating.toFixed(1)}</span>
                  <span className="text-white/50 text-sm">({biz.review_count} reviews)</span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {biz.phone && (
                  <a
                    href={`tel:${biz.phone}`}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    {biz.phone}
                  </a>
                )}
                {biz.website && (
                  <a
                    href={biz.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/20 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {biz.email && (
                  <a
                    href={`mailto:${biz.email}`}
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/20 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                )}
              </div>
            </div>

            {/* Right: Logo */}
            <div className="flex-shrink-0">
              {biz.logo_url ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-110" />
                  <img
                    src={biz.logo_url}
                    alt={`${biz.name} logo`}
                    className="relative w-36 h-36 md:w-48 md:h-48 rounded-3xl object-cover border-2 border-white/20 shadow-2xl bg-white"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-110" />
                  <div className={`relative w-36 h-36 md:w-48 md:h-48 rounded-3xl ${style.iconBg} border-2 border-white/10 flex items-center justify-center shadow-2xl overflow-hidden`}>
                    <img
                      src="/images/mascots/peptidealliancelogo.png"
                      alt="Peptide Alliance"
                      className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-90"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        {highlights.length > 0 && (
          <div className="border-t border-white/10 bg-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-6 overflow-x-auto scrollbar-none flex-wrap">
                {highlights.map((h, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap ${style.accent}`}>
                    {h.icon}
                    {h.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left / Main Column ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {(description || biz.long_description_en) && (
              <section>
                <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  About {biz.name}
                </h2>
                {description && (
                  <p className="text-text/80 leading-relaxed text-base mb-4">{description}</p>
                )}
                {biz.long_description_en && (
                  <div className="space-y-3 text-text/70 leading-relaxed text-sm">
                    {biz.long_description_en.split('\n').filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Keywords / Tags */}
            {biz.keywords && biz.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {biz.keywords.map((kw, i) => (
                  <span key={i} className="inline-block bg-primary/8 text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/15">
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {/* Photo Gallery */}
            {photos && photos.length > 0 && (
              <section>
                <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  Gallery
                </h2>
                <PhotoGalleryDisplay photos={photos} />
              </section>
            )}

            {/* Quick Info Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {biz.address && (
                <div className="bg-card rounded-2xl border border-muted/10 p-5 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm text-text">{biz.address}</p>
                    {biz.google_maps_url && (
                      <a href={biz.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline">
                        View on Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
              {biz.phone && (
                <div className="bg-card rounded-2xl border border-muted/10 p-5 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Phone</p>
                    <a href={`tel:${biz.phone}`} className="text-sm text-text hover:text-primary transition-colors font-medium">{biz.phone}</a>
                  </div>
                </div>
              )}
              {biz.email && (
                <div className="bg-card rounded-2xl border border-muted/10 p-5 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Email</p>
                    <a href={`mailto:${biz.email}`} className="text-sm text-text hover:text-primary transition-colors break-all">{biz.email}</a>
                  </div>
                </div>
              )}
              {biz.website && (
                <div className="bg-card rounded-2xl border border-muted/10 p-5 flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Website</p>
                    <a href={biz.website} target="_blank" rel="noopener noreferrer" className="text-sm text-text hover:text-primary transition-colors break-all">
                      {biz.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
              {biz.hours && (
                <div className="bg-card rounded-2xl border border-muted/10 p-5 flex items-start gap-3 sm:col-span-2">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Hours</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {Object.entries(biz.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between gap-4 text-sm">
                          <span className="text-muted capitalize">{day}</span>
                          <span className="text-text font-medium">{hours as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <section>
                <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  Follow &amp; Connect
                </h2>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-card border border-muted/10 text-text hover:text-primary hover:border-primary/30 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section>
              <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                Reviews
                {biz.review_count > 0 && (
                  <span className="text-sm font-normal text-muted">({biz.review_count})</span>
                )}
              </h2>

              {reviews && reviews.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {reviews.map((review: { id: string; user_id: string; rating: number; comment: string | null; owner_reply: string | null; created_at: string }) => (
                    <div key={review.id} className="bg-card rounded-2xl border border-muted/10 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {(reviewerNames[review.user_id] ?? 'A')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-text">{reviewerNames[review.user_id] ?? 'Anonymous'}</p>
                            <p className="text-xs text-muted">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted/20'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-sm text-text/80 leading-relaxed">{review.comment}</p>}
                      {review.owner_reply && (
                        <div className="mt-3 ml-2 pl-4 border-l-2 border-primary/30 bg-primary/3 rounded-r-lg py-2">
                          <p className="text-xs font-bold text-primary mb-1">Response from {biz.name}</p>
                          <p className="text-sm text-text/70">{review.owner_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-muted/10 border-dashed p-8 text-center mb-6">
                  <Star className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                  <p className="text-sm text-muted">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}

              <ReviewForm businessId={biz.id} locale="en" />
            </section>

            {/* Claim CTA */}
            {!biz.claimed_by && (
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
                <h3 className="font-heading font-bold text-text mb-1">Is this your business?</h3>
                <p className="text-sm text-muted mb-4">Claim this listing to update your information, respond to reviews, and unlock premium features.</p>
                <ClaimButton locale="en" businessId={biz.id} businessName={biz.name} />
              </div>
            )}
          </div>

          {/* ── Right / Sticky Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Lead Form */}
              <div className="bg-card rounded-2xl border border-muted/10 p-6 shadow-sm">
                <h2 className="font-heading font-bold text-xl text-text mb-1">{t('sendMessage')}</h2>
                <p className="text-xs text-muted mb-4">Get in touch with {biz.name} directly</p>
                <LeadForm businessId={biz.id} businessName={biz.name} />
              </div>

              {/* Trust Score Breakdown — only shown for paid tiers (verified/featured/industry_leader) */}
              {(biz.subscription_tier === 'verified' || biz.subscription_tier === 'featured' || biz.subscription_tier === 'industry_leader') && <TrustScoreBreakdown biz={biz} />}

              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* ── Related Businesses ──────────────────────────────────────────── */}
        {relatedBizs && relatedBizs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-muted/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-text">
                More {catLabel}
              </h2>
              <Link href={`/${catSlug}`} className="text-primary text-sm font-semibold hover:underline">
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
    </>
  );
}
