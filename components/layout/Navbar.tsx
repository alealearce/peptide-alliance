'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { SITE } from '@/lib/config/site';
import { ChevronDown, FlaskConical } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const PEPTIDE_MENU = [
  { slug: 'performance-recovery', label: 'Performance & Recovery' },
  { slug: 'growth-hormone', label: 'Growth Hormone' },
  { slug: 'weight-loss-metabolic', label: 'Weight Loss & Metabolic' },
  { slug: 'immune-anti-inflammatory', label: 'Immune & Anti-Inflammatory' },
  { slug: 'sexual-health', label: 'Sexual Health' },
  { slug: 'cognitive-nootropic', label: 'Cognitive & Nootropic' },
  { slug: 'anti-aging-longevity', label: 'Anti-Aging & Longevity' },
  { slug: 'cosmetic', label: 'Cosmetic Peptides' },
  { slug: 'cardiovascular', label: 'Cardiovascular' },
];

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [peptideOpen, setPeptideOpen] = useState(false);
  const [mobilePeptideOpen, setMobilePeptideOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { setMenuOpen(false); setPeptideOpen(false); setMobilePeptideOpen(false); }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPeptideOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-muted/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt={SITE.name} width={40} height={40} className="object-contain" />
            <span className="font-heading font-extrabold text-xl text-primary hidden sm:inline">{SITE.shortName}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-text hover:text-primary font-body transition-colors">{t('home')}</Link>
            <Link href="/search" className="text-text hover:text-primary font-body transition-colors">{t('search')}</Link>

            {/* Peptide Database dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPeptideOpen((o) => !o)}
                onMouseEnter={() => setPeptideOpen(true)}
                className="flex items-center gap-1 text-text hover:text-primary font-body font-semibold transition-colors focus:outline-none"
                aria-haspopup="true"
                aria-expanded={peptideOpen}
              >
                Peptide Database
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${peptideOpen ? 'rotate-180' : ''}`} />
              </button>

              {peptideOpen && (
                <div
                  onMouseLeave={() => setPeptideOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-muted/10 py-3 z-50"
                >
                  {/* Header */}
                  <div className="px-4 pb-2 mb-1 border-b border-muted/10">
                    <Link
                      href="/peptides"
                      className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                      <FlaskConical className="w-4 h-4" />
                      View Full Peptide Database →
                    </Link>
                  </div>

                  {/* Categories */}
                  <div className="px-2">
                    {PEPTIDE_MENU.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/peptides#${cat.slug}`}
                        className="flex items-center px-3 py-2 rounded-lg text-sm text-text hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>

                  {/* Footer CTA */}
                  <div className="px-4 pt-2 mt-1 border-t border-muted/10">
                    <Link
                      href="/best-peptide-sources"
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
                    >
                      🏆 Best Peptide Sources →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-text hover:text-primary font-body transition-colors">Blog</Link>
            <Link href="/claim" className="text-text hover:text-primary font-body transition-colors">{t('claim')}</Link>
            <Link href="/upgrade" className="text-text hover:text-primary font-body transition-colors">Pricing</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" variant="secondary">My Account</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="secondary">{t('login')}</Button>
                </Link>
                <Link href="/claim" className="hidden sm:inline-flex">
                  <Button size="sm">Get Listed</Button>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-muted/10 transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-text transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block w-5 h-0.5 bg-text transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-text transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-muted/10 bg-white px-4 py-4 flex flex-col gap-1">
          <Link href="/" className="px-3 py-2 rounded-lg text-text hover:text-primary hover:bg-primary/5 font-body transition-colors">{t('home')}</Link>
          <Link href="/search" className="px-3 py-2 rounded-lg text-text hover:text-primary hover:bg-primary/5 font-body transition-colors">{t('search')}</Link>

          {/* Mobile Peptide Database accordion */}
          <button
            onClick={() => setMobilePeptideOpen((o) => !o)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-text hover:text-primary hover:bg-primary/5 font-body font-semibold transition-colors w-full"
          >
            <span>Peptide Database</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobilePeptideOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobilePeptideOpen && (
            <div className="ml-4 flex flex-col gap-1 border-l-2 border-primary/20 pl-3">
              <Link href="/peptides" className="py-1.5 text-sm font-bold text-primary hover:underline">
                View All Peptides →
              </Link>
              {PEPTIDE_MENU.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/peptides#${cat.slug}`}
                  className="py-1.5 text-sm text-text hover:text-primary transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
              <Link href="/best-peptide-sources" className="py-1.5 text-sm font-semibold text-muted hover:text-primary transition-colors">
                🏆 Best Peptide Sources
              </Link>
            </div>
          )}

          <Link href="/blog" className="px-3 py-2 rounded-lg text-text hover:text-primary hover:bg-primary/5 font-body transition-colors">Blog</Link>
          <Link href="/claim" className="px-3 py-2 rounded-lg text-text hover:text-primary hover:bg-primary/5 font-body transition-colors">{t('claim')}</Link>
          <Link href="/upgrade" className="px-3 py-2 rounded-lg text-text hover:text-primary hover:bg-primary/5 font-body transition-colors">Pricing</Link>

          <div className="border-t border-muted/10 pt-3 mt-2">
            {user ? (
              <Link href="/dashboard" className="px-3 py-2 rounded-lg block text-text hover:text-primary hover:bg-primary/5 font-body transition-colors">
                My Account
              </Link>
            ) : (
              <Link href="/login" className="px-3 py-2 rounded-lg block text-text hover:text-primary hover:bg-primary/5 font-body transition-colors">
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
