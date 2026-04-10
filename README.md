# QR Studio

A lightweight event QR generator for quick sharing during events, meetups, and conferences, with reusable event theming and a phone-first meetup card flow.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![React](https://img.shields.io/badge/React-19.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6)

## Design Philosophy

**Less is More.** QR Studio uses an editorial event aesthetic: serif headlines, sans UI, black ink on paper, and restrained accent color.

### Editorial Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | `#F7F3EA` | Paper background |
| Mint | `#D8DFD3` | Soft neutral accents |
| Coral | `#B08A3C` | Brass highlight |
| Turquoise | `#C9D5DE` | Cool secondary accents |
| Charcoal | `#111111` | Ink text, borders |
| Mustard | `#B08A3C` | Highlight details |

## What It Does

QR Studio is designed to be easy to share as a public link so anyone can quickly generate a QR code without creating an account or installing anything.

- **Fast public utility** - anyone can generate a QR code from a shared link
- **Real-time preview** - QR codes update as content changes
- **Adaptive QR workflow** - the form, preview copy, and card details respond to the selected QR type
- **Flexible content types** - generate common QR payloads for event use
- **Custom styling** - colors, shapes, size, corners, and logo support
- **Reusable event template** - tune copy, branding, venue, and schedule through config
- **Phone-first card flow** - generate a meetup card people can save to Photos and reopen fast
- **Fast export** - download the meetup card image or the raw QR as PNG, SVG, or JPEG

The UI now keeps **Event** as the primary/default QR type, uses mobile-friendly sticky type tabs, and shows only the inputs relevant to the active payload.

## Features

### QR Code Types
- Event QR (default, first in the selector)
- URL links
- Plain text
- WiFi credentials (auto-connect)
- Email with subject and body
- Phone numbers
- Geographic locations

### Adaptive UI / UX
- Event-first workflow for meetup and conference usage
- Type-specific input panels instead of one generic form
- Type-specific descriptions in the selector and preview
- Type-specific presentation card details
- Mobile-friendly horizontal type tabs
- Sticky type selector on smaller screens for faster switching
- Smooth transitions when switching between QR types

### Styling Options
- Reusable color presets
- Custom color controls for dots, background, and corners
- Error correction controls with scan-safety feedback
- Logo upload with size and margin controls

### Smart Defaults
- Event payload fields prefilled from `src/config/event.ts`
- Card note defaults from `eventConfig.cardCallout`
- Location QR can preload configured latitude and longitude
- Reset returns the app to the default Event flow

### Export Options
- Presentation card image (phone-friendly)
- PNG (web-optimized)
- SVG (print-quality vectors)
- JPEG (compressed)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 6](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.2](https://tailwindcss.com/)
- **Typography**: Instrument Serif (display) + Instrument Sans (body)
- **QR Engine**: [qr-code-styling](https://www.npmjs.com/package/qr-code-styling)
- **Card Export**: [html-to-image](https://www.npmjs.com/package/html-to-image)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sergiopesch/qr-code-generator.git
cd qr-code-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Event Template Configuration

The app now has a reusable event config layer in [src/config/event.ts](src/config/event.ts). For a new event, the intended flow is:

1. Copy [.env.example](.env.example) to `.env.local`
2. Set the `NEXT_PUBLIC_EVENT_*` values for the event name, copy, venue, dates, and card labels
3. Reuse the same app with a different `.env.local` for each event

This keeps the generator reusable while letting you theme each event without rewriting the app shell.

### Phone-First Flow

The app is optimized around a no-Apple, no-account event flow:

1. Create the QR payload
2. Personalize the card with a display name and headline
3. Save the meetup card image to Photos
4. Favorite it or add the app to the home screen for fast access during the event

### Production Build

```bash
npm run build
npm start
```

## Usage

### Creating a QR Code

1. Pick a QR type from the top selector
2. Fill in only the fields shown for that QR type
3. Watch the preview and card details update in real time
4. Export either the raw QR or the presentation card

### Applying Styles

1. Open the Style section
2. Choose a preset such as `Ink`, `Sand`, `Mist`, or `Night`
3. Fine-tune dots, background, and corner colors
4. Check the scan-safety panel before exporting

### Adding a Logo

1. Open the Logo section
2. Upload your logo image
3. Adjust logo size and margin if needed
4. The app automatically raises error correction when a logo is present

### Building a Presentation Card

1. Add your display name
2. Add a short card note
3. If the active type is `Event`, optionally customize the event name shown on the card
4. Export the phone-ready card image

### Notes on Preview vs Export

- The app preview is optimized for on-screen editing and validation
- Exported files preserve the QR styling and embedded logo
- The presentation card adapts its metadata layout to the selected QR type

## Project Structure

```
qr-studio/
├── src/
│   ├── app/
│   │   ├── globals.css      # Editorial styling, 3D effects
│   │   ├── layout.tsx       # Fonts, metadata
│   │   ├── page.tsx         # Event landing page
│   │   ├── manifest.ts      # PWA metadata for home-screen install
│   │   └── icon.svg         # App icon
│   └── components/
│       └── QRCodeGenerator.tsx  # Main generator component
│   ├── config/
│   │   └── event.ts         # Event-level branding and card settings
│   └── lib/
│       └── qr.ts            # Shared QR payload helpers
├── .env.example
├── package.json
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

*3D CSS transforms require a modern browser for optimal display.*

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from editorial print systems and portable event card layouts
- [qr-code-styling](https://github.com/nicklasoverby/qr-code-styling) for QR generation
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## Changelog

### v3.1.0 (April 10, 2026)
- Reworked the generator into an adaptive, type-aware UI
- Kept Event as the first and default QR type
- Added mobile-friendly horizontal type tabs and sticky selector behavior
- Added smoother panel transitions when switching QR types
- Made the presentation card respond to the active QR type instead of always showing event-shaped metadata
- Added smarter defaults from `eventConfig` for event and location flows
- Improved README documentation to reflect the current UX

### v3.0.0 (April 7, 2026)
- Repositioned the app as a lightweight public QR utility for events
- Cleaned up QR payload generation and reset behavior
- Improved calendar event payload handling
- Added event description input
- Clarified the difference between on-page preview effects and exported files
- Synced metadata and package version with the current app
- Upgraded the stack to Next.js 16, Tailwind CSS 4, and the latest compatible tooling
- Added reusable event config for template-based theming
- Added a phone-first meetup card flow with card preview and image export
- Added installable web app metadata for faster mobile access

### v2.0.0 (January 22, 2026)
- Complete rewrite with Next.js 15 and React 19
- Added qr-code-styling library for advanced customization
- Added multiple QR code types (WiFi, Email, Location, Events)
- Added logo embedding with size and margin controls
- Added 6 different dot styles and corner customization
- Added multiple export formats (PNG, SVG, JPEG)
- Added error correction level selection
- Modern UI with Tailwind CSS and dark mode support
- Full TypeScript support

### v1.0.0 (December 5, 2024)
- Initial project setup
- Basic repository structure

---

**Create. Scan. Connect.**

Made with precision and care.
