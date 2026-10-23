import { describe, expect, it, vi } from 'vitest';
import { KEEP_ALIVE_FAILED_SUBJECT, runKeepAlive } from './keepAlive';

describe('runKeepAlive', () => {
  it('does nothing else when the query succeeds', async () => {
    const sendEmail = vi.fn();
    const result = await runKeepAlive({ ping: vi.fn().mockResolvedValue(undefined), sendEmail });
    expect(result).toEqual({ ok: true });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('emails the founder when the query fails', async () => {
    const sendEmail = vi.fn().mockResolvedValue(undefined);
    const result = await runKeepAlive({ ping: vi.fn().mockRejectedValue(new Error('project paused')), sendEmail });
    expect(result).toEqual({ ok: false, error: 'project paused' });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][0].subject).toBe(KEEP_ALIVE_FAILED_SUBJECT);
    expect(sendEmail.mock.calls[0][0].text).toContain('project paused');
  });

  it('still reports failure if the alert email also fails', async () => {
    const result = await runKeepAlive({
      ping: vi.fn().mockRejectedValue(new Error('down')),
      sendEmail: vi.fn().mockRejectedValue(new Error('no email')),
    });
    expect(result).toEqual({ ok: false, error: 'down' });
  });
});
