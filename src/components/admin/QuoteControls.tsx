'use client';

import { useState, useTransition } from 'react';
import { saveQuoteNotes, updateQuoteStatus } from '@/app/admin/(protected)/actions';
import { QUOTE_STATUSES, type QuoteStatus } from '@/lib/data/quote-status';
import { STATUS_LABELS } from './StatusBadge';

export function QuoteControls({ id, status, notes }: { id: string; status: QuoteStatus; notes: string }) {
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState(notes);
  const [message, setMessage] = useState('');

  const run = (fn: () => Promise<void>, done: string) =>
    start(async () => {
      try {
        await fn();
        setMessage(done);
      } catch {
        setMessage('Could not save. Please try again.');
      }
    });

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <label htmlFor="status" className="text-sm font-medium">Status</label>
        <select
          id="status"
          defaultValue={status}
          disabled={pending}
          onChange={(e) => run(() => updateQuoteStatus(id, e.target.value as QuoteStatus), 'Status updated.')}
          className="mt-1 block w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2.5"
        >
          {QUOTE_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="text-sm font-medium">Internal notes</label>
        <textarea id="notes" rows={5} maxLength={5000} value={draft} onChange={(e) => setDraft(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" />
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => saveQuoteNotes(id, draft), 'Notes saved.')}
          className="mt-2 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark disabled:opacity-70"
        >
          Save notes
        </button>
      </div>
      <p aria-live="polite" className="text-sm text-navy/70">{pending ? 'Saving…' : message}</p>
    </div>
  );
}
