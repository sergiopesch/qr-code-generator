import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
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
  title: 'QR Studio',
  description: 'Create a simple QR presentation card for your website, X profile, LinkedIn, or any link.',
  keywords: ['QR code', 'presentation card', 'profile QR', 'website QR', 'Next.js'],
  authors: [{ name: 'Sergio Peschiera' }],
  manifest: '/manifest.webmanifest',
  applicationName: 'QR Studio',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    title: 'QR Studio',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'QR Studio',
    description: 'Create a simple QR presentation card for your website, X profile, LinkedIn, or any link.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7f3ea',
  viewportFit: 'cover',
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
