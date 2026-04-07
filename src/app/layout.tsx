import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { eventConfig } from '@/config/event';
import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${eventConfig.appName} | ${eventConfig.eventName}`,
  description: eventConfig.heroDescription,
  keywords: ['QR code', 'meetup card', 'conference card', 'event QR', 'Next.js'],
  authors: [{ name: 'Sergio Peschiera' }],
  manifest: '/manifest.webmanifest',
  applicationName: eventConfig.appName,
  appleWebApp: {
    capable: true,
    title: eventConfig.appName,
    statusBarStyle: 'default',
  },
  openGraph: {
    title: `${eventConfig.appName} | ${eventConfig.eventName}`,
    description: eventConfig.heroDescription,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7f3ea',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
