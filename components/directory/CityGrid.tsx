'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown } from 'lucide-react';
import { US_STATES, CA_PROVINCES } from '@/lib/config/geography';

/**
 * Browse by location — US states and Canadian provinces.
 * For Peptide Alliance, we show country → state/province groupings.
 * Individual city links will be added as we populate the directory.
 */

const regions = [
  {
    country: 'CA',
    countryName: 'Canada',
    states: Object.entries(CA_PROVINCES).map(([code, name]) => ({ code, name })),
  },
  {
    country: 'US',
    countryName: 'United States',
    states: Object.entries(US_STATES).map(([code, name]) => ({ code, name })),
  },
];

export function CityGrid() {
  const [openCountry, setOpenCountry] = useState<string | null>('CA');

  const toggleCountry = (code: string) =>
    setOpenCountry(prev => (prev === code ? null : code));

  return (
    <div className="divide-y divide-muted/10 border border-muted/10 rounded-2xl overflow-hidden">
      {regions.map((region) => (
        <div key={region.country}>
          <button
            onClick={() => toggleCountry(region.country)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-white hover:bg-muted/5 transition-colors text-left"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{region.country === 'US' ? '🇺🇸' : '🇨🇦'}</span>
              <span className="font-heading font-semibold text-sm text-text">{region.countryName}</span>
              <span className="text-xs text-muted">({region.states.length} regions)</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted transition-transform duration-200 ${openCountry === region.country ? 'rotate-180' : ''}`}
            />
          </button>

          {openCountry === region.country && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 py-3 bg-bg/50">
              {region.states.map((state) => (
                  <Link
                    key={state.code}
                    href={`/search?province=${state.code}&country=${region.country}`}
                    className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-primary shrink-0" />
                    <span className="font-heading text-sm text-text group-hover:text-primary truncate">
                      {state.name}
                    </span>
                  </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
