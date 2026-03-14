'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { BadgeCheck } from 'lucide-react';

interface UpgradeBannerProps {
  businessId?: string;
}

export function UpgradeBanner({ businessId }: UpgradeBannerProps) {
  const locale = useLocale();

  const href = businessId
    ? `/${locale}/upgrade?businessId=${businessId}`
    : `/${locale}/upgrade`;

  return (
    <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-4 text-white flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <BadgeCheck className="w-5 h-5 flex-shrink-0 text-yellow-300" />
        <div>
          <p className="font-semibold text-sm">
            {locale === 'es' ? 'Obtén la insignia de negocio verificado' : 'Get your business verified'}
          </p>
          <p className="text-white/80 text-xs">
            {locale === 'es'
              ? 'Genera más confianza y aparece primero en los resultados.'
              : 'Build trust and appear at the top of search results.'}
          </p>
        </div>
      </div>
      <Link
        href={href}
        className="flex-shrink-0 bg-white text-primary text-sm font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap"
      >
        {locale === 'es' ? 'Verificar ahora' : 'Get Verified'}
      </Link>
    </div>
  );
}
