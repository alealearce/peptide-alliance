'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { lp } from '@/lib/utils/locale';

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  // ?next= lets other pages redirect here and bounce back after login
  const nextPath = searchParams.get('next') ?? lp(locale, '/dashboard');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [signupConfirmed, setSignupConfirmed] = useState(false);

  const supabase = createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push(nextPath);
    } else {
      const callbackUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callbackUrl },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSignupConfirmed(true);
      setLoading(false);
    }
  };

  // ── Confirmation screen after signup ──────────────────────────────────────
  if (signupConfirmed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">📬</div>
          <h1 className="text-2xl font-heading font-bold text-text mb-3">
            Check your inbox!
          </h1>
          <p className="text-muted mb-2">We sent a confirmation link to</p>
          <p className="font-semibold text-text mb-6">{email}</p>
          <p className="text-sm text-muted mb-8">
            Click the link in the email to activate your account, then come back here to sign in.
            If you don&apos;t see it, check your spam folder.
          </p>
          <Button variant="secondary" onClick={() => { setSignupConfirmed(false); setMode('login'); setPassword(''); }}>
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // ── Login / Signup form ───────────────────────────────────────────────────
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={lp(locale, '/')} className="font-heading font-extrabold text-2xl text-primary">
            InfoSylvita
          </Link>
          <h1 className="text-2xl font-heading font-bold text-text mt-4">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>

        <div className="bg-card rounded-2xl border border-muted/10 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              minLength={8}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            {mode === 'login' && (
              <div className="text-center">
                <Link
                  href={lp(locale, '/forgot-password')}
                  className="text-sm text-muted hover:text-primary transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>

          <div className="mt-4 text-center text-sm text-muted">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary font-semibold hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
