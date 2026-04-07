'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  Options,
} from 'qr-code-styling';
import {
  Download,
  Image as ImageIcon,
  Trash2,
  RotateCcw,
  Link,
  Type,
  Wifi,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  Sparkles,
  User,
} from 'lucide-react';
import { eventConfig } from '@/config/event';
import {
  buildQRData,
  DEFAULT_EMAIL_DATA,
  DEFAULT_EVENT_DATA,
  DEFAULT_LOCATION_DATA,
  DEFAULT_PHONE,
  DEFAULT_TEXT,
  DEFAULT_URL,
  DEFAULT_WIFI_DATA,
  EmailData,
  EventData,
  formatEventDateRange,
  getQRPreviewText,
  LocationData,
  QRContentState,
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

interface SectionHeaderProps {
  title: string;
  section: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: (section: string) => void;
}

const QR_TYPES: { value: QRType; label: string; icon: React.ReactNode }[] = [
  { value: 'url', label: 'URL', icon: <Link className="w-4 h-4" /> },
  { value: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
  { value: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
  { value: 'event', label: 'Event', icon: <Calendar className="w-4 h-4" /> },
];

const DOT_STYLES: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
];

const CORNER_SQUARE_STYLES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

const CORNER_DOT_STYLES: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
];

const ERROR_CORRECTION_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'Low' },
  { value: 'M', label: 'Medium' },
  { value: 'Q', label: 'Quartile' },
  { value: 'H', label: 'High' },
];

// Event-adjacent presets that keep the QR highly scannable.
const COLOR_PRESETS = [
  { name: 'Ink', dot: '#111111', bg: '#FFFFFF', corner: '#111111' },
  { name: 'Paper', dot: '#111111', bg: '#F7F3EA', corner: '#B08A3C' },
  { name: 'Fog', dot: '#111111', bg: '#EEF2F1', corner: '#7F8A85' },
  { name: 'Brass', dot: '#111111', bg: '#FCF8EE', corner: '#8E6B27' },
  { name: 'Blueprint', dot: '#13212B', bg: '#F4F7FA', corner: '#4D6476' },
  { name: 'Night', dot: '#FFFFFF', bg: '#111111', corner: '#B08A3C' },
];

const DEFAULT_VISUAL_OPTIONS: QRVisualOptions = {
  size: 280,
  margin: 10,
  dotColor: '#111111',
  backgroundColor: '#f7f3ea',
  dotType: 'square',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  cornerSquareColor: '#b08a3c',
  cornerDotColor: '#b08a3c',
  errorCorrectionLevel: 'M',
  logo: null,
  logoSize: 0.35,
  logoMargin: 5,
};

