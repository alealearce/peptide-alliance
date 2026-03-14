import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { lp } from '@/lib/utils/locale';
import AdminClient from './AdminClient';

export const metadata = {
  title: 'Admin Dashboard',
  robots: { index: false },
};

export default async function AdminPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(lp(locale, '/login'));

  // Admin role check
  const adminSupabase = createAdminClient();
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect(lp(locale, '/'));
  }

  // ── Fetch all data in parallel ────────────────────────────────────────────
  const [
    { data: blogDrafts },
    { data: pendingBizs },
    { data: allClaimedBizs },
    { data: subscribers },
    { data: chatSessions },
  ] = await Promise.all([
    adminSupabase
      .from('blog_posts')
      .select('id, title_en, title_es, category, city, created_at')
      .eq('is_published', false)
      .order('created_at', { ascending: false }),

    // Pending (not yet approved) — need owner info
    adminSupabase
      .from('businesses')
      .select('id, name, city, province, category, phone, website, owner_title, claimed_by, created_at')
      .eq('is_active', false)
      .not('claimed_by', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50),

    // All claimed businesses (active + pending) for the full directory view
    adminSupabase
      .from('businesses')
      .select('id, name, city, province, category, phone, subscription_tier, subscription_ends_at, is_active, is_verified, owner_title, claimed_by, created_at')
      .not('claimed_by', 'is', null)
      .order('created_at', { ascending: false })
      .limit(200),

    adminSupabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('subscribed', true),

    adminSupabase
      .from('chat_sessions')
      .select('id, session_id, messages, escalated, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(100),
  ]);

  // ── Enrich businesses with owner profiles ─────────────────────────────────
  // Collect all unique owner UUIDs across both lists
  const allOwnerIds = Array.from(new Set([
    ...(pendingBizs ?? []).map((b) => b.claimed_by),
    ...(allClaimedBizs ?? []).map((b) => b.claimed_by),
  ].filter(Boolean))) as string[];

  const { data: ownerProfiles } = allOwnerIds.length
    ? await adminSupabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', allOwnerIds)
    : { data: [] };

  const profileMap = Object.fromEntries(
    (ownerProfiles ?? []).map((p) => [p.id, p])
  );

  // Merge owner info into pending list
  const pendingWithOwner = (pendingBizs ?? []).map((b) => ({
    ...b,
    owner_name: profileMap[b.claimed_by]?.full_name ?? null,
    owner_email: profileMap[b.claimed_by]?.email ?? null,
  }));

  // Merge owner info into full claimed list
  const allClaimedWithOwner = (allClaimedBizs ?? []).map((b) => ({
    ...b,
    owner_name: profileMap[b.claimed_by]?.full_name ?? null,
    owner_email: profileMap[b.claimed_by]?.email ?? null,
  }));

  return (
    <AdminClient
      blogDrafts={(blogDrafts ?? []) as Parameters<typeof AdminClient>[0]['blogDrafts']}
      pendingBizs={pendingWithOwner as Parameters<typeof AdminClient>[0]['pendingBizs']}
      allClaimedBizs={allClaimedWithOwner as Parameters<typeof AdminClient>[0]['allClaimedBizs']}
      subscriberCount={subscribers?.length ?? 0}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chatSessions={(chatSessions ?? []) as any}
    />
  );
}
