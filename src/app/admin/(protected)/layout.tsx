import Link from 'next/link';
import { countNewQuotes } from '@/lib/data/quotes';
import { requireAdmin, signOut } from './actions';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newCount = await countNewQuotes().catch(() => 0);

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="text-lg font-bold">
            Plexio<span className="text-brand">hub</span> <span className="font-medium text-navy/70">Admin</span>
          </Link>
          <nav aria-label="Admin" className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <Link href="/admin" className="inline-flex items-center gap-1.5 hover:text-brand">
              Requests
              {newCount > 0 && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white" aria-label={`${newCount} new`}>
                  {newCount}
                </span>
              )}
            </Link>
            <Link href="/admin/projects" className="hover:text-brand">Projects</Link>
            <Link href="/admin/faqs" className="hover:text-brand">FAQs</Link>
            <Link href="/" target="_blank" className="text-navy/70 hover:text-brand">View site</Link>
            <form action={signOut}>
              <button type="submit" className="text-navy/70 hover:text-red-600">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </>
  );
}
