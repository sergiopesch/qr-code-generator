'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import Image from 'next/image';
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  FileExtension,
  Options,
} from 'qr-code-styling';
import {
  Calendar,
  Clock3,
  Download,
  FileText,
  Image as ImageIcon,
  KeyRound,
  Link,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Router,
  ScrollText,
  Trash2,
  Type,
  Wifi,
} from 'lucide-react';
import { eventConfig } from '@/config/event';
import {
  assessQRScanSafety,
  buildQRData,
  DEFAULT_EMAIL_DATA,
  DEFAULT_LOCATION_DATA,
  DEFAULT_PHONE,
  DEFAULT_TEXT,
  DEFAULT_URL,
  DEFAULT_WIFI_DATA,
  EmailData,
  EventData,
  formatEventDateRange,
  getCardDisplayValue,
  LocationData,
  QRContentState,
  QRScanAssessment,
  QRType,
  WifiData,
} from '@/lib/qr';

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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const QR_TYPES: { value: QRType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'event',
    label: 'Event',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Share an event title, time, venue, and summary in one scan.',
  },
  {
    value: 'url',
    label: 'URL',
    icon: <Link className="h-4 w-4" />,
    description: 'Open a website, landing page, or portfolio instantly.',
  },
  {
    value: 'text',
    label: 'Text',
    icon: <Type className="h-4 w-4" />,
    description: 'Show plain text, notes, or a short message.',
  },
  {
    value: 'wifi',
    label: 'WiFi',
    icon: <Wifi className="h-4 w-4" />,
    description: 'Let people join a WiFi network without typing credentials.',
  },
  {
    value: 'email',
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
    description: 'Start an email with recipient, subject, and message.',
  },
  {
    value: 'phone',
    label: 'Phone',
    icon: <Phone className="h-4 w-4" />,
    description: 'Start a phone call from a single tap after scanning.',
  },
  {
    value: 'location',
    label: 'Location',
    icon: <MapPin className="h-4 w-4" />,
    description: 'Open map coordinates for a venue or meeting point.',
  },
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

function previewLabel(qrType: QRType) {
  return QR_TYPES.find((type) => type.value === qrType)?.label ?? 'QR';
}

function getSelectedType(qrType: QRType) {
  return QR_TYPES.find((type) => type.value === qrType) ?? QR_TYPES[0];
}

function getDataSectionCopy(qrType: QRType) {
  switch (qrType) {
    case 'event':
      return {
        title: 'Event details',
        description: 'Only event-specific fields appear here so the form stays focused.',
      };
    case 'url':
      return {
        title: 'Destination URL',
        description: 'Paste the page you want people to open after scanning.',
      };
    case 'text':
      return {
        title: 'Text content',
        description: 'Use this for plain text, a short message, or instructions.',
      };
    case 'wifi':
      return {
        title: 'WiFi access',
        description: 'Add the network name, password, and security type.',
      };
    case 'email':
      return {
        title: 'Email draft',
        description: 'Pre-fill the email recipient and optional subject or body.',
      };
    case 'phone':
      return {
        title: 'Phone number',
        description: 'Scanning will prompt the user to call this number.',
      };
    case 'location':
      return {
        title: 'Map coordinates',
        description: 'Provide latitude and longitude for the destination.',
      };
    default:
      return {
        title: 'Data',
        description: 'Add the content you want to encode in the QR code.',
      };
  }
}

function getDefaultEventData(): EventData {
  return {
    title: eventConfig.eventName !== 'Your Event' ? eventConfig.eventName : '',
    startDate: eventConfig.startsAt,
    endDate: eventConfig.endsAt,
    location: eventConfig.locationLabel || eventConfig.venueName || eventConfig.venueAddress,
    description: eventConfig.heroDescription,
  };
}

function getDefaultLocationData(): LocationData {
  return {
    latitude: eventConfig.location.latitude?.toString() || DEFAULT_LOCATION_DATA.latitude,
    longitude: eventConfig.location.longitude?.toString() || DEFAULT_LOCATION_DATA.longitude,
  };
}

