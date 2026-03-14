'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';
import { lp } from '@/lib/utils/locale';

export function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const t = useTranslations('search');
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    // Always navigate — empty query clears the ?q= param from the URL
    router.push(trimmed
      ? lp(locale, `/search?q=${encodeURIComponent(trimmed)}`)
      : lp(locale, '/search')
    );
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          className="pl-10"
        />
      </div>
      <Button type="submit" size="md">
        {t('filters')}
      </Button>
    </form>
  );
}
