import { getService } from '@/config/services';
import { waLink } from '@/lib/whatsapp';
import type { QuoteSubmission } from './schema';

export type FormattedQuote = { subject: string; html: string; text: string; whatsapp: string };

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function serviceNames(services: string[]): string {
  return services.map((slug) => (slug === 'not-sure' ? 'Not sure yet' : (getService(slug)?.name ?? slug))).join(', ');
}

/** Service-specific answers labelled with their question text. */
function answerLines(q: QuoteSubmission): [string, string][] {
  const labels = new Map<string, string>();
  for (const slug of q.services) getService(slug)?.questions.forEach((qq) => labels.set(qq.id, qq.label));
  return Object.entries(q.serviceAnswers)
    .filter(([, v]) => v.trim())
    .map(([id, v]) => [labels.get(id) ?? id, v]);
}

export function formatQuote(
  q: QuoteSubmission,
  opts: { id?: string; saved: boolean; adminUrl: string },
): FormattedQuote {
  const services = serviceNames(q.services);
  const prefix = opts.saved ? '' : 'NOT SAVED — ';
  const subject = `${prefix}New quote request: ${q.name} (${services})`;
  const whatsapp = `${opts.saved ? '' : 'NOT SAVED — copy from email. '}New quote: ${q.name}, ${services}, ${q.budgetRange}. Open admin: ${opts.adminUrl}`;

  const rows: [string, string][] = [
    ['Name', q.name],
    ['Business', q.businessName ?? ''],
    ['WhatsApp', q.whatsapp ?? ''],
    ['Email', q.email ?? ''],
    ['Preferred contact', q.preferredContact],
    ['Country', q.country],
    ['Services', services],
    ['Goals', q.goals],
    ['Features needed', q.features.join(', ')],
    ...answerLines(q),
    ['Budget', q.budgetRange],
    ['Timeline', q.timeline],
  ];
  const filled = rows.filter(([, v]) => v && v.trim());

  const text = [
    opts.saved ? 'A new quote request came in.' : 'NOT SAVED: the database was unavailable. Copy these details into your records.',
    '',
    ...filled.map(([k, v]) => `${k}: ${v}`),
    '',
    opts.saved ? `Open in admin: ${opts.adminUrl}` : '',
  ].join('\n');

  const reply = q.whatsapp ? waLink(q.whatsapp, `Hi ${q.name}, this is PlexioHub about your project request.`) : null;
  const actions = [
    reply ? `<a href="${escapeHtml(reply)}">Reply on WhatsApp</a>` : '',
    q.email ? `<a href="mailto:${escapeHtml(q.email)}">Reply by email</a>` : '',
    opts.saved ? `<a href="${escapeHtml(opts.adminUrl)}">Open in admin</a>` : '',
  ].filter(Boolean);

  const html = `
<div style="font-family:Arial,sans-serif;color:#0F1E4A;max-width:600px">
  ${opts.saved ? '' : '<p style="background:#FEE2E2;padding:12px;border-radius:6px"><b>NOT SAVED:</b> the database was unavailable. Copy these details into your records.</p>'}
  <h2 style="margin:0 0 12px">New quote request from ${escapeHtml(q.name)}</h2>
  <table cellpadding="6" style="border-collapse:collapse">
    ${filled
      .map(
        ([k, v]) =>
          `<tr><td style="color:#64748B;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join('\n    ')}
  </table>
  <p>${actions.join(' &nbsp;·&nbsp; ')}</p>
</div>`.trim();

  return { subject, html, text, whatsapp };
}
