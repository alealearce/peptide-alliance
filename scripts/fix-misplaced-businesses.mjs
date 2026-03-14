/**
 * fix-misplaced-businesses.mjs
 *
 * Validates every active business in Supabase by comparing the province/city
 * encoded in the Google Places address against the indexed city/province fields.
 * Auto-corrects mismatches: updates city, city_slug, province, and slug.
 *
 * Usage:
 *   npm run fix-misplaced             # dry-run (default — no DB writes)
 *   npm run fix-misplaced -- --apply  # actually fix the records
 */

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = !process.argv.includes('--apply');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── City / Province reference data ──────────────────────────────────────────

const CA_PROVINCES = ['BC','ON','QC','AB','MB','SK','NS','NB','NL','PE','NT','YT','NU'];

// All known city names → city_slug mapping
const CITY_SLUG_MAP = {
  'toronto':       'toronto',
  'montreal':      'montreal',
  'vancouver':     'vancouver',
  'calgary':       'calgary',
  'edmonton':      'edmonton',
  'ottawa':        'ottawa',
  'winnipeg':      'winnipeg',
  'quebec city':   'quebec-city',
  'québec':        'quebec-city',
  'hamilton':      'hamilton',
  'kitchener':     'kitchener',
  'london':        'london',
  'halifax':       'halifax',
  'saskatoon':     'saskatoon',
  'regina':        'regina',
  'victoria':      'victoria',
  'windsor':       'windsor',
  'oshawa':        'oshawa',
  'brampton':      'brampton',
  'mississauga':   'mississauga',
  'laval':         'laval',
  'surrey':        'surrey',
  'burnaby':       'burnaby',
};

