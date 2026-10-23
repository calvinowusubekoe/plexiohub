/** Normalizes a phone number to international digits (no +), defaulting local numbers to Ghana. */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('0')) digits = `233${digits.slice(1)}`;
  return digits.length >= 8 ? digits : null;
}

export function waLink(number: string, message?: string): string | null {
  const phone = normalizePhone(number);
  if (!phone) return null;
  return message ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : `https://wa.me/${phone}`;
}
