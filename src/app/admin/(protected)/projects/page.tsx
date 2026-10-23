import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectRowActions } from '@/components/admin/ProjectRowActions';
import { getAllProjects } from '@/lib/data/projects';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsAdminPage() {
  const projects = await getAllProjects();
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Portfolio projects</h1>
        <Link href="/admin/projects/new" className="rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark">
          Add project
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-navy/70">No projects yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {projects.map((p, i) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Link href={`/admin/projects/${p.id}`} className="font-semibold hover:text-brand">{p.title}</Link>
                <p className="text-xs text-navy/70">
                  /work/{p.slug} · {p.kind === 'concept' ? 'Concept' : 'Client'} · {p.published ? 'Published' : 'Hidden'}
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
