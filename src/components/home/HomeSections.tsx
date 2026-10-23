import Image from 'next/image';
import Link from 'next/link';
import { content } from '@/config/content';
import { SERVICES } from '@/config/services';
import { site } from '@/config/site';
import type { Faq } from '@/lib/data/faqs';
import type { Project } from '@/lib/data/projects';
import { waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/layout/WhatsAppIcon';
import { DEFAULT_WHATSAPP_MESSAGE } from '@/components/layout/WhatsAppFab';
import { PortfolioGrid } from '@/components/work/PortfolioGrid';
import { FaqList } from './FaqList';

function SectionHeading({ eyebrow, title, intro, light = false }: { eyebrow: string; title: string; intro?: string; light?: boolean }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className={`text-xs font-bold uppercase tracking-[0.14em] ${light ? 'text-blue-300' : 'text-brand'}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${light ? 'text-white' : ''}`}>{title}</h2>
      {intro && <p className={`mt-3 text-lg ${light ? 'text-white/75' : 'text-navy/70'}`}>{intro}</p>}
    </div>
  );
}

export function HomeSections({ projects, faqs }: { projects: Project[]; faqs: Faq[] }) {
  const [before] = content.hero.headline.split(content.hero.highlight);
  const wa = waLink(site.whatsappNumber, DEFAULT_WHATSAPP_MESSAGE);

  return (
    <>
      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-brand-dark">
              Websites · WhatsApp chatbots · Automation · Design
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {before}
              <span className="text-brand">{content.hero.highlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy/75">{content.hero.subheadline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/quote" className="rounded-lg bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand/30 hover:bg-brand-dark">
                Get a Quote
              </Link>
              <a href="#work" className="font-semibold text-brand hover:underline">
                View Our Work →
              </a>
            </div>
            <p className="mt-8 text-sm text-navy/70">📍 {site.locationLine}</p>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/hero.jpg"
                alt="A shop owner serving a customer in her store"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[55%_center]"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl bg-white p-4 text-sm shadow-lg sm:left-auto sm:right-6 sm:w-72">
              <p className="font-semibold">🛒 New order on WhatsApp</p>
              <p className="text-navy/70">Your chatbot replied in 3 seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="Problems we solve" title="Sound familiar?" intro="If any of these describe your business, we can help." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.problems.map((p) => (
              <div key={p.title} className="rounded-2xl border border-slate-200 p-6">
                <div className="text-3xl" aria-hidden>{p.icon}</div>
                <h3 className="mt-3 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-navy/70">
                  <span className="font-semibold text-brand">Our fix: </span>
                  {p.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="Services" title="What we build for you" intro="Practical digital tools that save you time and bring in customers." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.slug} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl" aria-hidden>{s.icon}</div>
                <h3 className="mt-3 text-lg font-semibold">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm text-navy/70">{s.summary}</p>
                <Link href={`/services/${s.slug}`} className="mt-4 font-semibold text-brand hover:underline" aria-label={`Learn more about ${s.name}`}>
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how-we-work" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="How we work" title="Simple, clear and with you all the way" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {content.process.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl border border-slate-200 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-navy/70">{step.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="scroll-mt-20 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="Our work" title="Projects we've built" intro="What each project does, and the problem it solves." />
          <PortfolioGrid projects={projects} limit={6} />
        </div>
      </section>

      {/* Why us */}
      <section id="why-us" className="scroll-mt-20 bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="Why PlexioHub" title="Why businesses choose us" light />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {content.whyUs.map((w) => (
              <div key={w.title}>
                <div className="text-3xl" aria-hidden>{w.icon}</div>
                <h3 className="mt-3 font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-white/70">{w.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="FAQ" title="Questions we often get" />
          <FaqList faqs={faqs} />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Contact" title="Let's build something for your business" intro="Pick whichever is easiest for you. We usually reply within 24 hours." />
            <ul className="space-y-4 text-lg">
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-green-700 hover:underline">
                    <WhatsAppIcon /> Chat on WhatsApp
                  </a>
                </li>
              )}
              <li>
                ✉️{' '}
                <a href={`mailto:${site.email}`} className="hover:text-brand">
                  {site.email}
                </a>
              </li>
              <li>
                📞{' '}
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-brand">
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>
          <form action="/quote" method="get" className="self-start rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold">Start your project</h3>
            <p className="mt-1 text-sm text-navy/70">Tell us what you need. It takes about 2 minutes.</p>
            <label htmlFor="contact-service" className="mt-5 block text-sm font-medium">
              What do you need help with?
            </label>
            <select id="contact-service" name="service" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3" defaultValue="">
              <option value="">Not sure yet</option>
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <button type="submit" className="mt-5 w-full rounded-lg bg-brand px-5 py-3.5 font-semibold text-white hover:bg-brand-dark">
              Continue to quote request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
