import { SearchBar } from '@/components/directory/SearchBar';
import { COPY } from '@/lib/config/site';

export async function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Molecular pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='3' fill='%2398EBCF'/%3E%3Ccircle cx='50' cy='30' r='2' fill='%2373C2FB'/%3E%3Ccircle cx='30' cy='50' r='2.5' fill='%2398EBCF'/%3E%3Cline x1='10' y1='10' x2='50' y2='30' stroke='%2398EBCF' stroke-width='0.5'/%3E%3Cline x1='50' y1='30' x2='30' y2='50' stroke='%2373C2FB' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-accent/20 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-accent rounded-full" />
            {COPY.hero.badge}
          </span>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight mb-6">
            {COPY.hero.headline.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10">
            {COPY.hero.subtext}
          </p>

          {/* Search Bar */}
          <div className="max-w-xl">
            <SearchBar />
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-8 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Verified Sources
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              US &amp; Canada
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Free to Browse
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
