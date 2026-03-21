'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase/client';
import { lp } from '@/lib/utils/locale';

export default function ResetPasswordPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient();

  // New flow: token_hash arrives directly in URL (email template uses {{ .TokenHash }})
  // This prevents email-scanner pre-fetches from consuming the token at Supabase's
  // /auth/v1/verify endpoint before the user actually clicks.
  const tokenHash = searchParams.get('token_hash');
  const type      = searchParams.get('type') ?? 'recovery';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState('');
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    if (tokenHash) {
      // Token in URL — show form immediately, verify only on submit
      setReady(true);
    } else {
      // Fallback: check for an existing session (old callback-based flow)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.replace(lp(locale, '/forgot-password?error=link_expired'));
        } else {
          setReady(true);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // If we have a token_hash, verify it now (first real user interaction)
    if (tokenHash) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as 'recovery',
      });
      if (verifyError) {
        setLoading(false);
        setError('This reset link has expired or already been used. Please request a new one.');
        return;
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push(lp(locale, '/dashboard')), 2000);
  };

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Verifying reset link…</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-heading font-bold text-text">Password updated!</h1>
          <p className="text-muted">
            Your password has been changed. Redirecting you to your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={lp(locale, '/')} className="font-heading font-extrabold text-2xl text-primary">
            Peptide Alliance
          </Link>
          <h1 className="text-2xl font-heading font-bold text-text mt-4">
            Set a new password
          </h1>
          <p className="text-muted mt-2 text-sm">
            Choose a strong password with at least 8 characters.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-muted/10 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              minLength={8}
              required
              autoFocus
            />
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              minLength={8}
              required
            />
            {error && (
              <div className="text-sm text-red-500 space-y-1">
                <p>{error}</p>
                {error.includes('expired') && (
                  <Link
                    href={lp(locale, '/forgot-password')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Request a new reset link →
                  </Link>
                )}
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
