import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { eventConfig } from '@/config/event';
import { ArrowUpRight } from 'lucide-react';

export default function Home() {
  const hasEventLink = Boolean(eventConfig.supportUrl && eventConfig.officialEventLabel);
  const hasMetaBadge = Boolean(
    eventConfig.cardEyebrow || eventConfig.startsAt || eventConfig.locationLabel
  );

  return (
    <main className="min-h-screen bg-cream paper-grid">
      <header className="border-b-2 border-charcoal/90 bg-cream/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/55 font-semibold">
                  Template
                </p>
                <span className="font-body text-sm sm:text-base font-semibold tracking-[0.08em] uppercase text-charcoal">
                  {eventConfig.appName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {hasEventLink && (
                <a
                  href={eventConfig.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs sm:text-sm font-semibold text-charcoal hover:text-coral transition-colors uppercase tracking-[0.18em]"
                >
                  {eventConfig.officialEventLabel}
                </a>
              )}
              <a
                href={eventConfig.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-charcoal hover:text-coral transition-colors uppercase tracking-[0.18em]"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="hidden sm:inline">Source</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          {hasMetaBadge && (
            <p className="inline-flex flex-wrap items-center justify-center gap-2 border border-charcoal/20 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-charcoal/70">
              {eventConfig.cardEyebrow && <span>{eventConfig.cardEyebrow}</span>}
              {eventConfig.startsAt && (
                <>
                  <span className="h-1 w-1 rounded-full bg-coral" />
                  <span>{eventConfig.startsAt}</span>
                </>
              )}
              {eventConfig.locationLabel && (
                <>
                  <span className="h-1 w-1 rounded-full bg-coral" />
                  <span>{eventConfig.locationLabel}</span>
                </>
              )}
            </p>
          )}

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-charcoal mt-6 mb-5 tracking-tight leading-[0.95]">
            {eventConfig.heroAccent}
            <span className="text-coral">.</span>{' '}
            {eventConfig.heroTail}
            <span className="text-coral">.</span>
          </h1>
          <p className="text-lg text-charcoal/75 max-w-2xl mx-auto font-body">
            {eventConfig.heroDescription}
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-charcoal/45 mt-6">
            Fast to make · easy to scan · built for any event
          </p>
          {eventConfig.disclaimer && (
            <p className="text-sm text-charcoal/55 mt-4 max-w-2xl mx-auto">
              {eventConfig.disclaimer}
            </p>
          )}
        </div>

        <div className="mb-12 editorial-rule" />

        <QRCodeGenerator />

        <footer className="mt-20 pt-8 border-t-2 border-charcoal">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-charcoal/60 font-body">
              Built for fast, low-friction connection at any event
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                Instrument Serif
              </span>
              <span className="w-1 h-1 bg-coral rotate-45"></span>
              <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                Card Export
              </span>
              <span className="w-1 h-1 bg-mint rotate-45"></span>
              <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                Reusable
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
