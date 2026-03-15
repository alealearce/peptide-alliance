'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

type SuggestionType = 'city' | 'category' | 'business_type' | 'other';

const TYPES: { id: SuggestionType; label: { en: string; es: string } }[] = [
  { id: 'city',          label: { en: 'City',          es: 'Ciudad'          } },
  { id: 'category',      label: { en: 'Category',      es: 'Categoría'       } },
  { id: 'business_type', label: { en: 'Business Type', es: 'Tipo de Negocio' } },
  { id: 'other',         label: { en: 'Other',         es: 'Otro'            } },
];

export function SuggestionWidget() {
  const locale = useLocale() as 'en' | 'es';
  const [type, setType]         = useState<SuggestionType>('city');
  const [content, setContent]   = useState('');
  const [email, setEmail]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  const placeholders: Record<SuggestionType, { en: string; es: string }> = {
    city:          { en: 'e.g. Scarborough, ON',              es: 'Ej. Scarborough, ON'              },
    category:      { en: 'e.g. Music Schools',                es: 'Ej. Escuelas de Música'           },
    business_type: { en: 'e.g. Latin Supermarkets',           es: 'Ej. Supermercados Latinos'        },
    other:         { en: 'Tell us what\'s missing…',          es: '¿Qué nos falta? Cuéntanos…'       },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content: content.trim(), email: email.trim() || undefined }),
    });

    if (res.ok) {
      setDone(true);
    } else {
      setError(locale === 'es' ? 'Algo salió mal. Intenta de nuevo.' : 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-primary" />
        <p className="font-heading font-bold text-text text-lg">
          {locale === 'es' ? '¡Gracias por tu sugerencia!' : 'Thanks for your suggestion!'}
        </p>
        <p className="text-muted text-sm">
          {locale === 'es'
            ? 'Lo revisaremos y lo tendremos en cuenta.'
            : "We'll review it and take it into account."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type chips */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              type === t.id
                ? 'bg-primary text-white border-primary'
                : 'bg-bg text-muted border-muted/20 hover:border-primary/40 hover:text-text'
            }`}
          >
            {t.label[locale]}
          </button>
        ))}
      </div>

      {/* Suggestion text */}
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholders[type][locale]}
        maxLength={500}
        required
        className="w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Optional email */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={locale === 'es' ? 'Tu email (opcional)' : 'Your email (optional)'}
        className="w-full px-4 py-2.5 rounded-xl border border-muted/20 bg-bg text-text text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {submitting
          ? (locale === 'es' ? 'Enviando…' : 'Sending…')
          : (locale === 'es' ? 'Enviar sugerencia' : 'Send suggestion')}
      </button>
    </form>
  );
}
