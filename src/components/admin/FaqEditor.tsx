'use client';

import { useState, useTransition } from 'react';
import { moveFaq, removeFaq, saveFaqAction } from '@/app/admin/(protected)/actions';
import type { Faq } from '@/lib/data/faqs';

const input = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5';
const btn = 'rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:border-brand disabled:opacity-40';

function FaqForm({ faq, sortOrder, onDone }: { faq?: Faq; sortOrder: number; onDone?: () => void }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  return (
    <form
      className="space-y-3"
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
      <label className="block text-sm font-medium">
        Question
        <input name="question" defaultValue={faq?.question} maxLength={300} className={input} />
      </label>
      <label className="block text-sm font-medium">
        Answer
        <textarea name="answer" defaultValue={faq?.answer} rows={4} maxLength={3000} className={input} />
      </label>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark disabled:opacity-70">
        {pending ? 'Saving…' : faq ? 'Save' : 'Add question'}
      </button>
    </form>
  );
}

export function FaqEditor({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-8">
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {faqs.map((f, i) => (
          <li key={f.id} className="p-4">
            {editing === f.id ? (
              <FaqForm faq={f} sortOrder={i} onDone={() => setEditing(null)} />
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                  <p className="font-semibold">{f.question}</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-navy/70">{f.answer}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className={btn} disabled={pending || i === 0} aria-label="Move up" onClick={() => start(() => moveFaq(f.id, 'up'))}>↑</button>
                  <button type="button" className={btn} disabled={pending || i === faqs.length - 1} aria-label="Move down" onClick={() => start(() => moveFaq(f.id, 'down'))}>↓</button>
                  <button type="button" className={btn} onClick={() => setEditing(f.id)}>Edit</button>
                  <button
                    type="button"
                    className={`${btn} text-red-600`}
                    disabled={pending}
                    onClick={() => {
                      if (confirm('Delete this question?')) start(() => removeFaq(f.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {faqs.length === 0 && <li className="p-8 text-center text-navy/70">No questions yet.</li>}
      </ul>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold">Add a question</h2>
        <FaqForm sortOrder={faqs.length} />
      </div>
    </div>
  );
}
