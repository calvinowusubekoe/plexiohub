import type { Metadata } from 'next';
import { RequestTable } from '@/components/admin/RequestTable';
import { PageHeader } from '@/components/admin/ui';
import { listQuotes } from '@/lib/data/quotes';

export const metadata: Metadata = { title: 'Quote requests' };

export default async function RequestsPage() {
  const rows = await listQuotes();
  return (
    <>
      <PageHeader title="Quote requests" description="Everyone who has asked for a quote through the website, newest first." />
      <RequestTable rows={rows} />
    </>
  );
}
