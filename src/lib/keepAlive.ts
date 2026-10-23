export const KEEP_ALIVE_FAILED_SUBJECT = 'PlexioHub: database keep-alive failed';

export type KeepAliveDeps = {
  /** A tiny query that counts as database activity. */
  ping: () => Promise<void>;
  sendEmail: (msg: { subject: string; html: string; text: string }) => Promise<void>;
};

/** Daily job: keeps the free Supabase project from pausing, and emails the founder if the database is unreachable. */
export async function runKeepAlive(deps: KeepAliveDeps): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await deps.ping();
    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const text = `The daily database check failed:\n\n${error}\n\nQuote requests may not be saving. Check the Supabase dashboard (the project may be paused) and restore it. Quote alerts still arrive by email and WhatsApp while it is down.`;
    await deps.sendEmail({ subject: KEEP_ALIVE_FAILED_SUBJECT, text, html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${text.replace(/</g, '&lt;')}</pre>` }).catch(() => undefined);
    return { ok: false, error };
  }
}
