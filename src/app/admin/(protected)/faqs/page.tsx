import type { Metadata } from 'next';
import { FaqEditor } from '@/components/admin/FaqEditor';
import { PageHeader } from '@/components/admin/ui';
import { getFaqsAdmin } from '@/lib/data/faqs';

export const metadata: Metadata = { title: 'FAQs' };

export default async function FaqsAdminPage() {
  const faqs = await getFaqsAdmin();
  return (
    <>
      <PageHeader title="FAQs" description="Questions shown in the FAQ section of the homepage, in this order." />
      <FaqEditor faqs={faqs} />
    </>
  );
}
