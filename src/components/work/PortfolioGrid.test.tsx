import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortfolioGrid } from './PortfolioGrid';
import type { Project } from '@/lib/data/projects';

function project(slug: string, tag: Project['serviceTags'][number], kind: Project['kind'] = 'client'): Project {
  return {
    id: slug, slug, title: slug, kind, serviceTags: [tag], summary: `${slug} summary`, problem: 'Problem', built: '',
    features: [], liveUrl: null, coverImageUrl: null, galleryUrls: [], sortOrder: 0, published: true, createdAt: '2026-10-23',
  };
}

const projects = [project('site-a', 'website-design', 'concept'), project('shop-b', 'ecommerce'), project('logo-c', 'graphic-design')];

describe('PortfolioGrid', () => {
  it('shows all projects by default and labels concepts', () => {
    render(<PortfolioGrid projects={projects} />);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByText('Concept')).toBeInTheDocument();
  });

  it('filters by service and back to all', async () => {
    render(<PortfolioGrid projects={projects} />);
    await userEvent.click(screen.getByRole('button', { name: 'E-commerce' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('disables filters that have no projects', () => {
    render(<PortfolioGrid projects={projects} />);
    expect(screen.getByRole('button', { name: 'Automation' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Websites' })).toBeEnabled();
  });

  it('limits cards and links to all work', () => {
    render(<PortfolioGrid projects={projects} limit={2} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'See all work' })).toHaveAttribute('href', '/work');
  });

  it('shows a friendly message when there are no projects', () => {
    render(<PortfolioGrid projects={[]} />);
    expect(screen.getByText('New projects coming soon')).toBeInTheDocument();
  });
});
