'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase/client';
import { CATEGORIES } from '@/lib/config/categories';
import { US_STATES, CA_PROVINCES } from '@/lib/config/geography';
import { lp } from '@/lib/utils/locale';
import type { User } from '@supabase/supabase-js';
import { Search, CheckCircle2, PlusCircle, Instagram, Facebook, Linkedin, MapPin as MapPinIcon } from 'lucide-react';

interface BizResult {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string | null;
}

// 'identity' replaces the old 'auth' step — collects name/role only (no email/password)
type Step = 'search' | 'select' | 'submit' | 'identity' | 'done';
type Mode = 'claim' | 'submit';

const ALL_REGIONS = [
  ...Object.entries(US_STATES).map(([code, name]) => ({ code, name, country: 'US' as const })),
  ...Object.entries(CA_PROVINCES).map(([code, name]) => ({ code, name, country: 'CA' as const })),
];

const OWNER_TITLES = [
  { value: 'owner',      en: 'Owner',                        es: 'Dueño / Dueña' },
  { value: 'ceo',        en: 'CEO',                          es: 'CEO' },
  { value: 'director',   en: 'Director',                     es: 'Director / Directora' },
  { value: 'manager',    en: 'Manager',                      es: 'Gerente' },
  { value: 'partner',    en: 'Partner',                      es: 'Socio / Socia' },
  { value: 'marketing',  en: 'Marketing',                    es: 'Marketing' },
  { value: 'operations', en: 'Operations',                   es: 'Operaciones' },
  { value: 'employee',   en: 'Employee / Representative',    es: 'Empleado / Representante' },
  { value: 'other',      en: 'Other',                        es: 'Otro' },
];

