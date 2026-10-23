import { ArrowRight, Bot, Check, Mail, MapPin, Phone } from 'lucide-react';
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
import { IconTile } from '@/components/ui/Icon';
import { PortfolioGrid } from '@/components/work/PortfolioGrid';
import { FaqList } from './FaqList';

function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className={`text-sm font-semibold ${light ? 'text-blue-200' : 'text-brand'}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${light ? 'text-white' : ''}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/75' : 'text-navy/70'}`}>{intro}</p>}
    </div>
  );
}

const HERO_POINTS = ['Clear, upfront quotes', 'Built for phones', 'Support after launch'];

export function HomeSections({ projects, faqs }: { projects: Project[]; faqs: Faq[] }) {
  const [before] = content.hero.headline.split(content.hero.highlight);
  const wa = waLink(site.whatsappNumber, DEFAULT_WHATSAPP_MESSAGE);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-blue-100/70 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-brand-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              Digital solutions for growing businesses
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {before}
              <span className="text-brand">{content.hero.highlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/75">{content.hero.subheadline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/quote"
                className="rounded-lg bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
              >
                Get a Quote
              </Link>
              <a href="#work" className="group inline-flex items-center gap-1.5 font-semibold text-navy hover:text-brand">
                View Our Work
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy/75">
              {HERO_POINTS.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-brand" strokeWidth={2.5} aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-navy/70">
              <MapPin className="h-4 w-4" aria-hidden />
              {site.locationLine}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/hero.jpg"
                alt="A shop owner serving a customer in her store"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[55%_center]"
              />
            </div>
            <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5 sm:left-auto sm:right-6 sm:w-80">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                <Bot className="h-5 w-5" aria-hidden />
              </span>
              <div className="text-sm">
                <p className="font-semibold">New order on WhatsApp</p>
                <p className="text-navy/70">Your chatbot replied in 3 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <SectionHeading
            eyebrow="Problems we solve"
            title="Sound familiar?"
            intro="If any of these describe your business, we can help."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.problems.map((p) => (
              <div key={p.title} className="flex flex-col rounded-2xl border border-slate-200 p-6">
                <IconTile name={p.icon} />
                <h3 className="mt-5 flex-1 font-semibold leading-snug">{p.title}</h3>
                <p className="mt-4 flex gap-2 border-t border-slate-100 pt-4 text-sm leading-relaxed text-navy/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
                  <span>{p.fix}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <SectionHeading
            eyebrow="Services"
            title="What we build for you"
            intro="Practical digital tools that save you time and bring in customers."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.slug}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-brand/40 hover:shadow-md"
              >
                <IconTile name={s.icon} />
                <h3 className="mt-5 text-lg font-semibold">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/75">{s.summary}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                  aria-label={`Learn more about ${s.name}`}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how-we-work" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <SectionHeading eyebrow="How we work" title="Simple, clear and with you all the way" />
          <div className="relative">
            <div aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-slate-200 lg:block" />
            <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
              {content.process.map((step, i) => (
                <li key={step.title} className="relative">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-bold text-brand">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/75">{step.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="scroll-mt-20 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <SectionHeading
            eyebrow="Our work"
            title="Projects we've built"
            intro="What each project does, and the problem it solves."
          />
          <PortfolioGrid projects={projects} limit={6} />
        </div>
      </section>

      {/* Why us */}
      <section id="why-us" className="scroll-mt-20 bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <SectionHeading eyebrow="Why PlexioHub" title="Why businesses choose us" light />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {content.whyUs.map((w) => (
              <div key={w.title}>
                <IconTile name={w.icon} dark />
                <h3 className="mt-5 font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{w.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:py-24">
          <SectionHeading eyebrow="FAQ" title="Questions we often get" center />
          <FaqList faqs={faqs} />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:py-24 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something for your business"
              intro="Pick whichever is easiest for you. We usually reply within 24 hours."
            />
            <ul className="space-y-4">
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-100">
                      <WhatsAppIcon />
                    </span>
                    <span>
                      <span className="block text-sm text-navy/70">WhatsApp</span>
                      <span className="font-semibold group-hover:text-brand">Chat on WhatsApp</span>
                    </span>
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${site.email}`} className="group flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand ring-1 ring-blue-100">
                    <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm text-navy/70">Email</span>
                    <span className="font-semibold group-hover:text-brand">{site.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="group flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand ring-1 ring-blue-100">
                    <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm text-navy/70">Phone</span>
                    <span className="font-semibold group-hover:text-brand">{site.phone}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <form
            action="/quote"
            method="get"
            className="self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h3 className="text-xl font-semibold">Start your project</h3>
            <p className="mt-1 text-sm text-navy/70">Tell us what you need. It takes about 2 minutes.</p>
            <label htmlFor="contact-service" className="mt-6 block text-sm font-medium">
              What do you need help with?
            </label>
            <select
              id="contact-service"
              name="service"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3"
              defaultValue=""
            >
              <option value="">Not sure yet</option>
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3.5 font-semibold text-white transition hover:bg-brand-dark"
            >
              Continue to quote request
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
