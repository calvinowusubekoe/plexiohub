import { ChevronLeft, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageHeader, btn } from '@/components/admin/ui';
import { getProjectById } from '@/lib/data/projects';

export const metadata: Metadata = { title: 'Edit project' };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = id === 'new' ? undefined : await getProjectById(id);
  if (id !== 'new' && !project) notFound();
  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-navy">
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Portfolio
      </Link>
      <PageHeader
        title={project ? project.title : 'Add project'}
        description={project ? 'Changes show on the website as soon as you save.' : 'Fill this in and save. It goes live straight away if Published is ticked.'}
        actions={
          project?.published ? (
            <Link href={`/work/${project.slug}`} target="_blank" className={btn.secondary}>
              <ExternalLink className="h-4 w-4" aria-hidden />
              View on website
            </Link>
          ) : undefined
        }
      />
      <ProjectForm project={project ?? undefined} />
    </>
  );
}
