import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const metadata: Metadata = {
  title: { default: 'PlexioHub', template: '%s | PlexioHub' },
  description: 'Websites, WhatsApp chatbots and automation for growing businesses.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        {umamiId && (
          <Script src="https://cloud.umami.is/script.js" data-website-id={umamiId} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
