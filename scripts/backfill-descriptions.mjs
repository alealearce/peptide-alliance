#!/usr/bin/env node
// One-time script to generate AI descriptions for businesses that have none.
// Run from project root: node scripts/backfill-descriptions.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local, overriding any empty shell vars
const envContent = readFileSync(resolve('.env.local'), 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateDescription(name, city, category, subcategory) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Write two short business descriptions (2-3 sentences each) for "${name}", a ${subcategory} business in ${city}, Canada, listed under the "${category}" category on InfoSylvita (a Latin business directory).\n\nReturn ONLY valid JSON:\n{"en": "English description here", "es": "Spanish description here"}\n\nBe warm, professional, and community-focused. Do not make up specific details — keep it general enough to be accurate.`,
        }],
      }),
    });
    if (!res.ok) {
      console.error(`  API error ${res.status} for "${name}"`);
      return { en: null, es: null };
    }
    const data = await res.json();
    const raw = data.content?.[0]?.text ?? '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    console.error(`  Error for "${name}":`, e.message);
  }
  return { en: null, es: null };
}

const { data: businesses, error } = await sb
  .from('businesses')
  .select('id, name, city, category, subcategory')
  .is('description_en', null)
  .eq('source', 'google_places');

if (error) { console.error(error); process.exit(1); }

console.log(`Generating descriptions for ${businesses.length} businesses...\n`);

let done = 0;
let failed = 0;

for (const biz of businesses) {
  process.stdout.write(`  [${done + failed + 1}/${businesses.length}] ${biz.name} ... `);
  const { en, es } = await generateDescription(biz.name, biz.city, biz.category, biz.subcategory);
  if (en) {
    const { error: updateErr } = await sb
      .from('businesses')
      .update({ description_en: en, description_es: es })
      .eq('id', biz.id);
    if (updateErr) { console.log('DB error:', updateErr.message); failed++; }
    else { console.log('done'); done++; }
  } else {
    console.log('skipped (no description)');
    failed++;
  }
  await sleep(250);
}

console.log(`\n✅ Done: ${done} descriptions generated, ${failed} failed/skipped.`);
