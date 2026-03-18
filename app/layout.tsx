import type { Metadata } from 'next';
import { SITE } from '@/lib/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  verification: {
    google: 'b86b9530ac94f31a',
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
