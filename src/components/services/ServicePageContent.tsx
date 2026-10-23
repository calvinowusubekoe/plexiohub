import Link from 'next/link';
import { Check } from 'lucide-react';
import { IconTile } from '@/components/ui/Icon';
import type { Service } from '@/config/services';
import { site } from '@/config/site';
import type { Project } from '@/lib/data/projects';
import { waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/layout/WhatsAppIcon';
import { ProjectCard } from '@/components/work/ProjectCard';

export function serviceWhatsAppMessage(service: Service): string {
  return `Hi PlexioHub, I'm interested in ${service.name}.`;
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-navy/80">
            <Check className="mt-1 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServicePageContent({ service, projects }: { service: Service; projects: Project[] }) {
  const related = projects.filter((p) => p.serviceTags.includes(service.slug));
  const quoteHref = `/quote?service=${service.slug}`;
  const wa = waLink(site.whatsappNumber, serviceWhatsAppMessage(service));

  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold text-brand">
            <Link href="/#services" className="hover:underline">Services</Link> / {service.name}
          </p>
          <div className="mt-6">
            <IconTile name={service.icon} />
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{service.headline}</h1>
          <p className="mt-5 max-w-2xl text-lg text-navy/75">{service.summary}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href={quoteHref} className="rounded-lg bg-brand px-6 py-3.5 font-semibold text-white shadow-md shadow-brand/30 hover:bg-brand-dark">
              Get a Quote for this service
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-green-700 hover:underline">
                <WhatsAppIcon /> Chat with us on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold">Who it&apos;s for</h2>
          <p className="mt-3 text-lg text-navy/75">{service.forWho}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <List title="What's included" items={service.included} />
          <List title="How it helps your business" items={service.benefits} />
          <List title="Examples" items={service.useCases} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="mb-6 text-2xl font-bold">Related work</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl bg-navy p-8 text-white sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mt-2 text-white/75">Tell us about your project and we&apos;ll reply with a clear quote, usually within 24 hours.</p>
          <Link href={quoteHref} className="mt-6 inline-block rounded-lg bg-white px-6 py-3.5 font-semibold text-navy hover:bg-blue-50">
            Get a Quote for this service
          </Link>
        </div>
      </section>
    </>
  );
}
