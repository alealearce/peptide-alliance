'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UpgradeBanner } from '@/components/premium/UpgradeBanner';
import { createBrowserClient } from '@/lib/supabase/client';
import { lp } from '@/lib/utils/locale';
import type { Business, Lead, Review } from '@/lib/supabase/types';
import type { User } from '@supabase/supabase-js';
import { Mail, Phone, Clock, Instagram, Facebook, Linkedin } from 'lucide-react';
import { PhotoGalleryUpload } from '@/components/business/PhotoGallery';
import { ReviewManagement } from '@/components/business/ReviewManagement';

interface Props {
  user: User;
  businesses: Business[];
  leads: Lead[];
  reviews: Record<string, Review[]>;
  locale: string;
}

export function DashboardClient({ user, businesses, leads, reviews, locale }: Props) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const supabase = createBrowserClient();

  const [activeBiz, setActiveBiz] = useState<Business | null>(businesses[0] ?? null);
  const EXPIRY_CATEGORIES = ['eventos', 'trabajos'];

  const toDateInput = (iso: string | null | undefined) => {
    if (!iso) return '';
    return iso.split('T')[0];
  };

  const [editName, setEditName] = useState(activeBiz?.name ?? '');
  const [editDescEn, setEditDescEn] = useState(activeBiz?.description_en ?? '');

  const [editPhone, setEditPhone] = useState(activeBiz?.phone ?? '');
  const [editWebsite, setEditWebsite] = useState(activeBiz?.website ?? '');
  const [editInstagram, setEditInstagram] = useState(activeBiz?.instagram ?? '');
  const [editTiktok, setEditTiktok] = useState(activeBiz?.tiktok ?? '');
  const [editFacebook, setEditFacebook] = useState(activeBiz?.facebook ?? '');
  const [editLinkedin, setEditLinkedin] = useState(activeBiz?.linkedin ?? '');
  const [editGoogleMaps, setEditGoogleMaps] = useState(activeBiz?.google_maps_url ?? '');
  const [editKeywords, setEditKeywords] = useState(activeBiz?.keywords?.join(', ') ?? '');
  const [editExpiresAt, setEditExpiresAt] = useState(toDateInput(activeBiz?.expires_at));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(lp(locale, '/'));
  };

  const handleSave = async () => {
    if (!activeBiz) return;
    setSaving(true);
    const updatePayload: Record<string, unknown> = {
      name: editName,
      description_en: editDescEn,

      phone: editPhone,
      website: editWebsite,
      instagram: editInstagram || null,
      tiktok: editTiktok || null,
      facebook: editFacebook || null,
      linkedin: editLinkedin || null,
      google_maps_url: editGoogleMaps || null,
      keywords: editKeywords ? editKeywords.split(',').map((k: string) => k.trim()).filter(Boolean) : null,
    };

    if (EXPIRY_CATEGORIES.includes(activeBiz.category) && editExpiresAt) {
      updatePayload.expires_at = new Date(editExpiresAt + 'T23:59:59').toISOString();
    }

    await supabase
      .from('businesses')
      .update(updatePayload)
      .eq('id', activeBiz.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

  };

  const bizLeads = leads.filter((l) => l.business_id === activeBiz?.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm">{user.email}</p>
        <button
          onClick={handleSignOut}
          className="text-sm text-muted hover:text-red-500 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Business selector */}
      {businesses.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {businesses.map((biz) => (
            <button
              key={biz.id}
              onClick={() => {
                setActiveBiz(biz);
                setEditName(biz.name);
                setEditDescEn(biz.description_en ?? '');

                setEditPhone(biz.phone ?? '');
                setEditWebsite(biz.website ?? '');
                setEditInstagram(biz.instagram ?? '');
                setEditTiktok(biz.tiktok ?? '');
                setEditFacebook(biz.facebook ?? '');
                setEditLinkedin(biz.linkedin ?? '');
                setEditGoogleMaps(biz.google_maps_url ?? '');
                setEditKeywords(biz.keywords?.join(', ') ?? '');
                setEditExpiresAt(toDateInput(biz.expires_at));
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                activeBiz?.id === biz.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-muted/30 text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {biz.name}
            </button>
          ))}
        </div>
      )}

      {activeBiz ? (
        <div className="space-y-6">
          {/* Get Verified Banner — shown only for non-verified free listings */}
          {!activeBiz.is_verified && activeBiz.subscription_tier === 'free' && (
            <UpgradeBanner businessId={activeBiz.id} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit form */}
            <div className="bg-card rounded-2xl border border-muted/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-lg text-text">{t('editListing')}</h2>
                {activeBiz.is_verified && <Badge variant="verified">Verified</Badge>}
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Business Name</span>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Description (English)</span>
                  <textarea
                    value={editDescEn}
                    onChange={(e) => setEditDescEn(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-muted/20 bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Phone</span>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="mt-1" type="tel" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Website</span>
                  <Input value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} className="mt-1" type="url" />
                </label>

                {/* Social Media */}
                <div className="border-t border-muted/10 pt-3">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Social Media</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                      <Input value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} placeholder="@yourbusiness" className="pl-10" />
                    </div>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.83a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.24z"/></svg>
                      <Input value={editTiktok} onChange={(e) => setEditTiktok(e.target.value)} placeholder="@yourbusiness" className="pl-10" />
                    </div>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                      <Input value={editFacebook} onChange={(e) => setEditFacebook(e.target.value)} placeholder="facebook.com/..." className="pl-10" />
                    </div>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                      <Input value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} placeholder="linkedin.com/company/..." className="pl-10" />
                    </div>
                  </div>
                </div>

                {/* Google Maps URL */}
                <label className="block">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Google Maps Link</span>
                  <Input value={editGoogleMaps} onChange={(e) => setEditGoogleMaps(e.target.value)} placeholder="https://maps.google.com/..." className="mt-1" type="url" />
                </label>

                {/* Keywords */}
                <label className="block">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">SEO Keywords</span>
                  <Input value={editKeywords} onChange={(e) => setEditKeywords(e.target.value)} placeholder="Latin bakery, Colombian pastries" className="mt-1" />
                  <p className="text-xs text-muted mt-1">Separate with commas</p>
                </label>

                {/* Expiry date — only for jobs & events */}
                {EXPIRY_CATEGORIES.includes(activeBiz.category) && (
                  <div>
                    <label className="block">
                      <span className="text-xs font-semibold text-muted uppercase tracking-wide">Listing Expiry Date</span>
                      {activeBiz.expires_at && new Date(activeBiz.expires_at) < new Date() && (
                        <span className="ml-2 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                          Expired
                        </span>
                      )}
                      {activeBiz.expires_at && new Date(activeBiz.expires_at) >= new Date() && (
                        <span className="ml-2 text-xs text-muted">
                          — expires {new Date(activeBiz.expires_at).toLocaleDateString()}
                        </span>
                      )}
                      <input
                        type="date"
                        value={editExpiresAt}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEditExpiresAt(e.target.value)}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </label>
                    <p className="text-xs text-muted mt-1">
                      Extend your listing by choosing a future date and saving.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : saved ? `✓ ${t('saved')}` : t('save')}
                </Button>
                {!activeBiz.is_verified && (
                  <Button variant="ghost" size="sm" onClick={() => router.push(lp(locale, '/upgrade'))}>
                    {t('requestVerified')}
                  </Button>
                )}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-card rounded-2xl border border-muted/10 p-6">
              <PhotoGalleryUpload
                businessId={activeBiz.id}
                currentLogoUrl={activeBiz.logo_url}
                locale={locale}
              />
            </div>

            {/* Reviews Management */}
            <div className="bg-card rounded-2xl border border-muted/10 p-6">
              <h2 className="font-heading font-bold text-lg text-text mb-4">
                {locale === 'es' ? 'Reseñas' : 'Reviews'} ({(reviews[activeBiz.id] ?? []).length})
              </h2>
              <ReviewManagement
                businessId={activeBiz.id}
                reviews={reviews[activeBiz.id] ?? []}
                canManage={true}
                locale={locale}
              />
            </div>

            {/* Leads */}
            <div className="bg-card rounded-2xl border border-muted/10 p-6">
              <h2 className="font-heading font-bold text-lg text-text mb-4">
                {t('leads')} ({bizLeads.length})
              </h2>
              {bizLeads.length === 0 ? (
                <p className="text-muted text-sm text-center py-8">{t('noLeads')}</p>
              ) : (
                <ul className="divide-y divide-muted/10 space-y-0">
                  {bizLeads.map((lead) => (
                    <li key={lead.id} className="py-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-text text-sm">{lead.user_name}</p>
                          <a
                            href={`mailto:${lead.user_email}`}
                            className="text-xs text-primary flex items-center gap-1 hover:underline"
                          >
                            <Mail className="w-3 h-3" /> {lead.user_email}
                          </a>
                          {lead.user_phone && (
                            <a
                              href={`tel:${lead.user_phone}`}
                              className="text-xs text-muted flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" /> {lead.user_phone}
                            </a>
                          )}
                        </div>
                        <span className="text-xs text-muted flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {lead.message && (
                        <p className="text-sm text-text/70 mt-2 bg-bg rounded-lg px-3 py-2">
                          {lead.message}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-muted">
          <p className="text-5xl mb-4">🏢</p>
          <p className="font-semibold text-lg">No businesses claimed yet.</p>
          <p className="mt-2 text-sm">
            <a href={lp(locale, '/claim')} className="text-primary hover:underline">
              Claim your first listing →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
