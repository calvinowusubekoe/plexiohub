import type { QuoteInput } from '@/lib/data/quotes';
import { formatQuote } from './format';
import { flattenErrors, quoteSchema, type QuoteSubmission } from './schema';

export type EmailMessage = { subject: string; html: string; text: string };

export type SubmitDeps = {
  save: (q: QuoteInput, ipHash: string) => Promise<{ id: string }>;
  countRecent: (ipHash: string, sinceIso: string) => Promise<number>;
  sendEmail: (msg: EmailMessage) => Promise<void>;
  sendWhatsApp: (text: string) => Promise<void>;
  log: (msg: string, err?: unknown) => void;
  now: () => Date;
  /** Base admin URL, e.g. https://plexiohub.com/admin */
  adminUrl: string;
};

export type SubmitResult =
  | { status: 'saved'; id: string }
  | { status: 'not_saved' }
  | { status: 'rate_limited' }
  | { status: 'invalid'; errors: Record<string, string> }
  | { status: 'spam' };

export const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

/** Validates, rate-limits, saves, then notifies. Saving is the source of truth; notifications are best-effort. */
export async function submitQuote(raw: unknown, ipHash: string, deps: SubmitDeps): Promise<SubmitResult> {
  if (raw && typeof raw === 'object' && (raw as Record<string, unknown>).company_website) {
    return { status: 'spam' };
  }

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) return { status: 'invalid', errors: flattenErrors(parsed.error) };
  const q = parsed.data as QuoteSubmission;

  try {
    const since = new Date(deps.now().getTime() - RATE_WINDOW_MS).toISOString();
    if ((await deps.countRecent(ipHash, since)) >= RATE_LIMIT) return { status: 'rate_limited' };
  } catch (err) {
    deps.log('Rate-limit check failed; allowing request', err);
  }

  let id: string | undefined;
  try {
    id = (await deps.save(q, ipHash)).id;
  } catch (err) {
    deps.log('Saving quote failed; notifying founder with full brief', err);
  }

  const saved = id !== undefined;
  const msg = formatQuote(q, { id, saved, adminUrl: saved ? `${deps.adminUrl}/requests/${id}` : deps.adminUrl });
  const results = await Promise.allSettled([
    deps.sendEmail({ subject: msg.subject, html: msg.html, text: msg.text }),
    deps.sendWhatsApp(msg.whatsapp),
  ]);
  results.forEach((r, i) => {
    if (r.status === 'rejected') deps.log(`${i === 0 ? 'Email' : 'WhatsApp'} notification failed`, r.reason);
  });

  return saved ? { status: 'saved', id: id as string } : { status: 'not_saved' };
}
