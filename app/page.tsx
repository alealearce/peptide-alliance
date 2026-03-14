import { redirect } from 'next/navigation';

// next-intl middleware intercepts '/' and routes to /[locale]/page.tsx first.
// This is only a fallback in case middleware is bypassed.
export default function RootPage() {
  redirect('/en');
}
