import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RequestDetail } from '@/components/admin/RequestDetail';
import { QuoteControls } from '@/components/admin/QuoteControls';
import { getQuote } from '@/lib/data/quotes';

export const metadata: Metadata = { title: 'Quote request' };

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const quote = await getQuote((await params).id);
  if (!quote) notFound();
  return (
    <>
      <Link href="/admin" className="mb-4 inline-block text-sm font-medium text-brand hover:underline">
        ← All requests
      </Link>
      <RequestDetail quote={quote}>
        <QuoteControls id={quote.id} status={quote.status} notes={quote.notes ?? ''} />
      </RequestDetail>
    </>
  );
}
