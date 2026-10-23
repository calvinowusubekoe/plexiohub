import { isServiceSlug, type ServiceSlug } from '@/config/services';

/** Reads ?service=a,b (or repeated params) and keeps only known service slugs. */
export function parseServiceParam(param: string | string[] | undefined): ServiceSlug[] {
  const raw = Array.isArray(param) ? param.join(',') : (param ?? '');
  const slugs = raw.split(',').map((s) => s.trim()).filter(isServiceSlug);
  return [...new Set(slugs)];
}
