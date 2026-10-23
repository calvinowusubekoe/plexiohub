import { content } from '@/config/content';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createPublicClient } from '@/lib/supabase/public';

export type Faq = { id: string; question: string; answer: string; sortOrder: number };
export type FaqRow = { id: string; question: string; answer: string; sort_order: number };

export function mapFaqRow(row: FaqRow): Faq {
  return { id: row.id, question: row.question, answer: row.answer, sortOrder: row.sort_order };
}

/** Public FAQ list. Falls back to the seed FAQs while Supabase is not configured. */
export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[data] Supabase is not configured; getFaqs returns the seed FAQs.');
    return content.seedFaqs.map((f, i) => ({ id: `seed-${i}`, question: f.question, answer: f.answer, sortOrder: i }));
  }
  const { data, error } = await createPublicClient().from('faqs').select('*').order('sort_order');
  if (error) throw error;
  return (data as FaqRow[]).map(mapFaqRow);
}

async function adminClient() {
  const { createServerClient } = await import('@/lib/supabase/server');
  return createServerClient();
}

export async function getFaqsAdmin(): Promise<Faq[]> {
  const { data, error } = await (await adminClient()).from('faqs').select('*').order('sort_order');
  if (error) throw error;
  return (data as FaqRow[]).map(mapFaqRow);
}

export async function saveFaq(faq: { id?: string; question: string; answer: string; sortOrder: number }): Promise<void> {
  const row = { ...(faq.id ? { id: faq.id } : {}), question: faq.question, answer: faq.answer, sort_order: faq.sortOrder };
  const { error } = await (await adminClient()).from('faqs').upsert(row);
  if (error) throw error;
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await (await adminClient()).from('faqs').delete().eq('id', id);
  if (error) throw error;
}

/** Rewrites sort_order to match the given id order. */
export async function reorderFaqs(ids: string[]): Promise<void> {
  const client = await adminClient();
  for (const [i, id] of ids.entries()) {
    const { error } = await client.from('faqs').update({ sort_order: i }).eq('id', id);
    if (error) throw error;
  }
}
