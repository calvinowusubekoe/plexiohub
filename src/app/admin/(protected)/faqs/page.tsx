import type { Metadata } from 'next';
import { FaqEditor } from '@/components/admin/FaqEditor';
import { getFaqsAdmin } from '@/lib/data/faqs';

export const metadata: Metadata = { title: 'FAQs' };

export default async function FaqsAdminPage() {
  const faqs = await getFaqsAdmin();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">FAQs</h1>
      <FaqEditor faqs={faqs} />
    </>
  );
}
