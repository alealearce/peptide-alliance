import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { recalculateTrustScore } from '@/lib/utils/recalculate-trust-score';

// GET /api/business/products?businessId=xxx
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');
  if (!businessId) return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

// POST /api/business/products
export async function POST(req: NextRequest) {
  const supabaseUser = await createClient();
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { business_id, name, product_type, description, sku, price, quantity_duration, product_url } = body;

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

  const { data, error } = await supabase
    .from('products')
    .insert({
      business_id,
      name,
      product_type: product_type || 'other',
      description: description || null,
      sku: sku || null,
      price: price ? Number(price) : null,
      quantity_duration: quantity_duration || null,
      product_url: product_url || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recalculate trust score — first product earns +5 points
  void recalculateTrustScore(business_id).catch((err) => console.error('[products/POST] trust score error:', err));

  return NextResponse.json({ product: data });
}
