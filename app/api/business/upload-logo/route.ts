import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { recalculateTrustScore } from '@/lib/utils/recalculate-trust-score';

export async function POST(req: NextRequest) {
  // Verify the user is authenticated
  const supabaseUser = await createClient();
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const businessId = formData.get('business_id') as string | null;

  if (!file || !businessId) {
    return NextResponse.json({ error: 'Missing file or business_id' }, { status: 400 });
  }

  // File size check — 5 MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Verify this user owns the business
  const { data: biz, error: bizError } = await supabase
    .from('businesses')
    .select('id, claimed_by')
    .eq('id', businessId)
    .single();

  if (bizError || !biz) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  if (biz.claimed_by !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Upload to storage via admin client (bypasses RLS)
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${businessId}/logo-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const { data: storageData, error: storageError } = await supabase.storage
    .from('business-images')
    .upload(path, arrayBuffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: true, // overwrite any existing logo
    });

  if (storageError) {
    console.error('[upload-logo] storage error:', storageError);
    return NextResponse.json({ error: 'Upload failed: ' + storageError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('business-images')
    .getPublicUrl(storageData.path);

  // Update the business logo_url directly on the businesses table
  const { error: updateError } = await supabase
    .from('businesses')
    .update({ logo_url: publicUrl })
    .eq('id', businessId);

  if (updateError) {
    console.error('[upload-logo] db update error:', updateError);
    return NextResponse.json({ error: 'Failed to save logo URL' }, { status: 500 });
  }

  // Recalculate trust score — uploading a logo fills the has_logo profile field
  void recalculateTrustScore(businessId).catch((err) => console.error('[upload-logo] trust score error:', err));

  return NextResponse.json({ url: publicUrl });
}
