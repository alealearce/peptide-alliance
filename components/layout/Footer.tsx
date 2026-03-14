import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { SITE } from '@/lib/config/site';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-heading font-bold text-xl text-accent">{SITE.name}</p>
            <p className="text-white/60 text-sm mt-1">{t('tagline')}</p>
          </div>
          <Link
            href="/suggest"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
          >
            {t('suggest')}
          </Link>
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
