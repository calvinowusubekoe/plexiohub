import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectRowActions } from '@/components/admin/ProjectRowActions';
import { EmptyState, PageHeader, btn } from '@/components/admin/ui';
import { getService } from '@/config/services';
import { getAllProjects } from '@/lib/data/projects';

export const metadata: Metadata = { title: 'Portfolio' };

export default async function ProjectsAdminPage() {
  const projects = await getAllProjects();
  const addButton = (
    <Link href="/admin/projects/new" className={btn.primary}>
      <Plus className="h-4 w-4" aria-hidden />
      Add project
    </Link>
  );

  return (
    <>
      <PageHeader title="Portfolio" description="Projects shown on the homepage and the Work page, in this order." actions={addButton} />
      {projects.length === 0 ? (
        <EmptyState title="No projects yet.">Add your first project to show it on the website.</EmptyState>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {projects.map((p, i) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap sm:px-5">
              <Link href={`/admin/projects/${p.id}`} className="relative block aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-navy">
                {p.coverImageUrl ? (
                  <Image src={p.coverImageUrl} alt="" fill sizes="112px" className="object-cover object-top" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center px-2 text-center text-[11px] font-semibold text-white">No image</span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/projects/${p.id}`} className="font-semibold text-navy hover:text-brand">
                    {p.title}
                  </Link>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.published ? 'bg-green-50 text-green-800 ring-1 ring-green-200' : 'bg-surface text-ink-muted ring-1 ring-line'
                    }`}
                  >
                    {p.published ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-muted">
                  {p.kind === 'concept' ? 'Concept' : 'Client'}
                  {p.serviceTags.length > 0 && `, ${p.serviceTags.map((t) => getService(t)?.filterLabel).join(', ')}`}
                  <span className="hidden sm:inline">, /work/{p.slug}</span>
                </p>
              </div>
              <ProjectRowActions id={p.id} title={p.title} published={p.published} isFirst={i === 0} isLast={i === projects.length - 1} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
