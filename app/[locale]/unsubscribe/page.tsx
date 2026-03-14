'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { lp } from '@/lib/utils/locale';

export default function UnsubscribePage() {
  const t = useTranslations('unsubscribe');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }

    fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => setStatus(r.ok ? 'done' : 'error'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-3xl border border-muted/10 shadow-sm p-10 text-center">
        <Image
          src="/images/mascots/brand-logo.png"
          alt="Sylvita"
          width={80}
          height={80}
          className="object-contain mx-auto mb-6"
        />

        {status === 'loading' && (
          <p className="text-muted">Processing...</p>
        )}

        {status === 'done' && (
          <>
            <h1 className="text-2xl font-heading font-extrabold text-text mb-3">
              {t('title')}
            </h1>
            <p className="text-muted mb-8">{t('subtitle')}</p>
            <Link
              href={lp(locale, '/')}
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              {t('back')}
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-heading font-extrabold text-text mb-3">
              Something went wrong
            </h1>
            <p className="text-muted mb-8">This link may be invalid or expired.</p>
            <Link
              href={lp(locale, '/')}
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              {t('back')}
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
