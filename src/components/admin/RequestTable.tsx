'use client';

import Link from 'next/link';
import { useState } from 'react';
import { serviceNames } from '@/lib/quote/format';
import { QUOTE_STATUSES, type QuoteStatus } from '@/lib/data/quote-status';
import type { QuoteRow } from '@/lib/data/quotes';
import { STATUS_LABELS, StatusBadge, timeAgo } from './StatusBadge';

export function RequestTable({ rows }: { rows: QuoteRow[] }) {
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all');
  const sorted = [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const shown = filter === 'all' ? sorted : sorted.filter((r) => r.status === filter);
  const count = (s: QuoteStatus | 'all') => (s === 'all' ? rows.length : rows.filter((r) => r.status === s).length);

  return (
    <div>
      <div role="group" aria-label="Filter by status" className="mb-5 flex flex-wrap gap-2">
        {(['all', ...QUOTE_STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${filter === s ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white hover:border-brand'}`}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]} ({count(s)})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-navy/60">
          {rows.length === 0 ? 'No quote requests yet.' : 'No requests with this status.'}
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {shown.map((r) => (
            <li key={r.id} className="grid gap-1 p-4 sm:grid-cols-[1.5fr_2fr_1fr_auto] sm:items-center sm:gap-4">
              <div>
                <Link href={`/admin/requests/${r.id}`} className="font-semibold text-navy hover:text-brand">
                  {r.name}
                </Link>
                {r.business_name && <p className="text-xs text-navy/60">{r.business_name}</p>}
              </div>
              <p className="text-sm text-navy/75">{serviceNames(r.services)}</p>
              <p className="text-sm text-navy/75">{r.budget_range ?? '—'}</p>
              <div className="flex items-center gap-3 sm:justify-end">
                <StatusBadge status={r.status} />
                <time dateTime={r.created_at} className="text-xs text-navy/50">
                  {timeAgo(r.created_at)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
