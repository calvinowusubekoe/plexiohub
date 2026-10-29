import Image from 'next/image';
import Link from 'next/link';
import { getService } from '@/config/services';
import type { Project } from '@/lib/data/projects';

/** `wide` lays the card out side by side; used when a list has a single project to feature. */
export function ProjectCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  const services = project.serviceTags.map((t) => getService(t)?.filterLabel).filter(Boolean);
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-navy/25 ${
        wide ? 'grid md:grid-cols-[1.25fr_1fr]' : 'flex flex-col'
      }`}
    >
      <Link
        href={`/work/${project.slug}`}
        className={`relative block aspect-[16/10] overflow-hidden bg-navy ${wide ? 'border-b border-line md:aspect-auto md:min-h-[22rem] md:border-b-0 md:border-r' : 'border-b border-line'}`}
      >
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={`${project.title} preview`}
            fill
            sizes={wide ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-xl font-bold text-white">{project.title}</span>
        )}
      </Link>
      <div className={`flex flex-1 flex-col ${wide ? 'justify-center p-7 sm:p-10' : 'p-6'}`}>
        <p className="text-sm text-ink-muted">
          {project.kind === 'concept' ? 'Concept project' : 'Client project'}
          {services.length > 0 && <>, {services.join(', ')}</>}
        </p>
        <h3 className={`mt-2 font-semibold text-navy ${wide ? 'text-2xl' : 'text-lg'}`}>
          <Link href={`/work/${project.slug}`} className="hover:text-brand">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 leading-relaxed text-ink-muted">{project.summary}</p>
        {wide && project.problem && <p className="mt-4 leading-relaxed text-ink-muted">{project.problem}</p>}
        {wide && (
          <Link
            href={`/work/${project.slug}`}
            className="mt-7 self-start font-semibold text-navy underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-brand"
          >
            View project
          </Link>
        )}
      </div>
    </article>
  );
}
