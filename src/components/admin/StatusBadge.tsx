import type { QuoteStatus } from '@/lib/data/quote-status';

export const STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
};

const STYLES: Record<QuoteStatus, { badge: string; dot: string }> = {
  new: { badge: 'bg-blue-50 text-blue-800 ring-blue-200', dot: 'bg-blue-500' },
  contacted: { badge: 'bg-amber-50 text-amber-800 ring-amber-200', dot: 'bg-amber-500' },
  quoted: { badge: 'bg-violet-50 text-violet-800 ring-violet-200', dot: 'bg-violet-500' },
  won: { badge: 'bg-green-50 text-green-800 ring-green-200', dot: 'bg-green-600' },
  lost: { badge: 'bg-slate-100 text-slate-700 ring-slate-200', dot: 'bg-slate-400' },
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const style = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${style.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const seconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}
