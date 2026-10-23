import { describe, expect, it } from 'vitest';
import { SERVICES, getService, isServiceSlug } from './services';
import { BUDGET_RANGES, TIMELINES, PREFERRED_CONTACT } from './budget';
import { content } from './content';

describe('services config', () => {
  it('lists the six services in spec order', () => {
    expect(SERVICES.map((s) => s.slug)).toEqual([
      'website-design', 'whatsapp-chatbots', 'business-automation', 'ecommerce', 'it-support', 'graphic-design',
    ]);
    expect(SERVICES.map((s) => s.name)).toEqual([
      'Website Design & Development', 'WhatsApp Chatbots & AI Automation', 'Business Process Automation',
      'E-commerce Solutions', 'IT & Tech Support', 'Graphic Design',
    ]);
  });
  it('gives every service quote questions and features', () => {
    SERVICES.forEach((s) => {
      expect(s.questions.length).toBeGreaterThan(0);
      expect(s.features.length).toBeGreaterThan(0);
    });
  });
  it('validates slugs', () => {
    expect(isServiceSlug('ecommerce')).toBe(true);
    expect(isServiceSlug('hacking')).toBe(false);
    expect(getService('graphic-design')?.name).toBe('Graphic Design');
    expect(getService('nope')).toBeUndefined();
  });
});

describe('budget config', () => {
  it('has the agreed GHS and USD brackets', () => {
    expect(BUDGET_RANGES.GHS).toEqual(['Under GHS 500', 'GHS 500–1,000', 'GHS 1,000–3,000', 'GHS 3,000–7,000',
      'GHS 7,000–12,000', 'GHS 12,000–20,000', 'Above GHS 20,000', 'Not sure yet']);
    expect(BUDGET_RANGES.USD).toEqual(['Under $50', '$50–100', '$100–300', '$300–700', '$700–1,200',
      '$1,200–2,000', 'Above $2,000', 'Not sure yet']);
    expect(TIMELINES).toEqual(['ASAP', 'Within 1 month', '1–3 months', 'Flexible']);
    expect(PREFERRED_CONTACT).toEqual(['whatsapp', 'email', 'call']);
  });
});

describe('site copy', () => {
  it('has the process, problems, why-us and hero copy from the spec', () => {
    expect(content.process.map((p) => p.title)).toEqual(['Talk', 'Quote', 'Design', 'Build', 'Launch', 'Support']);
    expect(content.problems.map((p) => p.title)).toEqual([
      'Customers cannot find your business online.', 'You handle too many tasks manually.',
      'Your current website looks outdated.', 'Your business needs reliable technical support.',
    ]);
    expect(content.whyUs.map((w) => w.title)).toEqual(['Affordable solutions', 'Personalized service',
      'Practical technical expertise', 'Transparent communication', 'Ongoing support']);
    expect(content.hero.headline).toBe('Grow your business without the tech headache');
    expect(content.seedFaqs).toHaveLength(6);
  });
});
