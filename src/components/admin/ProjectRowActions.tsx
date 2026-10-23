'use client';

import { useTransition } from 'react';
import { moveProject, removeProject, setProjectPublished } from '@/app/admin/(protected)/actions';

const btn = 'rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:border-brand disabled:opacity-40';

export function ProjectRowActions({ id, title, published, isFirst, isLast }: { id: string; title: string; published: boolean; isFirst: boolean; isLast: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={btn} disabled={pending || isFirst} aria-label={`Move ${title} up`} onClick={() => start(() => moveProject(id, 'up'))}>↑</button>
      <button type="button" className={btn} disabled={pending || isLast} aria-label={`Move ${title} down`} onClick={() => start(() => moveProject(id, 'down'))}>↓</button>
      <button type="button" className={btn} disabled={pending} onClick={() => start(() => setProjectPublished(id, !published))}>
        {published ? 'Hide' : 'Publish'}
      </button>
      <button
        type="button"
        className={`${btn} text-red-600`}
        disabled={pending}
        onClick={() => {
          if (confirm(`Delete "${title}"? This cannot be undone.`)) start(() => removeProject(id));
        }}
      >
        Delete
      </button>
    </div>
  );
}
