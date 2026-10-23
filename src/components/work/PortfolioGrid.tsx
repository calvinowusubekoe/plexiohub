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
      <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
        <p className="font-semibold">New projects coming soon</p>
        <p className="mt-1 text-sm text-navy/70">We&apos;re adding recent work here. Ask us on WhatsApp for examples.</p>
      </div>
    );
  }

  const usedTags = new Set(projects.flatMap((p) => p.serviceTags));
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.serviceTags.includes(filter));
  const shown = limit ? filtered.slice(0, limit) : filtered;
  // Only categories that have work; with fewer than two there is nothing to filter.
  const filters: { value: ServiceSlug | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...SERVICES.filter((s) => usedTags.has(s.slug)).map((s) => ({ value: s.slug, label: s.filterLabel })),
  ];
  const showFilters = filters.length > 2;

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label="Filter projects by service" className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.value ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {shown.length === 1 ? (
        <ProjectCard project={shown[0]} wide />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {limit !== undefined && (
        <div className="mt-10">
          <Link href="/work" className="font-semibold text-navy underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-brand">
            See all work
          </Link>
        </div>
      )}
    </div>
  );
}
