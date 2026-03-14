import { notFound } from 'next/navigation';
import Link from 'next/link';
import { lp } from '@/lib/utils/locale';
import { createAdminClient } from '@/lib/supabase/server';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import type { Metadata } from 'next';

export const revalidate = 86400;

const BASE = 'https://infosylvita.com';

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('meta_title_en, meta_title_es, meta_description_en, meta_description_es, published_at, title_en, title_es')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!data) return {};
  const l = locale as 'en' | 'es';
  const isEs = l === 'es';
  const metaTitle = (isEs ? data.meta_title_es : data.meta_title_en) ?? (isEs ? data.title_es : data.title_en) ?? undefined;
  const metaDesc = (isEs ? data.meta_description_es : data.meta_description_en) ?? undefined;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: isEs ? `${BASE}/es/blog/${slug}` : `${BASE}/blog/${slug}`,
      languages: {
        'en': `${BASE}/blog/${slug}`,
        'es': `${BASE}/es/blog/${slug}`,
        'x-default': `${BASE}/blog/${slug}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: isEs ? `${BASE}/es/blog/${slug}` : `${BASE}/blog/${slug}`,
      siteName: 'InfoSylvita',
      locale: isEs ? 'es_CA' : 'en_CA',
      type: 'article',
      publishedTime: data.published_at ?? undefined,
      images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: metaTitle ?? 'InfoSylvita Blog' }],
    },
  };
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!post) notFound();

  const l = locale as 'en' | 'es';
  const title = l === 'es' ? post.title_es : post.title_en;
  const content = l === 'es' ? post.content_es : post.content_en;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(l === 'es' ? 'es-CA' : 'en-CA', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  // JSON-LD Article schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: post.published_at,
    url: locale === 'en' ? `https://infosylvita.com/blog/${slug}` : `https://infosylvita.com/es/blog/${slug}`,
    inLanguage: locale === 'es' ? 'es' : 'en',
    publisher: {
      '@type': 'Organization',
      name: 'InfoSylvita',
      url: 'https://infosylvita.com',
      logo: { '@type': 'ImageObject', url: 'https://infosylvita.com/icon.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': locale === 'en' ? `https://infosylvita.com/blog/${slug}` : `https://infosylvita.com/es/blog/${slug}`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: locale === 'en' ? 'https://infosylvita.com' : 'https://infosylvita.com/es' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: locale === 'en' ? 'https://infosylvita.com/blog' : 'https://infosylvita.com/es/blog' },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href={lp(locale, '/')} className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href={lp(locale, '/blog')} className="hover:text-primary">Blog</Link>
        <span>/</span>
        <span className="truncate max-w-[200px] text-text">{title}</span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {post.category && (
          <Link
            href={lp(locale, `/blog?category=${post.category}`)}
            className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
          >
            {post.category}
          </Link>
        )}
        {post.city && (
          <span className="text-xs text-muted bg-muted/10 px-2.5 py-1 rounded-full">
            📍 {post.city}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-text leading-tight mb-4">
        {title}
      </h1>

      {date && <p className="text-sm text-muted mb-8">{date}</p>}

      {/* Content — rendered as rich text using Tailwind prose */}
      <div
        className="prose prose-base max-w-none text-text/80
          prose-headings:font-heading prose-headings:text-text
          prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-muted/20
          prose-h3:mt-8 prose-h3:mb-3
          prose-p:leading-[1.85] prose-p:!mb-10 prose-p:text-text/80
          prose-ul:my-6 prose-ul:pl-6 prose-ol:my-6 prose-ol:pl-6 prose-li:my-2 prose-li:leading-relaxed
          prose-hr:border-muted/20 prose-hr:my-8
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          [&_strong]:bg-primary/10 [&_strong]:text-primary [&_strong]:px-1 [&_strong]:rounded-sm [&_strong]:font-semibold [&_strong]:not-italic"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
      />

      {/* Newsletter CTA */}
      <div className="mt-12">
        <NewsletterSignup />
      </div>

      {/* Back to blog */}
      <div className="mt-8 pt-8 border-t border-muted/10">
        <Link
          href={lp(locale, '/blog')}
          className="text-primary font-semibold hover:underline"
        >
          ← {l === 'es' ? 'Volver al Blog' : 'Back to Blog'}
        </Link>
      </div>
    </main>
  );
}

// Lightweight markdown → HTML converter for blog content.
// SECURITY: strip all raw HTML first, then only allow safe http/https links.
// Supports headings, paragraphs, unordered/ordered lists, bold, italic, links.
function markdownToHtml(md: string): string {
  if (!md) return '';

  // 1. Strip any raw HTML tags to prevent XSS (e.g. <script>, inline event handlers)
  let text = md.replace(/<[^>]*>/g, '');

  // 2. Remove "Quick Answer" / "Respuesta Rápida" heading (keep paragraph content below it)
  text = text.replace(/^## *(Quick Answer|Respuesta Rápida|Short Answer|Respuesta Corta) *\r?\n/im, '');

  // 3. Inline formatting helper — only safe patterns
  const inline = (s: string): string =>
    s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(
        /\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g,
        '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>',
      );

  // 4. Process line-by-line to correctly handle headings, lists, and paragraphs
  const lines = text.split('\n');
  const output: string[] = [];
  let listType = ''; // 'ul' | 'ol' | ''
  const paraLines: string[] = [];

  const flushPara = () => {
    if (paraLines.length > 0) {
      output.push(`<p>${paraLines.join(' ')}</p>`);
      paraLines.length = 0;
    }
  };

  const closeList = () => {
    if (listType) {
      output.push(`</${listType}>`);
      listType = '';
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Horizontal rule
    if (/^---+$/.test(trimmed)) { flushPara(); closeList(); output.push('<hr>'); continue; }

    // Headings
    if (/^### /.test(trimmed)) { flushPara(); closeList(); output.push(`<h3>${inline(trimmed.slice(4))}</h3>`); continue; }
    if (/^## /.test(trimmed))  { flushPara(); closeList(); output.push(`<h2>${inline(trimmed.slice(3))}</h2>`); continue; }
    if (/^# /.test(trimmed))   { flushPara(); closeList(); output.push(`<h1>${inline(trimmed.slice(2))}</h1>`); continue; }

    // Unordered list item
    if (/^[-*] /.test(trimmed)) {
      flushPara();
      if (listType !== 'ul') { closeList(); output.push('<ul>'); listType = 'ul'; }
      output.push(`<li>${inline(trimmed.slice(2))}</li>`);
      continue;
    }

    // Ordered list item
    if (/^\d+\. /.test(trimmed)) {
      flushPara();
      if (listType !== 'ol') { closeList(); output.push('<ol>'); listType = 'ol'; }
      output.push(`<li>${inline(trimmed.replace(/^\d+\. /, ''))}</li>`);
      continue;
    }

    // Empty line → flush paragraph / close list
    if (trimmed === '') {
      flushPara();
      closeList();
      continue;
    }

    // Regular text → close open list, accumulate into paragraph
    if (listType) closeList();
    paraLines.push(inline(trimmed));
  }

  flushPara();
  closeList();

  return output.join('\n');
}
