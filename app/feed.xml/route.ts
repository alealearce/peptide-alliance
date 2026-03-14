import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { SITE } from '@/lib/config/site';

// Don't prerender — requires Supabase connection
export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  const supabase = createAdminClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title_en, excerpt_en, category, published_at, updated_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(50);

  const items = (posts ?? [])
    .map((post) => {
      const title = post.title_en ?? 'Untitled';
      const description = post.excerpt_en ?? '';
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : new Date().toUTCString();
      const link = `${SITE.url}/blog/${post.slug}`;

      return `    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category>${post.category}</category>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE.name} Blog — Peptide Industry Directory</title>
    <description>Peptide education, industry news, source reviews, and the latest research updates from ${SITE.name}.</description>
    <link>${SITE.url}/blog</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <copyright>&copy; ${new Date().getFullYear()} ${SITE.name}</copyright>
    <managingEditor>${SITE.supportEmail} (${SITE.name})</managingEditor>
    <webMaster>${SITE.supportEmail} (${SITE.name})</webMaster>
    <image>
      <url>${SITE.url}/icon.png</url>
      <title>${SITE.name}</title>
      <link>${SITE.url}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
