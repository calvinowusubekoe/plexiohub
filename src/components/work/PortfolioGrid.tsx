'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SERVICES, type ServiceSlug } from '@/config/services';
import type { Project } from '@/lib/data/projects';
import { ProjectCard } from './ProjectCard';

export function PortfolioGrid({ projects, limit }: { projects: Project[]; limit?: number }) {
  const [filter, setFilter] = useState<ServiceSlug | 'all'>('all');

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-semibold">New projects coming soon</p>
        <p className="mt-1 text-sm text-navy/60">We&apos;re adding recent work here. Ask us on WhatsApp for examples.</p>
      </div>
    );
  }

  const usedTags = new Set(projects.flatMap((p) => p.serviceTags));
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.serviceTags.includes(filter));
  const shown = limit ? filtered.slice(0, limit) : filtered;
  const filters: { value: ServiceSlug | 'all'; label: string; enabled: boolean }[] = [
    { value: 'all', label: 'All', enabled: true },
    ...SERVICES.map((s) => ({ value: s.slug, label: s.filterLabel, enabled: usedTags.has(s.slug) })),
  ];

  return (
    <div>
      <div role="group" aria-label="Filter projects by service" className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            disabled={!f.enabled}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
              filter === f.value ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white text-navy hover:border-brand'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {limit !== undefined && (
        <div className="mt-8 text-center">
          <Link href="/work" className="font-semibold text-brand hover:underline">
            See all work
          </Link>
        </div>
      )}
    </div>
  );
}
