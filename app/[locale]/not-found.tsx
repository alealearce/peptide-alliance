import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <Image
        src="/images/mascots/peptidealliancelogo.png"
        alt="Peptide Alliance"
        width={100}
        height={100}
        className="rounded-full object-cover mb-6 opacity-60"
      />
      <h1 className="text-6xl font-heading font-extrabold text-text mb-3">404</h1>
      <h2 className="text-2xl font-heading font-bold text-text mb-3">
        Page not found
      </h2>
      <p className="text-muted max-w-md mb-8">
        We couldn&apos;t find what you&apos;re looking for. The page may have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
      >
        Back to Home →
      </Link>
    </div>
  );
}
