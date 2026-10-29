import { isServiceSlug, type ServiceSlug } from '@/config/services';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createPublicClient } from '@/lib/supabase/public';

export type Project = {
  id: string;
  slug: string;
  title: string;
  kind: 'concept' | 'client';
  serviceTags: ServiceSlug[];
  summary: string;
  problem: string;
  built: string;
  features: string[];
  liveUrl: string | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
  sortOrder: number;
  published: boolean;
  createdAt: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  service_tags: string[] | null;
  summary: string | null;
  problem: string | null;
  built: string | null;
  features: string[] | null;
  live_url: string | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type ProjectInput = Omit<Project, 'id' | 'createdAt'> & { id?: string };

export function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    kind: row.kind === 'concept' ? 'concept' : 'client',
    serviceTags: (row.service_tags ?? []).filter(isServiceSlug),
    summary: row.summary ?? '',
    problem: row.problem ?? '',
    built: row.built ?? '',
    features: row.features ?? [],
    liveUrl: row.live_url,
    coverImageUrl: row.cover_image_url,
    galleryUrls: row.gallery_urls ?? [],
    sortOrder: row.sort_order,
    published: row.published,
    createdAt: row.created_at,
  };
}

function toRow(p: ProjectInput) {
  return {
    ...(p.id ? { id: p.id } : {}),
    slug: p.slug,
    title: p.title,
    kind: p.kind,
    service_tags: p.serviceTags,
    summary: p.summary,
    problem: p.problem,
    built: p.built,
    features: p.features,
    live_url: p.liveUrl,
    cover_image_url: p.coverImageUrl,
    gallery_urls: p.galleryUrls,
    sort_order: p.sortOrder,
    published: p.published,
  };
}

function warnUnconfigured(what: string) {
  console.warn(`[data] Supabase is not configured; ${what} returns empty.`);
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    warnUnconfigured('getPublishedProjects');
    return [];
  }
  const { data, error } = await createPublicClient()
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ProjectRow[]).map(mapProjectRow);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    warnUnconfigured('getProjectBySlug');
    return null;
  }
  const { data, error } = await createPublicClient()
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProjectRow(data as ProjectRow) : null;
}

// Admin operations use the cookie-bound client; RLS only lets the signed-in admin through.
async function adminClient() {
  const { createServerClient } = await import('@/lib/supabase/server');
  return createServerClient();
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await (await adminClient())
    .from('projects')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ProjectRow[]).map(mapProjectRow);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await (await adminClient()).from('projects').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? mapProjectRow(data as ProjectRow) : null;
}

export async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  let query = (await adminClient()).from('projects').select('id').eq('slug', slug);
  if (exceptId) query = query.neq('id', exceptId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function upsertProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await (await adminClient()).from('projects').upsert(toRow(input)).select('*').single();
  if (error) throw error;
  return mapProjectRow(data as ProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await (await adminClient()).from('projects').delete().eq('id', id);
  if (error) throw error;
}
