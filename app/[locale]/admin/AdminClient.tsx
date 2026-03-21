'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle, BookOpen, Building2, Mail, Loader2, MessageSquare, ChevronDown, ChevronUp, AlertTriangle, PenLine, ExternalLink, Users, Pencil, Trash2 } from 'lucide-react';

const BLOG_CATEGORIES = [
  { id: 'comida', label: 'Food / Comida' },
  { id: 'servicios_profesionales', label: 'Professional Services' },
  { id: 'servicios_personales', label: 'Personal Services' },
  { id: 'salud', label: 'Health / Salud' },
  { id: 'eventos', label: 'Events / Eventos' },
  { id: 'trabajos', label: 'Jobs / Trabajos' },
];

const TIER_COLORS: Record<string, string> = {
  free:     'bg-gray-100 text-gray-600',
  premium:  'bg-blue-100 text-blue-700',
  featured: 'bg-amber-100 text-amber-700',
};

interface BlogDraft {
  id: string;
  title_en: string;
  title_es: string;
  category: string | null;
  city: string | null;
  created_at: string;
}

interface PendingBiz {
  id: string;
  name: string;
  city: string;
  province: string;
  category: string;
  phone: string | null;
  website: string | null;
  owner_title: string | null;
  owner_name: string | null;
  owner_email: string | null;
  created_at: string;
}

interface ClaimedBiz {
  id: string;
  name: string;
  city: string;
  province: string;
  category: string;
  phone: string | null;
  subscription_tier: string;
  subscription_ends_at: string | null;
  is_active: boolean;
  is_verified: boolean;
  owner_title: string | null;
  owner_name: string | null;
  owner_email: string | null;
  created_at: string;
}

interface ChatSession {
  id: string;
  session_id: string;
  messages: { role: string; content: string }[];
  escalated: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  blogDrafts: BlogDraft[];
  pendingBizs: PendingBiz[];
  allClaimedBizs: ClaimedBiz[];
  subscriberCount: number;
  chatSessions: ChatSession[];
}

const EMPTY_POST = {
  title_en: '', title_es: '',
  excerpt_en: '', excerpt_es: '',
  content_en: '', content_es: '',
  meta_title_en: '', meta_title_es: '',
  meta_description_en: '', meta_description_es: '',
  category: '', city: '', slug: '',
};

