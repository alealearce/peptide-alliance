import { SuggestionWidget } from '@/components/home/SuggestionWidget';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: locale === 'es' ? '¿Falta algo? — InfoSylvita' : 'Something Missing? — InfoSylvita',
    description: locale === 'es'
      ? 'Sugiere una ciudad, categoría o tipo de negocio para el directorio InfoSylvita.'
      : 'Suggest a city, category, or business type for the InfoSylvita directory.',
    robots: { index: false, follow: true },
  };
}

export default function SuggestPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <span className="text-5xl">💡</span>
        <h1 className="text-3xl font-heading font-extrabold text-text mt-4">
          {locale === 'es' ? '¿Falta algo?' : 'Something missing?'}
        </h1>
        <p className="text-muted mt-3 text-base">
          {locale === 'es'
            ? 'Ayúdanos a crecer el directorio — sugiere una ciudad, categoría o tipo de negocio que quieras ver.'
            : 'Help us grow the directory — suggest a city, category, or business type you want to see.'}
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-muted/10 p-8">
        <SuggestionWidget />
      </div>
    </div>
  );
}
