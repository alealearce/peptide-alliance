'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { US_STATES, CA_PROVINCES } from '@/lib/config/geography';

const REGIONS = [
  ...Object.entries(US_STATES).map(([code, name]) => ({ code, name, country: 'US' })),
  ...Object.entries(CA_PROVINCES).map(([code, name]) => ({ code, name, country: 'CA' })),
];

export function NewsletterSignup() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city: region || undefined, preferred_language: 'en' }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-center">
        <p className="font-semibold text-text">{t('success')}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-muted/10 p-6">
      <h3 className="font-heading font-bold text-lg text-text mb-1">{t('title')}</h3>
      <p className="text-muted text-sm mb-5">{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text placeholder-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">{t('cityPlaceholder')}</option>
          <optgroup label="United States">
            {REGIONS.filter(r => r.country === 'US').map((r) => (
              <option key={r.code} value={r.name}>{r.name}</option>
            ))}
          </optgroup>
          <optgroup label="Canada">
            {REGIONS.filter(r => r.country === 'CA').map((r) => (
              <option key={r.code} value={r.name}>{r.name}</option>
            ))}
          </optgroup>
        </select>

        {status === 'error' && (
          <p className="text-red-500 text-sm">{t('error')}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : t('subscribe')}
        </button>
      </form>
    </div>
  );
}
