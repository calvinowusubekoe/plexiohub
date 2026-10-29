'use client';

import { usePathname } from 'next/navigation';
import { getService } from '@/config/services';
import { site } from '@/config/site';
import { track } from '@/lib/analytics';
import { waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

export const DEFAULT_WHATSAPP_MESSAGE = "Hi PlexioHub, I'd like to talk about a project.";

/** On /services/<slug>, the prefilled message names that service. */
function messageForPath(pathname: string | null): string {
  const slug = pathname?.match(/^\/services\/([^/]+)/)?.[1];
  const service = slug ? getService(slug) : undefined;
  return service ? `Hi PlexioHub, I'm interested in ${service.name}.` : DEFAULT_WHATSAPP_MESSAGE;
}

export function WhatsAppFab({ message }: { message?: string }) {
  const pathname = usePathname();
  const href = waLink(site.whatsappNumber, message ?? messageForPath(pathname));
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click')}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-95 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
