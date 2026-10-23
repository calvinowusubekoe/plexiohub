import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { HomeSections } from './HomeSections';
import { SERVICES } from '@/config/services';

const EMOJI = /\p{Extended_Pictographic}/u;

const faqs = [{ id: 'f1', question: 'How long does it take?', answer: '1–3 weeks.', sortOrder: 0 }];

describe('HomeSections', () => {
  it('renders the sections in the agreed order', () => {
    render(<HomeSections projects={[]} faqs={faqs} />);
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.closest('section')?.id);
    expect(headings).toEqual(['problems', 'services', 'how-we-work', 'work', 'why-us', 'faq', 'contact']);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Grow your business without the tech headache');
  });

  it('has the hero calls to action', () => {
    render(<HomeSections projects={[]} faqs={faqs} />);
    const hero = screen.getByRole('heading', { level: 1 }).closest('section') as HTMLElement;
    expect(within(hero).getByRole('link', { name: 'Get a Quote' })).toHaveAttribute('href', '/quote');
    expect(within(hero).getByRole('link', { name: /view our work/i })).toHaveAttribute('href', '#work');
  });

  it('links every service card to its page', () => {
    render(<HomeSections projects={[]} faqs={faqs} />);
    const links = screen.getAllByRole('link', { name: /learn more/i });
    expect(links.map((l) => l.getAttribute('href'))).toEqual(SERVICES.map((s) => `/services/${s.slug}`));
  });

  it('uses icons, not emoji', () => {
    const { container } = render(<HomeSections projects={[]} faqs={faqs} />);
    expect(container.textContent).not.toMatch(EMOJI);
    const services = container.querySelector('#services') as HTMLElement;
    expect(services.querySelectorAll('svg.lucide')).toHaveLength(SERVICES.length);
  });

  it('renders FAQs as native disclosure widgets', () => {
    render(<HomeSections projects={[]} faqs={faqs} />);
    expect(screen.getByText('How long does it take?').closest('details')).not.toBeNull();
  });
});
