import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/config/categories';

// One distinct card background color per category (same order as CATEGORIES)
const CARD_COLORS = [
  '#0A1F44', // Peptide Brands — Navy
  '#0E7D6A', // Clinics — Teal
  '#6B3FA0', // Compounding Pharmacies — Purple
  '#C9A05D', // Research Labs — Gold
  '#C45C2A', // Wholesale Suppliers — Burnt Orange
  '#1A6B8A', // Manufacturers — Steel Blue
];

export function CategoryGrid({ city }: { city?: string } = {}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {CATEGORIES.map((category, i) => (
        <Link
          key={category.id}
          href={`/${category.slug.en}${city ? `?city=${encodeURIComponent(city)}` : ''}`}
          className="group relative rounded-2xl overflow-hidden border border-muted/10 hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: CARD_COLORS[i] }}
        >
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm p-2">
              <Image
                src="/images/logo.png"
                alt={category.label.en}
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-white text-base">
                {category.label.en}
              </p>
              <p className="text-white/70 text-xs mt-0.5">
                {category.subcategories.length} subcategories
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
