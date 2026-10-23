import 'server-only';

const MAX_LENGTH = 900;

/** Sends a WhatsApp message to the founder's own number through CallMeBot. Throws if not configured or on failure. */
export async function sendWhatsApp(text: string): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!phone || !apiKey) throw new Error('WhatsApp alerts are not configured (CALLMEBOT_PHONE / CALLMEBOT_API_KEY)');
  const body = text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH - 1)}…` : text;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(body)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`CallMeBot responded ${res.status}`);
}
