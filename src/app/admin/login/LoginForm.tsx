'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/browser';

const input = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    const { error: signInError } = await createBrowserClient().auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });
    setBusy(false);
    if (signInError) {
      setError('Email or password is incorrect.');
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={input} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-lg bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-70">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
