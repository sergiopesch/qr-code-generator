function parseOptionalNumber(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const eventConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Meetup Card Generator',
  eventName: process.env.NEXT_PUBLIC_EVENT_NAME || 'Your Event',
  heroAccent: process.env.NEXT_PUBLIC_EVENT_HERO_ACCENT || 'Create',
  heroTail: process.env.NEXT_PUBLIC_EVENT_HERO_TAIL || 'Connect',
  heroDescription:
    process.env.NEXT_PUBLIC_EVENT_DESCRIPTION ||
    'Create a phone-ready meetup card, save it to your phone, and make it easier to connect at any event, meetup, or conference.',
  sourceUrl:
    process.env.NEXT_PUBLIC_SOURCE_URL ||
    'https://github.com/sergiopesch/qr-code-generator',
  venueName: process.env.NEXT_PUBLIC_EVENT_VENUE_NAME || '',
  venueAddress:
    process.env.NEXT_PUBLIC_EVENT_VENUE_ADDRESS ||
    '',
  startsAt: process.env.NEXT_PUBLIC_EVENT_STARTS_AT || '',
  endsAt: process.env.NEXT_PUBLIC_EVENT_ENDS_AT || '',
  supportUrl:
    process.env.NEXT_PUBLIC_EVENT_SUPPORT_URL || '',
  locationLabel: process.env.NEXT_PUBLIC_EVENT_LOCATION_LABEL || '',
  location: {
    latitude: parseOptionalNumber(process.env.NEXT_PUBLIC_EVENT_VENUE_LATITUDE),
    longitude: parseOptionalNumber(process.env.NEXT_PUBLIC_EVENT_VENUE_LONGITUDE),
  },
  cardEyebrow: process.env.NEXT_PUBLIC_EVENT_CARD_EYEBROW || 'Meetup Card',
  cardCallout:
    process.env.NEXT_PUBLIC_EVENT_CARD_CALLOUT || 'Scan to connect',
  installPrompt:
    process.env.NEXT_PUBLIC_EVENT_INSTALL_PROMPT ||
    'Save the card image, favorite it in Photos, or add this app to your home screen so your QR is always one tap away.',
  disclaimer:
    process.env.NEXT_PUBLIC_EVENT_DISCLAIMER || '',
  officialEventLabel:
    process.env.NEXT_PUBLIC_EVENT_OFFICIAL_LABEL || '',
} as const;
