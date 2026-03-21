'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-7xl mb-6">😔</p>
      <h2 className="text-3xl font-heading font-extrabold text-text mb-3">
        Something went wrong
      </h2>
      <p className="text-muted max-w-sm mb-8">
        Something went wrong. Try refreshing or come back later.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