export default function ClaimPage() {
  const t = useTranslations('claim');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === 'true';
  const categoryParam = searchParams.get('category') as string | null;

  // ── Auth state ─────────────────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(isNew ? 'submit' : 'search');
  const [mode, setMode] = useState<Mode>(isNew ? 'submit' : 'claim');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BizResult[]>([]);
  const [selected, setSelected] = useState<BizResult | null>(null);
  const [searching, setSearching] = useState(false);

  // Identity fields (name + role — no email/password, user is already authenticated)
  const [fullName, setFullName] = useState('');
  const [ownerTitle, setOwnerTitle] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const EXPIRY_CATEGORIES = ['eventos', 'trabajos'];

  const defaultExpiry = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const [newBiz, setNewBiz] = useState({
    name: '',
    category: (categoryParam ?? '') as string | '',
    subcategory: '',
    city: '',
    province: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    linkedin: '',
    google_maps_url: '',
    keywords: '',
    expires_at: defaultExpiry(),
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // Auto-prepend https:// to a URL if it looks like a URL but is missing the protocol
  const normalizeUrl = (url: string): string | undefined => {
    if (!url.trim()) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  // Upload logo via the server-side API (uses admin client to bypass RLS)
  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!selected && !newBiz.name) return null;
    const formData = new FormData();
    formData.append('file', file);
    // Use a temporary placeholder business_id if submitting new (logo gets re-linked after insert)
    // For new submissions we upload without a business_id using a generic path
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `pending/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from('business-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) return null;
    const { data: { publicUrl } } = supabase.storage.from('business-images').getPublicUrl(data.path);
    return publicUrl;
  };

  const handleGenerateDesc = async () => {
    if (!newBiz.name || !newBiz.city || !newBiz.category) return;
    setGeneratingDesc(true);
    try {
      const res = await fetch('/api/business/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBiz.name,
          city: newBiz.city,
          category: newBiz.category,
          subcategory: newBiz.subcategory || undefined,
          website: newBiz.website || undefined,
          instagram: newBiz.instagram || undefined,
          tiktok: newBiz.tiktok || undefined,
          facebook: newBiz.facebook || undefined,
          linkedin: newBiz.linkedin || undefined,
          google_maps_url: newBiz.google_maps_url || undefined,
          keywords: newBiz.keywords || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.description) {
        setNewBiz((p) => ({ ...p, description: json.description }));
      }
    } finally {
      setGeneratingDesc(false);
    }
  };

  const searchBusinesses = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    const { data } = await supabase
      .from('businesses')
      .select('id, name, city, province, address')
      .ilike('name', `%${query.trim()}%`)
      .is('claimed_by', null)
      .limit(8);
    setResults((data as BizResult[]) ?? []);
    setStep('select');
    setSearching(false);
  };

  const selectBusiness = (biz: BizResult) => {
    setSelected(biz);
    setMode('claim');
    setStep('identity');
  };

  const startNewSubmission = () => {
    setMode('submit');
    setNewBiz((prev) => ({ ...prev, name: query }));
    setStep('submit');
  };

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    // Guard: user must be logged in (should never happen because of the gate, but just in case)
    if (!user) {
      router.push(lp(locale, `/login?next=/claim`));
      return;
    }

    if (!fullName.trim()) {
      setFormError(locale === 'es' ? 'Por favor ingresa tu nombre completo.' : 'Please enter your full name.');
      setSubmitting(false);
      return;
    }
    if (!ownerTitle) {
      setFormError(locale === 'es' ? 'Por favor selecciona tu cargo.' : 'Please select your title/role.');
      setSubmitting(false);
      return;
    }

    const userId = user.id;

    // Update full_name in profile
    await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', userId);

    if (mode === 'claim' && selected) {
      // ── Claim existing business via API ──────────────────────────────────
      const res = await fetch('/api/business/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: selected.id, owner_title: ownerTitle }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setFormError((err as { error?: string }).error ?? 'Failed to claim business. Please try again.');
        setSubmitting(false);
        return;
      }
    } else {
      // ── Submit new business via API ───────────────────────────────────────
      let logoUrl: string | null = null;
      if (logoFile) logoUrl = await uploadLogo(logoFile);

      const res = await fetch('/api/business/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBiz.name,
          category: newBiz.category,
          subcategory: newBiz.subcategory || undefined,
          city: newBiz.city,
          province: newBiz.province,
          address: newBiz.address || undefined,
          phone: newBiz.phone || undefined,
          website: normalizeUrl(newBiz.website),
          claimed_by: userId,
          owner_title: ownerTitle,
          description: newBiz.description || undefined,
          logo_url: logoUrl || undefined,
          instagram: newBiz.instagram || undefined,
          tiktok: newBiz.tiktok || undefined,
          facebook: newBiz.facebook || undefined,
          linkedin: newBiz.linkedin || undefined,
          google_maps_url: normalizeUrl(newBiz.google_maps_url),
          keywords: newBiz.keywords
            ? newBiz.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
            : undefined,
          expires_at:
            EXPIRY_CATEGORIES.includes(newBiz.category) && newBiz.expires_at
              ? new Date(newBiz.expires_at + 'T23:59:59').toISOString()
              : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setFormError(
          (err as { error?: string }).error ??
          (locale === 'es'
            ? 'Error al enviar el negocio. Por favor intenta de nuevo.'
            : 'Failed to submit business. Please try again.')
        );
        setSubmitting(false);
        return;
      }
    }

    setStep('done');
    setSubmitting(false);
  };

  // ── Step indicators ────────────────────────────────────────────────────────
  const identityLabel = locale === 'es' ? 'Tus datos' : 'Your Info';

  const claimSteps: { key: Step; label: string }[] = [
    { key: 'search', label: t('searchBusiness') },
    { key: 'select', label: t('selectListing') },
    { key: 'identity', label: identityLabel },
  ];
  const submitSteps: { key: Step; label: string }[] = isNew
    ? [
        { key: 'submit', label: locale === 'es' ? 'Detalles' : 'Details' },
        { key: 'identity', label: identityLabel },
      ]
    : [
        { key: 'search', label: t('searchBusiness') },
        { key: 'submit', label: locale === 'es' ? 'Detalles' : 'Details' },
        { key: 'identity', label: identityLabel },
      ];
  const currentSteps = mode === 'claim' ? claimSteps : submitSteps;
  const stepIndex = currentSteps.findIndex((s) => s.key === step);

  // ── Loading state while auth is being checked ──────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted text-sm">{locale === 'es' ? 'Cargando…' : 'Loading…'}</p>
      </div>
    );
  }

  // ── Auth gate: user is not logged in ───────────────────────────────────────
  if (!user) {
    const loginUrl = lp(locale, '/login') + '?next=' + encodeURIComponent(lp(locale, '/claim') + (isNew ? '?new=true' : ''));
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">🏪</div>
          <h1 className="text-2xl font-heading font-bold text-text mb-3">
            {locale === 'es' ? 'Crea tu cuenta primero' : 'Create your account first'}
          </h1>
          <p className="text-muted mb-6">
            {locale === 'es'
              ? 'Necesitas una cuenta de Peptide Alliance para agregar o reclamar un negocio. Es gratis y solo toma un minuto.'
              : 'You need an Peptide Alliance account to add or claim a business. It\'s free and only takes a minute.'}
          </p>
          <div className="space-y-3">
            <Link href={loginUrl}>
              <Button className="w-full">
                {locale === 'es' ? 'Iniciar sesión / Crear cuenta' : 'Sign In / Create Account'}
              </Button>
            </Link>
            <p className="text-xs text-muted">
              {locale === 'es'
                ? 'Después de crear tu cuenta, serás redirigido aquí para completar el proceso.'
                : 'After creating your account, you\'ll be redirected here to complete the process.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form (authenticated users only) ───────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-extrabold text-text">{t('title')}</h1>
        <p className="text-muted mt-2">{t('subtitle')}</p>
      </div>

      {step !== 'done' && (
        <div className="flex items-center justify-center gap-0 mb-10">
          {currentSteps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-colors ${
                  i < stepIndex
                    ? 'bg-primary border-primary text-white'
                    : i === stepIndex
                    ? 'border-primary text-primary'
                    : 'border-muted/30 text-muted'
                }`}
              >
                {i < stepIndex ? '✓' : i + 1}
              </div>
              {i < currentSteps.length - 1 && (
                <div className={`w-16 h-0.5 ${i < stepIndex ? 'bg-primary' : 'bg-muted/20'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-card rounded-2xl border border-muted/10 p-8">

        {/* ── Step 1: Search ── */}
        {step === 'search' && (
          <form onSubmit={searchBusinesses} className="space-y-4">
            <label className="block font-heading font-bold text-lg text-text mb-2">
              {t('searchBusiness')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. La Cocina de Mamá"
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={searching} className="w-full">
              {searching
                ? (locale === 'es' ? 'Buscando…' : 'Searching…')
                : (locale === 'es' ? 'Buscar' : 'Search')}
            </Button>
          </form>
        )}

        {/* ── Step 2: Select existing OR submit new ── */}
        {step === 'select' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-heading font-bold text-lg text-text">{t('selectListing')}</p>
              <button
                onClick={() => { setStep('search'); setResults([]); }}
                className="text-sm text-primary hover:underline"
              >
                ← {locale === 'es' ? 'Atrás' : 'Back'}
              </button>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-6 space-y-4">
                <p className="text-5xl">🔍</p>
                <p className="text-muted text-sm">
                  {locale === 'es'
                    ? 'No encontramos ese negocio en nuestro directorio.'
                    : "We couldn't find that business in our directory."}
                </p>
                <button
                  onClick={startNewSubmission}
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  {locale === 'es' ? 'Agregar mi negocio' : 'Add my business'}
                </button>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-muted/10">
                  {results.map((biz) => (
                    <li key={biz.id}>
                      <button
                        onClick={() => selectBusiness(biz)}
                        className="w-full text-left px-4 py-3 hover:bg-primary/5 rounded-xl transition-colors"
                      >
                        <p className="font-semibold text-text">{biz.name}</p>
                        <p className="text-sm text-muted">{biz.address ?? `${biz.city}, ${biz.province}`}</p>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-muted/10">
                  <p className="text-xs text-muted mb-2">
                    {locale === 'es' ? '¿No ves tu negocio?' : "Don't see yours?"}
                  </p>
                  <button
                    onClick={startNewSubmission}
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {locale === 'es' ? 'Agregar negocio nuevo' : 'Submit a new business'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Step 2b: New business details ── */}
        {step === 'submit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading font-bold text-lg text-text">
                {locale === 'es' ? 'Detalles del negocio' : 'Business Details'}
              </p>
              <button
                type="button"
                onClick={() => { if (isNew) router.back(); else { setMode('claim'); setStep('select'); } }}
                className="text-sm text-primary hover:underline"
              >
                ← {locale === 'es' ? 'Atrás' : 'Back'}
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {newBiz.category === 'trabajos'
                    ? (locale === 'es' ? 'Título del trabajo *' : 'Job Title *')
                    : (locale === 'es' ? 'Nombre del negocio *' : 'Business Name *')}
                </span>
                <Input
                  value={newBiz.name}
                  onChange={(e) => setNewBiz((p) => ({ ...p, name: e.target.value }))}
                  placeholder={
                    newBiz.category === 'trabajos'
                      ? (locale === 'es' ? 'Ej. Desarrollador Web Full-Stack' : 'e.g. Full-Stack Web Developer')
                      : (locale === 'es' ? 'Nombre de tu negocio' : 'Your business name')
                  }
                  required
                  className="mt-1"
                />
                {newBiz.category !== 'trabajos' && (
                  <p className="text-xs text-muted mt-1">
                    {locale === 'es'
                      ? '💡 Usa el mismo nombre que aparece en tu perfil de Google Business y tu sitio web para mejorar tu SEO.'
                      : '💡 Use the same name that appears on your Google Business Profile and website for best SEO.'}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Categoría *' : 'Category *'}
                </span>
                <select
                  value={newBiz.category}
                  onChange={(e) => setNewBiz((p) => ({ ...p, category: e.target.value as string, subcategory: '' }))}
                  required
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">{locale === 'es' ? 'Selecciona una categoría' : 'Select a category'}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label.en}
                    </option>
                  ))}
                </select>
              </label>

              {newBiz.category && (() => {
                const subs = CATEGORIES.find((c) => c.id === newBiz.category)?.subcategories ?? [];
                if (!subs.length) return null;
                return (
                  <label className="block">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                      {locale === 'es' ? 'Subcategoría (opcional)' : 'Subcategory (optional)'}
                    </span>
                    <select
                      value={newBiz.subcategory}
                      onChange={(e) => setNewBiz((p) => ({ ...p, subcategory: e.target.value }))}
                      className="mt-1 w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">{locale === 'es' ? 'Selecciona una subcategoría' : 'Select a subcategory'}</option>
                      {subs.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.label.en}</option>
                      ))}
                    </select>
                  </label>
                );
              })()}

              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  City *
                </span>
                <Input
                  value={newBiz.city}
                  onChange={(e) => setNewBiz((p) => ({ ...p, city: e.target.value }))}
                  placeholder="e.g. Dallas, New York, Toronto"
                  required
                  className="mt-1"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">State / Province *</span>
                <select
                  value={newBiz.province}
                  onChange={(e) => setNewBiz((p) => ({ ...p, province: e.target.value }))}
                  required
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select state / province</option>
                  <optgroup label="United States">
                    {ALL_REGIONS.filter(r => r.country === 'US').map((r) => (
                      <option key={r.code} value={r.code}>{r.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Canada">
                    {ALL_REGIONS.filter(r => r.country === 'CA').map((r) => (
                      <option key={r.code} value={r.code}>{r.name}</option>
                    ))}
                  </optgroup>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Dirección (opcional)' : 'Address (optional)'}
                </span>
                <Input
                  value={newBiz.address}
                  onChange={(e) => setNewBiz((p) => ({ ...p, address: e.target.value }))}
                  placeholder="123 Main St"
                  className="mt-1"
                />
                <p className="text-xs text-muted mt-1">
                  {locale === 'es'
                    ? '📍 Asegúrate de que la dirección coincida con la de tu perfil de Google para mejorar tu posicionamiento.'
                    : '📍 Make sure the address matches your Google Business listing to improve your rankings.'}
                </p>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}
                </span>
                <Input
                  value={newBiz.phone}
                  onChange={(e) => setNewBiz((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 (416) 555-0123"
                  type="tel"
                  className="mt-1"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">Website (optional)</span>
                <Input
                  value={newBiz.website}
                  onChange={(e) => setNewBiz((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://mybusiness.ca"
                  type="url"
                  className="mt-1"
                />
              </label>

              {/* Social Media Links */}
              <div className="border-t border-muted/10 pt-3 mt-1">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                  {locale === 'es' ? 'Redes sociales (opcional)' : 'Social Media (optional)'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                    <Input
                      value={newBiz.instagram}
                      onChange={(e) => setNewBiz((p) => ({ ...p, instagram: e.target.value }))}
                      placeholder="@yourbusiness"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.83a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.24z" />
                    </svg>
                    <Input
                      value={newBiz.tiktok}
                      onChange={(e) => setNewBiz((p) => ({ ...p, tiktok: e.target.value }))}
                      placeholder="@yourbusiness"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                    <Input
                      value={newBiz.facebook}
                      onChange={(e) => setNewBiz((p) => ({ ...p, facebook: e.target.value }))}
                      placeholder="facebook.com/yourbusiness"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                    <Input
                      value={newBiz.linkedin}
                      onChange={(e) => setNewBiz((p) => ({ ...p, linkedin: e.target.value }))}
                      placeholder="linkedin.com/company/..."
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Google Maps URL */}
              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Enlace de Google Maps (opcional)' : 'Google Maps Link (optional)'}
                </span>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <Input
                    value={newBiz.google_maps_url}
                    onChange={(e) => setNewBiz((p) => ({ ...p, google_maps_url: e.target.value }))}
                    placeholder="https://maps.google.com/..."
                    type="url"
                    className="mt-1 pl-10"
                  />
                </div>
                <p className="text-xs text-muted mt-1">
                  {locale === 'es'
                    ? 'Busca tu negocio en Google Maps, haz clic en "Compartir" y pega el enlace aquí.'
                    : 'Search your business on Google Maps, click "Share" and paste the link here.'}
                </p>
              </label>

              {/* Keywords */}
              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Palabras clave para SEO (opcional)' : 'SEO Keywords (optional)'}
                </span>
                <Input
                  value={newBiz.keywords}
                  onChange={(e) => setNewBiz((p) => ({ ...p, keywords: e.target.value }))}
                  placeholder={
                    locale === 'es'
                      ? 'Ej. panadería latina, pasteles colombianos'
                      : 'e.g. Latin bakery, Colombian pastries'
                  }
                  className="mt-1"
                />
                <p className="text-xs text-muted mt-1">
                  {locale === 'es'
                    ? 'Separa las palabras clave con comas.'
                    : 'Separate keywords with commas.'}
                </p>
              </label>

              <label className="block">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                    {locale === 'es' ? 'Descripción (opcional)' : 'Description (optional)'}
                  </span>
                  {newBiz.name && newBiz.city && newBiz.category && (
                    <button
                      type="button"
                      onClick={handleGenerateDesc}
                      disabled={generatingDesc}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingDesc ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {locale === 'es' ? 'Generando…' : 'Generating…'}
                        </>
                      ) : (
                        <>
                          ✨ {locale === 'es' ? 'Que Sylvita lo escriba' : 'Let Sylvita write it'}
                        </>
                      )}
                    </button>
                  )}
                </div>
                <textarea
                  value={newBiz.description}
                  onChange={(e) => setNewBiz((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder={
                    newBiz.category === 'trabajos'
                      ? (locale === 'es' ? 'Describe el puesto, requisitos, etc.' : 'Describe the role, requirements, etc.')
                      : (locale === 'es' ? 'Describe tu negocio (en español o inglés)' : 'Describe your business (in English or Spanish)')
                  }
                  className="w-full rounded-xl border border-muted/20 bg-bg px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                {newBiz.name && newBiz.city && newBiz.category && !newBiz.description && (
                  <p className="text-xs text-muted mt-1">
                    {locale === 'es'
                      ? '💡 Haz clic en "Que Sylvita lo escriba" para generar una descripción con IA.'
                      : '💡 Click "Let Sylvita write it" above to generate a description with AI.'}
                  </p>
                )}
              </label>

              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Imagen / Logo (opcional)' : 'Logo / Brand Image (optional)'}
                </span>
                <label className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-muted/20 rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors">
                  {logoPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={logoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl" />
                      <span className="text-xs text-primary">
                        {locale === 'es' ? 'Cambiar imagen' : 'Change image'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-muted py-2">
                      <p className="text-sm font-medium">{locale === 'es' ? 'Subir imagen' : 'Upload image'}</p>
                      <p className="text-xs mt-0.5">PNG, JPG, WebP — max 5 MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                </label>
              </div>

              {EXPIRY_CATEGORIES.includes(newBiz.category) && (
                <label className="block">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                    {locale === 'es' ? 'Fecha de vencimiento *' : 'Listing Expiry Date *'}
                  </span>
                  <input
                    type="date"
                    value={newBiz.expires_at}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewBiz((p) => ({ ...p, expires_at: e.target.value }))}
                    required
                    className="mt-1 w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
              )}
            </div>

            <Button
              onClick={() => setStep('identity')}
              disabled={!newBiz.name || !newBiz.category || !newBiz.city}
              className="w-full"
            >
              {locale === 'es' ? 'Continuar →' : 'Continue →'}
            </Button>
          </div>
        )}

        {/* ── Step 3: Identity (name + role — no email/password needed) ── */}
        {step === 'identity' && (
          <form onSubmit={submitClaim} className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading font-bold text-lg text-text">
                {locale === 'es' ? 'Tus datos' : 'Your Information'}
              </p>
              <button
                type="button"
                onClick={() => setStep(mode === 'claim' ? 'select' : 'submit')}
                className="text-sm text-primary hover:underline"
              >
                ← {locale === 'es' ? 'Atrás' : 'Back'}
              </button>
            </div>

            {/* Summary of what's being submitted */}
            <div className="bg-primary/5 rounded-xl px-4 py-3 text-sm text-text">
              {mode === 'claim' && selected ? (
                <>
                  {locale === 'es' ? 'Reclamando: ' : 'Claiming: '}
                  <span className="font-semibold">{selected.name}</span> — {selected.city}, {selected.province}
                </>
              ) : (
                <>
                  {locale === 'es' ? 'Enviando: ' : 'Submitting: '}
                  <span className="font-semibold">{newBiz.name}</span> — {newBiz.city}
                </>
              )}
            </div>

            {/* Signed-in indicator */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>
                {locale === 'es' ? 'Sesión iniciada como ' : 'Signed in as '}
                <span className="font-semibold">{user.email}</span>
              </span>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Nombre completo *' : 'Full Name *'}
                </span>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={locale === 'es' ? 'Tu nombre completo' : 'Your full name'}
                  required
                  className="mt-1"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {locale === 'es' ? 'Tu cargo en el negocio *' : 'Your Role / Title *'}
                </span>
                <select
                  value={ownerTitle}
                  onChange={(e) => setOwnerTitle(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">{locale === 'es' ? 'Selecciona tu cargo' : 'Select your role'}</option>
                  {OWNER_TITLES.map((ot) => (
                    <option key={ot.value} value={ot.value}>
                      {locale === 'es' ? ot.es : ot.en}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting
                ? (locale === 'es' ? 'Enviando…' : 'Submitting…')
                : mode === 'claim'
                  ? (locale === 'es' ? 'Reclamar Negocio' : 'Claim Business')
                  : (locale === 'es' ? 'Enviar Negocio' : 'Submit Business')}
            </Button>
          </form>
        )}

        {/* ── Done ── */}
        {step === 'done' && (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <h2 className="font-heading font-bold text-2xl text-text">{t('submitted')}</h2>
            <p className="text-muted">
              {mode === 'submit'
                ? (locale === 'es'
                    ? 'Revisaremos tu negocio y lo publicaremos en 24 horas.'
                    : "We'll review your submission and make it live within 24 hours.")
                : t('submittedDesc')}
            </p>
            <Button onClick={() => router.push(lp(locale, '/dashboard'))} className="mt-4">
              {locale === 'es' ? 'Ir a mi Panel' : 'Go to Dashboard'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
