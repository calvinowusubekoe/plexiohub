import type { Metadata } from 'next';
import { RequestTable } from '@/components/admin/RequestTable';
import { listQuotes } from '@/lib/data/quotes';

export const metadata: Metadata = { title: 'Quote requests' };

export default async function RequestsPage() {
  const rows = await listQuotes();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Quote requests</h1>
      <RequestTable rows={rows} />
    </>
  );
}
