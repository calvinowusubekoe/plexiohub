'use client';

import Link from 'next/link';
import { useState } from 'react';
import { site } from '@/config/site';
import { track } from '@/lib/analytics';
import { waLink } from '@/lib/whatsapp';
import { Logo } from './Logo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { DEFAULT_WHATSAPP_MESSAGE } from './WhatsAppFab';

export const NAV = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'How We Work', href: '/#how-we-work' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const wa = waLink(site.whatsappNumber, DEFAULT_WHATSAPP_MESSAGE);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-5 text-sm font-medium text-navy/80 xl:gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click')}
              className="hidden items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-green-700 hover:underline md:inline-flex lg:hidden xl:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>WhatsApp {site.phone}</span>
            </a>
          )}
          <Link
            href="/quote"
            className="whitespace-nowrap rounded-lg bg-brand px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark sm:px-4"
          >
            Get a Quote
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-surface lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-3 font-medium" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-3 font-semibold text-green-700">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp {site.phone}
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
