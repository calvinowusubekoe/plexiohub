import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import { site } from '@/config/site';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/seo/metadata';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });
const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: HOME_TITLE, template: '%s | PlexioHub' },
  description: HOME_DESCRIPTION,
  openGraph: { siteName: 'PlexioHub', locale: 'en_GH', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans antialiased">
        {children}
        {umamiId && (
          <Script src="https://cloud.umami.is/script.js" data-website-id={umamiId} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
