import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { recalculateTrustScore } from '@/lib/utils/recalculate-trust-score';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabaseUser = await createClient();
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();

  const { data: result } = await supabase
    .from('lab_results')
    .select('id, business_id, businesses!inner(claimed_by)')
    .eq('id', params.id)
    .single();

  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const biz = (result as unknown as { businesses: { claimed_by: string | null } }).businesses;
  if (biz.claimed_by !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await supabase.from('lab_results').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recalculate trust score — removing a lab result may reduce points
  const businessId = (result as unknown as { business_id: string }).business_id;
  void recalculateTrustScore(businessId).catch((err) => console.error('[lab-results/DELETE] trust score error:', err));

  return NextResponse.json({ ok: true });
}
