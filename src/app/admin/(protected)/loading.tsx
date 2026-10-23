/** Shown instantly while an admin page fetches its data, so every click responds right away. */
export default function AdminLoading() {
  const bar = 'rounded-md bg-line/70 motion-safe:animate-pulse';
  return (
    <div role="status" aria-label="Loading">
      <div className={`${bar} h-8 w-56`} />
      <div className={`${bar} mt-3 h-4 w-80 max-w-full`} />
      <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${bar} h-[4.5rem] rounded-xl`} />
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-6 border-b border-line px-5 py-5 last:border-0">
            <div className={`${bar} h-4 w-40`} />
            <div className={`${bar} hidden h-4 flex-1 md:block`} />
            <div className={`${bar} h-5 w-20 rounded-full`} />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
