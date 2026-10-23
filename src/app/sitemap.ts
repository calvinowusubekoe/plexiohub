import type { MetadataRoute } from 'next';
import { SERVICES } from '@/config/services';
import { site } from '@/config/site';
import { getPublishedProjects } from '@/lib/data/projects';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects().catch(() => []);
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/quote'), changeFrequency: 'monthly', priority: 0.9 },
    ...SERVICES.map((s) => ({ url: url(`/services/${s.slug}`), changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: url('/work'), changeFrequency: 'weekly', priority: 0.7 },
    ...projects.map((p) => ({ url: url(`/work/${p.slug}`), lastModified: p.createdAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: url('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
