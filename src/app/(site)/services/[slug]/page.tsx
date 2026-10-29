import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePageContent } from '@/components/services/ServicePageContent';
import { SERVICES, getService } from '@/config/services';
import { getPublishedProjects } from '@/lib/data/projects';
import { jsonLdScript, serviceJsonLd } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({ title: `${service.name} in Ghana`, description: `${service.summary} Affordable ${service.name.toLowerCase()} for businesses in Ghana and worldwide.`, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const projects = await getPublishedProjects();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(serviceJsonLd(service)) }} />
      <ServicePageContent service={service} projects={projects} />
    </>
  );
}
