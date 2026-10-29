'use client';

import { ExternalLink, FolderOpen, Inbox, LogOut, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: 'Quote requests', short: 'Requests', icon: Inbox, match: (p: string) => p === '/admin' || p.startsWith('/admin/requests') },
  { href: '/admin/projects', label: 'Portfolio', short: 'Portfolio', icon: FolderOpen, match: (p: string) => p.startsWith('/admin/projects') },
  { href: '/admin/faqs', label: 'FAQs', short: 'FAQs', icon: MessageCircleQuestion, match: (p: string) => p.startsWith('/admin/faqs') },
];

function Wordmark() {
  return (
    <Link href="/admin" className="flex items-baseline gap-1.5 text-lg font-bold tracking-tight text-navy">
      <span>
        Plexio<span className="text-brand">hub</span>
      </span>
      <span className="text-sm font-medium text-ink-muted">Admin</span>
    </Link>
  );
}

export function AdminNav({ newCount, email, signOutAction }: { newCount: number; email: string; signOutAction: () => Promise<void> }) {
  const pathname = usePathname() ?? '/admin';

  const badge = (n: number) =>
    n > 0 ? (
      <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white" aria-label={`${n} new`}>
        {n}
      </span>
    ) : null;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden border-r border-line bg-white lg:block">
        <aside className="sticky top-0 flex h-screen flex-col px-4 py-6">
          <div className="px-2">
            <Wordmark />
          </div>
          <nav aria-label="Admin" className="mt-8 space-y-1">
            {ITEMS.map((item) => {
              const active = item.match(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? 'bg-surface text-navy' : 'text-ink-muted hover:bg-surface hover:text-navy'
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] ${active ? 'text-brand' : ''}`} strokeWidth={1.9} aria-hidden />
                  {item.label}
                  {item.href === '/admin' && badge(newCount)}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-1 border-t border-line pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-muted hover:bg-surface hover:text-navy"
            >
              <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden />
              View website
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-muted hover:bg-surface hover:text-navy"
              >
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden />
                Sign out
              </button>
            </form>
            <p className="truncate px-3 pt-2 text-xs text-ink-muted" title={email}>
              {email}
            </p>
          </div>
        </aside>
      </div>

      {/* Phone and tablet: top bar with tabs */}
      <header className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Wordmark />
          <div className="flex items-center gap-1">
            <Link href="/" target="_blank" className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-navy" aria-label="View website">
              <ExternalLink className="h-5 w-5" strokeWidth={1.9} />
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-navy" aria-label="Sign out">
                <LogOut className="h-5 w-5" strokeWidth={1.9} />
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto px-3 pb-2 sm:px-5">
          {ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                  active ? 'bg-surface text-navy' : 'text-ink-muted hover:text-navy'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-brand' : ''}`} strokeWidth={1.9} aria-hidden />
                {item.short}
                {item.href === '/admin' && newCount > 0 && (
                  <span className="rounded-full bg-brand px-1.5 text-xs font-semibold text-white" aria-label={`${newCount} new`}>
                    {newCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
