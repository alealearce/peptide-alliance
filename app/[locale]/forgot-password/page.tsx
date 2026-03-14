'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase/client';
import { lp } from '@/lib/utils/locale';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const supabase = createBrowserClient();

  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    // Supabase sends a recovery email; after clicking it the user
    // lands on /api/auth/callback which exchanges the token and
    // redirects to /[locale]/reset-password where they set a new password.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/api/auth/callback?next=${lp(locale, '/reset-password')}`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="text-5xl">📧</div>
          <h1 className="text-2xl font-heading font-bold text-text">Check your email</h1>
          <p className="text-muted">
            We sent a password reset link to <strong>{email}</strong>.
            Click the link in the email to set a new password.
          </p>
          <p className="text-sm text-muted">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSent(false)}
              className="text-primary font-semibold hover:underline"
            >
              try again
            </button>
            .
          </p>
          <Link
            href={lp(locale, '/login')}
            className="block text-sm text-muted hover:text-primary transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={lp(locale, '/')} className="font-heading font-extrabold text-2xl text-primary">
            InfoSylvita
          </Link>
          <h1 className="text-2xl font-heading font-bold text-text mt-4">
            Forgot your password?
          </h1>
          <p className="text-muted mt-2 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-muted/10 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted">
            <Link
              href={lp(locale, '/login')}
              className="text-primary font-semibold hover:underline"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
