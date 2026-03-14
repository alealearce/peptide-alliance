import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Story — The Peptide Alliance',
    description:
      'How The Peptide Alliance was founded to bring transparency, trust, and visibility to the peptide industry across the US and Canada.',
    alternates: {
      canonical: 'https://peptidealliance.io/about',
    },
  };
}

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* ── Hero ── */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-text mb-4">Our Story</h1>
        <p className="text-muted text-lg">The story behind The Peptide Alliance</p>
      </div>

      {/* ── Section 1: The Problem ── */}
      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">The Problem We Saw</h2>
        <div className="space-y-5">
          <p className="text-text/80 leading-relaxed text-lg">
            The peptide industry is booming, but trust is in short supply. Consumers searching for peptide brands, clinics, and compounding pharmacies face a fragmented landscape with no centralized, reliable source of information.
          </p>
          <p className="text-text/80 leading-relaxed text-lg">
            Legitimate businesses struggle to differentiate themselves from bad actors. Researchers have difficulty finding verified suppliers. And the people who could benefit most from peptide therapies often don&apos;t know where to start.
          </p>
        </div>
      </section>

      {/* ── Section 2: How It Started ── */}
      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">How The Peptide Alliance Was Born</h2>
        <div className="space-y-5">
          <p className="text-text/80 leading-relaxed text-lg">
            We started The Peptide Alliance because we believed the industry deserved better infrastructure. A place where verified peptide brands, licensed clinics, accredited compounding pharmacies, research labs, wholesale suppliers, and manufacturers could all be discovered in one trusted directory.
          </p>
          <p className="text-text/80 leading-relaxed text-lg">
            We saw how search engines and AI tools like ChatGPT are reshaping how people find businesses. Companies with strong, consistent online presence get found first. Those without it get left behind, regardless of quality.
          </p>
          <p className="text-text/80 leading-relaxed text-lg">
            So we built a platform that helps legitimate peptide businesses establish that presence, earn trust through verification, and get discovered by the people who need them most.
          </p>
        </div>
      </section>

      {/* ── Section 3: The Mission ── */}
      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">The Mission</h2>
        <div className="space-y-5">
          <p className="text-text/80 leading-relaxed text-lg">
            The Peptide Alliance is more than a directory. It is an industry resource designed to bring transparency, accountability, and visibility to every corner of the peptide supply chain.
          </p>
          <p className="text-text/80 leading-relaxed text-lg">
            We verify businesses so consumers can shop with confidence. We give clinics and pharmacies the tools to stand out. And we provide researchers and wholesale buyers a single destination to find the suppliers they need across the United States and Canada.
          </p>
          <p className="text-text/80 leading-relaxed text-lg">
            Our trust score system, verification badges, and detailed business profiles are designed to raise the bar for the entire industry. When the best businesses are easy to find, everyone benefits.
          </p>
        </div>
      </section>

      {/* ── Section 4: What's Coming ── */}
      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">What&apos;s Next</h2>
        <div className="space-y-5">
          <p className="text-text/80 leading-relaxed text-lg">
            We are expanding our coverage across every state and province, building deeper verification tools, and forging partnerships with industry associations and regulatory bodies. Our goal is to make The Peptide Alliance the definitive resource for the peptide industry in North America.
          </p>
        </div>
      </section>

      {/* Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://peptidealliance.io/#organization',
            name: 'The Peptide Alliance',
            url: 'https://peptidealliance.io',
            description:
              'The trusted directory for peptide brands, clinics, compounding pharmacies, research labs, wholesale suppliers, and manufacturers in the US and Canada.',
            areaServed: [
              { '@type': 'Country', name: 'United States' },
              { '@type': 'Country', name: 'Canada' },
            ],
            inLanguage: 'en',
          }),
        }}
      />

      {/* ── CTA ── */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-8 text-center max-w-3xl mx-auto">
        <p className="text-xl font-heading font-bold text-text mb-2">
          Are you in the peptide industry?
        </p>
        <p className="text-muted text-sm mb-6">
          Join verified businesses already listed on The Peptide Alliance.
        </p>
        <Link
          href="/claim"
          className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          List your business for free
        </Link>
      </div>
    </main>
  );
}
