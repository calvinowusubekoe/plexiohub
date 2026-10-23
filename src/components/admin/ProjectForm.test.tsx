import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectForm } from './ProjectForm';
import { slugify, validateImageFile } from '@/lib/admin/projectForm';

vi.mock('@/app/admin/(protected)/actions', () => ({ saveProject: vi.fn() }));
vi.mock('@/lib/supabase/browser', () => ({ createBrowserClient: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));

describe('slugify', () => {
  it('makes URL-safe slugs', () => {
    expect(slugify('Palette Pleasers')).toBe('palette-pleasers');
    expect(slugify('  Ama’s Shop & Café!! ')).toBe('amas-shop-cafe');
  });
});

describe('validateImageFile', () => {
  it('accepts jpg/png/webp up to 5 MB', () => {
    expect(validateImageFile({ type: 'image/png', size: 1000 })).toBeNull();
    expect(validateImageFile({ type: 'image/gif', size: 1000 })).toBe('Please upload a JPG, PNG or WebP image.');
    expect(validateImageFile({ type: 'image/jpeg', size: 6 * 1024 * 1024 })).toBe('Images must be 5 MB or smaller.');
  });
});

describe('ProjectForm', () => {
  it('auto-fills the slug from the title until edited by hand', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);
    await user.type(screen.getByLabelText('Title'), 'Palette Pleasers');
    const slug = screen.getByLabelText(/URL name/) as HTMLInputElement;
    expect(slug.value).toBe('palette-pleasers');
    await user.clear(slug);
    await user.type(slug, 'my-slug');
    await user.type(screen.getByLabelText('Title'), ' Two');
    expect(slug.value).toBe('my-slug');
  });

  it('offers the six services as tags', () => {
    render(<ProjectForm />);
    expect(screen.getAllByRole('checkbox', { name: /Website Design|WhatsApp|Automation|E-commerce|IT & Tech|Graphic Design/ })).toHaveLength(6);
  });

  it('requires title, summary and a service tag', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);
    await user.click(screen.getByRole('button', { name: 'Save project' }));
    expect(screen.getByText('Title is required.')).toBeInTheDocument();
    expect(screen.getByText('Summary is required.')).toBeInTheDocument();
    expect(screen.getByText('Choose at least one service.')).toBeInTheDocument();
  });
});
