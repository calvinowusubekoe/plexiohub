import { describe, expect, it } from 'vitest';
import { mapProjectRow } from './projects';
import { mapFaqRow } from './faqs';

const row = {
  id: 'p1', slug: 'palette-pleasers', title: 'Palette Pleasers', kind: 'concept',
  service_tags: ['website-design', 'not-a-service'], summary: 'Restaurant site', problem: 'P', built: 'B',
  features: null, live_url: 'https://palette-pleasers.netlify.app', cover_image_url: null, gallery_urls: null,
  sort_order: 2, published: true, created_at: '2026-10-23T00:00:00Z',
};

describe('mapProjectRow', () => {
  it('maps snake_case columns to the Project type', () => {
    const p = mapProjectRow(row);
    expect(p).toMatchObject({ id: 'p1', slug: 'palette-pleasers', kind: 'concept', liveUrl: 'https://palette-pleasers.netlify.app',
      coverImageUrl: null, sortOrder: 2, published: true, createdAt: '2026-10-23T00:00:00Z' });
  });
  it('turns null arrays into empty arrays', () => {
    const p = mapProjectRow(row);
    expect(p.features).toEqual([]);
    expect(p.galleryUrls).toEqual([]);
  });
  it('drops tags that are not known services', () => {
    expect(mapProjectRow(row).serviceTags).toEqual(['website-design']);
  });
});

describe('mapFaqRow', () => {
  it('maps sort_order', () => {
    expect(mapFaqRow({ id: 'f1', question: 'Q', answer: 'A', sort_order: 3 })).toEqual({ id: 'f1', question: 'Q', answer: 'A', sortOrder: 3 });
  });
});
