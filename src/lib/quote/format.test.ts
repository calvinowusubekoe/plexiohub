import { describe, expect, it } from 'vitest';
import { formatQuote } from './format';
import { quoteSchema, type QuoteSubmission } from './schema';
import { validQuote as valid } from '@/test/fixtures';

const q = quoteSchema.parse(valid) as QuoteSubmission;
const opts = { id: 'abc', saved: true, adminUrl: 'https://x/admin/requests/abc' };

describe('formatQuote', () => {
  it('builds the short WhatsApp alert', () => {
    expect(formatQuote(q, opts).whatsapp).toBe(
      'New quote: Ama Mensah, Website Design & Development, GHS 3,000–7,000. Open admin: https://x/admin/requests/abc',
    );
  });
  it('builds the email subject', () => {
    expect(formatQuote(q, opts).subject).toBe('New quote request: Ama Mensah (Website Design & Development)');
  });
  it('labels service answers with the question text and includes the full brief', () => {
    const { text } = formatQuote(q, opts);
    expect(text).toContain('Is this a new website or a redesign?: New website');
    expect(text).toContain('Get more customers online');
    expect(text).toContain('ama@example.com');
  });
  it('escapes HTML from visitor text', () => {
    const html = formatQuote({ ...q, goals: '<script>alert(1)</script>' }, opts).html;
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
  it('marks NOT SAVED alerts and still includes the full brief', () => {
    const ns = formatQuote(q, { saved: false, adminUrl: 'https://x/admin' });
    expect(ns.subject.startsWith('NOT SAVED — ')).toBe(true);
    expect(ns.whatsapp.startsWith('NOT SAVED — copy from email. ')).toBe(true);
    expect(ns.text).toContain(q.goals);
  });
  it('joins multiple services and names not-sure', () => {
    const multi = formatQuote({ ...q, services: ['ecommerce', 'not-sure'] }, opts);
    expect(multi.subject).toBe('New quote request: Ama Mensah (E-commerce Solutions, Not sure yet)');
  });
  it('includes a reply-on-WhatsApp link', () => {
    expect(formatQuote(q, opts).html).toContain('https://wa.me/233241234567');
  });
});
