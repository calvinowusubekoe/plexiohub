import { describe, expect, it } from 'vitest';
import { quoteSchema, validateStep } from './schema';
import { validQuote as valid } from '@/test/fixtures';



describe('quoteSchema', () => {
  it('accepts a complete brief', () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });
  it('requires a WhatsApp number or an email', () => {
    const r = quoteSchema.safeParse({ ...valid, whatsapp: undefined, email: undefined });
    expect(r.success).toBe(false);
  });
  it('accepts WhatsApp only or email only', () => {
    expect(quoteSchema.safeParse({ ...valid, email: '' }).success).toBe(true);
    expect(quoteSchema.safeParse({ ...valid, whatsapp: '' }).success).toBe(true);
  });
  it('rejects a budget range from the other currency', () => {
    expect(quoteSchema.safeParse({ ...valid, budgetCurrency: 'USD', budgetRange: 'GHS 500–1,000' }).success).toBe(false);
  });
  it('requires consent', () => {
    expect(quoteSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
  it('rejects unknown services and an empty service list', () => {
    expect(quoteSchema.safeParse({ ...valid, services: ['hacking'] }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, services: [] }).success).toBe(false);
  });
  it('rejects a WhatsApp value that is not a phone number', () => {
    const r = quoteSchema.safeParse({ ...valid, whatsapp: 'call me' });
    expect(r.success).toBe(false);
    expect(validateStep(4, { ...valid, whatsapp: 'call me' }).whatsapp).toBe('Please enter a valid WhatsApp number, e.g. 024 123 4567.');
  });
  it('rejects an invalid email', () => {
    expect(quoteSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });
});

describe('validateStep', () => {
  it('flags missing services on step 1', () => {
    expect(validateStep(1, { services: [] })).toHaveProperty('services');
  });
  it('passes step 1 when a service is picked', () => {
    expect(validateStep(1, { services: ['ecommerce'] })).toEqual({});
  });
  it('flags missing contact on step 4 with the agreed message', () => {
    const errors = validateStep(4, { ...valid, email: '', whatsapp: '' });
    expect(errors.whatsapp).toBe('Please give a WhatsApp number or an email so we can reply.');
  });
  it('flags a missing budget on step 3', () => {
    expect(validateStep(3, { ...valid, budgetRange: '' })).toHaveProperty('budgetRange');
  });
});
