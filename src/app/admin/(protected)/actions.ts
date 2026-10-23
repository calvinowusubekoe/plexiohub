'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { QUOTE_STATUSES, updateQuote, type QuoteStatus } from '@/lib/data/quotes';
import { createServerClient } from '@/lib/supabase/server';

/** Every admin action starts here: no signed-in admin, no access. */
export async function requireAdmin() {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');
  return data.user;
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<void> {
  await requireAdmin();
  if (!QUOTE_STATUSES.includes(status)) throw new Error('Invalid status');
  await updateQuote(id, { status });
  revalidatePath('/admin', 'layout');
}

export async function saveQuoteNotes(id: string, notes: string): Promise<void> {
  await requireAdmin();
  await updateQuote(id, { notes: notes.trim().slice(0, 5000) });
  revalidatePath('/admin', 'layout');
}

export async function signOut(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
