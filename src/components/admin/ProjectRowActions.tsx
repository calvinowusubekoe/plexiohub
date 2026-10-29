'use client';

import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { moveProject, removeProject, setProjectPublished } from '@/app/admin/(protected)/actions';
import { btn } from './ui';

export function ProjectRowActions({ id, title, published, isFirst, isLast }: { id: string; title: string; published: boolean; isFirst: boolean; isLast: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button type="button" className={btn.icon} disabled={pending || isFirst} aria-label={`Move ${title} up`} title="Move up" onClick={() => start(() => moveProject(id, 'up'))}>
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className={btn.icon} disabled={pending || isLast} aria-label={`Move ${title} down`} title="Move down" onClick={() => start(() => moveProject(id, 'down'))}>
        <ArrowDown className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={btn.icon}
        disabled={pending}
        aria-label={published ? `Hide ${title} from the website` : `Publish ${title}`}
        title={published ? 'Hide from website' : 'Publish'}
        onClick={() => start(() => setProjectPublished(id, !published))}
      >
        {published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <Link href={`/admin/projects/${id}`} className={btn.icon} aria-label={`Edit ${title}`} title="Edit">
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        type="button"
        className={`${btn.icon} hover:border-red-200 hover:text-red-700`}
        disabled={pending}
        aria-label={`Delete ${title}`}
        title="Delete"
        onClick={() => {
          if (confirm(`Delete "${title}"? This cannot be undone.`)) start(() => removeProject(id));
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
