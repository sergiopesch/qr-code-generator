import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { eventConfig } from '@/config/event';

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="card-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">{eventConfig.appName}</p>
              <h1 className="mt-3 font-display text-5xl leading-none text-charcoal sm:text-6xl">
                Minimal QR cards for fast sharing.
              </h1>
              <p className="mt-4 max-w-xl text-base text-charcoal/68 sm:text-lg">
                Build a clean QR, preview the card instantly, and export a phone-ready image.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-charcoal/60">
              <span className="rounded-full border border-charcoal/12 bg-white px-4 py-2">
                {eventConfig.eventName}
              </span>
              {eventConfig.locationLabel && (
                <span className="rounded-full border border-charcoal/12 bg-white px-4 py-2">
                  {eventConfig.locationLabel}
                </span>
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