export function QRCodeGenerator() {
  const qrCode = useRef<QRCodeStyling | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [qrType, setQrType] = useState<QRType>('event');
  const [urlData, setUrlData] = useState(DEFAULT_URL);
  const [textData, setTextData] = useState(DEFAULT_TEXT);
  const [phoneData, setPhoneData] = useState(DEFAULT_PHONE);
  const [wifiData, setWifiData] = useState<WifiData>(DEFAULT_WIFI_DATA);
  const [emailData, setEmailData] = useState<EmailData>(DEFAULT_EMAIL_DATA);
  const [locationData, setLocationData] = useState<LocationData>(getDefaultLocationData);
  const [eventData, setEventData] = useState<EventData>(getDefaultEventData);

  const [dotColor, setDotColor] = useState(DEFAULT_VISUAL_OPTIONS.dotColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_VISUAL_OPTIONS.backgroundColor);
  const [cornerSquareColor, setCornerSquareColor] = useState(DEFAULT_VISUAL_OPTIONS.cornerSquareColor);
  const [cornerDotColor, setCornerDotColor] = useState(DEFAULT_VISUAL_OPTIONS.cornerDotColor);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>(DEFAULT_VISUAL_OPTIONS.errorCorrectionLevel);
  const [logo, setLogo] = useState<string | null>(DEFAULT_VISUAL_OPTIONS.logo);
  const [logoSize, setLogoSize] = useState(DEFAULT_VISUAL_OPTIONS.logoSize);
  const [logoMargin, setLogoMargin] = useState(DEFAULT_VISUAL_OPTIONS.logoMargin);

  const [cardName, setCardName] = useState('');
  const [cardHeadline, setCardHeadline] = useState(eventConfig.cardCallout);
  const [cardEventName, setCardEventName] = useState(eventConfig.eventName);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isQrReady, setIsQrReady] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [cardDownloadError, setCardDownloadError] = useState<string | null>(null);
  const [qrExportFeedback, setQrExportFeedback] = useState<string | null>(null);
  const [cardExportFeedback, setCardExportFeedback] = useState<string | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosInstallHint, setShowIosInstallHint] = useState(false);

  const qrState: QRContentState = {
    qrType,
    urlData,
    textData,
    phoneData,
    wifiData,
    emailData,
    locationData,
    eventData,
  };

  const qrData = buildQRData(qrState);
  const selectedType = getSelectedType(qrType);
  const dataSectionCopy = getDataSectionCopy(qrType);
  const cardPrimaryLabel = cardName || 'Your Name';
  const cardSecondaryLabel = cardHeadline || 'Scan to connect';
  const cardEventLabel = cardEventName || eventConfig.eventName;
  const cardValue = getCardDisplayValue(qrState);
  const cardDateLabel = formatEventDateRange(
    eventData.startDate || eventConfig.startsAt,
    eventData.endDate || eventConfig.endsAt
  );
  const cardVenueLabel = eventData.location || eventConfig.venueName || eventConfig.venueAddress;
  const showEventCardFields = qrType === 'event';
  const scanAssessment: QRScanAssessment = assessQRScanSafety({
    dotColor,
    backgroundColor,
    cornerSquareColor,
    cornerDotColor,
    hasLogo: Boolean(logo),
    logoSize,
    errorCorrectionLevel,
  });

  useEffect(() => {
    qrCode.current = new QRCodeStyling(buildQRCodeOptions(DEFAULT_VISUAL_OPTIONS, DEFAULT_URL));

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
          qrData
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
  }, [
    qrData,
    dotColor,
    backgroundColor,
    cornerSquareColor,
    cornerDotColor,
    errorCorrectionLevel,
    logo,
    logoSize,
    logoMargin,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQrExportFeedback(null);
      setCardExportFeedback(null);
      setCardDownloadError(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [qrExportFeedback, cardExportFeedback, cardDownloadError]);

  useEffect(() => {
    if (logoSize > 0.32) {
      setLogoSize(0.32);
    }
  }, [logoSize]);

  useEffect(() => {
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');

    const updateInstallState = () => {
      const standalone = displayModeQuery.matches || navigatorWithStandalone.standalone === true;
      const userAgent = navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);

      setIsStandalone(standalone);
      setShowIosInstallHint(isIos && isSafari && !standalone);
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeferredInstallPrompt(null);
      setCardExportFeedback('App installed. Your QR card is now one tap away.');
      updateInstallState();
    };

    updateInstallState();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    displayModeQuery.addEventListener('change', updateInstallState);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      displayModeQuery.removeEventListener('change', updateInstallState);
    };
  }, []);

  function applyColorPreset(preset: (typeof COLOR_PRESETS)[number]) {
    setDotColor(preset.dot);
    setBackgroundColor(preset.bg);
    setCornerSquareColor(preset.corner);
    setCornerDotColor(preset.corner);
  }

  function resetToDefaults() {
    setQrType('event');
    setUrlData(DEFAULT_URL);
    setTextData(DEFAULT_TEXT);
    setPhoneData(DEFAULT_PHONE);
    setWifiData(DEFAULT_WIFI_DATA);
    setEmailData(DEFAULT_EMAIL_DATA);
    setLocationData(getDefaultLocationData());
    setEventData(getDefaultEventData());
    setDotColor(DEFAULT_VISUAL_OPTIONS.dotColor);
    setBackgroundColor(DEFAULT_VISUAL_OPTIONS.backgroundColor);
    setCornerSquareColor(DEFAULT_VISUAL_OPTIONS.cornerSquareColor);
    setCornerDotColor(DEFAULT_VISUAL_OPTIONS.cornerDotColor);
    setErrorCorrectionLevel(DEFAULT_VISUAL_OPTIONS.errorCorrectionLevel);
    setLogo(DEFAULT_VISUAL_OPTIONS.logo);
    setLogoSize(DEFAULT_VISUAL_OPTIONS.logoSize);
    setLogoMargin(DEFAULT_VISUAL_OPTIONS.logoMargin);
    setCardName('');
    setCardHeadline(eventConfig.cardCallout);
    setCardEventName(eventConfig.eventName);
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
      setErrorCorrectionLevel('H');
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogo(null);
    setErrorCorrectionLevel('M');
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

  async function downloadConferenceCard() {
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

      const file = new File([blob], createFileName('meetup-card', 'png'), { type: 'image/png' });
      const share = navigator.share?.bind(navigator);
      const canShareFiles = navigator.canShare?.({ files: [file] }) ?? false;

      if (share && canShareFiles) {
        await share({
          files: [file],
          title: `${cardEventLabel} card`,
          text: 'Save this card to Photos for quick access.',
        });
        setCardExportFeedback('Share sheet opened. Save the image to Photos or Files.');
      } else {
        downloadBlob(file, file.name);
        setCardExportFeedback('Card image downloaded.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      setCardDownloadError(
        error instanceof Error ? error.message : 'Unable to export the card image.'
      );
    } finally {
      setIsDownloadingCard(false);
    }
  }

  async function installApp() {
    if (!deferredInstallPrompt) {
      return;
    }

    await deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;

    if (outcome === 'accepted') {
      setCardExportFeedback('Install accepted. The app will be available from your home screen.');
    }

    setDeferredInstallPrompt(null);
  }

  function renderCardDetails() {
    switch (qrType) {
      case 'event':
        return (
          <>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Event</p>
              <p className="mt-1 text-base font-semibold text-charcoal">{cardEventLabel}</p>
            </div>
            {cardVenueLabel && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Location</p>
                <p className="mt-1">{cardVenueLabel}</p>
              </div>
            )}
            {cardDateLabel && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">When</p>
                <p className="mt-1">{cardDateLabel}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Details</p>
              <p className="mt-1 break-words text-charcoal/80">{cardValue}</p>
            </div>
          </>
        );
      case 'wifi':
        return (
          <>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Network</p>
              <p className="mt-1 text-base font-semibold text-charcoal">{wifiData.ssid || 'WiFi network'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Security</p>
              <p className="mt-1">{wifiData.encryption === 'nopass' ? 'Open network' : wifiData.encryption}</p>
            </div>
          </>
        );
      case 'email':
        return (
          <>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Email</p>
              <p className="mt-1 text-base font-semibold text-charcoal break-words">{emailData.address || 'email@example.com'}</p>
            </div>
            {emailData.subject && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Subject</p>
                <p className="mt-1 break-words">{emailData.subject}</p>
              </div>
            )}
          </>
        );
      case 'phone':
        return (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Phone</p>
            <p className="mt-1 text-base font-semibold text-charcoal">{phoneData || DEFAULT_PHONE}</p>
          </div>
        );
      case 'location':
        return (
          <>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Latitude</p>
              <p className="mt-1 text-base font-semibold text-charcoal">{locationData.latitude || '0'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Longitude</p>
              <p className="mt-1 text-base font-semibold text-charcoal">{locationData.longitude || '0'}</p>
            </div>
          </>
        );
      case 'text':
        return (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Message</p>
            <p className="mt-1 break-words text-charcoal/80">{cardValue}</p>
          </div>
        );
      case 'url':
      default:
        return (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/55">Destination</p>
            <p className="mt-1 break-words text-charcoal/80">{cardValue}</p>
          </div>
        );
    }
  }

  function renderFieldGroup(
    label: string,
    icon: React.ReactNode,
    content: React.ReactNode,
    helper?: string,
    className = ''
  ) {
    return (
      <div className={`rounded-2xl border border-charcoal/10 bg-white/70 p-3 sm:p-4 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-charcoal/10 bg-cream text-charcoal/70">
            {icon}
          </span>
          <span>{label}</span>
        </div>
        {helper && <p className="mt-2 text-sm text-charcoal/55">{helper}</p>}
        <div className="mt-3">{content}</div>
      </div>
    );
  }

  function renderDataInput() {
    const inputClass = 'soft-input';

    switch (qrType) {
      case 'url':
        return renderFieldGroup(
          'Website URL',
          <Link className="h-4 w-4" />,
          <input
            type="url"
            value={urlData}
            onChange={(event) => setUrlData(event.target.value)}
            placeholder="https://example.com"
            className={inputClass}
          />,
          'Paste the full destination people should open after scanning.'
        );
      case 'text':
        return renderFieldGroup(
          'Text message',
          <FileText className="h-4 w-4" />,
          <textarea
            value={textData}
            onChange={(event) => setTextData(event.target.value)}
            placeholder="Add text"
            rows={4}
            className={`${inputClass} resize-none`}
          />,
          'Best for short notes, labels, or simple copy.'
        );
      case 'phone':
        return renderFieldGroup(
          'Phone number',
          <Phone className="h-4 w-4" />,
          <input
            type="tel"
            value={phoneData}
            onChange={(event) => setPhoneData(event.target.value)}
            placeholder="+1 234 567 8900"
            className={inputClass}
          />,
          'Use an international format when possible.'
        );
      case 'wifi':
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {renderFieldGroup(
              'Network name',
              <Router className="h-4 w-4" />,
              <input
                type="text"
                value={wifiData.ssid}
                onChange={(event) => setWifiData({ ...wifiData, ssid: event.target.value })}
                placeholder="Network name"
                className={inputClass}
              />
            )}
            {renderFieldGroup(
              'Password',
              <KeyRound className="h-4 w-4" />,
              <input
                type="password"
                value={wifiData.password}
                onChange={(event) => setWifiData({ ...wifiData, password: event.target.value })}
                placeholder="Password"
                className={inputClass}
              />
            )}
            {renderFieldGroup(
              'Security type',
              <Wifi className="h-4 w-4" />,
              <select
                value={wifiData.encryption}
                onChange={(event) =>
                  setWifiData({
                    ...wifiData,
                    encryption: event.target.value as WifiData['encryption'],
                  })
                }
                className={inputClass}
              >
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No password</option>
              </select>
            )}
            {renderFieldGroup(
              'Advanced',
              <ScrollText className="h-4 w-4" />,
              <label className="flex items-center gap-3 rounded-2xl border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={wifiData.hidden}
                  onChange={(event) => setWifiData({ ...wifiData, hidden: event.target.checked })}
                />
                Hidden network
              </label>
            )}
          </div>
        );
      case 'email':
        return (
          <div className="grid gap-3">
            {renderFieldGroup(
              'Recipient',
              <Mail className="h-4 w-4" />,
              <input
                type="email"
                value={emailData.address}
                onChange={(event) => setEmailData({ ...emailData, address: event.target.value })}
                placeholder="name@example.com"
                className={inputClass}
              />
            )}
            {renderFieldGroup(
              'Subject',
              <Type className="h-4 w-4" />,
              <input
                type="text"
                value={emailData.subject}
                onChange={(event) => setEmailData({ ...emailData, subject: event.target.value })}
                placeholder="Subject"
                className={inputClass}
              />
            )}
            {renderFieldGroup(
              'Message',
              <FileText className="h-4 w-4" />,
              <textarea
                value={emailData.body}
                onChange={(event) => setEmailData({ ...emailData, body: event.target.value })}
                placeholder="Message"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            )}
          </div>
        );
      case 'location':
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {renderFieldGroup(
              'Latitude',
              <MapPin className="h-4 w-4" />,
              <input
                type="text"
                value={locationData.latitude}
                onChange={(event) => setLocationData({ ...locationData, latitude: event.target.value })}
                placeholder="Latitude"
                className={inputClass}
              />
            )}
            {renderFieldGroup(
              'Longitude',
              <MapPin className="h-4 w-4" />,
              <input
                type="text"
                value={locationData.longitude}
                onChange={(event) => setLocationData({ ...locationData, longitude: event.target.value })}
                placeholder="Longitude"
                className={inputClass}
              />
            )}
          </div>
        );
      case 'event':
        return (
          <div className="grid gap-3">
            {renderFieldGroup(
              'Event title',
              <Calendar className="h-4 w-4" />,
              <input
                type="text"
                value={eventData.title}
                onChange={(event) => setEventData({ ...eventData, title: event.target.value })}
                placeholder="Event title"
                className={inputClass}
              />
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {renderFieldGroup(
                'Start date',
                <Clock3 className="h-4 w-4" />,
                <input
                  type="datetime-local"
                  value={eventData.startDate}
                  onChange={(event) => setEventData({ ...eventData, startDate: event.target.value })}
                  className={inputClass}
                />
              )}
              {renderFieldGroup(
                'End date',
                <Clock3 className="h-4 w-4" />,
                <input
                  type="datetime-local"
                  value={eventData.endDate}
                  onChange={(event) => setEventData({ ...eventData, endDate: event.target.value })}
                  className={inputClass}
                />
              )}
            </div>
            {renderFieldGroup(
              'Location',
              <MapPin className="h-4 w-4" />,
              <input
                type="text"
                value={eventData.location}
                onChange={(event) => setEventData({ ...eventData, location: event.target.value })}
                placeholder="Location"
                className={inputClass}
              />
            )}
            {renderFieldGroup(
              'Description',
              <FileText className="h-4 w-4" />,
              <textarea
                value={eventData.description}
                onChange={(event) => setEventData({ ...eventData, description: event.target.value })}
                placeholder="Description"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="grid gap-6">
      <section className="card-shell">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Content</p>
            <h2 className="section-title">Build the QR</h2>
            <p className="mt-2 text-sm text-charcoal/58">
              Keep the payload short, make the contrast strong, then export.
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

        <div className="mt-6 grid gap-4">
          <div className="panel-shell type-panel-sticky">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <label className="field-label">Type</label>
                <p className="mt-2 text-sm text-charcoal/58">
                  Pick the QR you want to build. The form below adapts to the selected type.
                </p>
              </div>
              <div className="rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal/68 lg:max-w-sm">
                <p className="font-semibold text-charcoal">{selectedType.label}</p>
                <p className="mt-1">{selectedType.description}</p>
              </div>
            </div>
            <div className="type-tabs-scroll mt-4">
              <div className="type-tabs-track">
                {QR_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setQrType(type.value)}
                    className={`chip-button type-tab ${qrType === type.value ? 'chip-button-active' : ''}`}
                    aria-pressed={qrType === type.value}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-shell">
            <label className="field-label">{dataSectionCopy.title}</label>
            <p className="mt-2 text-sm text-charcoal/58">{dataSectionCopy.description}</p>
            <div key={qrType} className="panel-transition mt-4">{renderDataInput()}</div>
          </div>

          <div className="panel-shell grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(event) => setCardName(event.target.value)}
                placeholder="Your name"
                className="soft-input mt-2"
              />
            </div>
            {showEventCardFields && (
              <div>
                <label className="field-label">Event</label>
                <input
                  type="text"
                  value={cardEventName}
                  onChange={(event) => setCardEventName(event.target.value)}
                  placeholder="Event name"
                  className="soft-input mt-2"
                />
              </div>
            )}
            <div className={showEventCardFields ? 'sm:col-span-2' : ''}>
              <label className="field-label">Card note</label>
              <input
                type="text"
                value={cardHeadline}
                onChange={(event) => setCardHeadline(event.target.value)}
                placeholder="Short description"
                className="soft-input mt-2"
              />
            </div>
          </div>

          <div
            className={`panel-shell ${
              scanAssessment.isSafe
                ? 'border-emerald-600/15 bg-emerald-50/70'
                : 'border-coral/20 bg-coral/8'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <label className="field-label">Scan safety</label>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                  scanAssessment.isSafe
                    ? 'bg-white text-emerald-700'
                    : 'bg-white text-coral'
                }`}
              >
                {scanAssessment.isSafe ? 'Ready' : 'Blocked'}
              </span>
            </div>
            <p className="mt-3 text-sm text-charcoal/72">{scanAssessment.message}</p>
            {scanAssessment.details.length > 0 && (
              <div className="mt-3 grid gap-2">
                {scanAssessment.details.map((detail) => (
                  <p key={detail} className="text-sm text-charcoal/58">
                    {detail}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="panel-shell">
              <div className="flex items-center justify-between gap-3">
                <label className="field-label">Style</label>
                <div className="flex items-center gap-2 text-xs text-charcoal/55">
                  <span>Correction</span>
                  <button
                    onClick={() => setErrorCorrectionLevel('M')}
                    className={`rounded-full px-3 py-1 font-semibold ${
                      errorCorrectionLevel === 'M' ? 'bg-charcoal text-cream' : 'bg-white text-charcoal/60'
                    }`}
                  >
                    M
                  </button>
                  <button
                    onClick={() => setErrorCorrectionLevel('H')}
                    className={`rounded-full px-3 py-1 font-semibold ${
                      errorCorrectionLevel === 'H' ? 'bg-charcoal text-cream' : 'bg-white text-charcoal/60'
                    }`}
                  >
                    H
                  </button>
                </div>
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

            <div className="panel-shell">
              <label className="field-label">Logo</label>
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
                Optional. Keep the mark small so the code remains easy to scan.
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
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="card-shell">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Preview</p>
              <h2 className="section-title">Scan-ready QR</h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              {previewLabel(qrType)}
            </span>
          </div>

          <p className="mt-3 text-sm text-charcoal/58">
            {selectedType.description}
          </p>

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

          <p className="mt-4 text-sm text-charcoal/55">
            Export the QR on its own for print and posting.
          </p>
          {qrExportFeedback && <p className="mt-3 text-sm text-charcoal/60">{qrExportFeedback}</p>}
        </div>

        <div className="card-shell">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Export</p>
              <h2 className="section-title">Presentation card</h2>
            </div>
            <button
              onClick={downloadConferenceCard}
              disabled={isDownloadingCard || !previewUrl || !scanAssessment.isSafe}
              className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isDownloadingCard ? 'Preparing' : 'Export'}
            </button>
          </div>

          <p className="mt-3 text-sm text-charcoal/60">
            On phones, export opens the native share sheet when supported so the image can be saved into Photos.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {deferredInstallPrompt && !isStandalone && (
              <button onClick={installApp} className="button-secondary">
                Install app
              </button>
            )}
            {showIosInstallHint && !isStandalone && (
              <p className="rounded-full border border-charcoal/12 bg-white px-4 py-3 text-sm text-charcoal/60">
                On iPhone, use Share then Add to Home Screen.
              </p>
            )}
            {isStandalone && (
              <p className="rounded-full border border-charcoal/12 bg-white px-4 py-3 text-sm text-charcoal/60">
                Installed. Open from your home screen for faster access.
              </p>
            )}
          </div>

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
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-charcoal/55">
                  {eventConfig.cardEyebrow}
                </p>
                <h3 className="mt-3 font-display text-4xl leading-none text-charcoal sm:text-5xl">
                  {cardPrimaryLabel}
                </h3>
                <p className="mt-3 max-w-[22rem] text-sm text-charcoal/72 sm:text-base">
                  {cardSecondaryLabel}
                </p>
              </div>
              <div className="rounded-full border border-charcoal/12 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                {previewLabel(qrType)}
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="grid gap-4 text-sm text-charcoal/75">
                {renderCardDetails()}
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
