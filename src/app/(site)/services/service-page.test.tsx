import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServicePageContent } from '@/components/services/ServicePageContent';
import { getService } from '@/config/services';
import type { Project } from '@/lib/data/projects';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));
vi.mock('@/lib/data/projects', () => ({ getPublishedProjects: vi.fn().mockResolvedValue([]) }));

function project(slug: string, tag: Project['serviceTags'][number]): Project {
  return {
    id: slug, slug, title: slug, kind: 'client', serviceTags: [tag], summary: '', problem: '', built: '', features: [],
    liveUrl: null, coverImageUrl: null, galleryUrls: [], sortOrder: 0, published: true, createdAt: '2026-10-23',
  };
}

describe('ServicePageContent', () => {
  const service = getService('graphic-design')!;
  const projects = [project('logo-job', 'graphic-design'), project('shop', 'ecommerce')];

  it('renders the headline, lists and a pre-selected quote link', () => {
    render(<ServicePageContent service={service} projects={projects} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(service.headline);
    expect(screen.getByText(service.included[0])).toBeInTheDocument();
    expect(screen.getByText(service.benefits[0])).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Get a Quote for this service' })[0]).toHaveAttribute(
      'href',
      '/quote?service=graphic-design',
    );
  });

  it('prefills the WhatsApp message with the service', () => {
    render(<ServicePageContent service={service} projects={projects} />);
    const wa = screen.getByRole('link', { name: /chat with us on whatsapp/i });
    expect(decodeURIComponent(wa.getAttribute('href') ?? '')).toContain('Graphic Design');
  });

  it('shows only related projects', () => {
    render(<ServicePageContent service={service} projects={projects} />);
    expect(screen.getByRole('heading', { name: 'logo-job' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'shop' })).not.toBeInTheDocument();
  });
});

describe('service page route', () => {
  it('calls notFound for an unknown slug', async () => {
    const { default: ServicePage } = await import('./[slug]/page');
    await expect(ServicePage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