export default function AdminClient({ blogDrafts: init_drafts, pendingBizs: init_bizs, allClaimedBizs: init_dir, subscriberCount, chatSessions }: Props) {
  const [drafts, setDrafts] = useState(init_drafts);
  const [bizs, setBizs] = useState(init_bizs);
  const [dir, setDir] = useState(init_dir);
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [blogTab, setBlogTab] = useState<'en' | 'es'>('en');
  const [post, setPost] = useState(EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [dirSearch, setDirSearch] = useState('');
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [tierDraft, setTierDraft] = useState<{ tier: string; expires_at: string }>({ tier: 'free', expires_at: '' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const escalatedCount = chatSessions.filter((s) => s.escalated).length;

  const savePost = async () => {
    if (!post.title_en) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const data = await res.json();
      if (data.ok) {
        setSavedSlug(data.slug);
        setDrafts((prev) => [{
          id: data.id,
          title_en: post.title_en,
          title_es: post.title_es,
          category: post.category || null,
          city: post.city || null,
          created_at: new Date().toISOString(),
        }, ...prev]);
        setPost(EMPTY_POST);
        setShowBlogEditor(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const action = async (type: string, id: string) => {
    setLoading(`${type}-${id}`);
    try {
      await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: type, id }),
      });
      if (type === 'publish_blog' || type === 'delete_blog') {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
      } else if (type === 'delete_business') {
        setDir((prev) => prev.filter((b) => b.id !== id));
        setConfirmDelete(null);
      } else {
        setBizs((prev) => prev.filter((b) => b.id !== id));
      }
    } finally {
      setLoading(null);
    }
  };

  const openTierEditor = (b: ClaimedBiz) => {
    setEditingTier(b.id);
    setTierDraft({
      tier: b.subscription_tier,
      expires_at: b.subscription_ends_at ? b.subscription_ends_at.split('T')[0] : '',
    });
  };

  const saveTier = async (id: string) => {
    setLoading(`set_tier-${id}`);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_tier', id, tier: tierDraft.tier, expires_at: tierDraft.expires_at || null }),
      });
      if (res.ok) {
        setDir((prev) => prev.map((b) =>
          b.id === id
            ? { ...b, subscription_tier: tierDraft.tier, subscription_ends_at: tierDraft.expires_at ? new Date(tierDraft.expires_at).toISOString() : null }
            : b
        ));
        setEditingTier(null);
      }
    } finally {
      setLoading(null);
    }
  };

  const isLoading = (type: string, id: string) => loading === `${type}-${id}`;

  const filteredDir = dir.filter((b) => {
    if (!dirSearch) return true;
    const q = dirSearch.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      (b.owner_name ?? '').toLowerCase().includes(q) ||
      (b.owner_email ?? '').toLowerCase().includes(q) ||
      (b.phone ?? '').toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

  const downloadCSV = () => {
    const cols = ['Business Name','Category','City','Province','Status','Tier','Tier Expires','Phone','Verified','Owner Name','Owner Email','Owner Title','Submitted'];
    const rows = filteredDir.map((b) => [
      b.name, b.category, b.city, b.province,
      b.is_active ? 'Active' : 'Pending',
      b.subscription_tier,
      b.subscription_ends_at ? new Date(b.subscription_ends_at).toLocaleDateString('en-CA') : '',
      b.phone ?? '', b.is_verified ? 'Yes' : 'No',
      b.owner_name ?? '', b.owner_email ?? '', b.owner_title ?? '',
      new Date(b.created_at).toLocaleDateString('en-CA'),
    ]);
    const csv = [cols, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `peptide-alliance-businesses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-text">Admin Dashboard</h1>
        <p className="text-muted text-sm mt-1">Peptide Alliance internal management</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen className="w-5 h-5 text-primary" />} label="Blog Drafts" value={drafts.length} />
        <StatCard icon={<Building2 className="w-5 h-5 text-primary" />} label="Pending Businesses" value={bizs.length} />
        <StatCard icon={<Mail className="w-5 h-5 text-primary" />} label="Subscribers" value={subscriberCount} />
        <StatCard icon={<MessageSquare className="w-5 h-5 text-primary" />} label="Conversations" value={chatSessions.length} highlight={escalatedCount > 0 ? `${escalatedCount} escalated` : undefined} />
      </div>

      {/* ── Write New Blog Post ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-text flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" /> Write New Post
          </h2>
          <button onClick={() => { setShowBlogEditor(!showBlogEditor); setSavedSlug(null); }}
            className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors">
            {showBlogEditor ? 'Cancel' : '+ New Post'}
          </button>
        </div>

        {savedSlug && (
          <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>Draft saved! Preview it below in Blog Drafts, then publish when ready.</span>
            <a href={`/en/blog/${savedSlug}`} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-primary font-semibold hover:underline">
              Preview <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {showBlogEditor && (
          <div className="bg-card rounded-2xl border border-muted/10 p-6 space-y-6">
            <div className="flex gap-2 border-b border-muted/10 pb-3">
              <button onClick={() => setBlogTab('en')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${blogTab === 'en' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}>🇨🇦 English</button>
              <button onClick={() => setBlogTab('es')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${blogTab === 'es' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}>🇲🇽 Español</button>
            </div>
            {blogTab === 'en' && (
              <div className="space-y-4">
                <FormField label="Title (EN) *"><input type="text" value={post.title_en} onChange={(e) => setPost((p) => ({ ...p, title_en: e.target.value }))} placeholder="e.g. 5 Best Latin Restaurants in Toronto" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
                <FormField label="Excerpt (EN)"><textarea rows={2} value={post.excerpt_en} onChange={(e) => setPost((p) => ({ ...p, excerpt_en: e.target.value }))} placeholder="Short summary shown in blog listing..." className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></FormField>
                <FormField label="Content (EN) — Markdown supported"><textarea rows={14} value={post.content_en} onChange={(e) => setPost((p) => ({ ...p, content_en: e.target.value }))} placeholder="Write your post content here. Use ## for headings, **bold**, *italic*, [link text](url)" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" /></FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="SEO Title (EN)"><input type="text" value={post.meta_title_en} onChange={(e) => setPost((p) => ({ ...p, meta_title_en: e.target.value }))} placeholder="Defaults to title if empty" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
                  <FormField label="SEO Description (EN)"><input type="text" value={post.meta_description_en} onChange={(e) => setPost((p) => ({ ...p, meta_description_en: e.target.value }))} placeholder="Defaults to excerpt if empty" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
                </div>
              </div>
            )}
            {blogTab === 'es' && (
              <div className="space-y-4">
                <FormField label="Título (ES)"><input type="text" value={post.title_es} onChange={(e) => setPost((p) => ({ ...p, title_es: e.target.value }))} placeholder="ej. Los 5 mejores restaurantes latinos en Toronto" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
                <FormField label="Extracto (ES)"><textarea rows={2} value={post.excerpt_es} onChange={(e) => setPost((p) => ({ ...p, excerpt_es: e.target.value }))} placeholder="Resumen corto para el listado del blog..." className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></FormField>
                <FormField label="Contenido (ES) — Markdown soportado"><textarea rows={14} value={post.content_es} onChange={(e) => setPost((p) => ({ ...p, content_es: e.target.value }))} placeholder="Escribe el contenido aquí. Usa ## para títulos, **negrita**, *cursiva*" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" /></FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Título SEO (ES)"><input type="text" value={post.meta_title_es} onChange={(e) => setPost((p) => ({ ...p, meta_title_es: e.target.value }))} placeholder="Por defecto usa el título" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
                  <FormField label="Descripción SEO (ES)"><input type="text" value={post.meta_description_es} onChange={(e) => setPost((p) => ({ ...p, meta_description_es: e.target.value }))} placeholder="Por defecto usa el extracto" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-muted/10">
              <FormField label="Category">
                <select value={post.category} onChange={(e) => setPost((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">— Select —</option>
                  {BLOG_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </FormField>
              <FormField label="City (optional)"><input type="text" value={post.city} onChange={(e) => setPost((p) => ({ ...p, city: e.target.value }))} placeholder="e.g. Toronto" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
              <FormField label="Slug (auto-generated)"><input type="text" value={post.slug} onChange={(e) => setPost((p) => ({ ...p, slug: e.target.value }))} placeholder="leave empty to auto-generate" className="w-full rounded-xl border border-muted/20 bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" /></FormField>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted">Saved as draft — review it then publish from the list below.</p>
              <button onClick={savePost} disabled={saving || !post.title_en}
                className="flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Save as Draft
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Blog Drafts ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Blog Drafts ({drafts.length})
        </h2>
        {drafts.length === 0 ? (
          <EmptyState text="No blog drafts to review. Run the generate-blog-posts function to create new drafts." />
        ) : (
          <div className="bg-card rounded-2xl border border-muted/10 divide-y divide-muted/10">
            {drafts.map((d) => (
              <div key={d.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-text text-sm truncate">{d.title_en}</p>
                  <p className="text-xs text-muted italic truncate">{d.title_es}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {d.category && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{d.category}</span>}
                    {d.city && <span className="text-xs text-muted">📍 {d.city}</span>}
                    <span className="text-xs text-muted">{new Date(d.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ActionButton label="Publish" icon={<CheckCircle2 className="w-4 h-4" />} onClick={() => action('publish_blog', d.id)} loading={isLoading('publish_blog', d.id)} variant="success" />
                  <ActionButton label="Delete" icon={<XCircle className="w-4 h-4" />} onClick={() => action('delete_blog', d.id)} loading={isLoading('delete_blog', d.id)} variant="danger" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Chat Conversations ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" /> Conversations ({chatSessions.length})
          {escalatedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
              <AlertTriangle className="w-3 h-3" />{escalatedCount} needs follow-up
            </span>
          )}
        </h2>
        {chatSessions.length === 0 ? (
          <EmptyState text="No conversations yet. They will appear here as users chat with the assistant." />
        ) : (
          <div className="bg-card rounded-2xl border border-muted/10 divide-y divide-muted/10">
            {chatSessions.map((session) => {
              const isExpanded = expandedSession === session.id;
              const userMessages = session.messages.filter((m) => m.role === 'user').length;
              return (
                <div key={session.id} className={`px-5 py-4 ${session.escalated ? 'bg-amber-50/50' : ''}`}>
                  <button onClick={() => setExpandedSession(isExpanded ? null : session.id)} className="w-full flex items-center justify-between gap-4 text-left">
                    <div className="min-w-0 flex items-center gap-3">
                      {session.escalated && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Escalated
                        </span>
                      )}
                      <div>
                        <p className="text-xs font-mono text-muted truncate max-w-[160px]">{session.session_id}</p>
                        <p className="text-xs text-muted mt-0.5">{userMessages} {userMessages === 1 ? 'message' : 'messages'} · {new Date(session.updated_at).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="mt-4 space-y-2 border-t border-muted/10 pt-4">
                      {session.messages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.role === 'assistant' && <div className="w-6 h-6 flex-shrink-0 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>}
                          <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-muted/10 text-text rounded-tl-sm'}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Pending Business Submissions ─────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Pending Business Submissions ({bizs.length})
        </h2>
        {bizs.length === 0 ? (
          <EmptyState text="No pending business submissions." />
        ) : (
          <div className="bg-card rounded-2xl border border-muted/10 divide-y divide-muted/10">
            {bizs.map((b) => (
              <div key={b.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text text-sm">{b.name}</p>
                  <p className="text-xs text-muted">📍 {b.city}, {b.province} · {b.category}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {b.owner_name && <span className="inline-flex items-center gap-1 text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium">👤 {b.owner_name}</span>}
                    {b.owner_title && <span className="inline-flex items-center gap-1 text-xs bg-muted/10 text-muted px-2 py-0.5 rounded-full capitalize">{b.owner_title}</span>}
                    {b.owner_email && <a href={`mailto:${b.owner_email}`} className="text-xs text-primary hover:underline truncate max-w-[200px]">✉ {b.owner_email}</a>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {b.phone && <span className="text-xs text-muted">📞 {b.phone}</span>}
                    {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate max-w-[160px]">🌐 {b.website.replace(/^https?:\/\//, '')}</a>}
                    <span className="text-xs text-muted">{new Date(b.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ActionButton label="Approve" icon={<CheckCircle2 className="w-4 h-4" />} onClick={() => action('approve_business', b.id)} loading={isLoading('approve_business', b.id)} variant="success" />
                  <ActionButton label="Reject" icon={<XCircle className="w-4 h-4" />} onClick={() => action('reject_business', b.id)} loading={isLoading('reject_business', b.id)} variant="danger" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── All Claimed Businesses (Directory) ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-heading font-bold text-text flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Business Directory ({filteredDir.length}{filteredDir.length !== dir.length ? ` of ${dir.length}` : ''})
          </h2>
          <div className="flex items-center gap-2">
            <input type="text" value={dirSearch} onChange={(e) => setDirSearch(e.target.value)} placeholder="Search name, owner, phone…"
              className="px-3 py-1.5 rounded-xl border border-muted/20 bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 w-52" />
            <button onClick={downloadCSV} className="flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-xl hover:bg-primary/20 transition-colors">↓ CSV</button>
          </div>
        </div>

        {dir.length === 0 ? (
          <EmptyState text="No claimed businesses yet. They will appear here once users add or claim listings." />
        ) : (
          <div className="bg-card rounded-2xl border border-muted/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/5 border-b border-muted/10">
                  <tr>
                    {['Business','Category','City','Status','Tier','Phone','Owner Name','Title','Email','Submitted','Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/8">
                  {filteredDir.map((b) => (
                    <>
                      <tr key={b.id} className="hover:bg-muted/3 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-text text-xs">{b.name}</p>
                          {b.is_verified && <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted capitalize whitespace-nowrap">{b.category.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{b.city}, {b.province}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {b.is_active ? 'Active' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TIER_COLORS[b.subscription_tier] ?? 'bg-gray-100 text-gray-600'}`}>
                            {b.subscription_tier}
                          </span>
                          {b.subscription_ends_at && (
                            <p className="text-[10px] text-muted mt-0.5">until {new Date(b.subscription_ends_at).toLocaleDateString('en-CA')}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                          {b.phone ? <a href={`tel:${b.phone}`} className="text-text hover:text-primary transition-colors">{b.phone}</a> : <span className="text-muted/50">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-text whitespace-nowrap">{b.owner_name ?? <span className="text-muted">—</span>}</td>
                        <td className="px-4 py-3 text-xs text-muted capitalize whitespace-nowrap">{b.owner_title ?? <span className="text-muted/50">—</span>}</td>
                        <td className="px-4 py-3 text-xs">
                          {b.owner_email ? <a href={`mailto:${b.owner_email}`} className="text-primary hover:underline">{b.owner_email}</a> : <span className="text-muted">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{new Date(b.created_at).toLocaleDateString('en-CA')}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {/* Tier editor button */}
                            <button
                              onClick={() => editingTier === b.id ? setEditingTier(null) : openTierEditor(b)}
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                                editingTier === b.id ? 'bg-muted/10 text-muted' : 'bg-primary/10 text-primary hover:bg-primary/20'
                              }`}
                            >
                              <Pencil className="w-3 h-3" />
                              {editingTier === b.id ? 'Cancel' : 'Tier'}
                            </button>

                            {/* Delete — two-click confirmation */}
                            {confirmDelete === b.id ? (
                              <button
                                onClick={() => action('delete_business', b.id)}
                                disabled={isLoading('delete_business', b.id)}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                              >
                                {isLoading('delete_business', b.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                Confirm?
                              </button>
                            ) : (
                              <button
                                onClick={() => { setConfirmDelete(b.id); setEditingTier(null); }}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Inline tier editor row */}
                      {editingTier === b.id && (
                        <tr key={`${b.id}-edit`} className="bg-blue-50/40 border-b border-blue-100">
                          <td colSpan={11} className="px-4 py-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs font-semibold text-text">Change tier for <span className="text-primary">{b.name}</span>:</span>
                              <select value={tierDraft.tier} onChange={(e) => setTierDraft((d) => ({ ...d, tier: e.target.value }))}
                                className="rounded-lg border border-muted/20 bg-white px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30">
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                                <option value="featured">Featured</option>
                              </select>
                              <div className="flex items-center gap-1.5">
                                <label className="text-xs text-muted font-medium">Expires:</label>
                                <input type="date" value={tierDraft.expires_at} onChange={(e) => setTierDraft((d) => ({ ...d, expires_at: e.target.value }))}
                                  className="rounded-lg border border-muted/20 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                <span className="text-[10px] text-muted">(leave blank = no expiry)</span>
                              </div>
                              <button onClick={() => saveTier(b.id)} disabled={isLoading(`set_tier`, b.id)}
                                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                                {isLoading(`set_tier`, b.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: number; highlight?: string }) {
  return (
    <div className="bg-card rounded-2xl border border-muted/10 p-5 flex items-center gap-4">
      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-heading font-extrabold text-text">{value}</p>
        <p className="text-xs text-muted">{label}</p>
        {highlight && <p className="text-xs font-semibold text-amber-600 mt-0.5">{highlight}</p>}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="bg-card rounded-2xl border border-muted/10 px-6 py-10 text-center text-muted text-sm">{text}</div>;
}

function ActionButton({ label, icon, onClick, loading, variant }: { label: string; icon: React.ReactNode; onClick: () => void; loading: boolean; variant: 'success' | 'danger' }) {
  const colors = variant === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700';
  return (
    <button onClick={onClick} disabled={loading} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${colors}`}>
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {label}
    </button>
  );
}
