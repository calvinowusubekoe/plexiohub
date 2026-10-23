import { SERVICES, type Service } from '@/config/services';
import { site } from '@/config/site';
import type { Faq } from '@/lib/data/faqs';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    slogan: site.tagline,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    logo: `${site.url}/opengraph-image`,
    image: `${site.url}/images/hero.jpg`,
    description:
      'Affordable websites, WhatsApp chatbots, business automation, e-commerce, IT support and graphic design for businesses in Ghana and worldwide.',
    address: { '@type': 'PostalAddress', addressCountry: 'GH' },
    areaServed: ['GH', 'Worldwide'],
    priceRange: 'GHS 200 – GHS 20,000',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.summary, url: `${site.url}/services/${s.slug}` },
      })),
    },
  };
}

export function faqPageJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function serviceJsonLd(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    serviceType: service.name,
    url: `${site.url}/services/${service.slug}`,
    areaServed: ['GH', 'Worldwide'],
    provider: { '@type': 'ProfessionalService', name: site.name, url: site.url },
  };
}

/** Serializes JSON-LD safely for a <script> tag (no closing-tag injection). */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
