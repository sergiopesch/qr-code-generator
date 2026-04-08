export type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'location' | 'event';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EmailData {
  address: string;
  subject: string;
  body: string;
}

export interface LocationData {
  latitude: string;
  longitude: string;
}

export interface EventData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface QRContentState {
  qrType: QRType;
  urlData: string;
  textData: string;
  phoneData: string;
  wifiData: WifiData;
  emailData: EmailData;
  locationData: LocationData;
  eventData: EventData;
}

export interface QRScanAssessment {
  isSafe: boolean;
  level: 'safe' | 'warning';
  message: string;
  details: string[];
}

export const DEFAULT_URL = 'https://example.com';
export const DEFAULT_TEXT = 'Hello world';
export const DEFAULT_PHONE = '+1234567890';

export const DEFAULT_WIFI_DATA: WifiData = {
  ssid: '',
  password: '',
  encryption: 'WPA',
  hidden: false,
};

export const DEFAULT_EMAIL_DATA: EmailData = {
  address: '',
  subject: '',
  body: '',
};

export const DEFAULT_LOCATION_DATA: LocationData = {
  latitude: '',
  longitude: '',
};

export const DEFAULT_EVENT_DATA: EventData = {
  title: '',
  startDate: '',
  endDate: '',
  location: '',
  description: '',
};

export const QR_TYPE_LABELS: Record<QRType, string> = {
  url: 'URL',
  text: 'Text',
  wifi: 'WiFi',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  event: 'Event',
};

