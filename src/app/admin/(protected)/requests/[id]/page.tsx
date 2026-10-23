import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuoteControls } from '@/components/admin/QuoteControls';
import { RequestDetail } from '@/components/admin/RequestDetail';
import { getQuote } from '@/lib/data/quotes';

export const metadata: Metadata = { title: 'Quote request' };

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const quote = await getQuote((await params).id);
  if (!quote) notFound();
  return (
    <RequestDetail quote={quote}>
      <QuoteControls id={quote.id} status={quote.status} notes={quote.notes ?? ''} />
    </RequestDetail>
  );
}
