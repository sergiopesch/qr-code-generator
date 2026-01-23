'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'lucide-react';

type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'location' | 'event';

interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

interface EmailData {
  address: string;
  subject: string;
  body: string;
}

interface LocationData {
  latitude: string;
  longitude: string;
}

interface EventData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
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

// 50's inspired color presets
const COLOR_PRESETS = [
  { name: 'Classic', dot: '#333333', bg: '#FFFFFF', corner: '#333333' },
  { name: 'Mint', dot: '#338570', bg: '#F0FAF7', corner: '#338570' },
  { name: 'Coral', dot: '#D45A40', bg: '#FFF5F3', corner: '#D45A40' },
  { name: 'Turquoise', dot: '#2F8795', bg: '#F0FAFB', corner: '#2F8795' },
  { name: 'Mustard', dot: '#B8860B', bg: '#FFFBEB', corner: '#B8860B' },
  { name: 'Charcoal', dot: '#1A1A1A', bg: '#F5E6C8', corner: '#1A1A1A' },
];

export function QRCodeGenerator() {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QR Type and Data
  const [qrType, setQrType] = useState<QRType>('url');
  const [urlData, setUrlData] = useState('https://github.com');
  const [textData, setTextData] = useState('');
  const [phoneData, setPhoneData] = useState('');
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [emailData, setEmailData] = useState<EmailData>({
    address: '',
    subject: '',
    body: '',
  });
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: '',
    longitude: '',
  });
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  });

  // Styling Options
  const [size, setSize] = useState(280);
  const [margin, setMargin] = useState(10);
  const [dotColor, setDotColor] = useState('#333333');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [dotType, setDotType] = useState<DotType>('square');
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('square');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('square');
  const [cornerSquareColor, setCornerSquareColor] = useState('#333333');
  const [cornerDotColor, setCornerDotColor] = useState('#333333');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('M');

  // Logo
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.35);
  const [logoMargin, setLogoMargin] = useState(5);

  // UI State
  const [activeSection, setActiveSection] = useState<string | null>('type');
  const [isFloating, setIsFloating] = useState(true);

  // Generate QR data based on type
  const generateQRData = useCallback((): string => {
    switch (qrType) {
      case 'url':
        return urlData || 'https://github.com';
      case 'text':
        return textData || 'Hello World';
      case 'phone':
        return phoneData ? `tel:${phoneData}` : 'tel:+1234567890';
      case 'wifi':
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden ? 'true' : 'false'};;`;
      case 'email':
        const emailParams = new URLSearchParams();
        if (emailData.subject) emailParams.set('subject', emailData.subject);
        if (emailData.body) emailParams.set('body', emailData.body);
        const paramStr = emailParams.toString();
        return `mailto:${emailData.address}${paramStr ? '?' + paramStr : ''}`;
      case 'location':
        return `geo:${locationData.latitude || '0'},${locationData.longitude || '0'}`;
      case 'event':
        const formatDate = (date: string) => date.replace(/[-:]/g, '').replace('T', 'T') + '00';
        return `BEGIN:VEVENT
SUMMARY:${eventData.title}
DTSTART:${formatDate(eventData.startDate)}
DTEND:${formatDate(eventData.endDate)}
LOCATION:${eventData.location}
DESCRIPTION:${eventData.description}
END:VEVENT`;
      default:
        return 'https://github.com';
    }
  }, [qrType, urlData, textData, phoneData, wifiData, emailData, locationData, eventData]);

  // Initialize QR Code
  useEffect(() => {
    const options: Options = {
      width: size,
      height: size,
      margin: margin,
      data: generateQRData(),
      dotsOptions: {
        color: dotColor,
        type: dotType,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      cornersSquareOptions: {
        color: cornerSquareColor,
        type: cornerSquareType,
      },
      cornersDotOptions: {
        color: cornerDotColor,
        type: cornerDotType,
      },
      qrOptions: {
        errorCorrectionLevel: errorCorrectionLevel,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: logoMargin,
        imageSize: logoSize,
      },
    };

    if (logo) {
      options.image = logo;
    }

    qrCode.current = new QRCodeStyling(options);

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, []);

  // Update QR Code when options change
  useEffect(() => {
    if (qrCode.current) {
      const options: Partial<Options> = {
        width: size,
        height: size,
        margin: margin,
        data: generateQRData(),
        dotsOptions: {
          color: dotColor,
          type: dotType,
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        cornersSquareOptions: {
          color: cornerSquareColor,
          type: cornerSquareType,
        },
        cornersDotOptions: {
          color: cornerDotColor,
          type: cornerDotType,
        },
        qrOptions: {
          errorCorrectionLevel: errorCorrectionLevel,
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: logoMargin,
          imageSize: logoSize,
        },
      };

      if (logo) {
        options.image = logo;
      } else {
        options.image = undefined;
      }

      qrCode.current.update(options);
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

  const resetToDefaults = () => {
    setSize(280);
    setMargin(10);
    setDotColor('#333333');
    setBackgroundColor('#ffffff');
    setDotType('square');
    setCornerSquareType('square');
    setCornerDotType('square');
    setCornerSquareColor('#333333');
    setCornerDotColor('#333333');
    setErrorCorrectionLevel('M');
    setLogo(null);
    setLogoSize(0.35);
    setLogoMargin(5);
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

  const renderDataInput = () => {
    const inputClass = "w-full bg-white text-charcoal placeholder-charcoal/40";

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
          </div>
        );
      default:
        return null;
    }
  };

  const SectionHeader = ({ title, section, icon }: { title: string; section: string; icon: React.ReactNode }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 text-left group"
    >
      <div className="flex items-center gap-3">
        <span className="text-coral">{icon}</span>
        <span className="font-display font-semibold text-charcoal uppercase tracking-wide text-sm">{title}</span>
      </div>
      <ChevronDown
        className={`w-4 h-4 text-charcoal/50 transition-transform ${activeSection === section ? 'rotate-180' : ''}`}
      />
    </button>
  );

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left Panel - Controls */}
      <div className="lg:col-span-2 space-y-0">
        <div className="card-retro divide-y-2 divide-charcoal">
          {/* Type Selection */}
          <div className="pb-4">
            <SectionHeader title="Type" section="type" icon={<Link className="w-4 h-4" />} />
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

          {/* Colors */}
          <div className="py-4">
            <SectionHeader title="Colors" section="colors" icon={<Sparkles className="w-4 h-4" />} />
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
            <SectionHeader title="Style" section="style" icon={<Type className="w-4 h-4" />} />
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
            <SectionHeader title="Logo Fusion" section="logo" icon={<ImageIcon className="w-4 h-4" />} />
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
                  {logo ? 'Logo fusion active - your brand emerges from the code' : 'Add your logo to create a unified 3D QR experience'}
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
            <h3 className="font-display font-semibold text-charcoal uppercase tracking-wide text-sm">Preview</h3>
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
          <p className="text-center text-xs text-charcoal/40 uppercase tracking-widest">
            Hover to interact
          </p>
        </div>

        {/* Download Options */}
        <div className="card-retro">
          <h3 className="font-display font-semibold text-charcoal uppercase tracking-wide text-sm mb-4">Export</h3>
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
            SVG for print &bull; PNG for web
          </p>
        </div>
      </div>
    </div>
  );
}
