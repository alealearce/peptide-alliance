#!/usr/bin/env node
// Recalculates trust_score for every business and writes it back to the DB.
// Run from project root: node scripts/sync-trust-scores.mjs
// Add --dry-run to preview without writing.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local ────────────────────────────────────────────────────────────
const envContent = readFileSync(resolve('.env.local'), 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
  if (!process.env[key]) process.env[key] = val;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── Trust score calculation (mirrors lib/utils/trust-score.ts) ───────────────
function calculateTrustScore(data) {
  let total = 0;

  // Verified certifications: +20
  const certPoints = data.verified_cert_count > 0 ? 20
    : data.certification_count > 0 ? 5 : 0;
  total += certPoints;

  // Lab results: +15
  const labPoints = data.verified_lab_count ? 15
    : data.lab_result_count > 0 ? 5 : 0;
  total += labPoints;

  // Claimed/owned profile: +10
  total += data.claimed_by ? 10 : 0;

  // Reviews avg 4+: +15
  const reviewPoints = data.review_count > 0 && (data.rating ?? 0) >= 4 ? 15
    : data.review_count > 0 ? 5 : 0;
  total += reviewPoints;

  // Complete profile: +10
  const { has_phone, has_website, has_description, has_logo, has_address } = data.trust_score_fields;
  const filledFields = [has_phone, has_website, has_description, has_logo, has_address].filter(Boolean).length;
  const profilePoints = filledFields >= 5 ? 10 : filledFields >= 3 ? 5 : 0;
  total += profilePoints;

  // Subscription tier bonus: +20
  const tierBonus = data.subscription_tier === 'industry_leader' ? 20
    : data.subscription_tier === 'featured' ? 15
    : data.subscription_tier === 'verified' ? 10 : 0;
  total += tierBonus;

  // Products listed: +5
  total += data.product_count > 0 ? 5 : 0;

  // Account age >6mo: +5
  const ageDays = (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24);
  total += ageDays >= 180 ? 5 : 0;

  return Math.min(100, total);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no writes' : '✏️  LIVE RUN — will update DB');

  // Fetch all businesses
  const { data: businesses, error: bizErr } = await supabase
    .from('businesses')
    .select('id, name, is_verified, subscription_tier, claimed_by, rating, review_count, phone, website, description_en, long_description_en, logo_url, address, created_at, trust_score');

  if (bizErr) {
    console.error('Failed to fetch businesses:', bizErr.message);
    process.exit(1);
  }

  console.log(`Found ${businesses.length} businesses\n`);

  let updated = 0;
  let unchanged = 0;
  let errors = 0;

  for (const biz of businesses) {
    // Fetch related data in parallel
    const [productsRes, certsRes, labsRes] = await Promise.all([
      supabase.from('products').select('id').eq('business_id', biz.id).eq('is_active', true),
      supabase.from('certifications').select('id, verified_by_admin').eq('business_id', biz.id),
      supabase.from('lab_results').select('id, verified_by_admin').eq('business_id', biz.id),
    ]);

    const products = productsRes.data ?? [];
    const certs = certsRes.data ?? [];
    const labs = labsRes.data ?? [];

    const newScore = calculateTrustScore({
      is_verified: biz.is_verified,
      subscription_tier: biz.subscription_tier,
      claimed_by: biz.claimed_by,
      rating: biz.rating,
      review_count: biz.review_count,
      trust_score_fields: {
        has_phone: !!biz.phone,
        has_website: !!biz.website,
        has_description: !!(biz.description_en || biz.long_description_en),
        has_logo: !!biz.logo_url,
        has_address: !!biz.address,
      },
      product_count: products.length,
      certification_count: certs.length,
      verified_cert_count: certs.filter((c) => c.verified_by_admin).length,
      lab_result_count: labs.length,
      verified_lab_count: labs.some((l) => l.verified_by_admin),
      created_at: biz.created_at,
    });

    const oldScore = biz.trust_score ?? 0;
    const changed = newScore !== oldScore;
    const arrow = changed ? `${oldScore} → ${newScore}` : `${oldScore} (unchanged)`;
    console.log(`  ${biz.name.padEnd(40)} ${arrow}`);

    if (!changed) {
      unchanged++;
      continue;
    }

    if (!DRY_RUN) {
      const { error: updateErr } = await supabase
        .from('businesses')
        .update({ trust_score: newScore })
        .eq('id', biz.id);

      if (updateErr) {
        console.error(`  ✗ Failed to update ${biz.name}:`, updateErr.message);
        errors++;
        continue;
      }
    }

    updated++;
  }

  console.log(`\n✅ Done — ${updated} updated, ${unchanged} unchanged, ${errors} errors`);
  if (DRY_RUN) console.log('   (dry run — no changes written)');
}

main();
