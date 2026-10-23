import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  isSlugTaken: vi.fn(),
  upsertProject: vi.fn(),
  saveFaq: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'admin' } } }) } }),
}));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('@/lib/data/projects', async (orig) => ({
  ...(await orig<object>()),
  isSlugTaken: mocks.isSlugTaken,
  upsertProject: mocks.upsertProject,
}));
vi.mock('@/lib/data/faqs', async (orig) => ({ ...(await orig<object>()), saveFaq: mocks.saveFaq }));

import { saveFaqAction, saveProject } from './(protected)/actions';

function projectForm(over: Record<string, string> = {}) {
  const f = new FormData();
  const fields = { title: 'Palette Pleasers', slug: 'palette-pleasers', kind: 'concept', summary: 'Restaurant site', problem: '', built: '', features: 'Menu\nContact form', liveUrl: '', coverImageUrl: '', galleryUrls: '[]', sortOrder: '0', ...over };
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  f.append('serviceTags', 'website-design');
  return f;
}

beforeEach(() => {
  Object.values(mocks).forEach((m) => m.mockReset());
  mocks.upsertProject.mockResolvedValue({ id: 'p1' });
});

describe('saveProject', () => {
  it('rejects a duplicate slug', async () => {
    mocks.isSlugTaken.mockResolvedValue(true);
    expect(await saveProject(projectForm())).toEqual({ ok: false, error: 'That URL name is already used by another project.' });
    expect(mocks.upsertProject).not.toHaveBeenCalled();
  });

  it('saves and revalidates public pages', async () => {
    mocks.isSlugTaken.mockResolvedValue(false);
    expect(await saveProject(projectForm())).toEqual({ ok: true, id: 'p1' });
    expect(mocks.upsertProject).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'palette-pleasers', serviceTags: ['website-design'], features: ['Menu', 'Contact form'], liveUrl: null, published: false }),
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/work');
  });

  it('rejects a non-http live URL', async () => {
    mocks.isSlugTaken.mockResolvedValue(false);
    const result = await saveProject(projectForm({ liveUrl: 'javascript:alert(1)' }));
    expect(result.ok).toBe(false);
    expect(mocks.upsertProject).not.toHaveBeenCalled();
  });
});

describe('saveFaqAction', () => {
  it('saves and revalidates the homepage', async () => {
    const f = new FormData();
    f.set('question', 'Q?');
    f.set('answer', 'A.');
    f.set('sortOrder', '2');
    expect(await saveFaqAction(f)).toEqual({ ok: true });
    expect(mocks.saveFaq).toHaveBeenCalledWith({ id: undefined, question: 'Q?', answer: 'A.', sortOrder: 2 });
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/');
  });

  it('requires a question and answer', async () => {
    const f = new FormData();
    f.set('question', ' ');
    f.set('answer', '');
    expect(await saveFaqAction(f)).toEqual({ ok: false, error: 'Question and answer are both required.' });
  });
});
