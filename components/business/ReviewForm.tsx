'use client';
import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface ReviewFormProps {
  businessId: string;
  locale: string;
}

export function ReviewForm({ businessId, locale }: ReviewFormProps) {
  const supabase = createBrowserClient();
  const isEs = locale === 'es';
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(isEs ? 'Por favor selecciona una calificación.' : 'Please select a rating.');
      return;
    }
    setSubmitting(true);
    setError('');

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setShowAuth(true);
      setSubmitting(false);
      return;
    }

    await submitReview(user.id);
  };

  const handleAuth = async () => {
    setSubmitting(true);
    setError('');

    // Try sign in first
    const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });

    let userId: string | null = null;
    if (signInData?.user) {
      userId = signInData.user.id;
    } else {
      // Sign up
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (signUpData?.user) {
        userId = signUpData.user.id;
      } else {
        setError(signUpErr?.message ?? 'Authentication failed');
        setSubmitting(false);
        return;
      }
    }

    if (userId) {
      await submitReview(userId);
    }
  };

  const submitReview = async (userId: string) => {
    const { error: reviewErr } = await supabase.from('reviews').insert({
      business_id: businessId,
      user_id: userId,
      rating,
      comment: comment.trim() || null,
    });

    if (reviewErr) {
      if (reviewErr.code === '23505') {
        setError(isEs ? 'Ya dejaste una reseña para este negocio.' : 'You already left a review for this business.');
      } else {
        setError(isEs ? 'Error al enviar la reseña.' : 'Failed to submit review.');
      }
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
        {isEs ? '¡Gracias por tu reseña!' : 'Thank you for your review!'}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-muted/10 p-4 space-y-3">
      <p className="font-heading font-bold text-sm text-text">
        {isEs ? 'Deja una reseña' : 'Leave a Review'}
      </p>

      {/* Star rating selector */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setRating(i + 1)}
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
            aria-label={`${i + 1} star${i + 1 !== 1 ? 's' : ''}`}
          >
            <svg
              className={`w-7 h-7 transition-colors ${
                i < (hoverRating || rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-muted/30 fill-muted/10'
              }`}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-muted ml-2">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={isEs ? 'Cuéntanos tu experiencia (opcional)' : 'Share your experience (optional)'}
        rows={3}
        className="w-full rounded-xl border border-muted/20 bg-bg px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />

      {/* Auth form — shown when user not logged in */}
      {showAuth && (
        <div className="space-y-2 border-t border-muted/10 pt-3">
          <p className="text-xs text-muted">
            {isEs ? 'Inicia sesión o crea una cuenta para dejar tu reseña' : 'Sign in or create an account to leave your review'}
          </p>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isEs ? 'Tu nombre' : 'Your name'}
            className="w-full rounded-xl border border-muted/20 bg-bg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-muted/20 bg-bg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEs ? 'Contraseña (mín. 8 caracteres)' : 'Password (min 8 chars)'}
            minLength={8}
            className="w-full rounded-xl border border-muted/20 bg-bg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button onClick={handleAuth} disabled={submitting || !email || !password} className="w-full">
            {submitting ? (isEs ? 'Enviando…' : 'Submitting…') : (isEs ? 'Enviar reseña' : 'Submit Review')}
          </Button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {!showAuth && (
        <Button onClick={handleSubmit} disabled={submitting || rating === 0} className="w-full">
          {submitting ? (isEs ? 'Enviando…' : 'Submitting…') : (isEs ? 'Enviar reseña' : 'Submit Review')}
        </Button>
      )}
    </div>
  );
}
