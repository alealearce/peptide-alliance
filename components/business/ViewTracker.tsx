'use client';
import { useEffect } from 'react';

// Fires a view-tracking POST once per mount (client-side only).
// Used on ISR business profile pages so every real page visit is counted
// regardless of the ISR cache.
export function ViewTracker({ businessId }: { businessId: string }) {
  useEffect(() => {
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    }).catch(() => {
      // Non-critical — silently ignore tracking failures
    });
  }, [businessId]);

  return null; // Renders nothing
}
