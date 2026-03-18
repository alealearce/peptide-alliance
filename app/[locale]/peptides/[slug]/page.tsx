import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/server';
import {
  getPeptideBySlug,
  getRelatedPeptides,
  PEPTIDE_CATEGORIES,
  ALL_PEPTIDE_SLUGS,
  type Peptide,
} from '@/lib/config/peptides';
import { PEPTIDE_SECTIONS } from '@/lib/config/peptide-sections';
import { SITE } from '@/lib/config/site';
import { BadgeCheck, FlaskConical, Syringe, AlertTriangle, BookOpen, ChevronRight, Users, Microscope, Baby, Dumbbell } from 'lucide-react';

export const revalidate = 3600;

export async function generateStaticParams() {
  return ALL_PEPTIDE_SLUGS.map((slug) => ({ locale: 'en', slug }));
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return {};
  const cat = PEPTIDE_CATEGORIES[peptide.category];
  return {
    title: `${peptide.name} — Research, Uses & Verified Sources`,
    description: `${peptide.tagline} Learn about ${peptide.name} research, use cases, dosing, and find verified ${cat.label.toLowerCase()} suppliers in North America.`,
    alternates: { canonical: `${SITE.url}/peptides/${slug}` },
    openGraph: {
      title: `${peptide.name} | Peptide Database — ${SITE.name}`,
      description: peptide.tagline,
      url: `${SITE.url}/peptides/${slug}`,
      siteName: SITE.name,
      type: 'article',
      images: [{ url: `${SITE.url}/opengraph-image`, width: 1200, height: 630, alt: peptide.name }],
    },
  };
}

const legalBadge: Record<string, { label: string; color: string }> = {
  'research-chemical': { label: 'Research Chemical', color: 'bg-amber-100 text-amber-800 border border-amber-200' },
  'prescription': { label: 'Prescription Only', color: 'bg-blue-100 text-blue-800 border border-blue-200' },
  'fda-approved': { label: 'FDA Approved', color: 'bg-green-100 text-green-800 border border-green-200' },
  'otc': { label: 'OTC / Cosmetic', color: 'bg-gray-100 text-gray-700 border border-gray-200' },
};

async function getVerifiedSources(peptide: Peptide) {
  try {
    const supabase = createAdminClient();
    const categoryMap: Record<string, string[]> = {
      'performance-recovery': ['peptide_brands', 'compounding_pharmacies', 'wholesale_suppliers'],
      'growth-hormone': ['peptide_brands', 'clinics', 'compounding_pharmacies'],
      'weight-loss-metabolic': ['clinics', 'compounding_pharmacies', 'peptide_brands'],
      'immune-anti-inflammatory': ['peptide_brands', 'clinics', 'compounding_pharmacies'],
      'sexual-health': ['clinics', 'compounding_pharmacies', 'peptide_brands'],
      'cognitive-nootropic': ['peptide_brands', 'clinics'],
      'anti-aging-longevity': ['peptide_brands', 'clinics', 'compounding_pharmacies'],
      'cosmetic': ['peptide_brands', 'wholesale_suppliers'],
      'cardiovascular': ['clinics', 'compounding_pharmacies', 'research_labs'],
    };

    const relevantCategories = categoryMap[peptide.category] ?? [];

    const [suppliersRes, clinicsRes] = await Promise.all([
      supabase
        .from('businesses')
        .select('id, name, slug, city, province, country, category, subscription_tier, is_verified, trust_score, description_en, logo_url')
        .in('category', relevantCategories)
        .eq('is_active', true)
        .eq('is_verified', true)
        .order('subscription_tier', { ascending: false })
        .order('trust_score', { ascending: false })
        .limit(12),
      supabase
        .from('businesses')
        .select('id, name, slug, city, province, country, subscription_tier, is_verified, trust_score, logo_url')
        .eq('category', 'clinics')
        .eq('is_active', true)
        .limit(6),
    ]);

    return { suppliers: suppliersRes.data ?? [], clinics: clinicsRes.data ?? [] };
  } catch {
    return { suppliers: [], clinics: [] };
  }
}

