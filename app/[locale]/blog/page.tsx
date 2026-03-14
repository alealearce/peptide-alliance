import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import type { BlogPost } from '@/lib/supabase/types';
import { SITE } from '@/lib/config/site';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Blog — ${SITE.name}`,
    description:
      'Peptide education, industry news, source reviews, and the latest research updates.',
    alternates: {
      canonical: `${SITE.url}/blog`,
    },
    openGraph: {
      title: `Blog — ${SITE.name}`,
      description:
        'Peptide education, industry news, source reviews, and the latest research updates.',
      url: `${SITE.url}/blog`,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: `${SITE.url}/opengraph-image`, width: 1200, height: 630, alt: `${SITE.name} Blog` }],
    },
  };
}

const BLOG_CATEGORIES = [
  { id: 'peptide_education', label: 'Peptide Education' },
  { id: 'industry_news', label: 'Industry News' },
  { id: 'source_reviews', label: 'Source Reviews' },
  { id: 'research_updates', label: 'Research Updates' },
];

export default async function BlogIndexPage({
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  const t = await getTranslations('blog');
  const supabase = createAdminClient();

  let query = supabase
    .from('blog_posts')
    .select('id, title_en, slug, excerpt_en, category, city, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(24);

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }

  const { data: posts } = await query;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-extrabold text-text mb-3">
          {t('title')}
        </h1>
        <p className="text-muted text-lg">{t('subtitle')}</p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/blog"
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            !searchParams.category
              ? 'bg-primary text-white border-primary'
              : 'border-muted/20 text-muted hover:border-primary hover:text-primary'
          }`}
        >
          {t('all')}
        </Link>
        {BLOG_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog?category=${cat.id}`}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              searchParams.category === cat.id
                ? 'bg-primary text-white border-primary'
                : 'border-muted/20 text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Posts grid */}
      {!posts?.length ? (
        <div className="text-center py-24 text-muted">
          <p className="text-xl font-heading font-bold mb-2">{t('noPostsTitle')}</p>
          <p>{t('noPostsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post as BlogPost} />
          ))}
        </div>
      )}
    </main>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : '';

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-card rounded-2xl border border-muted/10 p-6 h-full flex flex-col hover:shadow-md transition-shadow">
        {/* Category + city tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.category && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
          )}
          {post.city && (
            <span className="text-xs text-muted">{post.city}</span>
          )}
        </div>

        <h2 className="font-heading font-bold text-text text-lg leading-snug group-hover:text-primary transition-colors mb-3 flex-1">
          {post.title_en}
        </h2>

        {post.excerpt_en && (
          <p className="text-muted text-sm line-clamp-3 mb-4">{post.excerpt_en}</p>
        )}

        {date && (
          <p className="text-xs text-muted mt-auto">{date}</p>
        )}
      </article>
    </Link>
  );
}
