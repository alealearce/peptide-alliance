import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { lp } from '@/lib/utils/locale';
import NewsletterClient from './NewsletterClient';

export const metadata = {
  title: 'Newsletter Editor — Admin',
  robots: { index: false },
};

export default async function AdminNewsletterPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { sent?: string; error?: string };
}) {
  // ── Auth: must be logged-in admin ──────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(lp(locale, '/login'));

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect(lp(locale, '/'));

  // ── Load latest pending draft + subscriber count ───────────────────────────
  const [{ data: draft }, { count: subscriberCount }] = await Promise.all([
    admin
      .from('newsletter_drafts')
      .select('id, subject_en, body_en, subject_es, body_es, approval_token, status, subscriber_count, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    admin
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true })
      .eq('subscribed', true),
  ]);

  return (
    <NewsletterClient
      draft={draft ?? null}
      subscriberCount={subscriberCount ?? 0}
      sentCount={searchParams?.sent != null ? Number(searchParams.sent) : null}
      errorCode={searchParams?.error ?? null}
    />
  );
}
