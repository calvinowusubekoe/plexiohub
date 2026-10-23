import { describe, expect, it, vi } from 'vitest';
import { submitQuote, type SubmitDeps } from './submit';
import { validQuote } from '@/test/fixtures';

const NOW = new Date('2026-10-23T12:00:00Z');

function makeDeps(overrides: Partial<SubmitDeps> = {}): SubmitDeps {
  return {
    save: vi.fn().mockResolvedValue({ id: 'q1' }),
    countRecent: vi.fn().mockResolvedValue(0),
    sendEmail: vi.fn().mockResolvedValue(undefined),
    sendWhatsApp: vi.fn().mockResolvedValue(undefined),
    log: vi.fn(),
    now: () => NOW,
    adminUrl: 'https://plexiohub.com/admin',
    ...overrides,
  };
}

describe('submitQuote', () => {
  it('saves then notifies', async () => {
    const deps = makeDeps();
    expect(await submitQuote(validQuote, 'ip1', deps)).toEqual({ status: 'saved', id: 'q1' });
    expect(deps.save).toHaveBeenCalledTimes(1);
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
    expect(deps.sendWhatsApp).toHaveBeenCalledTimes(1);
    expect(vi.mocked(deps.sendWhatsApp).mock.calls[0][0]).toContain('https://plexiohub.com/admin/requests/q1');
  });

  it('honeypot: silently accepts and does nothing', async () => {
    const deps = makeDeps();
    expect(await submitQuote({ ...validQuote, company_website: 'x' }, 'ip1', deps)).toEqual({ status: 'spam' });
    expect(deps.save).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(deps.sendWhatsApp).not.toHaveBeenCalled();
  });

  it('invalid: returns field errors and saves nothing', async () => {
    const deps = makeDeps();
    const result = await submitQuote({ ...validQuote, name: '' }, 'ip1', deps);
    expect(result.status).toBe('invalid');
    expect(result.status === 'invalid' && result.errors).toHaveProperty('name');
    expect(deps.save).not.toHaveBeenCalled();
  });

  it('rate limit: 5 in the last hour blocks the 6th', async () => {
    const deps = makeDeps({ countRecent: vi.fn().mockResolvedValue(5) });
    expect(await submitQuote(validQuote, 'ip1', deps)).toEqual({ status: 'rate_limited' });
    expect(deps.countRecent).toHaveBeenCalledWith('ip1', '2026-10-23T11:00:00.000Z');
    expect(deps.save).not.toHaveBeenCalled();
  });

  it('rate-limit check failing allows the request', async () => {
    const deps = makeDeps({ countRecent: vi.fn().mockRejectedValue(new Error('db down')) });
    expect(await submitQuote(validQuote, 'ip1', deps)).toEqual({ status: 'saved', id: 'q1' });
  });

  it('db failure still notifies with NOT SAVED', async () => {
    const deps = makeDeps({ save: vi.fn().mockRejectedValue(new Error('paused')) });
    expect(await submitQuote(validQuote, 'ip1', deps)).toEqual({ status: 'not_saved' });
    expect(vi.mocked(deps.sendEmail).mock.calls[0][0].subject.startsWith('NOT SAVED — ')).toBe(true);
    expect(vi.mocked(deps.sendWhatsApp).mock.calls[0][0].startsWith('NOT SAVED — copy from email.')).toBe(true);
    expect(deps.log).toHaveBeenCalled();
  });

  it('notification failure does not fail the request', async () => {
    const deps = makeDeps({
      sendEmail: vi.fn().mockRejectedValue(new Error('resend down')),
      sendWhatsApp: vi.fn().mockRejectedValue(new Error('callmebot down')),
    });
    expect(await submitQuote(validQuote, 'ip1', deps)).toEqual({ status: 'saved', id: 'q1' });
    expect(deps.log).toHaveBeenCalledTimes(2);
  });
});
