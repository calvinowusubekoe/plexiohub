import { createHash } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { site } from '@/config/site';
import { countRecentQuotes, insertQuote } from '@/lib/data/quotes';
import { sendEmail } from '@/lib/notify/email';
import { sendWhatsApp } from '@/lib/notify/whatsapp';
import { submitQuote } from '@/lib/quote/submit';

function ipHash(req: NextRequest): string {
  const ip =
    req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  return createHash('sha256').update(ip + (process.env.RATE_LIMIT_SALT ?? '')).digest('hex');
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: 'Invalid request.' } }, { status: 400 });
  }

  const result = await submitQuote(body, ipHash(req), {
    save: insertQuote,
    countRecent: countRecentQuotes,
    sendEmail,
    sendWhatsApp,
    log: (msg, err) => console.error(`[quote] ${msg}`, err ?? ''),
    now: () => new Date(),
    adminUrl: `${site.url}/admin`,
  });

  switch (result.status) {
    case 'saved':
    case 'spam':
      return NextResponse.json({ ok: true });
    case 'invalid':
      return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
    case 'rate_limited':
      return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 });
    case 'not_saved':
      return NextResponse.json({ ok: false, reason: 'not_saved' }, { status: 503 });
  }
}
