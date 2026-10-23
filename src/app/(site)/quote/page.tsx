import type { Metadata } from 'next';
import { QuoteWizard } from '@/components/quote/QuoteWizard';
import { parseServiceParam } from '@/components/quote/parseServiceParam';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Get a Quote',
  description: 'Tell PlexioHub about your website, WhatsApp chatbot, automation or design project and get a clear quote, usually within 24 hours.',
  path: '/quote',
});

type Props = { searchParams: Promise<{ service?: string | string[] }> };

export default async function QuotePage({ searchParams }: Props) {
  const initialServices = parseServiceParam((await searchParams).service);
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Get a Quote</h1>
        <p className="mt-2 mb-8 text-lg text-navy/70">Answer a few quick questions. It takes about 2 minutes.</p>
        <QuoteWizard initialServices={initialServices} />
      </div>
    </section>
  );
}
