import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { recalculateTrustScore } from '@/lib/utils/recalculate-trust-score';

export const runtime = 'nodejs';

// GET /api/business/certifications?businessId=xxx
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');
  if (!businessId) return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certifications: data ?? [] });
}

// POST /api/business/certifications  (multipart: name, issuing_body, expires_at, file?)
export async function POST(req: NextRequest) {
  const supabaseUser = await createClient();
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const business_id = formData.get('business_id') as string | null;
  const name = formData.get('name') as string | null;
  const issuing_body = (formData.get('issuing_body') as string | null) || null;
  const expires_at = (formData.get('expires_at') as string | null) || null;
  const file = formData.get('file') as File | null;

  if (!business_id || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Verify ownership
  const { data: biz } = await supabase
    .from('businesses')
    .select('id, claimed_by')
    .eq('id', business_id)
    .single();

  if (!biz || biz.claimed_by !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let certificate_url: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10 MB.' }, { status: 400 });
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';
    const path = `${business_id}/certs/${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { data: storageData, error: storageError } = await supabase.storage
      .from('business-images')
      .upload(path, arrayBuffer, { contentType: file.type, cacheControl: '3600' });

    if (storageError) {
      return NextResponse.json({ error: 'Upload failed: ' + storageError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('business-images').getPublicUrl(storageData.path);
    certificate_url = publicUrl;
  }

  const { data, error } = await supabase
    .from('certifications')
    .insert({
      business_id,
      name,
      issuing_body,
      certificate_url,
      expires_at: expires_at || null,
      verified_by_admin: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recalculate trust score — adding a certification earns points
  void recalculateTrustScore(business_id).catch((err) => console.error('[certifications/POST] trust score error:', err));

  return NextResponse.json({ certification: data });
}
