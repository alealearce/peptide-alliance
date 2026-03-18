import Link from 'next/link';
import type { Metadata } from 'next';
import { PEPTIDES, PEPTIDE_CATEGORIES, getPeptidesByCategory, type PeptideCategory } from '@/lib/config/peptides';
import { SITE } from '@/lib/config/site';

// Map each peptide category to the most relevant business search link
const CATEGORY_SEARCH_LINKS: Partial<Record<PeptideCategory, { label: string; href: string }>> = {
  'performance-recovery':     { label: 'Find peptide brands & suppliers →', href: '/search?category=peptide_brands' },
  'growth-hormone':           { label: 'Browse clinics & compounding pharmacies →', href: '/clinics' },
  'weight-loss-metabolic':    { label: 'Find GLP-1 clinics & compounding pharmacies →', href: '/compounding-pharmacies' },
  'immune-anti-inflammatory': { label: 'Browse immune therapy clinics →', href: '/clinics' },
  'sexual-health':            { label: 'Find hormone therapy clinics →', href: '/clinics' },
  'cognitive-nootropic':      { label: 'Browse peptide brands & research labs →', href: '/research-labs' },
  'anti-aging-longevity':     { label: 'Find longevity clinics & peptide brands →', href: '/clinics' },
  'cosmetic':                 { label: 'Browse cosmetic peptide brands →', href: '/peptide-brands' },
  'cardiovascular':           { label: 'Find compounding pharmacies & research labs →', href: '/compounding-pharmacies' },
};

export const metadata: Metadata = {
  title: 'Peptide Database — Research, Uses & Verified Sources',
  description: 'Comprehensive database of therapeutic, research, and cosmetic peptides. Browse research summaries, use cases, dosing, and find verified suppliers for every major peptide.',
  alternates: { canonical: `${SITE.url}/peptides` },
  openGraph: {
    title: 'Peptide Database | The Peptide Alliance',
    description: 'The most comprehensive peptide reference database — research, use cases, dosing, and verified North American sources.',
    url: `${SITE.url}/peptides`,
    siteName: SITE.name,
    type: 'website',
  },
};

const legalBadge: Record<string, { label: string; color: string }> = {
  'research-chemical': { label: 'Research Chemical', color: 'bg-amber-100 text-amber-800' },
  'prescription': { label: 'Rx Only', color: 'bg-blue-100 text-blue-800' },
  'fda-approved': { label: 'FDA Approved', color: 'bg-green-100 text-green-800' },
  'otc': { label: 'OTC / Cosmetic', color: 'bg-gray-100 text-gray-700' },
};

const volumeBadge: Record<string, string> = {
  'very-high': 'ring-2 ring-primary/40',
  'high': 'ring-1 ring-primary/20',
  'medium': '',
  'low': 'opacity-90',
};

export default function PeptideDatabasePage() {
  const categories = Object.entries(PEPTIDE_CATEGORIES) as [PeptideCategory, typeof PEPTIDE_CATEGORIES[PeptideCategory]][];

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-4">
            {PEPTIDES.length} Peptides Indexed
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">
            Peptide Database
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Research summaries, use cases, dosing protocols, and verified North American sources — for every major therapeutic, performance, and cosmetic peptide.
          </p>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Peptide Database — The Peptide Alliance',
            description: 'Comprehensive database of therapeutic, research, and cosmetic peptides with verified North American suppliers.',
            url: `${SITE.url}/peptides`,
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          }),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {categories.map(([catKey, cat]) => {
          const peptides = getPeptidesByCategory(catKey);
          if (peptides.length === 0) return null;
          return (
            <section key={catKey} id={catKey}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <div>
                    <h2 className="text-xl font-heading font-bold text-text">{cat.label}</h2>
                    <p className="text-muted text-sm">{cat.description}</p>
                  </div>
                </div>
                {CATEGORY_SEARCH_LINKS[catKey] && (
                  <Link
                    href={CATEGORY_SEARCH_LINKS[catKey]!.href}
                    className="text-xs font-semibold text-primary hover:underline flex-shrink-0 mt-1"
                  >
                    {CATEGORY_SEARCH_LINKS[catKey]!.label}
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {peptides.map((peptide) => {
                  const badge = legalBadge[peptide.legalStatus];
                  return (
                    <Link
                      key={peptide.slug}
                      href={`/peptides/${peptide.slug}`}
                      className={`bg-card rounded-xl border border-muted/10 p-5 hover:shadow-md hover:border-primary/20 transition-all group ${volumeBadge[peptide.searchVolume]}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-heading font-bold text-text group-hover:text-primary transition-colors">
                          {peptide.name}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      {peptide.alsoKnownAs.length > 0 && (
                        <p className="text-xs text-muted mb-2 truncate">{peptide.alsoKnownAs[0]}</p>
                      )}
                      <p className="text-sm text-text/70 line-clamp-2">{peptide.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {peptide.useCases.slice(0, 2).map(uc => (
                          <span key={uc} className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full">
                            {uc}
                          </span>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="bg-card border-t border-muted/10 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-bold text-xl text-text mb-2">Sell peptides or offer peptide therapy?</h2>
          <p className="text-muted text-sm mb-6">Get listed in The Peptide Alliance directory and appear as a verified source on every relevant peptide page.</p>
          <Link
            href="/claim"
            className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Get Listed Free
          </Link>
        </div>
      </section>
    </main>
  );
}
