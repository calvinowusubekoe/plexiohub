import { describe, expect, it } from 'vitest';
import { normalizePhone, waLink } from './whatsapp';

describe('normalizePhone', () => {
  it('converts Ghanaian local numbers to international', () => {
    expect(normalizePhone('024 123 4567')).toBe('233241234567');
  });
  it('accepts +233 and 00233 prefixes', () => {
    expect(normalizePhone('+233 24 123 4567')).toBe('233241234567');
    expect(normalizePhone('00233241234567')).toBe('233241234567');
  });
  it('keeps other international numbers', () => {
    expect(normalizePhone('+44 7700 900123')).toBe('447700900123');
  });
  it('rejects empty or non-numeric input', () => {
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone('call me')).toBeNull();
  });
});

describe('waLink', () => {
  it('builds a wa.me link with an encoded message', () => {
    expect(waLink('024 123 4567', "Hi PlexioHub, I'm interested in Graphic Design")).toBe(
      "https://wa.me/233241234567?text=Hi%20PlexioHub%2C%20I'm%20interested%20in%20Graphic%20Design",
    );
  });
  it('omits text when no message', () => {
    expect(waLink('024 123 4567')).toBe('https://wa.me/233241234567');
  });
  it('returns null for invalid numbers', () => {
    expect(waLink('nope')).toBeNull();
  });
});
