import type { Metadata } from 'next';
import { HomeSections } from '@/components/home/HomeSections';
import { getFaqs } from '@/lib/data/faqs';
import { getPublishedProjects } from '@/lib/data/projects';
import { faqPageJsonLd, jsonLdScript, organizationJsonLd } from '@/lib/seo/jsonld';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/seo/metadata';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { title: HOME_TITLE, description: HOME_DESCRIPTION, url: '/' },
};

export default async function HomePage() {
  const [projects, faqs] = await Promise.all([getPublishedProjects(), getFaqs()]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageJsonLd(faqs)) }} />
      <HomeSections projects={projects} faqs={faqs} />
    </>
  );
}
