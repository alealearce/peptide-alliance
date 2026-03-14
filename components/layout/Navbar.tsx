'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { SITE } from '@/lib/config/site';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const navLinks = (
    <>
      <Link href="/" className="text-text hover:text-primary font-body transition-colors">{t('home')}</Link>
      <Link href="/search" className="text-text hover:text-primary font-body transition-colors">{t('search')}</Link>
      <Link href="/blog" className="text-text hover:text-primary font-body transition-colors">Blog</Link>
      <Link href="/claim" className="text-text hover:text-primary font-body transition-colors">{t('claim')}</Link>
      <Link href="/upgrade" className="text-text hover:text-primary font-body transition-colors">Pricing</Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-muted/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt={SITE.name} width={40} height={40} className="object-contain" />
            <span className="font-heading font-extrabold text-xl text-primary hidden sm:inline">{SITE.shortName}</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks}
          </div>

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

      {menuOpen && (
        <div className="md:hidden border-t border-muted/10 bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks}
          <div className="border-t border-muted/10 pt-4">
            {user ? (
              <Link href="/dashboard" className="block text-text hover:text-primary font-body transition-colors">
                My Account
              </Link>
            ) : (
              <Link href="/login" className="block text-text hover:text-primary font-body transition-colors">
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
