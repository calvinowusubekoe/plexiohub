import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhatsAppFab } from './WhatsAppFab';

const pathname = vi.hoisted(() => ({ value: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => pathname.value }));

function fabText() {
  const href = screen.getByRole('link', { name: /chat with us on whatsapp/i }).getAttribute('href') ?? '';
  return decodeURIComponent(href.split('text=')[1] ?? '');
}

describe('WhatsAppFab on different pages', () => {
  it('names the service on a service page', () => {
    pathname.value = '/services/graphic-design';
    render(<WhatsAppFab />);
    expect(fabText()).toBe("Hi PlexioHub, I'm interested in Graphic Design.");
  });
  it('uses the general message elsewhere', () => {
    pathname.value = '/work';
    render(<WhatsAppFab />);
    expect(fabText()).toBe("Hi PlexioHub, I'd like to talk about a project.");
  });
});
