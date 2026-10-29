import type { ReactNode } from 'react';

/** Shared admin styles, so every admin page reads as one tool. */
export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60',
  whatsapp:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-[#1FA855] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#178A45]',
  danger:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60',
  icon:
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink-muted transition-colors hover:border-navy/30 hover:text-navy disabled:cursor-not-allowed disabled:opacity-35',
};

export const field =
  'mt-1.5 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] text-navy placeholder:text-ink-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

export const label = 'block text-sm font-semibold text-navy';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1 text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, description, children, className = '' }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-line bg-white ${className}`}>
      {title && (
        <header className="border-b border-line px-5 py-4">
          <h2 className="font-semibold text-navy">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <p className="font-semibold text-navy">{title}</p>
      {children && <div className="mt-1 text-sm text-ink-muted">{children}</div>}
    </div>
  );
}
