export const BUDGET_RANGES = {
  GHS: ['Under GHS 500', 'GHS 500–1,000', 'GHS 1,000–3,000', 'GHS 3,000–7,000', 'GHS 7,000–12,000', 'GHS 12,000–20,000', 'Above GHS 20,000', 'Not sure yet'],
  USD: ['Under $50', '$50–100', '$100–300', '$300–700', '$700–1,200', '$1,200–2,000', 'Above $2,000', 'Not sure yet'],
} as const satisfies Record<'GHS' | 'USD', readonly string[]>;

export type BudgetCurrency = keyof typeof BUDGET_RANGES;

export const TIMELINES = ['ASAP', 'Within 1 month', '1–3 months', 'Flexible'] as const;

export const PREFERRED_CONTACT = ['whatsapp', 'email', 'call'] as const;
export type PreferredContact = (typeof PREFERRED_CONTACT)[number];
