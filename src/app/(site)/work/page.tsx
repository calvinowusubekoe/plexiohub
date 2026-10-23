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
      <h1 className="text-balance text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-navy sm:text-5xl">Projects we&apos;ve built</h1>
      <p className="mt-4 mb-12 max-w-2xl text-lg leading-relaxed text-ink-muted">What each project does, and the problem it solves for the business.</p>
      <PortfolioGrid projects={projects} />
    </section>
  );
}
