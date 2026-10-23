'use client';

import { useEffect, useRef, useState } from 'react';
import type { BudgetCurrency, PreferredContact } from '@/config/budget';
import type { ServiceSlug } from '@/config/services';
import { site } from '@/config/site';
import { track } from '@/lib/analytics';
import { serviceNames } from '@/lib/quote/format';
import { STEP_FIELDS, validateStep, type QuoteStep } from '@/lib/quote/schema';
import { waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/layout/WhatsAppIcon';
import { BudgetStep, DetailsStep, ProjectStep, ServiceStep } from './steps';

export type QuoteDraft = {
  services: string[];
  goals: string;
  features: string[];
  serviceAnswers: Record<string, string>;
  budgetCurrency: BudgetCurrency;
  budgetRange: string;
  timeline: string;
  name: string;
  businessName: string;
  whatsapp: string;
  email: string;
  preferredContact: PreferredContact;
  country: string;
  consent: boolean;
  company_website: string;
};

type Status = 'editing' | 'sending' | 'success' | 'failed' | 'rate_limited';

const DRAFT_KEY = 'plexiohub-quote-draft';
const STEP_TITLES: Record<QuoteStep, string> = {
  1: 'Choose your service',
  2: 'Tell us about your project',
  3: 'Budget and timing',
  4: 'Your details',
};

function emptyDraft(services: string[]): QuoteDraft {
  return {
    services,
    goals: '',
    features: [],
    serviceAnswers: {},
    budgetCurrency: 'GHS',
    budgetRange: '',
    timeline: '',
    name: '',
    businessName: '',
    whatsapp: '',
    email: '',
    preferredContact: 'whatsapp',
    country: 'Ghana',
    consent: false,
    company_website: '',
  };
}

function readDraft(): Partial<QuoteDraft> | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<QuoteDraft>) : null;
  } catch {
    return null;
  }
}

function writeDraft(data: QuoteDraft | null) {
  try {
    if (data) sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, company_website: '' }));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Storage can be unavailable (private mode); the form still works without drafts.
  }
}

function revealHeading(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  el.focus({ preventScroll: true });
}

function fallbackMessage(d: QuoteDraft): string {
  return [
    `Hi PlexioHub, I'm ${d.name || '…'}${d.businessName ? ` from ${d.businessName}` : ''}.`,
    `I'd like a quote for: ${serviceNames(d.services) || 'a project'}.`,
    d.goals && `Goal: ${d.goals}`,
    d.budgetRange && `Budget: ${d.budgetRange}`,
    d.timeline && `Timeline: ${d.timeline}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function QuoteWizard({ initialServices = [] }: { initialServices?: ServiceSlug[] }) {
  const [data, setData] = useState<QuoteDraft>(() => emptyDraft(initialServices));
  const [step, setStep] = useState<QuoteStep>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('editing');
  const [started, setStarted] = useState(false);
  const draftLoaded = useRef(false);
  const sending = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setData((d) => ({ ...d, ...draft, services: initialServices.length ? initialServices : (draft.services ?? d.services), company_website: '' }));
    }
    draftLoaded.current = true;
    // Only on mount: a later prop change shouldn't wipe answers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (draftLoaded.current && status === 'editing') writeDraft(data);
  }, [data, status]);

  // After sending, bring the result into view: on phones the page is often scrolled far below it.
  useEffect(() => {
    if (status === 'success' || status === 'failed' || status === 'rate_limited') revealHeading(resultRef.current);
  }, [status]);

  const update = (patch: Partial<QuoteDraft>) => setData((d) => ({ ...d, ...patch }));

  const goTo = (s: QuoteStep) => {
    setStep(s);
    requestAnimationFrame(() => revealHeading(headingRef.current));
  };

  const next = () => {
    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;
    if (!started) {
      track('quote_started');
      setStarted(true);
    }
    goTo((step + 1) as QuoteStep);
  };

  const submit = async () => {
    if (sending.current) return;
    const stepErrors = validateStep(4, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;

    sending.current = true;
    setStatus('sending');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        track('quote_submitted', { services: data.services.join(',') });
        writeDraft(null);
        setStatus('success');
      } else if (res.status === 429) {
        setStatus('rate_limited');
      } else if (res.status === 400) {
        const body = (await res.json().catch(() => ({}))) as { errors?: Record<string, string> };
        const serverErrors = body.errors ?? {};
        setErrors(serverErrors);
        setStatus('editing');
        const firstStep = ([1, 2, 3, 4] as QuoteStep[]).find((s) => STEP_FIELDS[s].some((f) => serverErrors[f]));
        if (firstStep) goTo(firstStep);
      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('failed');
    } finally {
      sending.current = false;
    }
  };

  const wa = waLink(site.whatsappNumber, fallbackMessage(data));

  if (status === 'success') {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12" role="status">
        <div className="text-5xl" aria-hidden>🎉</div>
        <h2 ref={resultRef} tabIndex={-1} className="mt-4 scroll-mt-24 text-2xl font-bold focus:outline-none">Thanks, we&apos;ll get back to you within 24 hours</h2>
        <p className="mt-2 text-navy/70">We&apos;ve received your project details. Need us sooner? Message us on WhatsApp.</p>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-3 font-semibold text-white">
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        )}
      </div>
    );
  }

  if (status === 'failed' || status === 'rate_limited') {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12" role="alert">
        <h2 ref={resultRef} tabIndex={-1} className="scroll-mt-24 text-2xl font-bold focus:outline-none">
          {status === 'rate_limited' ? 'Please reach us on WhatsApp' : 'Sorry, something went wrong'}
        </h2>
        <p className="mt-3 text-navy/75">
          {status === 'rate_limited'
            ? "You've sent several requests recently. Please contact us on WhatsApp."
            : 'Your request may not have reached us. Send it on WhatsApp instead, or try again. Your answers are still here.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-3 font-semibold text-white">
              <WhatsAppIcon /> Send on WhatsApp
            </a>
          )}
          {status === 'failed' && (
            <button type="button" onClick={submit} className="rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:border-brand">
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  const isSending = status === 'sending';

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 4) submit();
        else next();
      }}
      className="rounded-3xl bg-white p-6 shadow-sm sm:p-10"
    >
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand">Step {step} of 4</p>
        <div className="mt-2 h-2 rounded-full bg-slate-100" aria-hidden>
          <div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${step * 25}%` }} />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="mt-5 scroll-mt-24 text-2xl font-bold focus:outline-none">
          {STEP_TITLES[step]}
        </h2>
      </div>

      {/* Honeypot: hidden from people; bots that fill it are silently ignored. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" value={data.company_website} onChange={(e) => update({ company_website: e.target.value })} />
      </div>

      {step === 1 && <ServiceStep data={data} errors={errors} update={update} />}
      {step === 2 && <ProjectStep data={data} errors={errors} update={update} />}
      {step === 3 && <BudgetStep data={data} errors={errors} update={update} />}
      {step === 4 && <DetailsStep data={data} errors={errors} update={update} />}

      <div className="mt-10 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button type="button" onClick={() => goTo((step - 1) as QuoteStep)} className="min-h-12 rounded-lg px-5 py-3 font-semibold text-navy/70 hover:bg-surface">
            Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" disabled={isSending} className="min-h-12 rounded-lg bg-brand px-7 py-3 font-semibold text-white hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70">
          {step < 4 ? 'Next' : isSending ? 'Sending…' : 'Send request'}
        </button>
      </div>
    </form>
  );
}
