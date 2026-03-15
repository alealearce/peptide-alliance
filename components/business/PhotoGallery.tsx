'use client';
import { useState } from 'react';
import { Upload } from 'lucide-react';
import type { BusinessPhoto } from '@/lib/supabase/types';

interface LogoUploadProps {
  businessId: string;
  currentLogoUrl?: string | null;
  locale: string;
}

export function PhotoGalleryUpload({ businessId, currentLogoUrl, locale }: LogoUploadProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(currentLogoUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEs = locale === 'es';

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check for instant feedback
    if (file.size > 5 * 1024 * 1024) {
      setError(isEs ? 'El archivo es demasiado grande. Máximo 5 MB.' : 'File too large. Maximum size is 5 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('business_id', businessId);

      const res = await fetch('/api/business/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? (isEs ? 'Error al subir la imagen' : 'Upload failed. Please try again.'));
      } else {
        setLogoUrl(json.url);
      }
    } catch (err) {
      console.error('[upload-logo] client error:', err);
      setError(isEs ? 'Error de conexión. Por favor intenta de nuevo.' : 'Connection error. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-heading font-bold text-sm text-text">
        {isEs ? 'Logo del negocio' : 'Business Logo'}
      </h3>

      <div className="flex items-center gap-5">
        {/* Logo preview */}
        <div className="w-24 h-24 rounded-2xl border-2 border-muted/20 overflow-hidden bg-bg flex items-center justify-center flex-shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <span className="text-3xl">🏪</span>
          )}
        </div>

        {/* Upload area */}
        <div className="flex-1">
          <label className="inline-flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm px-4 py-2 rounded-xl transition-colors">
            <Upload className="w-4 h-4" />
            {uploading
              ? (isEs ? 'Subiendo…' : 'Uploading…')
              : (isEs ? 'Subir logo' : 'Upload logo')}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>

          <p className="text-xs text-muted mt-2">
            {isEs
              ? 'PNG, JPG o WebP — máx 5 MB. Se mostrará en tu listado.'
              : 'PNG, JPG, or WebP — max 5 MB. Shown on your listing.'}
          </p>

          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
          {!error && logoUrl && !uploading && (
            <p className="text-xs text-green-600 mt-1">
              {isEs ? 'Logo guardado' : 'Logo saved'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* Display-only gallery for business detail page */
interface PhotoGalleryDisplayProps {
  photos: BusinessPhoto[];
}

export function PhotoGalleryDisplay({ photos }: PhotoGalleryDisplayProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <div>
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt="Business photo"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain"
          />
          <span className="absolute bottom-8 right-8 text-white/40 text-xs font-medium">
            infosylvita.com
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelected(photo.url)}
            className="relative aspect-square rounded-xl overflow-hidden border border-muted/10 hover:opacity-90 transition-opacity"
          >
            <img src={photo.url} alt={photo.photo_type} className="w-full h-full object-cover" />
            <span className="absolute bottom-1 right-1 text-white/50 text-[8px] font-medium drop-shadow-sm">
              infosylvita.com
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