export default async function PeptidePage({
  params: { slug },
}: {
  params: { locale: string; slug: string };
}) {
  const peptide = getPeptideBySlug(slug);
  if (!peptide) notFound();

  const cat = PEPTIDE_CATEGORIES[peptide.category];
  const relatedPeptides = getRelatedPeptides(peptide);
  const badge = legalBadge[peptide.legalStatus];
  const { suppliers, clinics } = await getVerifiedSources(peptide);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `${peptide.name} — Research, Use Cases & Verified Sources`,
    description: peptide.tagline,
    url: `${SITE.url}/peptides/${slug}`,
    about: {
      '@type': 'Drug',
      name: peptide.name,
      alternateName: peptide.alsoKnownAs,
      description: peptide.description,
      administrationRoute: peptide.administrationRoutes.join(', '),
    },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Peptide Database', item: `${SITE.url}/peptides` },
      { '@type': 'ListItem', position: 3, name: peptide.name },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${peptide.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: peptide.description },
      },
      {
        '@type': 'Question',
        name: `How does ${peptide.name} work?`,
        acceptedAnswer: { '@type': 'Answer', text: peptide.mechanism },
      },
      {
        '@type': 'Question',
        name: `What is the typical dosage for ${peptide.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: peptide.typicalDosage },
      },
      {
        '@type': 'Question',
        name: `What are the uses of ${peptide.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: peptide.useCases.join('. ') },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-bg">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/peptides" className="hover:text-white">Peptide Database</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{peptide.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${cat.color}30`, color: '#fff' }}
                >
                  {cat.label}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-2">{peptide.name}</h1>
              {peptide.alsoKnownAs.length > 0 && (
                <p className="text-white/60 text-sm mb-4">Also known as: {peptide.alsoKnownAs.join(', ')}</p>
              )}
              <p className="text-white/85 text-lg max-w-2xl leading-relaxed">{peptide.tagline}</p>

              {/* Quick stats */}
              <div className="mt-6 flex flex-wrap gap-3">
                {peptide.administrationRoutes.map(route => (
                  <span key={route} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm text-white/90">
                    <Syringe className="w-3.5 h-3.5" /> {route}
                  </span>
                ))}
              </div>
            </div>

            {/* Peptide category visual card */}
            <div className="lg:w-64 xl:w-72 flex-shrink-0">
              <div
                className="relative w-full aspect-square max-w-xs mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-white/20 flex flex-col items-center justify-center gap-4 p-6"
                style={{ background: `linear-gradient(135deg, ${cat.color}55 0%, ${cat.color}22 60%, transparent 100%), rgba(255,255,255,0.06)` }}
              >
                {/* Large category icon */}
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}40`, boxShadow: `0 0 40px ${cat.color}60` }}
                >
                  <FlaskConical className="w-12 h-12 text-white" />
                </div>

                {/* Category label */}
                <div className="text-center">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: cat.color }}
                  >
                    {cat.label}
                  </p>
                  <p className="text-white font-heading font-extrabold text-lg leading-tight">{peptide.name}</p>
                </div>

                {/* Decorative dots */}
                <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-30">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-1">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="w-1 h-1 rounded-full bg-white" />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-1 opacity-20">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-1">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full bg-white" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick info pill below the card */}
              <div className="mt-3 flex justify-center gap-2 flex-wrap">
                <span className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full border border-white/10">
                  {peptide.administrationRoutes[0]}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* Warning banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm">{peptide.warning}</p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Description */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-bold text-text">Overview</h2>
              </div>
              <p className="text-text/80 leading-relaxed font-medium">{peptide.description}</p>

              {PEPTIDE_SECTIONS[peptide.slug]?.deepDive && (
                <div className="mt-5 space-y-4">
                  {PEPTIDE_SECTIONS[peptide.slug].deepDive
                    .split('\n\n')
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="text-text/75 leading-relaxed text-[0.95rem]">
                        {para.trim()}
                      </p>
                    ))}
                </div>
              )}
            </section>

            {/* Mechanism */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Microscope className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-bold text-text">Mechanism of Action</h2>
              </div>
              <p className="text-text/80 leading-relaxed">{peptide.mechanism}</p>
            </section>

            {/* Use Cases */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-bold text-text">Use Cases</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {peptide.useCases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2 bg-card rounded-lg px-4 py-3 border border-muted/10">
                    <span className="text-accent font-bold mt-0.5">✓</span>
                    <span className="text-text/80 text-sm">{uc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Research */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-bold text-text">Research Summary</h2>
              </div>
              <div className="bg-card rounded-xl border border-muted/10 p-6">
                <p className="text-text/80 leading-relaxed">{peptide.researchSummary}</p>
              </div>
            </section>

            {/* ELI5 Section */}
            {PEPTIDE_SECTIONS[peptide.slug] && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Baby className="w-5 h-5 text-sky-500" />
                  <h2 className="text-xl font-heading font-bold text-text">
                    Explain It Like I&apos;m 5 Years Old
                  </h2>
                </div>
                <div className="bg-sky-50 rounded-xl border border-sky-100 p-6">
                  <p className="text-sky-900/80 leading-relaxed whitespace-pre-line">
                    {PEPTIDE_SECTIONS[peptide.slug].eli5}
                  </p>
                </div>
              </section>
            )}

            {/* Gym Bros Section */}
            {PEPTIDE_SECTIONS[peptide.slug] && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Dumbbell className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-heading font-bold text-text">
                    How the Gym Bros Are Using It
                  </h2>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
                  <p className="text-amber-900/80 leading-relaxed whitespace-pre-line">
                    {PEPTIDE_SECTIONS[peptide.slug].gymBro}
                  </p>
                </div>
              </section>
            )}

          </div>

          {/* Right: sidebar */}
          <div className="space-y-6">

            {/* Dosing card */}
            <div className="bg-card rounded-xl border border-muted/10 p-5">
              <h3 className="font-heading font-bold text-text mb-3 flex items-center gap-2">
                <Syringe className="w-4 h-4 text-primary" /> Typical Dosing
              </h3>
              <p className="text-text/80 text-sm leading-relaxed">{peptide.typicalDosage}</p>
              <div className="mt-3 pt-3 border-t border-muted/10">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Administration</p>
                <div className="flex flex-col gap-1">
                  {peptide.administrationRoutes.map(r => (
                    <span key={r} className="text-xs bg-primary/8 text-primary px-2 py-1 rounded">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal status */}
            <div className={`rounded-xl p-5 ${badge.color}`}>
              <p className="font-semibold text-sm mb-1">{badge.label}</p>
              <p className="text-xs opacity-80 leading-relaxed">{peptide.warning}</p>
            </div>

            {/* Related peptides */}
            {relatedPeptides.length > 0 && (
              <div className="bg-card rounded-xl border border-muted/10 p-5">
                <h3 className="font-heading font-bold text-text mb-3 text-sm">Related Peptides</h3>
                <div className="flex flex-col gap-2">
                  {relatedPeptides.map(rp => (
                    <Link
                      key={rp.slug}
                      href={`/peptides/${rp.slug}`}
                      className="flex items-center justify-between hover:text-primary transition-colors group"
                    >
                      <span className="text-sm font-semibold text-text group-hover:text-primary">{rp.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verified Suppliers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-heading font-bold text-text">
                Verified Sources for {peptide.name}
              </h2>
            </div>
            <Link href="/search" className="text-sm text-primary font-semibold hover:underline">
              Browse all →
            </Link>
          </div>

          {suppliers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((biz) => (
                <Link
                  key={biz.id}
                  href={`/search?business=${biz.slug}`}
                  className="bg-card rounded-xl border border-muted/10 p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {biz.logo_url ? (
                      <Image src={biz.logo_url} alt={biz.name} width={40} height={40} className="rounded-lg object-cover w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{biz.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-text group-hover:text-primary truncate">{biz.name}</p>
                      <p className="text-xs text-muted">{biz.city ? `${biz.city}, ${biz.province}` : (biz.country === 'US' ? 'United States' : 'Canada')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {biz.is_verified && (
                      <span className="text-xs bg-accent/20 text-primary font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {biz.trust_score && (
                      <span className="text-xs text-muted">Trust: {biz.trust_score}/100</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-muted/10 p-8 text-center">
              <Users className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="font-semibold text-text mb-1">No verified sources listed yet</p>
              <p className="text-muted text-sm mb-4">Are you a verified supplier of {peptide.name}? Get listed and appear here.</p>
              <Link
                href="/claim"
                className="inline-block bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm"
              >
                Get Listed
              </Link>
            </div>
          )}

          {suppliers.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href="/claim"
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                Sell {peptide.name}? Get listed as a verified source →
              </Link>
            </div>
          )}
        </section>

        {/* Clinics offering therapy */}
        {(peptide.category === 'weight-loss-metabolic' || peptide.category === 'growth-hormone' ||
          peptide.category === 'sexual-health' || peptide.category === 'immune-anti-inflammatory') &&
          clinics.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-heading font-bold text-text">
                Clinics Offering {peptide.name} Therapy
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinics.slice(0, 6).map((clinic) => (
                <Link
                  key={clinic.id}
                  href={`/search?business=${clinic.slug}`}
                  className="bg-card rounded-xl border border-muted/10 p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {clinic.logo_url ? (
                      <Image src={clinic.logo_url} alt={clinic.name} width={40} height={40} className="rounded-lg object-cover w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{clinic.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-text group-hover:text-primary truncate">{clinic.name}</p>
                      <p className="text-xs text-muted">{clinic.city ? `${clinic.city}, ${clinic.province}` : 'National'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to database */}
        <div className="pt-4 border-t border-muted/10">
          <Link href="/peptides" className="text-primary font-semibold hover:underline text-sm">
            ← Back to Peptide Database
          </Link>
        </div>
      </div>
    </main>
  );
}
