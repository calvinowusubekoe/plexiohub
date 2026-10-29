import { ChevronLeft, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { getService } from '@/config/services';
import type { QuoteRow } from '@/lib/data/quotes';
import { serviceNames } from '@/lib/quote/format';
import { normalizePhone, waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/layout/WhatsAppIcon';
import { StatusBadge } from './StatusBadge';
import { Panel, btn } from './ui';

const CONTACT_LABELS: Record<string, string> = { whatsapp: 'WhatsApp', email: 'Email', call: 'Phone call' };

function questionLabel(services: string[], id: string): string {
  for (const slug of services) {
    const q = getService(slug)?.questions.find((qq) => qq.id === id);
    if (q) return q.label;
  }
  return id;
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i} className="rounded-md bg-surface px-2.5 py-1 text-sm font-medium text-navy ring-1 ring-line">
          {i}
        </li>
      ))}
    </ul>
  );
}

/** One quote request. Visitor text renders as plain text (React escapes it). `children` is the side panel of controls. */
export function RequestDetail({ quote, children }: { quote: QuoteRow; children?: React.ReactNode }) {
  const wa = quote.whatsapp ? waLink(quote.whatsapp, `Hi ${quote.name}, this is PlexioHub about your project request.`) : null;
  const tel = quote.whatsapp ? normalizePhone(quote.whatsapp) : null;
  const received = new Date(quote.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  const answers = Object.entries(quote.service_answers ?? {}).filter(([, v]) => v && String(v).trim());
  const services = quote.services.map((s) => serviceNames([s]));

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-navy">
        <ChevronLeft className="h-4 w-4" aria-hidden />
        All requests
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem]">{quote.name}</h1>
            <StatusBadge status={quote.status} />
          </div>
          <p className="mt-1 text-ink-muted">
            {quote.business_name ? `${quote.business_name}, received ${received}` : `Received ${received}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={btn.whatsapp}>
              <WhatsAppIcon className="h-4 w-4" />
              Reply on WhatsApp
            </a>
          )}
          {quote.email && (
            <a href={`mailto:${quote.email}`} className={btn.secondary}>
              <Mail className="h-4 w-4" aria-hidden />
              Reply by email
            </a>
          )}
          {tel && (
            <a href={`tel:+${tel}`} className={btn.secondary}>
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-6">
          <Panel title="Project">
            <dl className="space-y-5">
              <div>
                <dt className="text-sm font-semibold text-ink-muted">Services</dt>
                <dd className="mt-2">
                  <Chips items={services} />
                </dd>
              </div>
              {quote.goals && (
                <div>
                  <dt className="text-sm font-semibold text-ink-muted">What they want to achieve</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words leading-relaxed text-navy">{quote.goals}</dd>
                </div>
              )}
              {quote.features.length > 0 && (
                <div>
                  <dt className="text-sm font-semibold text-ink-muted">Features needed</dt>
                  <dd className="mt-2">
                    <Chips items={quote.features} />
                  </dd>
                </div>
              )}
            </dl>
          </Panel>

          {answers.length > 0 && (
            <Panel title="Their answers">
              <dl className="divide-y divide-line">
                {answers.map(([id, v]) => (
                  <div key={id} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[1fr_1fr] sm:gap-6">
                    <dt className="text-sm text-ink-muted">{questionLabel(quote.services, id)}</dt>
                    <dd className="whitespace-pre-wrap break-words font-medium text-navy">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}

          <Panel title="Budget and timing">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-surface p-4">
                <dt className="text-sm text-ink-muted">Budget</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-navy">{quote.budget_range ?? 'Not given'}</dd>
              </div>
              <div className="rounded-lg bg-surface p-4">
                <dt className="text-sm text-ink-muted">Timeline</dt>
                <dd className="mt-1 text-lg font-semibold text-navy">{quote.timeline ?? 'Not given'}</dd>
              </div>
            </dl>
          </Panel>
        </div>

        <div className="space-y-6">
          {children}
          <Panel title="Contact">
            <dl className="space-y-3 text-sm">
              {[
                ['WhatsApp', quote.whatsapp],
                ['Email', quote.email],
                ['Prefers', quote.preferred_contact ? (CONTACT_LABELS[quote.preferred_contact] ?? quote.preferred_contact) : null],
                ['Country', quote.country],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="break-all text-right font-medium text-navy">{v}</dd>
                  </div>
                ))}
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
