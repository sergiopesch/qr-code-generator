import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR Code Generator | Create Custom QR Codes',
  description: 'Generate beautiful, customizable QR codes with logo embedding, custom colors, gradients, and multiple dot styles. Export as PNG, SVG, or JPEG.',
  keywords: ['QR code', 'QR generator', 'custom QR code', 'QR code with logo', 'free QR code'],
  authors: [{ name: 'Sergio Peschiera' }],
  openGraph: {
    title: 'QR Code Generator',
    description: 'Create stunning custom QR codes with advanced styling options',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
