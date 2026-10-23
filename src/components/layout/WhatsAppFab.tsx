'use client';

import { site } from '@/config/site';
import { track } from '@/lib/analytics';
import { waLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

export const DEFAULT_WHATSAPP_MESSAGE = "Hi PlexioHub, I'd like to talk about a project.";

export function WhatsAppFab({ message = DEFAULT_WHATSAPP_MESSAGE }: { message?: string }) {
  const href = waLink(site.whatsappNumber, message);
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
