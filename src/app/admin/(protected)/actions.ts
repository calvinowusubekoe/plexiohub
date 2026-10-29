'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseProjectForm } from '@/lib/admin/projectForm';
import { deleteFaq, getFaqsAdmin, reorderFaqs, saveFaq } from '@/lib/data/faqs';
import { deleteProject, getAllProjects, getProjectById, isSlugTaken, upsertProject } from '@/lib/data/projects';
import { QUOTE_STATUSES, updateQuote, type QuoteStatus } from '@/lib/data/quotes';
import { createServerClient } from '@/lib/supabase/server';

function isAdminEmail(email: string | undefined): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && email && email.trim().toLowerCase() === admin);
}

/**
 * Every admin page and action starts here: only the signed-in user whose email is ADMIN_EMAIL gets in.
 * getClaims verifies the login token's signature locally (no round trip to Supabase), so admin pages stay fast.
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === 'string' ? data.claims.email : undefined;
  if (!email || !isAdminEmail(email)) redirect('/admin/login');
  return { email };
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

// ---- Portfolio and FAQ content ----

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function revalidateContent() {
  revalidatePath('/');
  revalidatePath('/work');
  revalidatePath('/work/[slug]', 'page');
  revalidatePath('/services/[slug]', 'page');
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin', 'layout');
}

export async function saveProject(form: FormData): Promise<ActionResult> {
  await requireAdmin();
  const { input, errors } = parseProjectForm(form);
  const firstError = Object.values(errors)[0];
  if (firstError) return { ok: false, error: firstError };
  if (await isSlugTaken(input.slug, input.id)) return { ok: false, error: 'That URL name is already used by another project.' };
  const saved = await upsertProject(input);
  revalidateContent();
  return { ok: true, id: saved.id };
}

export async function removeProject(id: string): Promise<void> {
  await requireAdmin();
  await deleteProject(id);
  revalidateContent();
}

export async function setProjectPublished(id: string, published: boolean): Promise<void> {
  await requireAdmin();
  const project = await getProjectById(id);
  if (!project) throw new Error('Project not found');
  await upsertProject({ ...project, published });
  revalidateContent();
}

/** Swaps sort position with the neighbour above/below, then renumbers 0..n. */
export async function moveProject(id: string, dir: 'up' | 'down'): Promise<void> {
  await requireAdmin();
  const projects = await getAllProjects();
  const i = projects.findIndex((p) => p.id === id);
  const j = dir === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= projects.length) return;
  [projects[i], projects[j]] = [projects[j], projects[i]];
  for (const [index, p] of projects.entries()) {
    if (p.sortOrder !== index) await upsertProject({ ...p, sortOrder: index });
  }
  revalidateContent();
}

export async function saveFaqAction(form: FormData): Promise<ActionResult> {
  await requireAdmin();
  const question = String(form.get('question') ?? '').trim();
  const answer = String(form.get('answer') ?? '').trim();
  if (!question || !answer) return { ok: false, error: 'Question and answer are both required.' };
  const id = String(form.get('id') ?? '') || undefined;
  await saveFaq({ id, question: question.slice(0, 300), answer: answer.slice(0, 3000), sortOrder: Number(form.get('sortOrder')) || 0 });
  revalidateContent();
  return { ok: true };
}

export async function removeFaq(id: string): Promise<void> {
  await requireAdmin();
  await deleteFaq(id);
  revalidateContent();
}

export async function moveFaq(id: string, dir: 'up' | 'down'): Promise<void> {
  await requireAdmin();
  const ids = (await getFaqsAdmin()).map((f) => f.id);
  const i = ids.indexOf(id);
  const j = dir === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await reorderFaqs(ids);
  revalidateContent();
}

export async function signOut(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
