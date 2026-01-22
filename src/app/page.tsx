'use client';

import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { Github, Zap, Palette, Download, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">QR Code Generator</h1>
                <p className="text-xs text-slate-500 dark:text-gray-400">Create stunning custom QR codes</p>
              </div>
            </div>
            <a
              href="https://github.com/sergiopesch/qr-code-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Generate Beautiful QR Codes
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create customizable QR codes with logos, custom colors, gradients, and unique dot styles.
            Export in multiple formats instantly.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-slate-200 dark:border-gray-700">
            <Palette className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Custom Colors</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-slate-200 dark:border-gray-700">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Logo Embedding</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-slate-200 dark:border-gray-700">
            <Download className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">PNG, SVG, JPEG</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-slate-200 dark:border-gray-700">
            <Shield className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Error Correction</span>
          </div>
        </div>

        {/* QR Code Generator */}
        <QRCodeGenerator />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Built with Next.js 15, React 19, and qr-code-styling
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
              Originally created December 5, 2024 &bull; Last updated January 22, 2026
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