export function escapeQRCodeValue(value: string) {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

export function formatCalendarDate(date: string) {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const pad = (value: number) => value.toString().padStart(2, '0');

  return [
    parsedDate.getFullYear(),
    pad(parsedDate.getMonth() + 1),
    pad(parsedDate.getDate()),
    'T',
    pad(parsedDate.getHours()),
    pad(parsedDate.getMinutes()),
    pad(parsedDate.getSeconds()),
  ].join('');
}

export function buildEventPayload(eventData: EventData) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
  ];

  if (eventData.title) {
    lines.push(`SUMMARY:${escapeQRCodeValue(eventData.title)}`);
  }

  const startDate = formatCalendarDate(eventData.startDate);
  const endDate = formatCalendarDate(eventData.endDate);

  if (startDate) {
    lines.push(`DTSTART:${startDate}`);
  }

  if (endDate) {
    lines.push(`DTEND:${endDate}`);
  }

  if (eventData.location) {
    lines.push(`LOCATION:${escapeQRCodeValue(eventData.location)}`);
  }

  if (eventData.description) {
    lines.push(`DESCRIPTION:${escapeQRCodeValue(eventData.description)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\n');
}

export function buildQRData(state: QRContentState): string {
  switch (state.qrType) {
    case 'url':
      return state.urlData || DEFAULT_URL;
    case 'text':
      return state.textData || DEFAULT_TEXT;
    case 'phone':
      return state.phoneData ? `tel:${state.phoneData}` : `tel:${DEFAULT_PHONE}`;
    case 'wifi':
      return `WIFI:T:${state.wifiData.encryption};S:${escapeQRCodeValue(state.wifiData.ssid)};P:${escapeQRCodeValue(state.wifiData.password)};H:${state.wifiData.hidden ? 'true' : 'false'};;`;
    case 'email': {
      const emailParams = new URLSearchParams();
      if (state.emailData.subject) emailParams.set('subject', state.emailData.subject);
      if (state.emailData.body) emailParams.set('body', state.emailData.body);
      const paramStr = emailParams.toString();
      return `mailto:${state.emailData.address}${paramStr ? `?${paramStr}` : ''}`;
    }
    case 'location':
      return `geo:${state.locationData.latitude || '0'},${state.locationData.longitude || '0'}`;
    case 'event':
      return buildEventPayload(state.eventData);
    default:
      return DEFAULT_URL;
  }
}

export function getQRPreviewText(state: QRContentState): string {
  switch (state.qrType) {
    case 'url':
      return state.urlData || DEFAULT_URL;
    case 'text':
      return state.textData || DEFAULT_TEXT;
    case 'phone':
      return state.phoneData || DEFAULT_PHONE;
    case 'wifi':
      return state.wifiData.ssid || 'Conference WiFi';
    case 'email':
      return state.emailData.address || 'email@example.com';
    case 'location':
      return [state.locationData.latitude, state.locationData.longitude].filter(Boolean).join(', ') || '0, 0';
    case 'event':
      return state.eventData.title || 'Conference Session';
    default:
      return DEFAULT_URL;
  }
}

export function getCardDisplayValue(state: QRContentState): string {
  switch (state.qrType) {
    case 'wifi':
      return state.wifiData.ssid || 'WiFi network';
    case 'email':
      return state.emailData.address || 'Email link';
    case 'phone':
      return state.phoneData || DEFAULT_PHONE;
    case 'location':
      return state.locationData.latitude && state.locationData.longitude
        ? `${state.locationData.latitude}, ${state.locationData.longitude}`
        : 'Map location';
    case 'event':
      return state.eventData.title || 'Event details';
    case 'text':
      return state.textData || DEFAULT_TEXT;
    case 'url':
    default:
      return state.urlData || DEFAULT_URL;
  }
}

export function formatEventDateRange(startDate: string, endDate: string) {
  if (!startDate && !endDate) {
    return '';
  }

  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const formattedStart = startDate ? formatter.format(new Date(startDate)) : '';
  const formattedEnd = endDate ? formatter.format(new Date(endDate)) : '';

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart || formattedEnd;
}

function normalizeHexColor(color: string) {
  const value = color.trim().replace('#', '');

  if (value.length === 3) {
    return value
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }

  return value.slice(0, 6);
}

function srgbToLinear(value: number) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function getContrastRatio(firstColor: string, secondColor: string) {
  const [first, second] = [firstColor, secondColor].map((color) => {
    const normalized = normalizeHexColor(color);
    const channels = normalized.match(/.{2}/g) ?? ['00', '00', '00'];
    const [red, green, blue] = channels.map((channel) => parseInt(channel, 16));
    const [r, g, b] = [red, green, blue].map(srgbToLinear);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  });

  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

export function assessQRScanSafety(input: {
  dotColor: string;
  backgroundColor: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  hasLogo: boolean;
  logoSize: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}): QRScanAssessment {
  const contrast = getContrastRatio(input.dotColor, input.backgroundColor);
  const cornerContrast = Math.min(
    getContrastRatio(input.cornerSquareColor, input.backgroundColor),
    getContrastRatio(input.cornerDotColor, input.backgroundColor)
  );
  const details: string[] = [];

  if (contrast < 4.5) {
    return {
      isSafe: false,
      level: 'warning',
      message: 'Increase contrast between the QR modules and the background.',
      details: ['The current color contrast is too low for reliable scanning.'],
    };
  }

  if (cornerContrast < 3) {
    return {
      isSafe: false,
      level: 'warning',
      message: 'Corner markers need stronger contrast to stay detectable.',
      details: ['Darken the corner color or lighten the background before exporting.'],
    };
  }

  if (input.hasLogo && input.logoSize > 0.32) {
    return {
      isSafe: false,
      level: 'warning',
      message: 'Reduce the logo size before exporting.',
      details: ['Large center logos cover too many modules and can break scanning.'],
    };
  }

  if (input.hasLogo && input.errorCorrectionLevel !== 'H') {
    return {
      isSafe: false,
      level: 'warning',
      message: 'Use high error correction when a logo is embedded.',
      details: ['Logos remove QR modules, so the export is blocked until correction is set to H.'],
    };
  }

  if (contrast < 7) {
    details.push('Contrast is acceptable, but stronger separation will scan faster in low light.');
  }

  if (input.hasLogo) {
    details.push('Logo overlay is within the safe range for export.');
  }

  return {
    isSafe: true,
    level: details.length > 0 ? 'warning' : 'safe',
    message: details.length > 0 ? 'Export is allowed, but there is limited scan margin.' : 'Ready to export.',
    details,
  };
}
