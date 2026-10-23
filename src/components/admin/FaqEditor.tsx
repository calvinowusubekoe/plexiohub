'use client';

import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { moveFaq, removeFaq, saveFaqAction } from '@/app/admin/(protected)/actions';
import type { Faq } from '@/lib/data/faqs';
import { EmptyState, btn, field, label } from './ui';

function FaqForm({ faq, sortOrder, onDone }: { faq?: Faq; sortOrder: number; onDone?: () => void }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  const prefix = faq ? `faq-${faq.id}` : 'faq-new';
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const formEl = e.currentTarget;
        start(async () => {
          const result = await saveFaqAction(form);
          if (!result.ok) return setError(result.error);
          setError('');
          if (!faq) formEl.reset();
          onDone?.();
        });
      }}
    >
      {faq && <input type="hidden" name="id" value={faq.id} />}
      <input type="hidden" name="sortOrder" value={faq?.sortOrder ?? sortOrder} />
      <div>
        <label htmlFor={`${prefix}-q`} className={label}>
          Question
        </label>
        <input id={`${prefix}-q`} name="question" defaultValue={faq?.question} maxLength={300} className={field} />
      </div>
      <div>
        <label htmlFor={`${prefix}-a`} className={label}>
          Answer
        </label>
        <textarea id={`${prefix}-a`} name="answer" defaultValue={faq?.answer} rows={4} maxLength={3000} className={field} />
      </div>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btn.primary}>
          {pending ? 'Saving…' : faq ? 'Save changes' : 'Add question'}
        </button>
        {faq && onDone && (
          <button type="button" onClick={onDone} className={btn.secondary}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function FaqEditor({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-start">
      {faqs.length === 0 ? (
        <EmptyState title="No questions yet.">Add your first question using the form.</EmptyState>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {faqs.map((f, i) => (
            <li key={f.id} className="px-5 py-5">
              {editing === f.id ? (
                <FaqForm faq={f} sortOrder={i} onDone={() => setEditing(null)} />
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex max-w-2xl gap-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold tabular-nums text-ink-muted ring-1 ring-line">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-navy">{f.question}</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{f.answer}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5 pl-10 sm:pl-0">
                    <button type="button" className={btn.icon} disabled={pending || i === 0} aria-label="Move up" title="Move up" onClick={() => start(() => moveFaq(f.id, 'up'))}>
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={btn.icon}
                      disabled={pending || i === faqs.length - 1}
                      aria-label="Move down"
                      title="Move down"
                      onClick={() => start(() => moveFaq(f.id, 'down'))}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button type="button" className={btn.icon} aria-label={`Edit: ${f.question}`} title="Edit" onClick={() => setEditing(f.id)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={`${btn.icon} hover:border-red-200 hover:text-red-700`}
                      disabled={pending}
                      aria-label={`Delete: ${f.question}`}
                      title="Delete"
                      onClick={() => {
                        if (confirm('Delete this question?')) start(() => removeFaq(f.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      <section className="rounded-xl border border-line bg-white p-5 xl:sticky xl:top-10">
        <h2 className="font-semibold text-navy">Add a question</h2>
        <p className="mb-4 mt-0.5 text-sm text-ink-muted">It appears at the end of the list.</p>
        <FaqForm sortOrder={faqs.length} />
      </section>
    </div>
  );
}
