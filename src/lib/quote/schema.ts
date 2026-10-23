import { z } from 'zod';
import { BUDGET_RANGES, PREFERRED_CONTACT, TIMELINES } from '@/config/budget';
import { SERVICES, type ServiceSlug } from '@/config/services';
import { normalizePhone } from '@/lib/whatsapp';

const serviceValues: string[] = [...SERVICES.map((s) => s.slug), 'not-sure'];

export const CONTACT_REQUIRED_MESSAGE = 'Please give a WhatsApp number or an email so we can reply.';
export const INVALID_WHATSAPP_MESSAGE = 'Please enter a valid WhatsApp number, e.g. 024 123 4567.';

const baseSchema = z.object({
  services: z
    .array(z.string().refine((v) => serviceValues.includes(v), 'Unknown service.'))
    .min(1, 'Please choose at least one service.'),
  goals: z.string().trim().max(2000, 'Please keep this under 2,000 characters.').default(''),
  features: z.array(z.string().max(100)).max(30).default([]),
  serviceAnswers: z.record(z.string(), z.string().max(2000)).default({}),
  budgetCurrency: z.enum(['GHS', 'USD']),
  budgetRange: z.string().min(1, 'Please choose a budget range.'),
  timeline: z.enum(TIMELINES, 'Please choose a timeline.'),
  name: z.string().trim().min(1, 'Please tell us your name.').max(100),
  businessName: z.string().trim().max(150).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  email: z.union([z.literal(''), z.email('Please enter a valid email address.')]).optional(),
  preferredContact: z.enum(PREFERRED_CONTACT).default('whatsapp'),
  country: z.string().trim().max(80).default('Ghana'),
  consent: z.literal(true, 'Please agree so we can contact you about your project.'),
  /** Honeypot: hidden from people, filled in by bots. */
  hp_x7: z.string().optional(),
});

type Data = Partial<Record<string, unknown>>;

/** Checks that span fields; shared by the schema and per-step validation. */
function crossFieldErrors(data: Data): Record<string, string> {
  const errors: Record<string, string> = {};
  const whatsapp = typeof data.whatsapp === 'string' ? data.whatsapp.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!whatsapp && !email) errors.whatsapp = CONTACT_REQUIRED_MESSAGE;
  else if (whatsapp && !normalizePhone(whatsapp)) errors.whatsapp = INVALID_WHATSAPP_MESSAGE;

  const currency = data.budgetCurrency === 'USD' ? 'USD' : 'GHS';
  if (data.budgetRange && !(BUDGET_RANGES[currency] as readonly string[]).includes(String(data.budgetRange))) {
    errors.budgetRange = 'Please choose a budget range.';
  }
  return errors;
}

export const quoteSchema = baseSchema.superRefine((data, ctx) => {
  for (const [field, message] of Object.entries(crossFieldErrors(data))) {
    ctx.addIssue({ code: 'custom', path: [field], message });
  }
});

export type QuoteSubmission = Omit<z.infer<typeof quoteSchema>, 'services'> & {
  services: (ServiceSlug | 'not-sure')[];
};

export type QuoteStep = 1 | 2 | 3 | 4;

export const STEP_FIELDS: Record<QuoteStep, (keyof QuoteSubmission)[]> = {
  1: ['services'],
  2: ['goals', 'features', 'serviceAnswers'],
  3: ['budgetCurrency', 'budgetRange', 'timeline'],
  4: ['name', 'businessName', 'whatsapp', 'email', 'preferredContact', 'country', 'consent'],
};

/** Errors for one step's fields only (field name → message). Empty object means the step is valid. */
export function validateStep(step: QuoteStep, data: Data): Record<string, string> {
  const fields = new Set<string>(STEP_FIELDS[step]);
  const errors: Record<string, string> = {};
  const result = baseSchema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);
      if (fields.has(field) && !errors[field]) errors[field] = issue.message;
    }
  }
  for (const [field, message] of Object.entries(crossFieldErrors(data))) {
    if (fields.has(field) && !errors[field]) errors[field] = message;
  }
  return errors;
}

/** Field → first message, for API error responses. */
export function flattenErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form');
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
