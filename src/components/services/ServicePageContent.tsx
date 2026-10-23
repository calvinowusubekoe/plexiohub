import Link from 'next/link';
import { Check } from 'lucide-react';
import type { Service } from '@/config/services';
import { site } from '@/config/site';
import type { Project } from '@/lib/data/projects';
import { waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/layout/WhatsAppIcon';
import { Icon } from '@/components/ui/Icon';
import { ProjectCard } from '@/components/work/ProjectCard';

export function serviceWhatsAppMessage(service: Service): string {
  return `Hi PlexioHub, I'm interested in ${service.name}.`;
}

const container = 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8';

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-line pt-6">
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-ink-muted">
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
      <section className="border-b border-line bg-surface">
        <div className={`${container} py-14 sm:py-20`}>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-muted">
            <Link href="/#services" className="hover:text-navy">
              Services
            </Link>
            <span aria-hidden>/</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-navy">
              <Icon name={service.icon} className="h-4 w-4 text-brand" />
              {service.name}
            </span>
          </nav>
          <h1 className="mt-6 max-w-3xl text-balance text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-navy sm:text-5xl">
            {service.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{service.summary}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href={quoteHref} className="rounded-lg bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark">
              Get a Quote for this service
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-navy hover:text-green-700">
                <WhatsAppIcon className="h-5 w-5 text-green-600" /> Chat with us on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <section className={`${container} grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
        <div>
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">Who it&apos;s for</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{service.forWho}</p>
        </div>
        <div className="grid gap-10">
          <List title="What's included" items={service.included} />
          <List title="How it helps your business" items={service.benefits} />
          <List title="Examples" items={service.useCases} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-y border-line bg-surface">
          <div className={`${container} py-16 sm:py-20`}>
            <h2 className="mb-8 text-2xl font-bold text-navy sm:text-3xl">Related work</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`${container} py-16 sm:py-24`}>
        <div className="grid gap-8 rounded-2xl bg-navy p-8 text-white sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-white/75">
              Tell us about your project and we&apos;ll reply with a clear quote, usually within 24 hours.
            </p>
          </div>
          <Link href={quoteHref} className="justify-self-start rounded-lg bg-white px-6 py-3.5 font-semibold text-navy transition-colors hover:bg-blue-50">
            Get a Quote for this service
          </Link>
        </div>
      </section>
    </>
  );
}
