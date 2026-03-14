import Link from 'next/link';
import { lp } from '@/lib/utils/locale';

interface Props {
  locale: string;
  businessId: string;
  businessName?: string;
}

// Server component — renders a styled link to the claim flow
export function ClaimButton({ locale, businessId }: Props) {
  return (
    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 text-center">
      <p className="text-sm text-text/70 mb-3">
        Is this your business? Claim it to manage your profile and respond to messages.
      </p>
      <Link
        href={lp(locale, `/claim?biz=${businessId}`)}
        className="inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-accent/90 transition-colors text-sm"
      >
        🏷️ Claim This Listing
      </Link>
    </div>
  );
}
