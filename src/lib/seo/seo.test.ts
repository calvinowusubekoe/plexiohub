import { describe, expect, it, vi } from 'vitest';
import { faqPageJsonLd, organizationJsonLd, serviceJsonLd } from './jsonld';
import { HOME_TITLE, pageMetadata } from './metadata';
import { getService } from '@/config/services';

vi.mock('@/lib/data/projects', () => ({
  getPublishedProjects: vi.fn().mockResolvedValue([{ slug: 'palette-pleasers', createdAt: '2026-10-01T00:00:00Z' }]),
}));

describe('JSON-LD', () => {
  it('describes PlexioHub as a professional service with six offers', () => {
    const org = organizationJsonLd();
    expect(org['@type']).toBe('ProfessionalService');
    expect(org.address.addressCountry).toBe('GH');
    expect(org.areaServed).toEqual(['GH', 'Worldwide']);
    expect(org.hasOfferCatalog.itemListElement).toHaveLength(6);
  });

  it('builds an FAQPage', () => {
    expect(faqPageJsonLd([{ id: '1', question: 'Q', answer: 'A', sortOrder: 0 }]).mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'Q',
      acceptedAnswer: { '@type': 'Answer', text: 'A' },
    });
  });

  it('builds a Service entity', () => {
    const s = serviceJsonLd(getService('ecommerce')!);
    expect(s).toMatchObject({ '@type': 'Service', name: 'E-commerce Solutions', provider: { name: 'PlexioHub' } });
  });
});

describe('pageMetadata', () => {
  it('sets canonical URL, OG and twitter card', () => {
    const m = pageMetadata({ title: 'Get a Quote', description: 'D', path: '/quote' });
    expect(m.title).toBe('Get a Quote');
    expect(m.alternates?.canonical).toBe('/quote');
    expect(m.openGraph).toMatchObject({ title: 'Get a Quote | PlexioHub', url: '/quote', siteName: 'PlexioHub' });
    expect(m.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('has the agreed home title', () => {
    expect(HOME_TITLE).toBe('PlexioHub — Websites, WhatsApp Chatbots & Automation in Ghana');
  });
});

describe('sitemap and robots', () => {
  it('lists public pages, services and projects but not admin', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const urls = (await sitemap()).map((e) => new URL(e.url).pathname);
    for (const p of ['/', '/quote', '/work', '/privacy', '/services/graphic-design', '/work/palette-pleasers']) {
      expect(urls).toContain(p);
    }
    expect(urls.filter((u) => u.startsWith('/services/'))).toHaveLength(6);
    expect(urls.some((u) => u.startsWith('/admin'))).toBe(false);
  });

  it('disallows admin and api', async () => {
    const { default: robots } = await import('@/app/robots');
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rules.disallow).toEqual(['/admin', '/api']);
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
