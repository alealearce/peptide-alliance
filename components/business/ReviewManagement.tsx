'use client';
import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import type { Review } from '@/lib/supabase/types';
import { Trash2, MessageSquare } from 'lucide-react';

interface ReviewManagementProps {
  businessId: string;
  reviews: Review[];
  canManage: boolean; // premium or featured
  locale: string;
}

export function ReviewManagement({ reviews: initialReviews, canManage, locale }: ReviewManagementProps) {
  const supabase = createBrowserClient();
  const isEs = locale === 'es';
  const [reviews, setReviews] = useState(initialReviews);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setSaving(true);
    await supabase
      .from('reviews')
      .update({
        owner_reply: replyText.trim(),
        owner_replied_at: new Date().toISOString(),
      })
      .eq('id', reviewId);

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, owner_reply: replyText.trim(), owner_replied_at: new Date().toISOString() } : r
      )
    );
    setReplyingTo(null);
    setReplyText('');
    setSaving(false);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm(isEs ? '¿Eliminar esta reseña?' : 'Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-muted text-sm">
        {isEs ? 'No hay reseñas aún.' : 'No reviews yet.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-bg rounded-xl border border-muted/10 p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">
                {review.reviewer_name ?? 'Anonymous'}
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < review.rating ? '' : 'opacity-20'}`}>🫓</span>
                ))}
              </div>
            </div>
            <span className="text-xs text-muted">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>

          {review.comment && (
            <p className="text-sm text-text/80 mb-2">{review.comment}</p>
          )}

          {review.owner_reply && (
            <div className="ml-3 pl-3 border-l-2 border-primary/30 mb-2">
              <p className="text-xs font-semibold text-primary">{isEs ? 'Tu respuesta' : 'Your reply'}</p>
              <p className="text-sm text-text/70">{review.owner_reply}</p>
            </div>
          )}

          {canManage && (
            <div className="flex items-center gap-2 mt-2">
              {!review.owner_reply && (
                <button
                  onClick={() => { setReplyingTo(replyingTo === review.id ? null : review.id); setReplyText(''); }}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  {isEs ? 'Responder' : 'Reply'}
                </button>
              )}
              <button
                onClick={() => handleDelete(review.id)}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                {isEs ? 'Eliminar' : 'Delete'}
              </button>
            </div>
          )}

          {replyingTo === review.id && (
            <div className="mt-2 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isEs ? 'Escribe tu respuesta...' : 'Write your reply...'}
                rows={2}
                className="w-full rounded-lg border border-muted/20 bg-white px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={() => handleReply(review.id)} disabled={saving || !replyText.trim()} size="sm">
                  {saving ? '...' : (isEs ? 'Enviar' : 'Send')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                  {isEs ? 'Cancelar' : 'Cancel'}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {!canManage && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          {isEs
            ? 'Actualiza a Premium o Destacado para responder y gestionar reseñas.'
            : 'Upgrade to Premium or Featured to reply to and manage reviews.'}
        </div>
      )}
    </div>
  );
}
