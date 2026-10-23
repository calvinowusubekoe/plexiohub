import Link from 'next/link';

/** Text wordmark until the founder supplies the logo file (spec §12). */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-1 text-lg font-bold tracking-tight sm:text-xl" aria-label="PlexioHub home">
      <span aria-hidden className="relative mr-0.5 inline-block h-3 w-3">
        <span className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-navy" />
        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-brand" />
      </span>
      <span className={light ? 'text-white' : 'text-navy'}>Plexio</span>
      <span className={light ? '-ml-1 text-blue-300' : '-ml-1 text-brand'}>hub</span>
    </Link>
  );
}
