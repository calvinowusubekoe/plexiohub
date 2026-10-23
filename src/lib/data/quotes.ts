import type { BudgetCurrency, PreferredContact } from '@/config/budget';
import type { ServiceSlug } from '@/config/services';

export type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
export const QUOTE_STATUSES: QuoteStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost'];

/** Validated quote data as stored. QuoteSubmission (lib/quote/schema) is assignable to this. */
export type QuoteInput = {
  services: (ServiceSlug | 'not-sure')[];
  goals: string;
  features: string[];
  serviceAnswers: Record<string, string>;
  budgetCurrency: BudgetCurrency;
  budgetRange: string;
  timeline: string;
  name: string;
  businessName?: string;
  whatsapp?: string;
  email?: string;
  preferredContact: PreferredContact;
  country: string;
};

export type QuoteRow = {
  id: string;
  created_at: string;
  status: QuoteStatus;
  services: string[];
  goals: string | null;
  features: string[];
  service_answers: Record<string, string>;
  budget_currency: string | null;
  budget_range: string | null;
  timeline: string | null;
  name: string;
  business_name: string | null;
  whatsapp: string | null;
  email: string | null;
  preferred_contact: string | null;
  country: string | null;
  notes: string | null;
};

async function serviceClient() {
  const { createServiceClient } = await import('@/lib/supabase/service');
  return createServiceClient();
}

async function adminClient() {
  const { createServerClient } = await import('@/lib/supabase/server');
  return createServerClient();
}

export async function insertQuote(q: QuoteInput, ipHash: string): Promise<{ id: string }> {
  const { data, error } = await (await serviceClient())
    .from('quote_requests')
    .insert({
      services: q.services,
      goals: q.goals,
      features: q.features,
      service_answers: q.serviceAnswers,
      budget_currency: q.budgetCurrency,
      budget_range: q.budgetRange,
      timeline: q.timeline,
      name: q.name,
      business_name: q.businessName || null,
      whatsapp: q.whatsapp || null,
      email: q.email || null,
      preferred_contact: q.preferredContact,
      country: q.country,
      ip_hash: ipHash,
    })
    .select('id')
    .single();
  if (error) throw error;
  return { id: data.id as string };
}

export async function countRecentQuotes(ipHash: string, sinceIso: string): Promise<number> {
  const { count, error } = await (await serviceClient())
    .from('quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', sinceIso);
  if (error) throw error;
  return count ?? 0;
}

export async function listQuotes(): Promise<QuoteRow[]> {
  const { data, error } = await (await adminClient())
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as QuoteRow[];
}

export async function getQuote(id: string): Promise<QuoteRow | null> {
  const { data, error } = await (await adminClient()).from('quote_requests').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as QuoteRow | null;
}

export async function updateQuote(id: string, patch: { status?: QuoteStatus; notes?: string }): Promise<void> {
  const { error } = await (await adminClient()).from('quote_requests').update(patch).eq('id', id);
  if (error) throw error;
}

export async function countNewQuotes(): Promise<number> {
  const { count, error } = await (await adminClient())
    .from('quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');
  if (error) throw error;
  return count ?? 0;
}
