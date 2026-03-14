'use client';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Business } from '@/lib/supabase/types';
import { MapPin, ExternalLink } from 'lucide-react';
import { CATEGORIES } from '@/lib/config/categories';
import { cityToSlug } from '@/lib/utils/slug';

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const description = business.description_en;
  const category = CATEGORIES.find(c => c.id === business.category);
  const citySlug = business.city_slug || cityToSlug(business.city);

  const isIndustryLeader = business.subscription_tier === 'industry_leader';
  const isFeatured = business.subscription_tier === 'featured' || isIndustryLeader;
  const isVerified = business.subscription_tier === 'verified' || isFeatured;
  const showVerified = business.is_verified || isVerified;

  return (
    <Link href={`/${citySlug}/${business.slug}`}>
      <div
        className={[
          'rounded-2xl overflow-hidden cursor-pointer h-full transition-all duration-200',
          isIndustryLeader
            ? 'border-2 border-gold shadow-md shadow-amber-100 hover:shadow-lg hover:shadow-amber-200'
            : isFeatured
            ? 'border-2 border-accent shadow-md hover:shadow-lg'
            : 'border border-muted/10 shadow-sm hover:shadow-md',
          'bg-white',
        ].join(' ')}
      >
        {isIndustryLeader && (
          <div className="h-1 bg-gradient-to-r from-gold via-amber-300 to-gold" />
        )}
        {isFeatured && !isIndustryLeader && (
          <div className="h-1 bg-gradient-to-r from-accent via-emerald-300 to-accent" />
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading font-bold text-text text-lg leading-tight line-clamp-2">
              {business.name}
            </h3>
            {showVerified && (
              <Badge variant="verified_source">✓ Verified</Badge>
            )}
          </div>

          {business.trust_score > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 bg-muted/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${business.trust_score}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-muted">{business.trust_score}/100</span>
            </div>
          )}

          {description && (
            <p className="text-muted text-sm line-clamp-2 mb-3 font-body">
              {description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-muted">
            {business.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {business.city}{business.province ? `, ${business.province}` : ''}{business.country ? ` (${business.country})` : ''}
              </span>
            )}
            {business.service_area === 'online_only' && (
              <span className="text-xs text-sky">Online Only</span>
            )}
            {business.service_area === 'national' && (
              <span className="text-xs text-sky">National</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {category && (
              <Badge variant="category">
                {category.icon} {category.label.en}
              </Badge>
            )}
            {business.google_maps_url && (
              <a
                href={business.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <MapPin className="w-3 h-3" />
                Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {isIndustryLeader && (
              <Badge variant="industry_leader" className="ml-auto">
                🏆 Industry Leader
              </Badge>
            )}
            {isFeatured && !isIndustryLeader && (
              <Badge variant="featured" className="ml-auto">
                ⭐ Featured
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
