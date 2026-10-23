import type { Metadata } from 'next';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-xl font-bold">
          Plexio<span className="text-brand">hub</span> <span className="font-medium text-navy/50">Admin</span>
        </p>
        {isSupabaseConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the environment (see README).
          </p>
        )}
      </div>
    </div>
  );
}
