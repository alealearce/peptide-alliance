'use client';
import { useState, useEffect } from 'react';
import { Newspaper, Sparkles, Loader2, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import type { BusinessBlogPost } from '@/lib/supabase/types';

interface Props {
  businessId: string;
  tier: string;
}

export function BusinessBlogManager({ businessId, tier }: Props) {
  const [posts, setPosts] = useState<BusinessBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const canAccess = tier === 'featured' || tier === 'industry_leader';

  useEffect(() => {
    if (!canAccess) { setLoading(false); return; }
    fetch(`/api/business/blog?businessId=${businessId}`)
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [businessId, canAccess]);

  const handleGenerate = async () => {
    setError('');
    setGenerating(true);
    const res = await fetch('/api/business/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: businessId }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? 'Failed to generate post.'); setGenerating(false); return; }
    setPosts((prev) => [json.post, ...prev]);
    setExpandedId(json.post.id);
    setGenerating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-primary" />
          <h2 className="font-heading font-bold text-lg text-text">Business Blog</h2>
        </div>
        {canAccess && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Generate Post
          </button>
        )}
      </div>

      {!canAccess ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3 bg-muted/5 rounded-xl border border-dashed border-muted/20">
          <Lock className="w-8 h-8 text-muted/40" />
          <p className="text-sm font-semibold text-text">Featured or Industry Leader required</p>
          <p className="text-xs text-muted text-center max-w-xs">
            Upgrade to Featured to unlock your business blog section. Posts are auto-generated monthly based on your products and certifications.
          </p>
          <a
            href="/upgrade"
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Upgrade to Featured
          </a>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted">
            Blog posts appear on your public listing page and help grow your SEO. A new post is auto-generated monthly based on your products and certifications. You can also generate one manually anytime.
          </p>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {loading ? (
            <p className="text-sm text-muted text-center py-4">Loading…</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No blog posts yet.</p>
              <p className="text-xs mt-1">Click &ldquo;Generate Post&rdquo; to create your first one.</p>
            </div>
          ) : (
            <div className="divide-y divide-muted/10 rounded-xl border border-muted/15 overflow-hidden">
              {posts.map((post) => (
                <div key={post.id} className="bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-bg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">{post.title}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {post.auto_generated && <span className="ml-2 text-primary/70">Auto-generated</span>}
                      </p>
                    </div>
                    {expandedId === post.id
                      ? <ChevronUp className="w-4 h-4 text-muted flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                    }
                  </button>
                  {expandedId === post.id && (
                    <div className="px-4 pb-4">
                      <div className="prose-sm text-muted text-sm leading-relaxed whitespace-pre-line border-t border-muted/10 pt-3">
                        {post.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
