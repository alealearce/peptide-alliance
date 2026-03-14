import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendListingLiveEmail } from '@/lib/email/resend';

const VALID_ACTIONS = ['publish_blog', 'delete_blog', 'approve_business', 'reject_business', 'delete_business', 'set_tier'] as const;
type AdminAction = typeof VALID_ACTIONS[number];

const VALID_TIERS = ['free', 'premium', 'featured'] as const;

export async function POST(req: NextRequest) {
  try {
    // Verify the requesting user is an admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, id, tier, expires_at } = await req.json();

    if (!VALID_ACTIONS.includes(action as AdminAction) || !id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    switch (action as AdminAction) {
      case 'publish_blog':
        await adminSupabase
          .from('blog_posts')
          .update({ is_published: true, published_at: new Date().toISOString() })
          .eq('id', id);
        break;

      case 'delete_blog':
        await adminSupabase.from('blog_posts').delete().eq('id', id);
        break;

      case 'approve_business': {
        const { data: biz, error: updateError } = await adminSupabase
          .from('businesses')
          .update({ is_active: true, is_verified: true })
          .eq('id', id)
          .select('name, slug, claimed_by')
          .single();

        if (updateError) {
          console.error('[admin/approve] update error:', updateError);
          return NextResponse.json({ error: `Approval failed: ${updateError.message}` }, { status: 500 });
        }

        // Look up owner email + name from profiles using claimed_by
        if (biz?.claimed_by && biz?.slug) {
          const { data: profile } = await adminSupabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', biz.claimed_by)
            .single();

          if (profile?.email) {
            sendListingLiveEmail({
              ownerEmail: profile.email,
              ownerName: profile.full_name ?? null,
              businessName: biz.name,
              slug: biz.slug,
            }).catch((err) => console.error('[admin/approve] activation email error:', err));
          }
        }
        break;
      }

      case 'reject_business':
        await adminSupabase.from('businesses').delete().eq('id', id);
        break;

      case 'delete_business':
        await adminSupabase.from('businesses').delete().eq('id', id);
        break;

      case 'set_tier': {
        if (!VALID_TIERS.includes(tier)) {
          return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
        }
        // expires_at should be a date string like "2025-12-31" or null
        const expiresAt = expires_at
          ? new Date(expires_at).toISOString()
          : null;
        await adminSupabase
          .from('businesses')
          .update({
            subscription_tier: tier,
            subscription_ends_at: expiresAt,
            is_premium: tier !== 'free',
            is_verified: tier !== 'free',
          })
          .eq('id', id);
        break;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/action] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
