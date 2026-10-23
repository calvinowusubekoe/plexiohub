export const site = {
  name: 'PlexioHub',
  tagline: 'We Build. You Grow.',
  locationLine: 'Based in Ghana 🇬🇭 · Serving businesses worldwide 🌍',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '233000000000',
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+233 00 000 0000',
  email: process.env.NEXT_PUBLIC_EMAIL ?? 'hello@plexiohub.com',
  // Placeholder URLs until the founder supplies real profiles (spec §12).
  socials: [
    { label: 'Facebook', url: 'https://facebook.com/' },
    { label: 'Instagram', url: 'https://instagram.com/' },
    { label: 'LinkedIn', url: 'https://linkedin.com/' },
  ],
} as const;
