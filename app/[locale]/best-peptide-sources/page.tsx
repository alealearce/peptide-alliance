import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/server';
import { SITE } from '@/lib/config/site';
import { BadgeCheck, Star, FlaskConical, ShieldCheck, Award, ChevronRight } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Peptide Sources 2025 — Verified & Ranked',
  description: 'The definitive guide to the best verified peptide sources in the US and Canada. Every source ranked by Trust Score, certifications, lab results, and community reviews.',
  alternates: {
    canonical: `${SITE.url}/best-peptide-sources`,
  },
  openGraph: {
    title: 'Best Peptide Sources 2025 — Verified & Ranked | The Peptide Alliance',
    description: 'Find the most trusted peptide suppliers, compounding pharmacies, and clinics in North America — independently verified and ranked.',
    url: `${SITE.url}/best-peptide-sources`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: `${SITE.url}/opengraph-image`, width: 1200, height: 630, alt: 'Best Peptide Sources 2025' }],
  },
};

async function getTopSources() {
  const supabase = createAdminClient();

  const [brands, pharmacies, clinics] = await Promise.all([
    supabase
      .from('businesses')
      .select('id, name, slug, city, province, country, subscription_tier, trust_score, rating, review_count, logo_url, description_en, website')
      .eq('category', 'peptide_brands')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('trust_score', { ascending: false })
      .limit(10),

    supabase
      .from('businesses')
      .select('id, name, slug, city, province, country, subscription_tier, trust_score, rating, review_count, logo_url, description_en')
      .eq('category', 'compounding_pharmacies')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('trust_score', { ascending: false })
      .limit(10),

    supabase
      .from('businesses')
      .select('id, name, slug, city, province, country, subscription_tier, trust_score, rating, review_count, logo_url, description_en')
      .eq('category', 'clinics')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('trust_score', { ascending: false })
      .limit(10),
  ]);

  return {
    brands: brands.data ?? [],
    pharmacies: pharmacies.data ?? [],
    clinics: clinics.data ?? [],
  };
}

type BizRow = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  province: string | null;
  country: string | null;
  subscription_tier: string | null;
  trust_score: number | null;
  rating: number | null;
  review_count: number | null;
  logo_url: string | null;
  description_en: string | null;
};

const tierBadge: Record<string, { label: string; color: string }> = {
  industry_leader: { label: '🏆 Industry Leader', color: 'bg-amber-100 text-amber-800' },
  featured: { label: '⭐ Featured', color: 'bg-sky/20 text-primary' },
  verified: { label: '✓ Verified', color: 'bg-accent/20 text-primary' },
  free: { label: 'Listed', color: 'bg-muted/10 text-muted' },
};

