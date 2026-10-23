import type { Faq } from '@/lib/data/faqs';

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
      {faqs.map((f) => (
        <details key={f.id} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {f.question}
            <span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 whitespace-pre-line text-navy/75">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
