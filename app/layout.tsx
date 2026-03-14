import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'InfoSylvita — Latin Business Directory Canada',
    template: '%s | InfoSylvita',
  },
  description:
    'Find trusted Latin-owned businesses across Canada. Restaurants, services, healthcare, and more — in English and Spanish.',
  metadataBase: new URL('https://infosylvita.com'),
  openGraph: {
    type: 'website',
    siteName: 'InfoSylvita',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'InfoSylvita' }],
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
