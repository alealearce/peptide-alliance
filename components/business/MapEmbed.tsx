'use client';

interface Props {
  lat: number;
  lng: number;
  name: string;
  placeId?: string | null;
}

export function MapEmbed({ lat, lng, name, placeId }: Props) {
  const placeSrc = placeId
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''}&q=place_id:${placeId}`
    : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''}&q=${encodeURIComponent(name)}&center=${lat},${lng}&zoom=15`;

  const fallbackHref = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-muted/10 h-64 relative bg-muted/10">
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
        <iframe
          title={`Map of ${name}`}
          src={placeSrc}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <a
          href={fallbackHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-full text-muted hover:text-primary transition-colors"
        >
          📍 View on Google Maps
        </a>
      )}
    </div>
  );
}
