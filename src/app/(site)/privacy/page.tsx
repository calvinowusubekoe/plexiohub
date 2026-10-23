import type { Metadata } from 'next';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How PlexioHub collects, uses and protects the information you share with us.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 text-navy">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-navy/70">Last updated: 23 October 2026</p>

      <div className="mt-8 space-y-8 leading-relaxed text-navy/85">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-navy">What we collect</h2>
          <p>
            When you request a quote, we collect the details you give us: your name, business name, WhatsApp number,
            email address, country, and information about your project (the services you need, your goals, features,
            budget range and timeline). We also store a one-way scrambled version of your internet (IP) address so we can
            block spam. It cannot be turned back into your address.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-navy">Why we collect it</h2>
          <p>
            We use your details only to reply to your request, prepare a quote and, if you go ahead, work with you on
            your project. We do not sell your information or use it for unrelated marketing.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-navy">Who handles it for us</h2>
          <p>We use a small number of trusted services to run this website:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Supabase: stores quote requests securely.</li>
            <li>Resend: sends us an email when you submit a request.</li>
            <li>CallMeBot: sends us a WhatsApp alert when you submit a request.</li>
            <li>Netlify: hosts this website.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-navy">How long we keep it</h2>
          <p>
            We keep quote requests for up to 2 years so we can follow up and keep records of our work, or delete them
            sooner if you ask us to.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-navy">Your choices</h2>
          <p>
            You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Email{' '}
            <a href={`mailto:${site.email}`} className="font-medium text-brand underline">
              {site.email}
            </a>{' '}
            and we will respond within a reasonable time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-navy">Contact</h2>
          <p>
            PlexioHub, {site.locationLine}. Email: {site.email}. Phone/WhatsApp: {site.phone}.
          </p>
        </section>
      </div>
    </article>
  );
}
