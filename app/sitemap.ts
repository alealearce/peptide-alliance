import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/config/categories';
import { ALL_PEPTIDE_SLUGS } from '@/lib/config/peptides';
import { createAdminClient } from '@/lib/supabase/server';

const BASE = 'https://peptidealliance.io';
const BATCH_SIZE = 1000; // Supabase default row limit per request

function url(path: string) {
  return `${BASE}${path}`;
}

/** Fetch ALL rows from a table, paginating in batches to bypass the 1000-row default limit. */
async function fetchAllRows<T extends Record<string, unknown>>(
  supabase: ReturnType<typeof createAdminClient>,
  table: string,
  select: string,
): Promise<T[]> {
  const all: T[] = [];
  let offset = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .range(offset, offset + BATCH_SIZE - 1);
    if (error || !data || data.length === 0) break;
    all.push(...(data as unknown as T[]));
    if (data.length < BATCH_SIZE) break; // last page
    offset += BATCH_SIZE;
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home
  entries.push({ url: url('/'), changeFrequency: 'daily', priority: 1.0 });

  // Search
  entries.push({ url: url('/search'), changeFrequency: 'daily', priority: 0.9 });

  // Peptide Database index
  entries.push({ url: url('/peptides'), changeFrequency: 'weekly', priority: 0.9 });

  // Best peptide sources comparison
  entries.push({ url: url('/best-peptide-sources'), changeFrequency: 'daily', priority: 0.85 });

  // Static informational pages
  entries.push({ url: url('/about'),   changeFrequency: 'monthly', priority: 0.7 });
  entries.push({ url: url('/claim'),   changeFrequency: 'monthly', priority: 0.8 });
  entries.push({ url: url('/upgrade'), changeFrequency: 'monthly', priority: 0.8 });
  entries.push({ url: url('/terms'),   changeFrequency: 'yearly',  priority: 0.3 });
  entries.push({ url: url('/privacy'), changeFrequency: 'yearly',  priority: 0.3 });

  // Individual peptide pages
  for (const slug of ALL_PEPTIDE_SLUGS) {
    entries.push({ url: url(`/peptides/${slug}`), changeFrequency: 'weekly', priority: 0.8 });
  }

  // Blog index
  entries.push({ url: url('/blog'), changeFrequency: 'weekly', priority: 0.8 });

  // Category pages
  for (const cat of CATEGORIES) {
    const catSlug = typeof cat.slug === 'string' ? cat.slug : cat.slug.en;
    entries.push({
      url: url(`/${catSlug}`),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Subcategory pages
    for (const sub of cat.subcategories) {
      entries.push({
        url: url(`/${catSlug}/${sub.id}`),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // City pages — fetch distinct city_slugs from all businesses (paginated)
  try {
    const supabase = createAdminClient();
    const cities = await fetchAllRows<{ city_slug: string }>(supabase, 'businesses', 'city_slug');

    if (cities.length) {
      const uniqueCitySlugs = Array.from(new Set(cities.map((c) => c.city_slug)));
      for (const citySlug of uniqueCitySlugs) {
        entries.push({
          url: url(`/${citySlug}`),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // Non-critical — sitemap still works without city pages
  }

  // Blog posts — fetch published slugs (paginated)
  try {
    const supabase = createAdminClient();
    const posts = await fetchAllRows<{ slug: string; published_at: string | null }>(supabase, 'blog_posts', 'slug, published_at');

    for (const post of posts) {
      entries.push({
        url: url(`/blog/${post.slug}`),
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: post.published_at ? new Date(post.published_at) : undefined,
      });
    }
  } catch {
    // Non-critical — sitemap still works without blog posts
  }

  // Business listings — /{city_slug}/{slug} (paginated to fetch ALL)
  try {
    const supabase = createAdminClient();
    const businesses = await fetchAllRows<{ slug: string; city_slug: string; updated_at: string | null }>(
      supabase, 'businesses', 'slug, city_slug, updated_at'
    );

    for (const biz of businesses) {
      entries.push({
        url: url(`/${biz.city_slug}/${biz.slug}`),
        changeFrequency: 'weekly',
        priority: 0.6,
        lastModified: biz.updated_at ? new Date(biz.updated_at) : undefined,
      });
    }
  } catch {
    // Non-critical — sitemap still works without business listings
  }

  return entries;
}
