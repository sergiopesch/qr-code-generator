import { QRCodeGenerator } from '@/components/QRCodeGenerator';

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="card-shell">
          <div className="max-w-2xl">
            <p className="section-kicker">QR Studio</p>
            <h1 className="mt-3 font-display text-4xl leading-none text-charcoal sm:text-5xl">
              Make a simple QR presentation card.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-charcoal/64 sm:text-base">
              Add your link, add your name, and export a clean card for people to scan.
            </p>
          </div>
        </header>

        <div className="mt-6">
          <QRCodeGenerator />
        </div>
      </div>
    </main>
  );
}
