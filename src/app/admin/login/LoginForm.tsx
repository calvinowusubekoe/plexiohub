'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { btn, field, label } from '@/components/admin/ui';
import { createBrowserClient } from '@/lib/supabase/browser';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const { error: signInError } = await createBrowserClient().auth.signInWithPassword({
        email: String(form.get('email')),
        password: String(form.get('password')),
      });
      if (signInError) {
        setError('Email or password is incorrect.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={field} />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={`${btn.primary} w-full py-3`}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
