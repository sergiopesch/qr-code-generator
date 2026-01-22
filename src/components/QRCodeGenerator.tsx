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
  RefreshCw,
  Link,
  Type,
  Wifi,
  Mail,
  Phone,
  MapPin,
  Calendar,
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

const ERROR_CORRECTION_LEVELS: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: 'L', label: 'Low (7%)', description: 'Smallest QR code' },
  { value: 'M', label: 'Medium (15%)', description: 'Balanced' },
  { value: 'Q', label: 'Quartile (25%)', description: 'Good for logos' },
  { value: 'H', label: 'High (30%)', description: 'Best for logos' },
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
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(10);
  const [dotColor, setDotColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [dotType, setDotType] = useState<DotType>('square');
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('square');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('square');
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000');
  const [cornerDotColor, setCornerDotColor] = useState('#000000');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('M');

  // Logo
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.4);
  const [logoMargin, setLogoMargin] = useState(5);

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
        name: `qrcode-${Date.now()}`,
        extension: format,
      });
    }
  };

  const resetToDefaults = () => {
    setSize(300);
    setMargin(10);
    setDotColor('#000000');
    setBackgroundColor('#ffffff');
    setDotType('square');
    setCornerSquareType('square');
    setCornerDotType('square');
    setCornerSquareColor('#000000');
    setCornerDotColor('#000000');
    setErrorCorrectionLevel('M');
    setLogo(null);
    setLogoSize(0.4);
    setLogoMargin(5);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderDataInput = () => {
    switch (qrType) {
      case 'url':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              value={urlData}
              onChange={(e) => setUrlData(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
        );
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Text
            </label>
            <textarea
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              placeholder="Enter your text here..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
            />
          </div>
        );
      case 'phone':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneData}
              onChange={(e) => setPhoneData(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                placeholder="My WiFi Network"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                placeholder="WiFi password"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Encryption
                </label>
                <select
                  value={wifiData.encryption}
                  onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wifiData.hidden}
                    onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-gray-300">Hidden Network</span>
                </label>
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={emailData.address}
                onChange={(e) => setEmailData({ ...emailData, address: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Subject (optional)
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Email subject"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Body (optional)
              </label>
              <textarea
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                placeholder="Email body"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
              />
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={locationData.latitude}
                onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                placeholder="40.7128"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={locationData.longitude}
                onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                placeholder="-74.0060"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>
        );
      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Meeting"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Start Date/Time
                </label>
                <input
                  type="datetime-local"
                  value={eventData.startDate}
                  onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  End Date/Time
                </label>
                <input
                  type="datetime-local"
                  value={eventData.endDate}
                  onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="123 Main St"
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Event description..."
                rows={2}
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Panel - Controls */}
      <div className="space-y-6">
        {/* QR Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">QR Code Type</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {QR_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setQrType(type.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  qrType === type.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500 text-slate-600 dark:text-gray-400'
                }`}
              >
                {type.icon}
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Content</h3>
          {renderDataInput()}
        </div>

        {/* Styling Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Styling</h3>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="space-y-6">
            {/* Size and Margin */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Margin: {margin}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-3">
                Colors
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Dots</label>
                  <input
                    type="color"
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Background</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Corner Square</label>
                  <input
                    type="color"
                    value={cornerSquareColor}
                    onChange={(e) => setCornerSquareColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Corner Dot</label>
                  <input
                    type="color"
                    value={cornerDotColor}
                    onChange={(e) => setCornerDotColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Dot Style */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Dot Style
              </label>
              <select
                value={dotType}
                onChange={(e) => setDotType(e.target.value as DotType)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                {DOT_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Corner Styles */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Corner Square Style
                </label>
                <select
                  value={cornerSquareType}
                  onChange={(e) => setCornerSquareType(e.target.value as CornerSquareType)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                >
                  {CORNER_SQUARE_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Corner Dot Style
                </label>
                <select
                  value={cornerDotType}
                  onChange={(e) => setCornerDotType(e.target.value as CornerDotType)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                >
                  {CORNER_DOT_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Correction */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Error Correction Level
              </label>
              <select
                value={errorCorrectionLevel}
                onChange={(e) => setErrorCorrectionLevel(e.target.value as ErrorCorrectionLevel)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                {ERROR_CORRECTION_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Logo</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
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
                className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-xl cursor-pointer transition-colors"
              >
                <ImageIcon className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                  {logo ? 'Change Logo' : 'Upload Logo'}
                </span>
              </label>
              {logo && (
                <button
                  onClick={removeLogo}
                  className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Remove</span>
                </button>
              )}
            </div>

            {logo && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Logo Size: {Math.round(logoSize * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.5"
                    step="0.05"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
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
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-gray-400">
              Tip: Use High error correction level when adding a logo for better scan reliability.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview and Download */}
      <div className="lg:sticky lg:top-24 h-fit space-y-6">
        {/* QR Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 text-center">Preview</h3>
          <div className="flex justify-center">
            <div
              ref={qrRef}
              className="rounded-xl overflow-hidden shadow-inner bg-slate-50 dark:bg-gray-700 p-4"
            />
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Download</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => downloadQRCode('png')}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <Download className="w-6 h-6" />
              <span className="text-sm font-semibold">PNG</span>
            </button>
            <button
              onClick={() => downloadQRCode('svg')}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              <Download className="w-6 h-6" />
              <span className="text-sm font-semibold">SVG</span>
            </button>
            <button
              onClick={() => downloadQRCode('jpeg')}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              <Download className="w-6 h-6" />
              <span className="text-sm font-semibold">JPEG</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-4 text-center">
            SVG recommended for print, PNG for web use
          </p>
        </div>
      </div>
    </div>
  );
}
