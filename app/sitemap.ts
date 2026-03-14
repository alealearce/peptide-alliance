import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/config/categories';
import { createAdminClient } from '@/lib/supabase/server';

const BASE = 'https://peptidealliance.io';

function url(path: string) {
  return `${BASE}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home
  entries.push({ url: url('/'), changeFrequency: 'daily', priority: 1.0 });

  // Search
  entries.push({ url: url('/search'), changeFrequency: 'daily', priority: 0.9 });

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

  // City pages — fetch distinct city_slugs from active businesses
  try {
    const supabase = createAdminClient();
    const { data: cities } = await supabase
      .from('businesses')
      .select('city_slug')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (cities?.length) {
      const uniqueCitySlugs = Array.from(new Set(cities.map((c: { city_slug: string }) => c.city_slug)));
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

  // Blog posts — fetch published slugs
  try {
    const supabase = createAdminClient();
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (posts?.length) {
      for (const post of posts) {
        entries.push({
          url: url(`/blog/${post.slug}`),
          changeFrequency: 'monthly',
          priority: 0.7,
          lastModified: post.published_at ? new Date(post.published_at) : undefined,
        });
      }
    }
  } catch {
    // Non-critical — sitemap still works without blog posts
  }

  // Business listings — /{city_slug}/{slug}
  try {
    const supabase = createAdminClient();
    const { data: businesses } = await supabase
      .from('businesses')
      .select('slug, city_slug, updated_at')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (businesses?.length) {
      for (const biz of businesses) {
        entries.push({
          url: url(`/${biz.city_slug}/${biz.slug}`),
          changeFrequency: 'weekly',
          priority: 0.6,
          lastModified: biz.updated_at ? new Date(biz.updated_at) : undefined,
        });
      }
    }
  } catch {
    // Non-critical — sitemap still works without business listings
  }

  return entries;
}
