import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { CategoryGrid } from '@/components/directory/CategoryGrid';
import { CityGrid } from '@/components/directory/CityGrid';
import { BusinessCard } from '@/components/directory/BusinessCard';
import { Button } from '@/components/ui/Button';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import { HeroSection } from '@/components/home/HeroSection';
import { WhyPeptideAlliance } from '@/components/home/WhyPeptideAlliance';
import { createAdminClient } from '@/lib/supabase/server';
import type { Business } from '@/lib/supabase/types';
import type { Metadata } from 'next';
import { SITE } from '@/lib/config/site';

const BASE = SITE.url;

// ISR: refresh featured section every hour
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    alternates: {
      canonical: BASE,
      languages: { 'en': BASE, 'x-default': BASE },
    },
    openGraph: {
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      url: BASE,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: SITE.name }],
    },
  };
}

export default async function HomePage() {
  const tHome = await getTranslations('home');

  // Fetch featured businesses — industry_leader first, then featured, verified, by rating
  const supabase = createAdminClient();
  const { data: featuredBizs } = await supabase
    .from('businesses')
    .select('*')
    .eq('is_active', true)
    .order('subscription_tier', { ascending: false })
    .order('is_verified', { ascending: false })
    .order('rating', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoryGrid />
      </section>

      {/* ── Browse by Location ────────────────────────────────────────────── */}
      <section className="bg-white/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-text mb-6">
            Browse by Location
          </h2>
          <CityGrid />
        </div>
      </section>

      {/* ── Featured Businesses ──────────────────────────────────────────── */}
      {featuredBizs && featuredBizs.length > 0 ? (
        <section className="bg-white/60 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-bold text-text">
                {tHome('featuredTitle')}
              </h2>
              <Link
                href="/search"
                className="text-primary font-semibold text-sm hover:underline"
              >
                {tHome('viewMore')} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBizs.map((biz) => (
                <BusinessCard key={biz.id} business={biz as unknown as Business} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white/60 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-4xl mb-4">🔬</p>
            <h2 className="text-xl font-heading font-bold text-text mb-2">
              {tHome('featuredTitle')}
            </h2>
            <p className="text-muted text-sm mb-6">
              Verified businesses will appear here soon.
            </p>
            <Link
              href="/claim"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              {tHome('ctaButton')}
            </Link>
          </div>
        </section>
      )}

      {/* ── Why The Peptide Alliance ──────────────────────────────────────── */}
      <WhyPeptideAlliance />

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="bg-primary py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-3">
            {tHome('ctaTitle')}
          </p>
          <p className="text-white/85 text-lg mb-8">{tHome('ctaSubtitle')}</p>
          <Link href="/claim">
            <Button
              variant="secondary"
              size="lg"
              className="bg-accent text-primary hover:bg-accent/90 font-bold"
            >
              {tHome('ctaButton')}
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-heading font-bold text-text text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: 'What is The Peptide Alliance?',
              a: 'The Peptide Alliance is the most trusted directory for verified peptide sources, clinics, compounding pharmacies, and research labs across the United States and Canada. We are the standard in regenerative health.',
            },
            {
              q: 'How do I find verified peptide sources?',
              a: 'Browse by category or use our search to find verified peptide brands, clinics, compounding pharmacies, research labs, wholesale suppliers, and manufacturers.',
            },
            {
              q: 'Is The Peptide Alliance free to use?',
              a: 'Yes — browsing the directory and contacting businesses is completely free. Business owners can list their business with a free Standard listing. Verified, Featured, and Industry Leader plans are available for enhanced visibility.',
            },
            {
              q: 'How do I list my peptide business?',
              a: 'Click "Get Listed" in the navigation. It takes just a few minutes and your Standard listing is free. We review and activate your listing within 24 hours.',
            },
            {
              q: 'What does the Verified Source badge mean?',
              a: 'The Verified Source badge indicates that a business has been reviewed and confirmed by The Peptide Alliance team. It signals trust, legitimacy, and commitment to quality in the peptide industry.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              suppressHydrationWarning
              className="group bg-white rounded-xl border border-muted/10 p-5 cursor-pointer"
            >
              <summary className="font-semibold text-text list-none flex items-center justify-between gap-4">
                <span>{q}</span>
                <span className="text-primary text-xl font-light flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-muted text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Newsletter Signup ────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <NewsletterSignup />
      </section>

      {/* WebSite + SearchAction JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${BASE}/#website`,
            name: SITE.name,
            url: BASE,
            inLanguage: 'en',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE}/search?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { q: 'What is The Peptide Alliance?', a: 'The Peptide Alliance is the most trusted directory for verified peptide sources, clinics, compounding pharmacies, and research labs across the United States and Canada.' },
              { q: 'How do I find verified peptide sources?', a: 'Browse by category or use our search to find verified peptide brands, clinics, compounding pharmacies, research labs, wholesale suppliers, and manufacturers.' },
              { q: 'Is The Peptide Alliance free to use?', a: 'Yes — browsing the directory and contacting businesses is completely free. Business owners can list their business with a free Standard listing.' },
              { q: 'How do I list my peptide business?', a: 'Click "Get Listed" in the navigation. It takes just a few minutes and your Standard listing is free.' },
              { q: 'What does the Verified Source badge mean?', a: 'The Verified Source badge indicates that a business has been reviewed and confirmed by The Peptide Alliance team.' },
            ].map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />

      {/* Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${BASE}/#organization`,
            name: SITE.name,
            url: BASE,
            logo: {
              '@type': 'ImageObject',
              url: `${BASE}/icon.png`,
              width: 512,
              height: 512,
            },
            description: SITE.description,
            areaServed: [
              { '@type': 'Country', name: 'United States' },
              { '@type': 'Country', name: 'Canada' },
            ],
            foundingDate: '2025',
            inLanguage: 'en',
            sameAs: [
              `https://www.linkedin.com/company/${SITE.social.linkedin}`,
              `https://www.instagram.com/${SITE.social.instagram}`,
              `https://twitter.com/${SITE.social.twitter}`,
            ],
          }),
        }}
      />
    </>
  );
}
