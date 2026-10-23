import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePageContent } from '@/components/services/ServicePageContent';
import { SERVICES, getService } from '@/config/services';
import { getPublishedProjects } from '@/lib/data/projects';

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return { title: `${service.name} in Ghana`, description: service.summary };
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const projects = await getPublishedProjects();
  return <ServicePageContent service={service} projects={projects} />;
}
