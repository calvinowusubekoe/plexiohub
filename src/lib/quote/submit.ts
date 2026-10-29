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
// Netlify cuts synchronous functions off at about 10s, so every external call gets a budget (worst case ~8.5s).
export const RATE_CHECK_TIMEOUT_MS = 1500;
export const SAVE_TIMEOUT_MS = 4000;
export const NOTIFY_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>, ms: number, what: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${what} timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}
const RATE_WINDOW_MS = 60 * 60 * 1000;

/** Validates, rate-limits, saves, then notifies. Saving is the source of truth; notifications are best-effort. */
export async function submitQuote(raw: unknown, ipHash: string, deps: SubmitDeps): Promise<SubmitResult> {
  if (raw && typeof raw === 'object' && (raw as Record<string, unknown>).hp_x7) {
    return { status: 'spam' };
  }

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) return { status: 'invalid', errors: flattenErrors(parsed.error) };
  const q = parsed.data as QuoteSubmission;

  try {
    const since = new Date(deps.now().getTime() - RATE_WINDOW_MS).toISOString();
    if ((await withTimeout(deps.countRecent(ipHash, since), RATE_CHECK_TIMEOUT_MS, 'Rate-limit check')) >= RATE_LIMIT) {
      return { status: 'rate_limited' };
    }
  } catch (err) {
    deps.log('Rate-limit check failed; allowing request', err);
  }

  let id: string | undefined;
  try {
    id = (await withTimeout(deps.save(q, ipHash), SAVE_TIMEOUT_MS, 'Saving quote')).id;
  } catch (err) {
    deps.log('Saving quote failed; notifying founder with full brief', err);
  }

  const saved = id !== undefined;
  const msg = formatQuote(q, { id, saved, adminUrl: saved ? `${deps.adminUrl}/requests/${id}` : deps.adminUrl });
  const results = await Promise.allSettled([
    withTimeout(deps.sendEmail({ subject: msg.subject, html: msg.html, text: msg.text }), NOTIFY_TIMEOUT_MS, 'Email'),
    withTimeout(deps.sendWhatsApp(msg.whatsapp), NOTIFY_TIMEOUT_MS, 'WhatsApp'),
  ]);
  results.forEach((r, i) => {
    if (r.status === 'rejected') deps.log(`${i === 0 ? 'Email' : 'WhatsApp'} notification failed`, r.reason);
  });

  return saved ? { status: 'saved', id: id as string } : { status: 'not_saved' };
}
