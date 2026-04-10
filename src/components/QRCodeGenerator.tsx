'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import Image from 'next/image';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
  FileExtension,
  Options,
} from 'qr-code-styling';
import {
  AtSign,
  BriefcaseBusiness,
  Download,
  Image as ImageIcon,
  Link2,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { assessQRScanSafety } from '@/lib/qr';

interface QRVisualOptions {
  size: number;
  margin: number;
  dotColor: string;
  backgroundColor: string;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  cornerSquareColor: string;
  cornerDotColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logo: string | null;
  logoSize: number;
  logoMargin: number;
}

type LinkType = 'website' | 'x' | 'linkedin' | 'custom';

const LINK_TYPES: { value: LinkType; label: string; icon: React.ReactNode }[] = [
  { value: 'website', label: 'Website', icon: <Link2 className="h-4 w-4" /> },
  { value: 'x', label: 'X', icon: <AtSign className="h-4 w-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <BriefcaseBusiness className="h-4 w-4" /> },
  { value: 'custom', label: 'Other', icon: <Link2 className="h-4 w-4" /> },
];

const COLOR_PRESETS = [
  { name: 'Ink', dot: '#111111', bg: '#ffffff', corner: '#111111' },
  { name: 'Sand', dot: '#111111', bg: '#f7f3ea', corner: '#b08a3c' },
  { name: 'Mist', dot: '#13212b', bg: '#f4f7fa', corner: '#4d6476' },
  { name: 'Night', dot: '#ffffff', bg: '#111111', corner: '#d8dfd3' },
] as const;

const DEFAULT_VISUAL_OPTIONS: QRVisualOptions = {
  size: 320,
  margin: 16,
  dotColor: '#111111',
  backgroundColor: '#ffffff',
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  cornerSquareColor: '#111111',
  cornerDotColor: '#111111',
  errorCorrectionLevel: 'M',
  logo: null,
  logoSize: 0.28,
  logoMargin: 6,
};

const DEFAULT_STATE = {
  linkType: 'website' as LinkType,
  websiteUrl: 'https://example.com',
  xHandle: '',
  linkedinHandle: '',
  customUrl: '',
  displayName: 'Your Name',
  headline: 'Scan to connect',
};

function buildQRCodeOptions(options: QRVisualOptions, data: string): Options {
  return {
    width: options.size,
    height: options.size,
    margin: options.margin,
    data,
    dotsOptions: {
      color: options.dotColor,
      type: options.dotType,
    },
    backgroundOptions: {
      color: options.backgroundColor,
    },
    cornersSquareOptions: {
      color: options.cornerSquareColor,
      type: options.cornerSquareType,
    },
    cornersDotOptions: {
      color: options.cornerDotColor,
      type: options.cornerDotType,
    },
    qrOptions: {
      errorCorrectionLevel: options.errorCorrectionLevel,
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: options.logoMargin,
      imageSize: options.logoSize,
    },
    image: options.logo ?? undefined,
  };
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createFileName(prefix: string, extension: string) {
  return `${prefix}-${Date.now()}.${extension}`;
}

function normalizeHandle(value: string) {
  return value.trim().replace(/^@+/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/^x\.com\//, '').replace(/^twitter\.com\//, '').replace(/^linkedin\.com\/in\//, '').replace(/\/$/, '');
}

function ensureUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_STATE.websiteUrl;
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function buildDestination(linkType: LinkType, websiteUrl: string, xHandle: string, linkedinHandle: string, customUrl: string) {
  switch (linkType) {
    case 'x': {
      const handle = normalizeHandle(xHandle);
      return handle ? `https://x.com/${handle}` : 'https://x.com';
    }
    case 'linkedin': {
      const handle = normalizeHandle(linkedinHandle);
      return handle ? `https://linkedin.com/in/${handle}` : 'https://linkedin.com';
    }
    case 'custom':
      return ensureUrl(customUrl || DEFAULT_STATE.websiteUrl);
    case 'website':
    default:
      return ensureUrl(websiteUrl);
  }
}

function getDestinationLabel(linkType: LinkType, destination: string) {
  switch (linkType) {
    case 'x':
      return 'X profile';
    case 'linkedin':
      return 'LinkedIn';
    case 'custom':
      return 'Link';
    case 'website':
    default:
      return 'Website';
  }
}

function getInputHint(linkType: LinkType) {
  switch (linkType) {
    case 'x':
      return 'Add just the handle, for example sergiopesch';
    case 'linkedin':
      return 'Add your LinkedIn public handle or paste the full URL';
    case 'custom':
      return 'Use any full link you want to share';
    case 'website':
    default:
      return 'Use your homepage, portfolio, bio link, or landing page';
  }
}

export function QRCodeGenerator() {
  const qrCode = useRef<QRCodeStyling | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [linkType, setLinkType] = useState<LinkType>(DEFAULT_STATE.linkType);
  const [websiteUrl, setWebsiteUrl] = useState(DEFAULT_STATE.websiteUrl);
  const [xHandle, setXHandle] = useState(DEFAULT_STATE.xHandle);
  const [linkedinHandle, setLinkedinHandle] = useState(DEFAULT_STATE.linkedinHandle);
  const [customUrl, setCustomUrl] = useState(DEFAULT_STATE.customUrl);
  const [displayName, setDisplayName] = useState(DEFAULT_STATE.displayName);
  const [headline, setHeadline] = useState(DEFAULT_STATE.headline);

  const [dotColor, setDotColor] = useState(DEFAULT_VISUAL_OPTIONS.dotColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_VISUAL_OPTIONS.backgroundColor);
  const [cornerSquareColor, setCornerSquareColor] = useState(DEFAULT_VISUAL_OPTIONS.cornerSquareColor);
  const [cornerDotColor, setCornerDotColor] = useState(DEFAULT_VISUAL_OPTIONS.cornerDotColor);
  const [logo, setLogo] = useState<string | null>(DEFAULT_VISUAL_OPTIONS.logo);
  const [logoSize, setLogoSize] = useState(DEFAULT_VISUAL_OPTIONS.logoSize);
  const [logoMargin, setLogoMargin] = useState(DEFAULT_VISUAL_OPTIONS.logoMargin);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isQrReady, setIsQrReady] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [cardDownloadError, setCardDownloadError] = useState<string | null>(null);
  const [qrExportFeedback, setQrExportFeedback] = useState<string | null>(null);
  const [cardExportFeedback, setCardExportFeedback] = useState<string | null>(null);

  const errorCorrectionLevel: ErrorCorrectionLevel = logo ? 'H' : 'M';
  const destination = buildDestination(linkType, websiteUrl, xHandle, linkedinHandle, customUrl);
  const destinationLabel = getDestinationLabel(linkType, destination);
  const scanAssessment = assessQRScanSafety({
    dotColor,
    backgroundColor,
    cornerSquareColor,
    cornerDotColor,
    hasLogo: Boolean(logo),
    logoSize,
    errorCorrectionLevel,
  });

  useEffect(() => {
    qrCode.current = new QRCodeStyling(buildQRCodeOptions(DEFAULT_VISUAL_OPTIONS, DEFAULT_STATE.websiteUrl));

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncPreview() {
      if (!qrCode.current) {
        return;
      }

      setIsQrReady(false);

      qrCode.current.update(
        buildQRCodeOptions(
          {
            ...DEFAULT_VISUAL_OPTIONS,
            dotColor,
            backgroundColor,
            cornerSquareColor,
            cornerDotColor,
            errorCorrectionLevel,
            logo,
            logoSize,
            logoMargin,
          },
          destination
        )
      );

      const rawData = await qrCode.current.getRawData('png');
      if (!rawData || cancelled) {
        return;
      }

      const blob = rawData instanceof Blob ? rawData : new Blob([new Uint8Array(rawData)], { type: 'image/png' });
      const nextUrl = URL.createObjectURL(blob);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
      setIsQrReady(true);
    }

    syncPreview().catch(() => {
      if (!cancelled) {
        setPreviewUrl(null);
        setIsQrReady(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [destination, dotColor, backgroundColor, cornerSquareColor, cornerDotColor, errorCorrectionLevel, logo, logoSize, logoMargin]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQrExportFeedback(null);
      setCardExportFeedback(null);
      setCardDownloadError(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [qrExportFeedback, cardExportFeedback, cardDownloadError]);

  function applyColorPreset(preset: (typeof COLOR_PRESETS)[number]) {
    setDotColor(preset.dot);
    setBackgroundColor(preset.bg);
    setCornerSquareColor(preset.corner);
    setCornerDotColor(preset.corner);
  }

  function resetToDefaults() {
    setLinkType(DEFAULT_STATE.linkType);
    setWebsiteUrl(DEFAULT_STATE.websiteUrl);
    setXHandle(DEFAULT_STATE.xHandle);
    setLinkedinHandle(DEFAULT_STATE.linkedinHandle);
    setCustomUrl(DEFAULT_STATE.customUrl);
    setDisplayName(DEFAULT_STATE.displayName);
    setHeadline(DEFAULT_STATE.headline);
    setDotColor(DEFAULT_VISUAL_OPTIONS.dotColor);
    setBackgroundColor(DEFAULT_VISUAL_OPTIONS.backgroundColor);
    setCornerSquareColor(DEFAULT_VISUAL_OPTIONS.cornerSquareColor);
    setCornerDotColor(DEFAULT_VISUAL_OPTIONS.cornerDotColor);
    setLogo(DEFAULT_VISUAL_OPTIONS.logo);
    setLogoSize(DEFAULT_VISUAL_OPTIONS.logoSize);
    setLogoMargin(DEFAULT_VISUAL_OPTIONS.logoMargin);
    setCardDownloadError(null);
    setQrExportFeedback(null);
    setCardExportFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setLogo(loadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function exportQRCode(format: FileExtension) {
    if (!qrCode.current || !scanAssessment.isSafe) {
      return;
    }

    const rawData = await qrCode.current.getRawData(format);
    if (!rawData) {
      return;
    }

    const mimeType = format === 'svg' ? 'image/svg+xml' : `image/${format}`;
    const blob = rawData instanceof Blob ? rawData : new Blob([new Uint8Array(rawData)], { type: mimeType });
    downloadBlob(blob, createFileName('qr-code', format));
    setQrExportFeedback(`${format.toUpperCase()} downloaded.`);
  }

  async function downloadPresentationCard() {
    if (!cardRef.current || !scanAssessment.isSafe) {
      return;
    }

    setCardDownloadError(null);
    setIsDownloadingCard(true);

    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#f7f3ea',
      });

      if (!blob) {
        throw new Error('Unable to create the card image.');
      }

      downloadBlob(blob, createFileName('presentation-card', 'png'));
      setCardExportFeedback('Card image downloaded.');
    } catch (error) {
      setCardDownloadError(error instanceof Error ? error.message : 'Unable to export the card image.');
    } finally {
      setIsDownloadingCard(false);
    }
  }

  function renderDestinationInput() {
    const inputClass = 'soft-input';

    switch (linkType) {
      case 'x':
        return (
          <input
            type="text"
            value={xHandle}
            onChange={(event) => setXHandle(event.target.value)}
            placeholder="yourhandle"
            className={inputClass}
          />
        );
      case 'linkedin':
        return (
          <input
            type="text"
            value={linkedinHandle}
            onChange={(event) => setLinkedinHandle(event.target.value)}
            placeholder="your-name"
            className={inputClass}
          />
        );
      case 'custom':
        return (
          <input
            type="url"
            value={customUrl}
            onChange={(event) => setCustomUrl(event.target.value)}
            placeholder="https://your-link.com"
            className={inputClass}
          />
        );
      case 'website':
      default:
        return (
          <input
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://yourwebsite.com"
            className={inputClass}
          />
        );
    }
  }

  return (
    <div className="grid gap-6">
      <section className="card-shell">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Build</p>
            <h2 className="section-title">Simple presentation card</h2>
            <p className="mt-2 max-w-2xl text-sm text-charcoal/58">
              Pick where the QR should send people, add your name, and export the card.
            </p>
          </div>
          <button
            onClick={resetToDefaults}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/60 transition hover:border-charcoal/40 hover:text-charcoal"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-4">
            <div className="panel-shell">
              <label className="field-label">Where should the QR go?</label>
              <div className="type-tabs-scroll mt-3">
                <div className="type-tabs-track">
                  {LINK_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setLinkType(type.value)}
                      className={`chip-button type-tab ${linkType === type.value ? 'chip-button-active' : ''}`}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-charcoal/55">{getInputHint(linkType)}</p>
              <div className="mt-4">{renderDestinationInput()}</div>
            </div>

            <div className="panel-shell grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your name"
                  className="soft-input mt-2"
                />
              </div>
              <div>
                <label className="field-label">Short note</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  placeholder="What should people know?"
                  className="soft-input mt-2"
                />
              </div>
            </div>

            <div className="panel-shell">
              <div className="flex items-center justify-between gap-3">
                <label className="field-label">Style</label>
                <span className="text-xs uppercase tracking-[0.18em] text-charcoal/45">
                  {logo ? 'Logo mode' : 'Clean mode'}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyColorPreset(preset)}
                    className="chip-button"
                    style={{ backgroundColor: preset.bg, color: preset.dot }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 sm:max-w-xs">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Dots
                  <input type="color" value={dotColor} onChange={(event) => setDotColor(event.target.value)} className="h-11 w-full rounded-xl border border-charcoal/15 bg-white p-1" />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Background
                  <input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} className="h-11 w-full rounded-xl border border-charcoal/15 bg-white p-1" />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Corners
                  <input
                    type="color"
                    value={cornerSquareColor}
                    onChange={(event) => {
                      setCornerSquareColor(event.target.value);
                      setCornerDotColor(event.target.value);
                    }}
                    className="h-11 w-full rounded-xl border border-charcoal/15 bg-white p-1"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="panel-shell">
            <label className="field-label">Optional logo</label>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-charcoal/15 bg-white px-4 py-3 text-sm font-medium text-charcoal transition hover:border-charcoal/35"
              >
                <ImageIcon className="h-4 w-4" />
                {logo ? 'Replace logo' : 'Upload logo'}
              </label>
              {logo && (
                <button
                  onClick={removeLogo}
                  className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-white px-4 py-3 text-sm font-medium text-charcoal transition hover:border-charcoal/35"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-charcoal/58">
              Totally optional. Use it only if your QR still stays easy to scan.
            </p>

            {logo && (
              <div className="mt-4 grid gap-4">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Logo size
                  <input
                    type="range"
                    min="0.18"
                    max="0.32"
                    step="0.01"
                    value={logoSize}
                    onChange={(event) => setLogoSize(Number(event.target.value))}
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Logo margin
                  <input
                    type="range"
                    min="0"
                    max="18"
                    value={logoMargin}
                    onChange={(event) => setLogoMargin(Number(event.target.value))}
                  />
                </label>
              </div>
            )}

            <div
              className={`mt-5 rounded-2xl border px-4 py-4 ${
                scanAssessment.isSafe ? 'border-emerald-600/15 bg-emerald-50/70' : 'border-coral/20 bg-coral/8'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="field-label">Scan safety</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${scanAssessment.isSafe ? 'bg-white text-emerald-700' : 'bg-white text-coral'}`}>
                  {scanAssessment.isSafe ? 'Ready' : 'Blocked'}
                </span>
              </div>
              <p className="mt-3 text-sm text-charcoal/72">{scanAssessment.message}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="card-shell">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Preview</p>
              <h2 className="section-title">QR code</h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              {destinationLabel}
            </span>
          </div>

          <div className="mt-6 rounded-[32px] bg-white p-5 sm:p-8">
            <div className="mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center rounded-[28px] border border-charcoal/10 bg-white">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="QR code preview"
                  width={360}
                  height={360}
                  unoptimized
                  className="h-full w-full rounded-[24px] object-contain"
                />
              ) : (
                <div className="h-full w-full animate-pulse rounded-[24px] bg-charcoal/5" />
              )}
            </div>
          </div>

          <p className="mt-4 break-words text-sm text-charcoal/55">{destination}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => exportQRCode('png')}
              disabled={!isQrReady || !scanAssessment.isSafe}
              className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              PNG
            </button>
            <button
              onClick={() => exportQRCode('svg')}
              disabled={!isQrReady || !scanAssessment.isSafe}
              className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              SVG
            </button>
            <button
              onClick={() => exportQRCode('jpeg')}
              disabled={!isQrReady || !scanAssessment.isSafe}
              className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              JPEG
            </button>
          </div>

          {qrExportFeedback && <p className="mt-3 text-sm text-charcoal/60">{qrExportFeedback}</p>}
        </div>

        <div className="card-shell">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Export</p>
              <h2 className="section-title">Presentation card</h2>
            </div>
            <button
              onClick={downloadPresentationCard}
              disabled={isDownloadingCard || !previewUrl || !scanAssessment.isSafe}
              className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloadingCard ? 'Preparing' : 'Export'}
            </button>
          </div>

          <p className="mt-3 text-sm text-charcoal/60">
            A simple card you can save and show at an event.
          </p>

          <div
            ref={cardRef}
            className="mt-6 overflow-hidden rounded-[32px] border border-charcoal/12 bg-cream p-5 shadow-[0_24px_60px_rgba(17,17,17,0.08)] sm:p-7"
            style={{
              background:
                'radial-gradient(circle at top right, rgba(176,138,60,0.16), transparent 26%), linear-gradient(180deg, #fbfaf6 0%, #f7f3ea 100%)',
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-charcoal/12 pb-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-charcoal/55">Presentation card</p>
                <h3 className="mt-3 font-display text-4xl leading-none text-charcoal sm:text-5xl">
                  {displayName || 'Your Name'}
                </h3>
                <p className="mt-3 max-w-[22rem] text-sm text-charcoal/72 sm:text-base">
                  {headline || 'Scan to connect'}
                </p>
              </div>
              <div className="rounded-full border border-charcoal/12 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                {destinationLabel}
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="grid gap-4 text-sm text-charcoal/75">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Link</p>
                  <p className="mt-1 break-words text-base font-semibold text-charcoal">{destination}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Use</p>
                  <p className="mt-1">Let people scan this card to open your profile or website.</p>
                </div>
              </div>

              <div className="mx-auto rounded-[28px] bg-white p-4 shadow-[0_16px_32px_rgba(17,17,17,0.12)] sm:mx-0">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Presentation card QR"
                    width={160}
                    height={160}
                    unoptimized
                    className="h-36 w-36 rounded-[20px] object-contain sm:h-40 sm:w-40"
                  />
                ) : (
                  <div className="h-36 w-36 rounded-[20px] bg-charcoal/5 sm:h-40 sm:w-40" />
                )}
              </div>
            </div>
          </div>

          {cardExportFeedback && <p className="mt-3 text-sm text-charcoal/60">{cardExportFeedback}</p>}
          {cardDownloadError && <p className="mt-3 text-sm text-coral">{cardDownloadError}</p>}
        </div>
      </section>
    </div>
  );
}
