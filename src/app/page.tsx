import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { eventConfig } from '@/config/event';

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="card-shell">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="section-kicker">{eventConfig.appName}</p>
              <h1 className="mt-3 font-display text-4xl leading-none text-charcoal sm:text-5xl">
                Clean QR cards, ready fast.
              </h1>
              <p className="mt-3 max-w-lg text-sm text-charcoal/64 sm:text-base">
                Build, preview, and export without extra clutter.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="meta-pill">{eventConfig.eventName}</span>
              {eventConfig.locationLabel && (
                <span className="meta-pill">{eventConfig.locationLabel}</span>
              )}
            </div>
          </div>
        </header>

        <div className="mt-6">
          <QRCodeGenerator />
        </div>
      </div>
    </main>
  );
}
