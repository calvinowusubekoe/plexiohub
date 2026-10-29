import { isServiceSlug } from '@/config/services';
import type { ProjectInput } from '@/lib/data/projects';

export function slugify(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'Please upload a JPG, PNG or WebP image.';
  if (file.size > MAX_IMAGE_BYTES) return 'Images must be 5 MB or smaller.';
  return null;
}

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export type ProjectFormErrors = Partial<Record<'title' | 'slug' | 'summary' | 'serviceTags' | 'liveUrl' | 'images', string>>;

/** Field checks shared by the form (before submit) and the server action. */
export function projectFormErrors(v: { title: string; slug: string; summary: string; serviceTags: string[]; liveUrl: string }): ProjectFormErrors {
  const errors: ProjectFormErrors = {};
  if (!v.title.trim()) errors.title = 'Title is required.';
  if (!v.summary.trim()) errors.summary = 'Summary is required.';
  if (!v.serviceTags.some(isServiceSlug)) errors.serviceTags = 'Choose at least one service.';
  if (!slugify(v.slug || v.title)) errors.slug = 'URL name is required.';
  if (v.liveUrl.trim() && !isHttpUrl(v.liveUrl.trim())) errors.liveUrl = 'Live URL must start with http:// or https://';
  return errors;
}

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? '').trim();
}

function urlList(raw: string): string[] {
  try {
    const list = JSON.parse(raw || '[]');
    return Array.isArray(list) ? list.filter((u): u is string => typeof u === 'string' && isHttpUrl(u)) : [];
  } catch {
    return [];
  }
}

export function parseProjectForm(form: FormData): { input: ProjectInput; errors: ProjectFormErrors } {
  const title = str(form, 'title');
  const slug = slugify(str(form, 'slug') || title);
  const serviceTags = form.getAll('serviceTags').map(String).filter(isServiceSlug);
  const liveUrl = str(form, 'liveUrl');
  const cover = str(form, 'coverImageUrl');
  const input: ProjectInput = {
    id: str(form, 'id') || undefined,
    slug,
    title,
    kind: str(form, 'kind') === 'concept' ? 'concept' : 'client',
    serviceTags,
    summary: str(form, 'summary'),
    problem: str(form, 'problem'),
    built: str(form, 'built'),
    features: str(form, 'features').split('\n').map((f) => f.trim()).filter(Boolean),
    liveUrl: liveUrl || null,
    coverImageUrl: cover && isHttpUrl(cover) ? cover : null,
    galleryUrls: urlList(str(form, 'galleryUrls')),
    sortOrder: Number.parseInt(str(form, 'sortOrder'), 10) || 0,
    published: form.get('published') === 'on',
  };
  return { input, errors: projectFormErrors({ title, slug, summary: input.summary, serviceTags, liveUrl }) };
}
