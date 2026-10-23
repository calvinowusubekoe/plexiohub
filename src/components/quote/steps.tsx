import Link from 'next/link';
import { BUDGET_RANGES, TIMELINES } from '@/config/budget';
import { SERVICES, getService, type ServiceQuestion } from '@/config/services';
import { CheckCard, FieldError, inputClass } from './fields';
import type { QuoteDraft } from './QuoteWizard';

type StepProps = {
  data: QuoteDraft;
  errors: Record<string, string>;
  update: (patch: Partial<QuoteDraft>) => void;
};

function toggle(list: string[], value: string, on: boolean): string[] {
  return on ? [...new Set([...list, value])] : list.filter((v) => v !== value);
}

export function ServiceStep({ data, errors, update }: StepProps) {
  const options = [...SERVICES.map((s) => ({ value: s.slug as string, label: `${s.icon} ${s.name}` })), { value: 'not-sure', label: '🤔 Not sure yet' }];
  return (
    <fieldset aria-describedby={errors.services ? 'services-error' : undefined}>
      <legend className="text-lg font-semibold">What do you need help with?</legend>
      <p className="mt-1 text-sm text-navy/60">Choose one or more.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <CheckCard
            key={o.value}
            name="services"
            value={o.value}
            checked={data.services.includes(o.value)}
            onChange={(on) => update({ services: toggle(data.services, o.value, on) })}
          >
            {o.label}
          </CheckCard>
        ))}
      </div>
      <FieldError id="services-error" message={errors.services} />
    </fieldset>
  );
}

function QuestionField({ q, value, onChange }: { q: ServiceQuestion; value: string; onChange: (v: string) => void }) {
  const id = `q-${q.id}`;
  if (q.type === 'checkboxes') {
    const selected = value ? value.split(', ') : [];
    return (
      <fieldset>
        <legend className="text-sm font-medium">{q.label}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {q.options?.map((opt) => (
            <CheckCard key={opt} name={q.id} value={opt} checked={selected.includes(opt)} onChange={(on) => onChange(toggle(selected, opt, on).join(', '))}>
              {opt}
            </CheckCard>
          ))}
        </div>
      </fieldset>
    );
  }
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {q.label}
      </label>
      {q.type === 'select' ? (
        <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {q.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : q.type === 'textarea' ? (
        <textarea id={id} rows={3} maxLength={2000} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type="text" maxLength={300} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function ProjectStep({ data, errors, update }: StepProps) {
  const services = data.services.map(getService).filter((s) => s !== undefined);
  const features = [...new Set(services.flatMap((s) => s.features))];
  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="goals" className="text-lg font-semibold">
          What do you want this to achieve?
        </label>
        <p className="mt-1 text-sm text-navy/60">For example: &quot;Get more customers from Google&quot; or &quot;Stop answering the same WhatsApp questions&quot;.</p>
        <textarea id="goals" rows={4} maxLength={2000} className={inputClass} value={data.goals} onChange={(e) => update({ goals: e.target.value })} />
        <FieldError id="goals-error" message={errors.goals} />
      </div>

      {features.length > 0 && (
        <fieldset>
          <legend className="text-lg font-semibold">Features you need</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <CheckCard key={f} name="features" value={f} checked={data.features.includes(f)} onChange={(on) => update({ features: toggle(data.features, f, on) })}>
                {f}
              </CheckCard>
            ))}
          </div>
        </fieldset>
      )}

      {services.map((s) => (
        <section key={s.slug} className="space-y-4 rounded-2xl bg-surface p-5">
          <h3 className="font-semibold">
            {s.icon} {s.name}
          </h3>
          {s.questions.map((q) => (
            <QuestionField
              key={q.id}
              q={q}
              value={data.serviceAnswers[q.id] ?? ''}
              onChange={(v) => update({ serviceAnswers: { ...data.serviceAnswers, [q.id]: v } })}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

export function BudgetStep({ data, errors, update }: StepProps) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-lg font-semibold">Currency</legend>
        <div className="mt-3 flex gap-3">
          {(['GHS', 'USD'] as const).map((c) => (
            <label key={c} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 ${data.budgetCurrency === c ? 'border-brand bg-blue-50' : 'border-slate-300'}`}>
              <input
                type="radio"
                name="budgetCurrency"
                value={c}
                checked={data.budgetCurrency === c}
                onChange={() => update({ budgetCurrency: c, budgetRange: '' })}
                className="h-5 w-5 accent-brand"
              />
              {c === 'GHS' ? 'GHS (₵)' : 'USD ($)'}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="budgetRange" className="text-lg font-semibold">
          Budget range
        </label>
        <select id="budgetRange" className={inputClass} value={data.budgetRange} onChange={(e) => update({ budgetRange: e.target.value })} aria-describedby={errors.budgetRange ? 'budget-error' : undefined}>
          <option value="">Choose a range</option>
          {BUDGET_RANGES[data.budgetCurrency].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <FieldError id="budget-error" message={errors.budgetRange} />
      </div>

      <div>
        <label htmlFor="timeline" className="text-lg font-semibold">
          Timeline
        </label>
        <select id="timeline" className={inputClass} value={data.timeline} onChange={(e) => update({ timeline: e.target.value })} aria-describedby={errors.timeline ? 'timeline-error' : undefined}>
          <option value="">When do you need it?</option>
          {TIMELINES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <FieldError id="timeline-error" message={errors.timeline} />
      </div>
    </div>
  );
}

export function DetailsStep({ data, errors, update }: StepProps) {
  const text = (id: keyof QuoteDraft, label: string, opts: { type?: string; autoComplete?: string; inputMode?: 'tel' | 'email' | 'text' } = {}) => (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={opts.type ?? 'text'}
        autoComplete={opts.autoComplete}
        inputMode={opts.inputMode}
        maxLength={150}
        className={inputClass}
        value={String(data[id] ?? '')}
        onChange={(e) => update({ [id]: e.target.value })}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      <FieldError id={`${id}-error`} message={errors[id]} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {text('name', 'Your name', { autoComplete: 'name' })}
        {text('businessName', 'Business name (optional)', { autoComplete: 'organization' })}
        {text('whatsapp', 'WhatsApp number', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
        {text('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
      </div>
      <p className="-mt-2 text-sm text-navy/60">Give us at least one: a WhatsApp number or an email.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredContact" className="text-sm font-medium">
            How should we contact you?
          </label>
          <select id="preferredContact" className={inputClass} value={data.preferredContact} onChange={(e) => update({ preferredContact: e.target.value as QuoteDraft['preferredContact'] })}>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="call">Phone call</option>
          </select>
        </div>
        {text('country', 'Country', { autoComplete: 'country-name' })}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => update({ consent: e.target.checked })}
            className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            I agree that PlexioHub may contact me about my project. See our{' '}
            <Link href="/privacy" target="_blank" className="font-medium text-brand underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />
      </div>
    </div>
  );
}
