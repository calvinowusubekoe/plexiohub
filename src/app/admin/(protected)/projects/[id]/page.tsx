import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { getProjectById } from '@/lib/data/projects';

export const metadata: Metadata = { title: 'Edit project' };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = id === 'new' ? undefined : await getProjectById(id);
  if (id !== 'new' && !project) notFound();
  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-block text-sm font-medium text-brand hover:underline">← All projects</Link>
      <h1 className="mb-6 text-2xl font-bold">{project ? `Edit: ${project.title}` : 'Add project'}</h1>
      <ProjectForm project={project ?? undefined} />
    </>
  );
}
