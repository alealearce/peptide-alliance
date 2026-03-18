'use client';
import Link from 'next/link';
import { BadgeCheck, Sparkles, Star, Zap } from 'lucide-react';

interface Props {
  tier: string;
  businessId: string;
}

export function TieredUpgradeBanners({ tier, businessId }: Props) {
  const href = `/upgrade?businessId=${businessId}`;

  if (tier === 'free') {
    return (
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-4 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-5 h-5 flex-shrink-0 text-accent" />
          <div>
            <p className="font-semibold text-sm">Get your Verified Source badge</p>
            <p className="text-white/80 text-xs">Unlock clickable links, lead management, and reviews — starting at $49/mo.</p>
          </div>
        </div>
        <Link href={href} className="flex-shrink-0 bg-white text-primary text-sm font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap">
          Get Verified
        </Link>
      </div>
    );
  }

  if (tier === 'verified') {
    return (
      <div className="rounded-xl bg-gradient-to-r from-sky/80 to-primary/70 p-4 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 text-white" />
          <div>
            <p className="font-semibold text-sm">Upgrade to Featured — unlock your business blog</p>
            <p className="text-white/80 text-xs">Get clickable product links, priority placement, and a monthly auto-generated blog post for SEO.</p>
          </div>
        </div>
        <Link href={href} className="flex-shrink-0 bg-white text-primary text-sm font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap">
          Upgrade — $99/mo
        </Link>
      </div>
    );
  }

  if (tier === 'featured') {
    return (
      <div className="rounded-xl p-4 text-white flex items-center justify-between gap-4" style={{ background: 'linear-gradient(to right, #C9A05D, #a07840)' }}>
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 flex-shrink-0 text-white" />
          <div>
            <p className="font-semibold text-sm">Become an Industry Leader</p>
            <p className="text-white/80 text-xs">Homepage spotlight, top search position, phone number displayed, and a monthly backlink article on the main blog.</p>
          </div>
        </div>
        <Link href={href} className="flex-shrink-0 bg-white text-amber-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap">
          Upgrade — $499/mo
        </Link>
      </div>
    );
  }

  if (tier === 'industry_leader') {
    return (
      <div className="rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 p-4 flex items-center gap-3">
        <Zap className="w-5 h-5 flex-shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold text-sm text-amber-800">You&apos;re an Industry Leader</p>
          <p className="text-amber-700/80 text-xs">You have full access to all features. Thank you for supporting Peptide Alliance.</p>
        </div>
      </div>
    );
  }

  return null;
}
