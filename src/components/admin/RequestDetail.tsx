import { getService } from '@/config/services';
import type { QuoteRow } from '@/lib/data/quotes';
import { serviceNames } from '@/lib/quote/format';
import { waLink } from '@/lib/whatsapp';
import { StatusBadge } from './StatusBadge';

function questionLabel(services: string[], id: string): string {
  for (const slug of services) {
    const q = getService(slug)?.questions.find((qq) => qq.id === id);
    if (q) return q.label;
  }
  return id;
}

/** Read-only view of one quote request. Visitor text renders as plain text (React escapes it). */
export function RequestDetail({ quote, children }: { quote: QuoteRow; children?: React.ReactNode }) {
  const wa = quote.whatsapp ? waLink(quote.whatsapp, `Hi ${quote.name}, this is PlexioHub about your project request.`) : null;
  const rows: [string, string | null][] = [
    ['Business', quote.business_name],
    ['WhatsApp', quote.whatsapp],
    ['Email', quote.email],
    ['Preferred contact', quote.preferred_contact],
    ['Country', quote.country],
    ['Services', serviceNames(quote.services)],
    ['Goals', quote.goals],
    ['Features needed', quote.features.join(', ')],
    ...Object.entries(quote.service_answers ?? {}).map(([id, v]) => [questionLabel(quote.services, id), v] as [string, string]),
    ['Budget', quote.budget_range],
    ['Timeline', quote.timeline],
    ['Received', new Date(quote.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{quote.name}</h1>
        <StatusBadge status={quote.status} />
      </div>

      <div className="flex flex-wrap gap-3">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-whatsapp px-4 py-2.5 font-semibold text-white">
            Reply on WhatsApp
          </a>
        )}
        {quote.email && (
          <a href={`mailto:${quote.email}`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold hover:border-brand">
            Reply by email
          </a>
        )}
      </div>

      <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {rows
          .filter(([, v]) => v && String(v).trim())
          .map(([k, v]) => (
            <div key={k} className="grid gap-1 p-4 sm:grid-cols-[200px_1fr]">
              <dt className="text-sm text-navy/70">{k}</dt>
              <dd className="whitespace-pre-wrap break-words">{v}</dd>
            </div>
          ))}
      </dl>

      {children}
    </div>
  );
}
