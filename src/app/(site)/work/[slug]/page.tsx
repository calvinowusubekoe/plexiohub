import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getService } from '@/config/services';
import { getProjectBySlug, getPublishedProjects } from '@/lib/data/projects';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return {};
  return pageMetadata({ title: project.title, description: project.summary, path: `/work/${project.slug}`, image: project.coverImageUrl ?? undefined });
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();
  const firstService = project.serviceTags[0];

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <p className="text-sm font-semibold text-brand">
        <Link href="/work" className="hover:underline">Our work</Link> / {project.title}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className={project.kind === 'concept' ? 'rounded-full bg-amber-100 px-2.5 py-1 text-amber-800' : 'rounded-full bg-green-100 px-2.5 py-1 text-green-800'}>
          {project.kind === 'concept' ? 'Concept' : 'Client'}
        </span>
        {project.serviceTags.map((t) => (
          <Link key={t} href={`/services/${t}`} className="rounded-full bg-surface px-2.5 py-1 text-navy/70 hover:text-brand">
            {getService(t)?.name}
          </Link>
        ))}
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{project.title}</h1>
      <p className="mt-3 text-lg text-navy/75">{project.summary}</p>

      {project.coverImageUrl && (
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200">
          <Image src={project.coverImageUrl} alt={`${project.title} screenshot`} fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" priority />
        </div>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {project.problem && (
          <section>
            <h2 className="text-xl font-semibold">The problem</h2>
            <p className="mt-2 text-navy/75">{project.problem}</p>
          </section>
        )}
        {project.built && (
          <section>
            <h2 className="text-xl font-semibold">What we built</h2>
            <p className="mt-2 text-navy/75">{project.built}</p>
          </section>
        )}
      </div>

      {project.features.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Key features</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2 text-navy/80"><span aria-hidden className="text-brand">✓</span>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {project.galleryUrls.length > 0 && (
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {project.galleryUrls.map((url, i) => (
            <div key={url} className="relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-200">
              <Image src={url} alt={`${project.title} screenshot ${i + 2}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </section>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl bg-surface p-6">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-navy/20 bg-white px-5 py-3 font-semibold hover:border-brand">
            View live site ↗
          </a>
        )}
        <Link href={firstService ? `/quote?service=${firstService}` : '/quote'} className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">
          Get a Quote for something similar
        </Link>
      </div>
    </article>
  );
}
