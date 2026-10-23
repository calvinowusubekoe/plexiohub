'use client';

import { ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { serviceNames } from '@/lib/quote/format';
import { QUOTE_STATUSES, type QuoteStatus } from '@/lib/data/quote-status';
import type { QuoteRow } from '@/lib/data/quotes';
import { STATUS_LABELS, StatusBadge, timeAgo } from './StatusBadge';
import { EmptyState, field } from './ui';

export function RequestTable({ rows }: { rows: QuoteRow[] }) {
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const count = (s: QuoteStatus | 'all') => (s === 'all' ? rows.length : rows.filter((r) => r.status === s).length);

  const q = query.trim().toLowerCase();
  const shown = [...rows]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .filter((r) => filter === 'all' || r.status === filter)
    .filter((r) => !q || r.name.toLowerCase().includes(q) || (r.business_name ?? '').toLowerCase().includes(q));

  if (rows.length === 0) {
    return (
      <EmptyState title="No quote requests yet.">
        New requests from the website&apos;s quote form will appear here.
      </EmptyState>
    );
  }

  return (
    <div>
      {/* Status tiles: counts at a glance, and the filter */}
      <div role="group" aria-label="Filter by status" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {(['all', ...QUOTE_STATUSES] as const).map((s) => {
          const active = filter === s;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(s)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/30'
              }`}
            >
              <span className={`block text-sm font-medium ${active ? 'text-white/80' : 'text-ink-muted'}`}>{s === 'all' ? 'All' : STATUS_LABELS[s]}</span>
              <span className="mt-0.5 block text-2xl font-bold tabular-nums">{count(s)}</span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 mt-[3px] h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <input
          type="search"
          aria-label="Search requests by client or business"
          placeholder="Search by client or business"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${field} pl-9`}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <div className="hidden grid-cols-[1.4fr_1.8fr_1fr_0.8fr_6.5rem_1.25rem] gap-4 border-b border-line bg-surface px-5 py-3 text-xs font-semibold text-ink-muted md:grid">
          <span>Client</span>
          <span>Services</span>
          <span>Budget</span>
          <span>Received</span>
          <span>Status</span>
          <span />
        </div>
        {shown.length === 0 ? (
          <p className="px-5 py-12 text-center text-ink-muted">No requests match. Try another status or search.</p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((r) => (
              <li key={r.id} className="group relative grid gap-1 px-5 py-4 transition-colors hover:bg-surface/60 md:grid-cols-[1.4fr_1.8fr_1fr_0.8fr_6.5rem_1.25rem] md:items-center md:gap-4">
                <div className="min-w-0">
                  <Link href={`/admin/requests/${r.id}`} className="font-semibold text-navy after:absolute after:inset-0">
                    {r.name}
                  </Link>
                  {r.business_name && <p className="truncate text-sm text-ink-muted">{r.business_name}</p>}
                </div>
                <p className="text-sm text-navy">{serviceNames(r.services)}</p>
                <p className="text-sm tabular-nums text-navy">{r.budget_range ?? 'Not given'}</p>
                <time dateTime={r.created_at} className="text-sm text-ink-muted">
                  {timeAgo(r.created_at)}
                </time>
                <div className="mt-1 md:mt-0">
                  <StatusBadge status={r.status} />
                </div>
                <ChevronRight className="hidden h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 md:block" aria-hidden />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
