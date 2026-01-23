'use client';

import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { Github } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Minimal Header */}
      <header className="border-b-2 border-charcoal bg-cream sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-charcoal flex items-center justify-center">
                <svg className="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="4" height="4" />
                  <rect x="17" y="17" width="4" height="4" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-charcoal">
                QR STUDIO
              </span>
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/sergiopesch/qr-code-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-charcoal hover:text-coral transition-colors uppercase tracking-wider"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Source</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero - Ultra Minimal */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-charcoal mb-4 tracking-tight">
            Create.{' '}
            <span className="text-coral">Scan.</span>{' '}
            <span className="text-mint-500">Connect.</span>
          </h1>
          <p className="text-lg text-charcoal/70 max-w-xl mx-auto font-body">
            Minimalist QR codes with innovative 3D logo fusion
          </p>
        </div>

        {/* Decorative Element - Mid-Century Inspired */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div className="w-16 h-0.5 bg-charcoal"></div>
          <div className="w-3 h-3 bg-coral rotate-45"></div>
          <div className="w-3 h-3 bg-turquoise rotate-45"></div>
          <div className="w-3 h-3 bg-mint rotate-45"></div>
          <div className="w-16 h-0.5 bg-charcoal"></div>
        </div>

        {/* QR Code Generator */}
        <QRCodeGenerator />

        {/* Footer - Minimal */}
        <footer className="mt-20 pt-8 border-t-2 border-charcoal">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-charcoal/60 font-body">
              Built with precision and care
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                Next.js 15
              </span>
              <span className="w-1 h-1 bg-coral rotate-45"></span>
              <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                React 19
              </span>
              <span className="w-1 h-1 bg-mint rotate-45"></span>
              <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                TypeScript
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
