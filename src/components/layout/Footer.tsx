import Link from 'next/link';
import { SERVICES } from '@/config/services';
import { site } from '@/config/site';
import { waLink } from '@/lib/whatsapp';
import { Logo } from './Logo';

export function Footer() {
  const wa = waLink(site.whatsappNumber);
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <Logo light />
          <p className="font-semibold">{site.tagline}</p>
          <p className="text-sm text-white/70">
            Affordable, professional digital solutions that help businesses simplify work and serve customers better.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Services</h2>
          <ul className="space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-white/85 hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Contact</h2>
          <ul className="space-y-2 text-sm text-white/85">
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp: {site.phone}
                </a>
              </li>
            )}
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-white">
                Phone: {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Follow us</h2>
          <ul className="space-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/quote"
            className="mt-5 inline-block rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 sm:px-6 lg:px-8 pb-20 text-xs text-white/75 sm:flex-row sm:justify-between sm:pb-5">
          <p>{site.locationLine}</p>
          <p>
            © {new Date().getFullYear()} PlexioHub ·{' '}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
