import type { Metadata } from 'next';

export const HOME_TITLE = 'PlexioHub — Websites, WhatsApp Chatbots & Automation in Ghana';
export const HOME_DESCRIPTION =
  'PlexioHub builds affordable websites, WhatsApp chatbots, business automation, online shops and graphic design for small and growing businesses in Ghana and worldwide. We Build. You Grow.';

/** Per-page metadata. `title` goes through the root template ("<title> | PlexioHub"). */
export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const fullTitle = `${title} | PlexioHub`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: 'PlexioHub',
      type: 'website',
      locale: 'en_GH',
      ...(image ? { images: [image] } : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, ...(image ? { images: [image] } : {}) },
  };
}
