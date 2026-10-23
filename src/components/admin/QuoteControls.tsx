'use client';

import { useState, useTransition } from 'react';
import { saveQuoteNotes, updateQuoteStatus } from '@/app/admin/(protected)/actions';
import { QUOTE_STATUSES, type QuoteStatus } from '@/lib/data/quote-status';
import { STATUS_LABELS } from './StatusBadge';
import { Panel, btn, field } from './ui';

export function QuoteControls({ id, status, notes }: { id: string; status: QuoteStatus; notes: string }) {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState(status);
  const [draft, setDraft] = useState(notes);
  const [message, setMessage] = useState('');

  const run = (fn: () => Promise<void>, done: string, onFail?: () => void) =>
    start(async () => {
      try {
        await fn();
        setMessage(done);
      } catch {
        onFail?.();
        setMessage('Could not save. Check your connection and try again.');
      }
    });

  const changeStatus = (next: QuoteStatus) => {
    if (next === current) return;
    const previous = current;
    setCurrent(next);
    run(() => updateQuoteStatus(id, next), `Marked as ${STATUS_LABELS[next].toLowerCase()}.`, () => setCurrent(previous));
  };

  return (
    <>
      <Panel title="Status">
        <div role="radiogroup" aria-label="Request status" className="grid grid-cols-2 gap-2">
          {QUOTE_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={current === s}
              disabled={pending}
              onClick={() => changeStatus(s)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors last:col-span-2 ${
                current === s ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/30'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Internal notes" description="Only you can see these.">
        <label htmlFor="notes" className="sr-only">
          Internal notes
        </label>
        <textarea
          id="notes"
          rows={6}
          maxLength={5000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Calls, prices quoted, next steps…"
          className={`${field} mt-0`}
        />
        <button type="button" disabled={pending || draft === notes} onClick={() => run(() => saveQuoteNotes(id, draft), 'Notes saved.')} className={`${btn.primary} mt-3 w-full`}>
          Save notes
        </button>
        <p aria-live="polite" className="mt-2 min-h-5 text-center text-sm text-ink-muted">
          {pending ? 'Saving…' : message}
        </p>
      </Panel>
    </>
  );
}
