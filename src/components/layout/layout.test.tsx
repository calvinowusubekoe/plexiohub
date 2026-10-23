import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFab } from './WhatsAppFab';
import { SERVICES } from '@/config/services';

describe('Header', () => {
  it('has a Get a Quote link and a WhatsApp link', () => {
    render(<Header />);
    const quote = screen.getAllByRole('link', { name: 'Get a Quote' })[0];
    expect(quote).toHaveAttribute('href', '/quote');
    const wa = screen.getAllByRole('link', { name: /whatsapp/i })[0];
    expect(wa.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);
  });
  it('has the main navigation', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const label of ['Services', 'Work', 'How We Work', 'FAQ', 'Contact']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument();
    }
  });
});

describe('Footer', () => {
  it('shows the tagline, location line, privacy link and all service links', () => {
    render(<Footer />);
    expect(screen.getByText('We Build. You Grow.')).toBeInTheDocument();
    expect(screen.getByText('Based in Ghana · Serving businesses worldwide')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /WhatsApp: \+233 53 982 1888/ }).getAttribute('href')).toMatch(/^https:\/\/wa\.me\/233539821888/);
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    for (const s of SERVICES) {
      expect(screen.getByRole('link', { name: s.name })).toHaveAttribute('href', `/services/${s.slug}`);
    }
  });
});

describe('WhatsAppFab', () => {
  beforeEach(() => {
    (window as unknown as { umami?: { track: (e: string) => void } }).umami = { track: vi.fn() };
  });
  it('prefills a service-specific message and tracks clicks', async () => {
    render(<WhatsAppFab message="Hi PlexioHub, I'm interested in Graphic Design" />);
    const link = screen.getByRole('link', { name: /chat with us on whatsapp/i });
    expect(link.getAttribute('href')).toContain('text=Hi%20PlexioHub');
    link.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(link);
    expect((window as unknown as { umami: { track: ReturnType<typeof vi.fn> } }).umami.track).toHaveBeenCalledWith(
      'whatsapp_click',
      undefined,
    );
  });
});
