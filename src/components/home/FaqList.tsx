import { Plus } from 'lucide-react';
import type { Faq } from '@/lib/data/faqs';

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.id} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-navy">
            {f.question}
            <Plus className="h-5 w-5 shrink-0 text-brand transition-transform duration-200 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-ink-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
