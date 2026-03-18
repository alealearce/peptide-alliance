import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { recalculateTrustScore } from '@/lib/utils/recalculate-trust-score';

export const runtime = 'nodejs';

// GET /api/business/lab-results?businessId=xxx
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');
  if (!businessId) return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lab_results')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lab_results: data ?? [] });
}

// POST /api/business/lab-results  (multipart: product_name, test_type, testing_lab, test_date, description?, file?)
export async function POST(req: NextRequest) {
  const supabaseUser = await createClient();
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const business_id = formData.get('business_id') as string | null;
  const product_name = (formData.get('product_name') as string | null) || null;
  const test_type = formData.get('test_type') as string | null;
  const testing_lab = (formData.get('testing_lab') as string | null) || null;
  const test_date = (formData.get('test_date') as string | null) || null;
  const description = (formData.get('description') as string | null) || null;
  const file = formData.get('file') as File | null;

  if (!business_id || !test_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!file && !description) {
    return NextResponse.json({ error: 'Provide a file or a description' }, { status: 400 });
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

  let result_url: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10 MB.' }, { status: 400 });
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';
    const path = `${business_id}/lab-results/${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { data: storageData, error: storageError } = await supabase.storage
      .from('business-images')
      .upload(path, arrayBuffer, { contentType: file.type, cacheControl: '3600' });

    if (storageError) {
      return NextResponse.json({ error: 'Upload failed: ' + storageError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('business-images').getPublicUrl(storageData.path);
    result_url = publicUrl;
  }

  const { data, error } = await supabase
    .from('lab_results')
    .insert({
      business_id,
      product_name,
      test_type,
      testing_lab,
      test_date: test_date || null,
      description,
      result_url,
      verified_by_admin: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recalculate trust score — adding a lab result earns points
  void recalculateTrustScore(business_id).catch((err) => console.error('[lab-results/POST] trust score error:', err));

  return NextResponse.json({ lab_result: data });
}
