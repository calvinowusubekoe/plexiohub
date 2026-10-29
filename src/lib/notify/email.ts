import 'server-only';
import { Resend } from 'resend';
import type { EmailMessage } from '@/lib/quote/submit';

/** Sends an email to the founder (ADMIN_EMAIL) through Resend. Throws if not configured or on failure. */
export async function sendEmail(msg: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  if (!apiKey || !to) throw new Error('Email is not configured (RESEND_API_KEY / ADMIN_EMAIL)');
  const from = process.env.RESEND_FROM || 'PlexioHub <onboarding@resend.dev>';
  const { error } = await new Resend(apiKey).emails.send({ from, to, subject: msg.subject, html: msg.html, text: msg.text });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
