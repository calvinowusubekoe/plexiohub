import type { Metadata } from 'next';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center text-2xl font-bold tracking-tight text-navy">
          Plexio<span className="text-brand">hub</span>
        </Link>
        <div className="mt-8 rounded-2xl border border-line bg-white p-7 sm:p-8">
          <h1 className="text-xl font-bold text-navy">Sign in to admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Manage quote requests, your portfolio and FAQs.</p>
          {isSupabaseConfigured() ? (
            <LoginForm />
          ) : (
            <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
              Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the
              environment (see README).
            </p>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-ink-muted">
          <Link href="/" className="font-semibold hover:text-navy">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
