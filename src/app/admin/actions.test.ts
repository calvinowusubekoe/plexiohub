import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  user: { id: 'admin' } as { id: string } | null,
  updateQuote: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: async () => ({ auth: { getUser: async () => ({ data: { user: mocks.user } }), signOut: vi.fn() } }),
}));
vi.mock('next/navigation', () => ({
  redirect: (to: string) => {
    throw new Error(`REDIRECT:${to}`);
  },
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('@/lib/data/quotes', async (orig) => ({ ...(await orig<object>()), updateQuote: mocks.updateQuote }));

import { saveQuoteNotes, updateQuoteStatus } from './(protected)/actions';

beforeEach(() => {
  mocks.user = { id: 'admin' };
  mocks.updateQuote.mockReset();
  mocks.revalidatePath.mockReset();
});

describe('updateQuoteStatus', () => {
  it('updates a valid status and revalidates admin pages', async () => {
    await updateQuoteStatus('q1', 'quoted');
    expect(mocks.updateQuote).toHaveBeenCalledWith('q1', { status: 'quoted' });
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/admin', 'layout');
  });

  it('rejects a status outside the five values', async () => {
    await expect(updateQuoteStatus('q1', 'deleted' as never)).rejects.toThrow('Invalid status');
    expect(mocks.updateQuote).not.toHaveBeenCalled();
  });

  it('redirects to login when not signed in', async () => {
    mocks.user = null;
    await expect(updateQuoteStatus('q1', 'won')).rejects.toThrow('REDIRECT:/admin/login');
    expect(mocks.updateQuote).not.toHaveBeenCalled();
  });
});

describe('saveQuoteNotes', () => {
  it('saves notes, trimmed and capped at 5000 characters', async () => {
    await saveQuoteNotes('q1', `  ${'x'.repeat(6000)}  `);
    expect(mocks.updateQuote).toHaveBeenCalledWith('q1', { notes: 'x'.repeat(5000) });
  });
});