// Province → default city slug (fallback if city can't be parsed from address)
const PROVINCE_DEFAULT_CITY = {
  'BC': { city: 'Vancouver', city_slug: 'vancouver' },
  'ON': { city: 'Toronto',   city_slug: 'toronto'   },
  'QC': { city: 'Montreal',  city_slug: 'montreal'  },
  'AB': { city: 'Calgary',   city_slug: 'calgary'   },
  'MB': { city: 'Winnipeg',  city_slug: 'winnipeg'  },
  'SK': { city: 'Saskatoon', city_slug: 'saskatoon' },
  'NS': { city: 'Halifax',   city_slug: 'halifax'   },
  'NB': { city: 'Moncton',   city_slug: null        },
  'NL': { city: "St. John's", city_slug: null       },
  'PE': { city: 'Charlottetown', city_slug: null    },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract province abbreviation from a Google Places address string */
function extractProvince(address) {
  if (!address) return null;
  for (const prov of CA_PROVINCES) {
    const re = new RegExp(',\\s*' + prov + '[\\s,]', 'i');
    if (re.test(address)) return prov.toUpperCase();
  }
  return null;
}

/**
 * Extract city name from address. Google Places format:
 * "Street, [Neighbourhood,] City, Province PostalCode, Canada"
 * We look backwards from the province match.
 */
function extractCity(address) {
  if (!address) return null;
  const parts = address.split(',').map(p => p.trim());
  // Find the part that contains " Province PostalCode"
  for (let i = parts.length - 1; i >= 1; i--) {
    const part = parts[i];
    const hasProv = CA_PROVINCES.some(p => {
      const re = new RegExp('\\b' + p + '\\b');
      return re.test(part);
    });
    if (hasProv) {
      // City is the segment just before this
      const cityRaw = parts[i - 1]?.toLowerCase().trim();
      return cityRaw || null;
    }
  }
  return null;
}

/** Convert city name to our slug format */
function cityToSlug(cityRaw) {
  if (!cityRaw) return null;
  const lower = cityRaw.toLowerCase().trim();
  // Direct lookup
  if (CITY_SLUG_MAP[lower]) return { city: capitalize(cityRaw), city_slug: CITY_SLUG_MAP[lower] };
  return null;
}

function capitalize(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Rebuild slug: replace the old city_slug portion with the new one.
 * Slug format: `{name-slug}-{city-slug}-{5char-hash}`
 * Strategy: replace the last occurrence of oldCitySlug before the hash.
 */
function rebuildSlug(oldSlug, oldCitySlug, newCitySlug) {
  if (!oldSlug || !oldCitySlug || !newCitySlug) return oldSlug;
  if (oldCitySlug === newCitySlug) return oldSlug;
  // Replace last occurrence of `-{oldCitySlug}-` with `-{newCitySlug}-`
  const pattern = new RegExp('-' + escapeRegex(oldCitySlug) + '-(?=[a-z0-9]{5}$)', 'i');
  const newSlug = oldSlug.replace(pattern, '-' + newCitySlug + '-');
  return newSlug !== oldSlug ? newSlug : oldSlug;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY_RUN
    ? '🔍 DRY RUN — no DB changes will be made. Pass --apply to fix records.\n'
    : '🔧 APPLY MODE — fixing records in DB.\n'
  );

  let from = 0;
  const pageSize = 1000;
  const mismatches = [];
  let total = 0;
  let noAddress = 0;
  let unparseable = 0;

  // ── Fetch all businesses and find mismatches ──
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, slug, city, city_slug, province, address')
      .eq('is_active', true)
      .range(from, from + pageSize - 1);

    if (error) { console.error('Fetch error:', error); break; }
    if (!data || data.length === 0) break;

    total += data.length;

    for (const biz of data) {
      if (!biz.address) { noAddress++; continue; }

      const addrProvince = extractProvince(biz.address);
      if (!addrProvince) { unparseable++; continue; }

      const indexedProvince = biz.province?.toUpperCase();
      if (!indexedProvince || indexedProvince === addrProvince) continue;

      // We have a mismatch — figure out correct city + slug
      const cityRaw  = extractCity(biz.address);
      const cityInfo = cityRaw ? cityToSlug(cityRaw) : null;

      const correctCity     = cityInfo?.city     ?? PROVINCE_DEFAULT_CITY[addrProvince]?.city ?? capitalize(cityRaw ?? '');
      const correctCitySlug = cityInfo?.city_slug ?? PROVINCE_DEFAULT_CITY[addrProvince]?.city_slug ?? null;

      const newSlug = correctCitySlug
        ? rebuildSlug(biz.slug, biz.city_slug, correctCitySlug)
        : biz.slug;

      mismatches.push({
        id:            biz.id,
        name:          biz.name,
        old_city:      biz.city,
        old_province:  biz.province,
        old_city_slug: biz.city_slug,
        old_slug:      biz.slug,
        new_city:      correctCity,
        new_province:  addrProvince,
        new_city_slug: correctCitySlug,
        new_slug:      newSlug,
        address:       biz.address,
      });
    }

    if (data.length < pageSize) break;
    from += pageSize;
  }

  // ── Print summary ──
  console.log(`Checked:       ${total.toLocaleString()} businesses`);
  console.log(`No address:    ${noAddress}`);
  console.log(`Unparseable:   ${unparseable}`);
  console.log(`Mismatches:    ${mismatches.length}\n`);

  if (mismatches.length === 0) {
    console.log('✅ Everything looks good!');
    return;
  }

  // Group by: can fix automatically vs needs manual review
  const autoFix     = mismatches.filter(m => m.new_city_slug);
  const needsReview = mismatches.filter(m => !m.new_city_slug);

  console.log(`Auto-fixable:  ${autoFix.length}`);
  console.log(`Needs review:  ${needsReview.length}\n`);

  if (needsReview.length > 0) {
    console.log('── NEEDS MANUAL REVIEW (city not in our index) ──');
    needsReview.forEach((m, i) => {
      console.log(`${i+1}. ${m.name}`);
      console.log(`   Indexed: ${m.old_city}, ${m.old_province} → Address: ${m.new_province}`);
      console.log(`   Address: ${m.address}`);
    });
    console.log('');
  }

  if (DRY_RUN) {
    console.log('── PREVIEW: first 20 auto-fixes ──');
    autoFix.slice(0, 20).forEach((m, i) => {
      console.log(`${i+1}. ${m.name}`);
      console.log(`   ${m.old_city}, ${m.old_province} → ${m.new_city}, ${m.new_province}`);
      if (m.old_slug !== m.new_slug) {
        console.log(`   slug: ${m.old_slug}`);
        console.log(`      → ${m.new_slug}`);
      }
    });
    if (autoFix.length > 20) console.log(`   ... and ${autoFix.length - 20} more`);
    console.log('\nRun with --apply to execute fixes.');
    return;
  }

  // ── Apply fixes in batches ──
  console.log(`Fixing ${autoFix.length} records...`);
  let fixed = 0;
  let errors = 0;
  const BATCH = 50;

  for (let i = 0; i < autoFix.length; i += BATCH) {
    const batch = autoFix.slice(i, i + BATCH);
    await Promise.all(batch.map(async (m) => {
      const updates = {
        city:      m.new_city,
        city_slug: m.new_city_slug,
        province:  m.new_province,
      };
      if (m.new_slug !== m.old_slug) updates.slug = m.new_slug;

      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', m.id);

      if (error) {
        console.error(`  ✗ ${m.name}: ${error.message}`);
        errors++;
      } else {
        fixed++;
      }
    }));

    process.stdout.write(`\r  Progress: ${Math.min(i + BATCH, autoFix.length)}/${autoFix.length}`);
  }

  console.log(`\n\n✅ Done! Fixed: ${fixed}  Errors: ${errors}  Skipped (no city_slug): ${needsReview.length}`);
}

main().catch(console.error);
