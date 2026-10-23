import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestTable } from '@/components/admin/RequestTable';
import { RequestDetail } from '@/components/admin/RequestDetail';
import type { QuoteRow } from '@/lib/data/quotes';

function row(over: Partial<QuoteRow>): QuoteRow {
  return {
    id: 'q', created_at: '2026-10-20T10:00:00Z', status: 'new', services: ['website-design'], goals: 'More customers',
    features: [], service_answers: {}, budget_currency: 'GHS', budget_range: 'GHS 1,000–3,000', timeline: 'ASAP',
    name: 'Ama', business_name: null, whatsapp: '024 123 4567', email: null, preferred_contact: 'whatsapp',
    country: 'Ghana', notes: null, ...over,
  };
}

const rows = [
  row({ id: 'a', name: 'Older Contacted', status: 'contacted', created_at: '2026-10-01T10:00:00Z' }),
  row({ id: 'b', name: 'Newest New', status: 'new', created_at: '2026-10-22T10:00:00Z' }),
  row({ id: 'c', name: 'Won Deal', status: 'won', created_at: '2026-10-10T10:00:00Z', services: ['ecommerce', 'graphic-design'] }),
];

describe('RequestTable', () => {
  it('lists requests newest first with services, budget and status', () => {
    render(<RequestTable rows={rows} />);
    const links = screen.getAllByRole('link').filter((l) => l.getAttribute('href')?.startsWith('/admin/requests/'));
    expect(links.map((l) => l.textContent)).toEqual(['Newest New', 'Won Deal', 'Older Contacted']);
    const won = screen.getByRole('link', { name: 'Won Deal' }).closest('li') as HTMLElement;
    expect(within(won).getByText('E-commerce Solutions, Graphic Design')).toBeInTheDocument();
    expect(within(won).getByText('GHS 1,000–3,000')).toBeInTheDocument();
    expect(within(won).getByText('Won')).toBeInTheDocument();
  });

  it('filters by status', async () => {
    render(<RequestTable rows={rows} />);
    await userEvent.click(screen.getByRole('button', { name: /^Contacted/ }));
    expect(screen.getByRole('link', { name: 'Older Contacted' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Newest New' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /^All/ }));
    expect(screen.getByRole('link', { name: 'Newest New' })).toBeInTheDocument();
  });

  it('searches by client or business name', async () => {
    render(<RequestTable rows={[...rows, row({ id: 'd', name: 'Kofi', business_name: 'Kente House' })]} />);
    await userEvent.type(screen.getByRole('searchbox', { name: /search requests/i }), 'kente');
    expect(screen.getByRole('link', { name: 'Kofi' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Newest New' })).not.toBeInTheDocument();
  });

  it('shows an empty state', () => {
    render(<RequestTable rows={[]} />);
    expect(screen.getByText('No quote requests yet.')).toBeInTheDocument();
  });
});

describe('RequestDetail', () => {
  it('renders visitor HTML as plain text', () => {
    render(<RequestDetail quote={row({ goals: '<b>x</b>' })} />);
    expect(screen.getByText('<b>x</b>')).toBeInTheDocument();
  });

  it('links Reply on WhatsApp with a greeting', () => {
    render(<RequestDetail quote={row({ name: 'Ama' })} />);
    const href = screen.getByRole('link', { name: 'Reply on WhatsApp' }).getAttribute('href') ?? '';
    expect(href.startsWith('https://wa.me/233241234567?text=')).toBe(true);
    expect(decodeURIComponent(href)).toContain('Hi Ama, this is PlexioHub about your project request.');
  });

  it('hides the WhatsApp button for an invalid number and shows email reply', () => {
    render(<RequestDetail quote={row({ whatsapp: 'n/a', email: 'ama@example.com' })} />);
    expect(screen.queryByRole('link', { name: 'Reply on WhatsApp' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reply by email' })).toHaveAttribute('href', 'mailto:ama@example.com');
  });

  it('labels service answers with their questions', () => {
    render(<RequestDetail quote={row({ service_answers: { website_type: 'Redesign of an existing site' } })} />);
    expect(screen.getByText('Is this a new website or a redesign?')).toBeInTheDocument();
    expect(screen.getByText('Redesign of an existing site')).toBeInTheDocument();
  });
});