function buildQRCodeOptions(options: QRVisualOptions, data: string): Options {
  const qrOptions: Options = {
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

  return qrOptions;
}

function SectionHeader({ title, section, icon, isOpen, onToggle }: SectionHeaderProps) {
  return (
    <button
      onClick={() => onToggle(section)}
      className="w-full flex items-center justify-between py-3 text-left group"
    >
      <div className="flex items-center gap-3">
        <span className="text-coral">{icon}</span>
        <span className="font-display font-semibold text-charcoal uppercase tracking-wide text-sm">{title}</span>
      </div>
      <ChevronDown
        className={`w-4 h-4 text-charcoal/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );
}

export function QRCodeGenerator() {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // QR Type and Data
  const [qrType, setQrType] = useState<QRType>('url');
  const [urlData, setUrlData] = useState(DEFAULT_URL);
  const [textData, setTextData] = useState('');
  const [phoneData, setPhoneData] = useState('');
  const [wifiData, setWifiData] = useState<WifiData>(DEFAULT_WIFI_DATA);
  const [emailData, setEmailData] = useState<EmailData>(DEFAULT_EMAIL_DATA);
  const [locationData, setLocationData] = useState<LocationData>(DEFAULT_LOCATION_DATA);
  const [eventData, setEventData] = useState<EventData>(DEFAULT_EVENT_DATA);

  // Styling Options
  const [size, setSize] = useState(DEFAULT_VISUAL_OPTIONS.size);
  const [margin, setMargin] = useState(DEFAULT_VISUAL_OPTIONS.margin);
  const [dotColor, setDotColor] = useState(DEFAULT_VISUAL_OPTIONS.dotColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_VISUAL_OPTIONS.backgroundColor);
  const [dotType, setDotType] = useState<DotType>(DEFAULT_VISUAL_OPTIONS.dotType);
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>(DEFAULT_VISUAL_OPTIONS.cornerSquareType);
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>(DEFAULT_VISUAL_OPTIONS.cornerDotType);
  const [cornerSquareColor, setCornerSquareColor] = useState(DEFAULT_VISUAL_OPTIONS.cornerSquareColor);
  const [cornerDotColor, setCornerDotColor] = useState(DEFAULT_VISUAL_OPTIONS.cornerDotColor);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>(DEFAULT_VISUAL_OPTIONS.errorCorrectionLevel);

  // Logo
  const [logo, setLogo] = useState<string | null>(DEFAULT_VISUAL_OPTIONS.logo);
  const [logoSize, setLogoSize] = useState(DEFAULT_VISUAL_OPTIONS.logoSize);
  const [logoMargin, setLogoMargin] = useState(DEFAULT_VISUAL_OPTIONS.logoMargin);

  // UI State
  const [activeSection, setActiveSection] = useState<string | null>('type');
  const [isFloating, setIsFloating] = useState(true);
  const [cardName, setCardName] = useState('');
  const [cardHeadline, setCardHeadline] = useState('Builder, collaborator, and scan-first networker');
  const [cardQrImageUrl, setCardQrImageUrl] = useState<string | null>(null);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [cardDownloadError, setCardDownloadError] = useState<string | null>(null);

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

  // Generate QR data based on type
  const generateQRData = useCallback(
    (): string =>
      buildQRData({
        qrType,
        urlData,
        textData,
        phoneData,
        wifiData,
        emailData,
        locationData,
        eventData,
      }),
    [qrType, urlData, textData, phoneData, wifiData, emailData, locationData, eventData]
  );

  // Initialize QR Code
  useEffect(() => {
    qrCode.current = new QRCodeStyling(
      buildQRCodeOptions(DEFAULT_VISUAL_OPTIONS, DEFAULT_URL)
    );

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, []);

  // Update QR Code when options change
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update(buildQRCodeOptions({
        size,
        margin,
        dotColor,
        backgroundColor,
        dotType,
        cornerSquareType,
        cornerDotType,
        cornerSquareColor,
        cornerDotColor,
        errorCorrectionLevel,
        logo,
        logoSize,
        logoMargin,
      }, generateQRData()));
    }
  }, [
    size,
    margin,
    dotColor,
    backgroundColor,
    dotType,
    cornerSquareType,
    cornerDotType,
    cornerSquareColor,
    cornerDotColor,
    errorCorrectionLevel,
    logo,
    logoSize,
    logoMargin,
    generateQRData,
  ]);

  useEffect(() => {
    let isMounted = true;
    let nextUrl: string | null = null;

    async function syncCardQrImage() {
      if (!qrCode.current) {
        return;
      }

      const rawData = await qrCode.current.getRawData('png');
      if (!rawData || !isMounted) {
        return;
      }

      const blob =
        rawData instanceof Blob
          ? rawData
          : new Blob([new Uint8Array(rawData)], { type: 'image/png' });
      nextUrl = URL.createObjectURL(blob);
      setCardQrImageUrl(nextUrl);
    }

    syncCardQrImage().catch(() => {
      if (isMounted) {
        setCardQrImageUrl(null);
      }
    });

    return () => {
      isMounted = false;
      if (nextUrl) {
        URL.revokeObjectURL(nextUrl);
      }
    };
  }, [
    size,
    margin,
    dotColor,
    backgroundColor,
    dotType,
    cornerSquareType,
    cornerDotType,
    cornerSquareColor,
    cornerDotColor,
    errorCorrectionLevel,
    logo,
    logoSize,
    logoMargin,
    generateQRData,
  ]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
        // Auto-enable high error correction when logo is added
        setErrorCorrectionLevel('H');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadQRCode = (format: 'png' | 'svg' | 'jpeg') => {
    if (qrCode.current) {
      qrCode.current.download({
        name: `qr-studio-${Date.now()}`,
        extension: format,
      });
    }
  };

  const downloadConferenceCard = async () => {
    if (!cardRef.current) {
      return;
    }

    setCardDownloadError(null);
    setIsDownloadingCard(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#f7f3ea',
      });

      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = `meetup-card-${Date.now()}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      setCardDownloadError(
        error instanceof Error ? error.message : 'Unable to export the meetup card.'
      );
    } finally {
      setIsDownloadingCard(false);
    }
  };

  const resetToDefaults = () => {
    setQrType('url');
    setUrlData(DEFAULT_URL);
    setTextData('');
    setPhoneData('');
    setWifiData(DEFAULT_WIFI_DATA);
    setEmailData(DEFAULT_EMAIL_DATA);
    setLocationData(DEFAULT_LOCATION_DATA);
    setEventData(DEFAULT_EVENT_DATA);
    setSize(DEFAULT_VISUAL_OPTIONS.size);
    setMargin(DEFAULT_VISUAL_OPTIONS.margin);
    setDotColor(DEFAULT_VISUAL_OPTIONS.dotColor);
    setBackgroundColor(DEFAULT_VISUAL_OPTIONS.backgroundColor);
    setDotType(DEFAULT_VISUAL_OPTIONS.dotType);
    setCornerSquareType(DEFAULT_VISUAL_OPTIONS.cornerSquareType);
    setCornerDotType(DEFAULT_VISUAL_OPTIONS.cornerDotType);
    setCornerSquareColor(DEFAULT_VISUAL_OPTIONS.cornerSquareColor);
    setCornerDotColor(DEFAULT_VISUAL_OPTIONS.cornerDotColor);
    setErrorCorrectionLevel(DEFAULT_VISUAL_OPTIONS.errorCorrectionLevel);
    setLogo(DEFAULT_VISUAL_OPTIONS.logo);
    setLogoSize(DEFAULT_VISUAL_OPTIONS.logoSize);
    setLogoMargin(DEFAULT_VISUAL_OPTIONS.logoMargin);
    setCardName('');
    setCardHeadline('Builder, collaborator, and scan-first networker');
    setCardDownloadError(null);
    setActiveSection('type');
    setIsFloating(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setDotColor(preset.dot);
    setBackgroundColor(preset.bg);
    setCornerSquareColor(preset.corner);
    setCornerDotColor(preset.corner);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const qrPreviewText = getQRPreviewText(qrState);
  const cardPrimaryLabel = cardName || 'Your Name';
  const cardSecondaryLabel =
    cardHeadline || 'What you build, hire for, or want to talk about';
  const cardDateLabel = formatEventDateRange(
    eventData.startDate || eventConfig.startsAt,
    eventData.endDate || eventConfig.endsAt
  );
  const cardVenueLabel = eventData.location || eventConfig.venueName || eventConfig.venueAddress;

  const renderDataInput = () => {
    const inputClass = "w-full bg-white text-charcoal placeholder-charcoal/35";

    switch (qrType) {
      case 'url':
        return (
          <input
            type="url"
            value={urlData}
            onChange={(e) => setUrlData(e.target.value)}
            placeholder="https://example.com"
            className={inputClass}
          />
        );
      case 'text':
        return (
          <textarea
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            placeholder="Enter your text..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            value={phoneData}
            onChange={(e) => setPhoneData(e.target.value)}
            placeholder="+1 234 567 8900"
            className={inputClass}
          />
        );
      case 'wifi':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={wifiData.ssid}
              onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
              placeholder="Network name (SSID)"
              className={inputClass}
            />
            <input
              type="password"
              value={wifiData.password}
              onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
              placeholder="Password"
              className={inputClass}
            />
            <div className="flex gap-3">
              <select
                value={wifiData.encryption}
                onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
                className={`flex-1 ${inputClass}`}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wifiData.hidden}
                  onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                />
                <span className="text-sm text-charcoal">Hidden</span>
              </label>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-3">
            <input
              type="email"
              value={emailData.address}
              onChange={(e) => setEmailData({ ...emailData, address: e.target.value })}
              placeholder="email@example.com"
              className={inputClass}
            />
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="Subject (optional)"
              className={inputClass}
            />
            <textarea
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              placeholder="Message (optional)"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        );
      case 'location':
        return (
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={locationData.latitude}
              onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
              placeholder="Latitude"
              className={inputClass}
            />
            <input
              type="text"
              value={locationData.longitude}
              onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
              placeholder="Longitude"
              className={inputClass}
            />
          </div>
        );
      case 'event':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              placeholder="Event title"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="datetime-local"
                value={eventData.startDate}
                onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                className={inputClass}
              />
              <input
                type="datetime-local"
                value={eventData.endDate}
                onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              placeholder="Location"
              className={inputClass}
            />
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              placeholder="Description"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left Panel - Controls */}
      <div className="lg:col-span-2 space-y-0">
        <div className="card-retro divide-y-2 divide-charcoal">
          {/* Type Selection */}
          <div className="pb-4">
            <SectionHeader
              title="Type"
              section="type"
              icon={<Link className="w-4 h-4" />}
              isOpen={activeSection === 'type'}
              onToggle={toggleSection}
            />
            {activeSection === 'type' && (
              <div className="pt-2">
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {QR_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setQrType(type.value)}
                      className={`flex flex-col items-center gap-1 p-2 border-2 transition-all ${
                        qrType === type.value
                          ? 'border-coral bg-coral/10 text-coral'
                          : 'border-charcoal/20 hover:border-charcoal/40 text-charcoal/60'
                      }`}
                    >
                      {type.icon}
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  {renderDataInput()}
                </div>
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="py-4">
            <SectionHeader
              title="Card"
              section="card"
              icon={<User className="w-4 h-4" />}
              isOpen={activeSection === 'card'}
              onToggle={toggleSection}
            />
            {activeSection === 'card' && (
              <div className="pt-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Your name or handle"
                    className="w-full bg-white text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                    Headline
                  </label>
                  <textarea
                    value={cardHeadline}
                    onChange={(e) => setCardHeadline(e.target.value)}
                    placeholder="What you build, hire for, or want to talk about"
                    rows={2}
                    className="w-full bg-white text-charcoal resize-none"
                  />
                </div>
                <p className="text-xs text-charcoal/50">
                  These fields personalize the meetup card without changing the QR payload itself.
                </p>
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="py-4">
            <SectionHeader
              title="Colors"
              section="colors"
              icon={<Sparkles className="w-4 h-4" />}
              isOpen={activeSection === 'colors'}
              onToggle={toggleSection}
            />
            {activeSection === 'colors' && (
              <div className="pt-2 space-y-4">
                {/* Color Presets */}
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border-2 border-charcoal hover:bg-charcoal hover:text-cream transition-colors"
                      style={{ backgroundColor: preset.bg, color: preset.dot }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Custom Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Dots</label>
                    <input
                      type="color"
                      value={dotColor}
                      onChange={(e) => setDotColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Background</label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Corners</label>
                    <input
                      type="color"
                      value={cornerSquareColor}
                      onChange={(e) => {
                        setCornerSquareColor(e.target.value);
                        setCornerDotColor(e.target.value);
                      }}
                      className="w-full h-10"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Style */}
          <div className="py-4">
            <SectionHeader
              title="Style"
              section="style"
              icon={<Type className="w-4 h-4" />}
              isOpen={activeSection === 'style'}
              onToggle={toggleSection}
            />
            {activeSection === 'style' && (
              <div className="pt-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                    Dot Style
                  </label>
                  <select
                    value={dotType}
                    onChange={(e) => setDotType(e.target.value as DotType)}
                    className="w-full bg-white text-charcoal"
                  >
                    {DOT_STYLES.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                      Corner Square
                    </label>
                    <select
                      value={cornerSquareType}
                      onChange={(e) => setCornerSquareType(e.target.value as CornerSquareType)}
                      className="w-full bg-white text-charcoal"
                    >
                      {CORNER_SQUARE_STYLES.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                      Corner Dot
                    </label>
                    <select
                      value={cornerDotType}
                      onChange={(e) => setCornerDotType(e.target.value as CornerDotType)}
                      className="w-full bg-white text-charcoal"
                    >
                      {CORNER_DOT_STYLES.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                    Size: {size}px
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="400"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                    Error Correction
                  </label>
                  <div className="flex gap-2">
                    {ERROR_CORRECTION_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setErrorCorrectionLevel(level.value)}
                        className={`flex-1 py-2 text-xs font-semibold uppercase border-2 transition-all ${
                          errorCorrectionLevel === level.value
                            ? 'border-coral bg-coral text-white'
                            : 'border-charcoal/20 hover:border-charcoal/40 text-charcoal/60'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logo Fusion */}
          <div className="py-4">
            <SectionHeader
              title="Logo Fusion"
              section="logo"
              icon={<ImageIcon className="w-4 h-4" />}
              isOpen={activeSection === 'logo'}
              onToggle={toggleSection}
            />
            {activeSection === 'logo' && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-3">
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
                    className="btn-retro flex-1 bg-mint text-charcoal text-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {logo ? 'Change' : 'Upload'}
                  </label>
                  {logo && (
                    <button
                      onClick={removeLogo}
                      className="btn-retro bg-coral text-white text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {logo && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                        Logo Size: {Math.round(logoSize * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.15"
                        max="0.5"
                        step="0.05"
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">
                        Logo Margin: {logoMargin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={logoMargin}
                        onChange={(e) => setLogoMargin(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <p className="text-xs text-charcoal/50">
                  {logo ? 'Logo fusion active. Keep the mark simple for best scanning.' : 'Add a personal mark if you want, but keep the center clean enough to scan quickly.'}
                </p>
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="pt-4">
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 text-sm font-semibold text-charcoal/50 hover:text-coral transition-colors uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - 3D Preview and Download */}
      <div className="lg:col-span-3 lg:sticky lg:top-24 h-fit space-y-6">
        {/* 3D QR Preview */}
        <div className="card-retro">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-body font-semibold text-charcoal uppercase tracking-[0.22em] text-sm">QR Preview</h3>
            <button
              onClick={() => setIsFloating(!isFloating)}
              className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 border-2 transition-all ${
                isFloating
                  ? 'border-coral bg-coral text-white'
                  : 'border-charcoal/20 text-charcoal/50 hover:border-charcoal/40'
              }`}
            >
              3D Float
            </button>
          </div>

          {/* 3D Container */}
          <div className="qr-3d-container flex justify-center py-8">
            <div className={`qr-3d-wrapper ${isFloating ? 'qr-floating' : ''}`}>
              <div className="qr-3d-face p-4">
                <div ref={qrRef} className="relative" />
                {/* Logo Fusion Overlay Effect */}
                {logo && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/20" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download hint */}
          <p className="text-center text-xs text-charcoal/40 uppercase tracking-[0.24em]">
            Editorial framing, conservative modules
          </p>
        </div>

        {/* Phone Card */}
        <div className="card-retro">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h3 className="font-body font-semibold text-charcoal uppercase tracking-[0.22em] text-sm">
                Meetup Card
              </h3>
              <p className="text-xs text-charcoal/50 mt-1">
                Save this to Photos and pull it up quickly while you are moving between talks.
              </p>
            </div>
            <button
              onClick={downloadConferenceCard}
              disabled={isDownloadingCard}
              className="btn-retro bg-charcoal text-cream text-sm px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isDownloadingCard ? 'Saving...' : 'Save Card'}
            </button>
          </div>

          <div
            ref={cardRef}
            className="relative overflow-hidden border-2 border-charcoal bg-cream p-5 sm:p-6"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(247,243,234,0.96)), #f7f3ea',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-charcoal" />
            <div className="absolute inset-x-0 top-2 h-px bg-coral/70" />
            <div className="absolute right-5 top-6 h-28 w-28 rounded-full border border-coral/15" />
            <div className="absolute right-10 top-11 h-20 w-20 rounded-full border border-coral/10" />
            <div className="absolute inset-x-6 bottom-14 h-px bg-charcoal/10" />

            <div className="relative flex items-start justify-between gap-4 border-b-2 border-charcoal pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/60 font-semibold">
                  {eventConfig.cardEyebrow}
                </p>
                <h3 className="font-display text-[2rem] sm:text-[2.35rem] text-charcoal mt-2 leading-none">
                  {cardPrimaryLabel}
                </h3>
                <p className="text-sm text-charcoal/75 mt-2 max-w-[18rem]">
                  {cardSecondaryLabel}
                </p>
              </div>
              <div className="border-2 border-charcoal bg-charcoal px-3 py-2 text-cream text-right min-w-[7rem]">
                <div className="text-[10px] uppercase tracking-[0.25em] text-cream/60">QR PASS</div>
                <div className="font-body text-sm leading-none mt-2 uppercase tracking-[0.2em]">{qrType}</div>
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-[1fr_auto] gap-4 items-end">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold">
                    Event
                  </p>
                  <p className="text-base text-charcoal font-semibold mt-1">{eventConfig.eventName}</p>
                </div>

                {cardVenueLabel && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold">
                      Venue
                    </p>
                    <p className="text-sm text-charcoal/80 mt-1">{cardVenueLabel}</p>
                  </div>
                )}

                {cardDateLabel && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold">
                      When
                    </p>
                    <p className="text-sm text-charcoal/80 mt-1">{cardDateLabel}</p>
                  </div>
                )}

                <div className="pt-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold">
                    Link
                  </p>
                  <p className="text-sm text-charcoal/80 mt-1 break-all max-w-[18rem]">
                    {qrPreviewText}
                  </p>
                </div>
              </div>

              <div className="border-2 border-charcoal bg-white p-3 shadow-[6px_6px_0_0_#111111]">
                {cardQrImageUrl ? (
                  <Image
                    src={cardQrImageUrl}
                    alt="Meetup QR card"
                    width={128}
                    height={128}
                    unoptimized
                    className="block w-28 h-28 sm:w-32 sm:h-32 object-contain"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-charcoal/5" />
                )}
              </div>
            </div>

            <div className="relative mt-5 flex items-center justify-between gap-4 border-t-2 border-charcoal pt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-charcoal/70 font-semibold">
                {eventConfig.cardCallout}
              </p>
              <p className="text-xs text-charcoal/55 text-right max-w-[14rem]">
                Save the image and favorite it in Photos for one-tap access.
              </p>
            </div>
          </div>

          {cardDownloadError && (
            <p className="text-xs text-coral mt-3 text-center">
              {cardDownloadError}
            </p>
          )}
        </div>

        {/* Export Options */}
        <div className="card-retro">
          <h3 className="font-body font-semibold text-charcoal uppercase tracking-[0.22em] text-sm mb-4">QR Export</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => downloadQRCode('png')}
              className="btn-retro bg-mint text-charcoal flex-col py-4"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs mt-1">PNG</span>
            </button>
            <button
              onClick={() => downloadQRCode('svg')}
              className="btn-retro bg-turquoise text-charcoal flex-col py-4"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs mt-1">SVG</span>
            </button>
            <button
              onClick={() => downloadQRCode('jpeg')}
              className="btn-retro bg-coral text-white flex-col py-4"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs mt-1">JPEG</span>
            </button>
          </div>
          <p className="text-xs text-charcoal/40 mt-4 text-center uppercase tracking-wider">
            Save Card for your phone &bull; PNG for posting &bull; SVG for print
          </p>
        </div>

        <div className="card-retro">
          <h3 className="font-body font-semibold text-charcoal uppercase tracking-[0.22em] text-sm mb-3">
            Quick Access
          </h3>
          <p className="text-sm text-charcoal/70">
            {eventConfig.installPrompt}
          </p>
          <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs uppercase tracking-wider text-charcoal/60">
            <div className="border-2 border-charcoal/20 p-3 bg-white/70">1. Save Card</div>
            <div className="border-2 border-charcoal/20 p-3 bg-white/70">2. Favorite In Photos</div>
            <div className="border-2 border-charcoal/20 p-3 bg-white/70">3. Pin Before Day One</div>
          </div>
          {eventConfig.disclaimer && (
            <p className="mt-4 text-xs text-charcoal/55">
              {eventConfig.disclaimer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
