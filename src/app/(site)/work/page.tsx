import type { Metadata } from 'next';
import { PortfolioGrid } from '@/components/work/PortfolioGrid';
import { getPublishedProjects } from '@/lib/data/projects';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: 'Our Work',
  description: 'Website design, WhatsApp chatbot, automation, e-commerce and graphic design projects built by PlexioHub in Ghana.',
  path: '/work',
});

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Our work</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Projects we&apos;ve built</h1>
      <p className="mt-3 mb-10 max-w-2xl text-lg text-navy/70">What each project does, and the problem it solves for the business.</p>
      <PortfolioGrid projects={projects} />
    </section>
  );
}
