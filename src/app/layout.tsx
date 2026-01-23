import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'QR Studio | Minimalist QR Code Generator',
  description: 'Ultra-minimalist QR code generator with 1950s-inspired design. Create stunning 3D QR codes with innovative logo fusion technology.',
  keywords: ['QR code', 'QR generator', 'minimalist', 'retro design', '1950s', '3D QR code', 'logo fusion'],
  authors: [{ name: 'Sergio Peschiera' }],
  openGraph: {
    title: 'QR Studio | Minimalist 3D QR Codes',
    description: 'Create stunning 3D QR codes with innovative logo fusion - inspired by 1950s design',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