function SourceCard({ biz, rank }: { biz: BizRow; rank: number }) {
  const tier = tierBadge[biz.subscription_tier ?? 'free'] ?? tierBadge.free;
  const location = biz.city ? `${biz.city}, ${biz.province}` : biz.country === 'US' ? 'United States' : 'Canada';

  return (
    <div className="bg-card rounded-xl border border-muted/10 p-5 flex gap-4 hover:border-primary/20 hover:shadow-sm transition-all">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-bold text-sm">#{rank}</span>
      </div>

      {/* Logo */}
      <div className="flex-shrink-0">
        {biz.logo_url ? (
          <Image src={biz.logo_url} alt={biz.name} width={48} height={48} className="w-12 h-12 rounded-xl object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">{biz.name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-heading font-bold text-text">{biz.name}</h3>
            <p className="text-xs text-muted">{location}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${tier.color}`}>
            {tier.label}
          </span>
        </div>

        {biz.description_en && (
          <p className="text-sm text-text/70 line-clamp-2 mb-2">{biz.description_en}</p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {biz.trust_score != null && (
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Trust {biz.trust_score}/100</span>
            </div>
          )}
          {biz.rating != null && biz.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold text-text">{biz.rating.toFixed(1)}</span>
              {biz.review_count != null && biz.review_count > 0 && (
                <span className="text-xs text-muted">({biz.review_count})</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-muted">Verified</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 self-center">
        <Link
          href={`/search?business=${biz.slug}`}
          className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
        >
          View <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default async function BestPeptideSourcesPage() {
  const { brands, pharmacies, clinics } = await getTopSources();

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find a legitimate peptide source?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Look for sources that provide third-party lab testing (COA), have clear GMP certification, offer transparent ingredient disclosure, and have verifiable reviews. The Peptide Alliance verifies all listed sources against these criteria.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes a peptide source "verified"?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Peptide Alliance Verified badge is awarded to businesses that have been reviewed by our team for legitimate operation, provided proof of certifications (GMP, ISO, etc.), and submitted to our verification process. Verified sources appear on our Trust Score leaderboard.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are compounding pharmacies better than research peptide suppliers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on the intended use. Compounding pharmacies operate under pharmacy regulations and require a prescription, making them appropriate for clinical use. Research peptide suppliers offer peptides for research purposes without a prescription. Both can be high quality — the key is third-party testing and transparency.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a Trust Score?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Peptide Alliance Trust Score is a proprietary 0–100 rating calculated from: verified certifications (+20), lab results on file (+15), claimed ownership (+10), positive reviews (+15), complete business profile (+10), subscription tier (+20), product listings (+5), and account age (+5).',
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-4">
            Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">
            Best Peptide Sources 2025
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
            Every source on this page has been independently verified by The Peptide Alliance team. Ranked by Trust Score — a composite of certifications, lab results, reviews, and transparency.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: ShieldCheck, label: 'Independently Verified' },
              { icon: FlaskConical, label: 'Lab Results on File' },
              { icon: Award, label: 'Trust Score Ranked' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-white/80">
                <Icon className="w-4 h-4 text-accent" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* How we rank */}
        <section className="bg-card rounded-2xl border border-muted/10 p-6">
          <h2 className="font-heading font-bold text-lg text-text mb-4">How We Rank Sources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { score: '+20', label: 'Verified Certifications (GMP, ISO, CGMP)' },
              { score: '+20', label: 'Subscription Tier (Industry Leader = maximum trust)' },
              { score: '+15', label: 'Lab Results on File (COA, purity, identity testing)' },
              { score: '+15', label: 'Customer Reviews (4+ star average)' },
              { score: '+10', label: 'Claimed & Verified Business Ownership' },
              { score: '+10', label: 'Complete Business Profile' },
              { score: '+5', label: 'Product Catalog Listed' },
              { score: '+5', label: 'Account Age (6+ months)' },
            ].map(({ score, label }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded mt-0.5">{score}</span>
                <span className="text-sm text-text/80">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Peptide Brands */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-text mb-2">Best Peptide Brands & Research Suppliers</h2>
          <p className="text-muted text-sm mb-6">Verified research peptide brands and suppliers in the US and Canada, ranked by Trust Score.</p>
          {brands.length > 0 ? (
            <div className="flex flex-col gap-3">
              {brands.map((biz, i) => <SourceCard key={biz.id} biz={biz} rank={i + 1} />)}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-muted/10 p-8 text-center">
              <p className="text-muted">Verified peptide brands will appear here as they join the directory.</p>
              <Link href="/claim" className="inline-block mt-4 bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm">
                List Your Brand
              </Link>
            </div>
          )}
        </section>

        {/* Compounding Pharmacies */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-text mb-2">Best Compounding Pharmacies for Peptides</h2>
          <p className="text-muted text-sm mb-6">Licensed compounding pharmacies verified to produce semaglutide, tirzepatide, BPC-157, and other therapeutic peptides.</p>
          {pharmacies.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pharmacies.map((biz, i) => <SourceCard key={biz.id} biz={biz} rank={i + 1} />)}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-muted/10 p-8 text-center">
              <p className="text-muted">Verified compounding pharmacies will appear here as they join the directory.</p>
              <Link href="/claim" className="inline-block mt-4 bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm">
                List Your Pharmacy
              </Link>
            </div>
          )}
        </section>

        {/* Clinics */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-text mb-2">Best Peptide Therapy Clinics</h2>
          <p className="text-muted text-sm mb-6">Verified clinics offering peptide therapy — from GLP-1 weight loss to growth hormone optimization and anti-aging protocols.</p>
          {clinics.length > 0 ? (
            <div className="flex flex-col gap-3">
              {clinics.map((biz, i) => <SourceCard key={biz.id} biz={biz} rank={i + 1} />)}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-muted/10 p-8 text-center">
              <p className="text-muted">Verified peptide therapy clinics will appear here as they join the directory.</p>
              <Link href="/claim" className="inline-block mt-4 bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm">
                List Your Clinic
              </Link>
            </div>
          )}
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-text mb-6">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: 'How do I find a legitimate peptide source?',
                a: 'Look for sources that provide third-party lab testing (COA), have clear GMP certification, offer transparent ingredient disclosure, and have verifiable reviews. Every source on this page has been verified by The Peptide Alliance team.',
              },
              {
                q: 'What makes a peptide source "verified"?',
                a: 'The Peptide Alliance Verified badge is awarded to businesses reviewed by our team for legitimate operation, proof of certifications (GMP, ISO, etc.), and completion of our verification process.',
              },
              {
                q: 'Are compounding pharmacies better than research peptide suppliers?',
                a: 'It depends on the intended use. Compounding pharmacies operate under pharmacy regulations and require a prescription — appropriate for clinical use. Research peptide suppliers offer peptides for research purposes. Both can be high quality — the key is third-party testing and transparency.',
              },
              {
                q: 'What is a Trust Score?',
                a: 'The Trust Score is a proprietary 0–100 rating calculated from certifications, lab results, ownership verification, reviews, profile completeness, subscription tier, product listings, and account age.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-card rounded-xl border border-muted/10 p-5">
                <p className="font-semibold text-text mb-2">{q}</p>
                <p className="text-muted text-sm">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Get listed CTA */}
        <section className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
          <h2 className="font-heading font-bold text-2xl mb-2">Verified peptide business?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Get listed and start building your Trust Score. Verified businesses appear on every relevant peptide page and in this ranking.</p>
          <Link
            href="/claim"
            className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Get Listed Free
          </Link>
        </section>
      </div>
    </main>
  );
}
