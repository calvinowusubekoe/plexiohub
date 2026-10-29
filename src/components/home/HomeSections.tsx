import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { content } from '@/config/content';
import { SERVICES } from '@/config/services';
import { site } from '@/config/site';
import type { Faq } from '@/lib/data/faqs';
import type { Project } from '@/lib/data/projects';
import { waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/layout/WhatsAppIcon';
import { DEFAULT_WHATSAPP_MESSAGE } from '@/components/layout/WhatsAppFab';
import { Icon } from '@/components/ui/Icon';
import { PortfolioGrid } from '@/components/work/PortfolioGrid';
import { FaqList } from './FaqList';
import { HeroVisual } from './HeroVisual';

const container = 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8';
const sectionY = 'py-20 sm:py-28';

function SectionHeading({ title, intro, light = false }: { title: string; intro?: string; light?: boolean }) {
  return (
    <div className="mb-12 max-w-2xl sm:mb-14">
      <h2 className={`text-balance text-[1.75rem] font-bold leading-tight tracking-tight sm:text-[2.5rem] ${light ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/75' : 'text-ink-muted'}`}>{intro}</p>}
    </div>
  );
}

const HERO_FACTS = ['Clear quote before work starts', 'Built for phones first', 'Support after launch'];

export function HomeSections({ projects, faqs }: { projects: Project[]; faqs: Faq[] }) {
  const wa = waLink(site.whatsappNumber, DEFAULT_WHATSAPP_MESSAGE);

  return (
    <>
      {/* Hero: the one bold moment. The three things PlexioHub builds, shown working together. */}
      <section className="border-b border-line bg-surface">
        <div className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.08fr_1fr] lg:gap-12 xl:gap-16 lg:py-24`}>
          <div>
            <h1 className="text-balance text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-navy sm:text-[3.25rem] lg:text-[3.1rem] xl:text-[3.5rem]">
              {content.hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{content.hero.subheadline}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/quote" className="rounded-lg bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark">
                Get a Quote
              </Link>
              <a href="#work" className="font-semibold text-navy underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-brand">
                View our work
              </a>
            </div>
            <ul className="mt-12 grid max-w-xl gap-3 border-t border-line pt-6 text-sm text-ink-muted sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
              {HERO_FACTS.map((f) => (
                <li key={f} className="font-medium sm:px-5 sm:first:pl-0">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* Problems: a plain problem / fix list reads as organised, not decorated. */}
      <section id="problems" className="scroll-mt-20 bg-white">
        <div className={`${container} ${sectionY}`}>
          <SectionHeading title="Sound familiar?" intro="If any of these describe your business, we can help." />
          <dl className="border-t border-line">
            {content.problems.map((p) => (
              <div key={p.title} className="grid gap-2 border-b border-line py-7 md:grid-cols-[1fr_1.15fr] md:gap-12">
                <dt className="text-lg font-semibold leading-snug text-navy">{p.title}</dt>
                <dd className="leading-relaxed text-ink-muted">{p.fix}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 border-y border-line bg-surface">
        <div className={`${container} ${sectionY}`}>
          <SectionHeading title="What we build for you" intro="Practical digital tools that save you time and bring in customers." />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.slug} className="flex flex-col bg-white p-7 sm:p-8">
                <Icon name={s.icon} className="h-6 w-6 text-brand" />
                <h3 className="mt-6 text-lg font-semibold text-navy">{s.name}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-ink-muted">{s.summary}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-6 self-start text-sm font-semibold text-brand underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-brand"
                  aria-label={`Learn more about ${s.name}`}
                >
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process: a real sequence, so numbered. */}
      <section id="how-we-work" className="scroll-mt-20 bg-white">
        <div className={`${container} ${sectionY}`}>
          <SectionHeading title="How we work with you" intro="Six clear steps, and you know what happens next at every one." />
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {content.process.map((step, i) => (
              <li key={step.title} className="border-t-2 border-line pt-5 first:border-brand">
                <span className="text-sm font-semibold text-brand">Step {i + 1}</span>
                <h3 className="mt-1 text-lg font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{step.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="scroll-mt-20 border-y border-line bg-surface">
        <div className={`${container} ${sectionY}`}>
          <SectionHeading title="Projects we've built" intro="What each project does, and the problem it solves." />
          <PortfolioGrid projects={projects} limit={6} />
        </div>
      </section>

      {/* Why us */}
      <section id="why-us" className="scroll-mt-20 bg-navy text-white">
        <div className={`${container} ${sectionY} grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
          <div>
            <SectionHeading
              title="Why businesses choose PlexioHub"
              intro="You work directly with the person building your project, from the first message to long after launch."
              light
            />
          </div>
          <dl className="border-t border-white/15">
            {content.whyUs.map((w) => (
              <div key={w.title} className="grid gap-1 border-b border-white/15 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
                <dt className="font-semibold">{w.title}</dt>
                <dd className="leading-relaxed text-white/75">{w.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white">
        <div className={`${container} ${sectionY} grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
          <div>
            <SectionHeading title="Questions we often get" />
            {wa && (
              <p className="-mt-6 text-ink-muted">
                Something else?{' '}
                <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline decoration-2 underline-offset-4">
                  Ask us on WhatsApp
                </a>
              </p>
            )}
          </div>
          <FaqList faqs={faqs} />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 border-t border-line bg-surface">
        <div className={`${container} ${sectionY} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <SectionHeading
              title="Let's build something for your business"
              intro="Pick whichever is easiest for you. We usually reply within 24 hours."
            />
            <ul className="divide-y divide-line border-y border-line">
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-5">
                    <WhatsAppIcon className="h-5 w-5 text-green-700" />
                    <span className="w-24 text-sm text-ink-muted">WhatsApp</span>
                    <span className="font-semibold text-navy group-hover:text-brand">{site.phone}</span>
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${site.email}`} className="group flex items-center gap-4 py-5">
                  <Mail className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden />
                  <span className="w-24 text-sm text-ink-muted">Email</span>
                  <span className="break-all font-semibold text-navy group-hover:text-brand">{site.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="group flex items-center gap-4 py-5">
                  <Phone className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden />
                  <span className="w-24 text-sm text-ink-muted">Phone</span>
                  <span className="font-semibold text-navy group-hover:text-brand">{site.phone}</span>
                </a>
              </li>
            </ul>
          </div>
          <form action="/quote" method="get" className="self-start rounded-2xl border border-line bg-white p-6 sm:p-9">
            <h3 className="text-xl font-semibold text-navy">Start your project</h3>
            <p className="mt-1 text-ink-muted">Tell us what you need. It takes about 2 minutes.</p>
            <label htmlFor="contact-service" className="mt-7 block text-sm font-semibold text-navy">
              What do you need help with?
            </label>
            <select
              id="contact-service"
              name="service"
              className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-3 text-navy focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
              defaultValue=""
            >
              <option value="">Not sure yet</option>
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <button type="submit" className="mt-5 w-full rounded-lg bg-brand px-5 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark">
              Continue to quote request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
