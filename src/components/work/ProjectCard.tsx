import Image from 'next/image';
import Link from 'next/link';
import { getService } from '@/config/services';
import type { Project } from '@/lib/data/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/work/${project.slug}`} className="relative block aspect-[16/10] bg-gradient-to-br from-blue-100 to-brand/70">
        {project.coverImageUrl ? (
          <Image src={project.coverImageUrl} alt={`${project.title} preview`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white/90">{project.title}</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className={project.kind === 'concept' ? 'rounded-full bg-amber-100 px-2.5 py-1 text-amber-800' : 'rounded-full bg-green-100 px-2.5 py-1 text-green-800'}>
            {project.kind === 'concept' ? 'Concept' : 'Client'}
          </span>
          {project.serviceTags.map((t) => (
            <span key={t} className="rounded-full bg-surface px-2.5 py-1 text-navy/70">
              {getService(t)?.filterLabel}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold">
          <Link href={`/work/${project.slug}`} className="hover:text-brand">
            {project.title}
          </Link>
        </h3>
        <p className="text-sm text-navy/70">{project.summary}</p>
        {project.problem && (
          <p className="text-sm">
            <span className="font-semibold">Problem solved: </span>
            <span className="text-navy/70">{project.problem}</span>
          </p>
        )}
      </div>
    </article>
  );
}
