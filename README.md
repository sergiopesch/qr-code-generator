# QR Studio

An ultra-minimalist QR code generator featuring innovative 3D logo fusion technology, inspired by 1950s mid-century modern design aesthetics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black)
![React](https://img.shields.io/badge/React-19.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)

## Design Philosophy

**Less is More.** QR Studio embraces the timeless elegance of 1950s design - clean lines, purposeful simplicity, and a carefully curated color palette that brings warmth and character to every QR code you create.

### 1950s Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | `#F5E6C8` | Background |
| Mint | `#7DD2B7` | Accents, buttons |
| Coral | `#E8765C` | Primary actions |
| Turquoise | `#52C3D3` | Secondary actions |
| Charcoal | `#333333` | Text, borders |
| Mustard | `#D4A017` | Highlights |

## Key Innovation: 3D Logo Fusion

QR Studio introduces a revolutionary approach to branded QR codes:

- **3D Perspective View** - QR codes are displayed with depth and dimension
- **Floating Animation** - Subtle movement brings your codes to life
- **Logo Integration** - Your brand seamlessly emerges from the code itself
- **Interactive Preview** - Hover to explore from different angles

The 3D effect creates a visual where the logo and QR code become one unified element, rather than a logo simply placed on top of a flat code.

## Features

### QR Code Types
- URL links
- Plain text
- WiFi credentials (auto-connect)
- Email with subject and body
- Phone numbers
- Geographic locations
- Calendar events (vCalendar)

### Styling Options
- 6 retro-inspired color presets
- Custom color controls for dots, background, and corners
- 6 dot pattern styles (square, dots, rounded, classy, etc.)
- Corner square and dot customization
- 4 error correction levels
- Adjustable size (150-400px)

### Logo Fusion
- Upload custom logos/images
- Automatic high error correction when logo is added
- Adjustable logo size (15-50%)
- Logo margin control
- 3D emergence effect

### Export Options
- PNG (web-optimized)
- SVG (print-quality vectors)
- JPEG (compressed)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Typography**: Space Grotesk (display) + Inter (body)
- **QR Engine**: [qr-code-styling](https://www.npmjs.com/package/qr-code-styling)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
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

### Production Build

```bash
npm run build
npm start
```

## Usage

### Creating a QR Code

1. Select the QR code type from the collapsible Type section
2. Enter your content (URL, text, WiFi details, etc.)
3. Watch your QR code update in real-time in the 3D preview

### Applying Retro Styles

1. Open the Colors section
2. Choose from 6 pre-designed color presets:
   - Classic (black on white)
   - Mint (fresh and modern)
   - Coral (warm and inviting)
   - Turquoise (cool and calm)
   - Mustard (bold and vintage)
   - Charcoal (sophisticated on cream)
3. Fine-tune with custom color pickers

### Logo Fusion

1. Open the Logo Fusion section
2. Upload your logo image
3. Adjust size (35% default, 15-50% range)
4. Set margin for padding around logo
5. Toggle 3D Float to see your logo emerge from the code

### Interacting with 3D Preview

- **Hover** over the QR code to flatten and enlarge
- **Toggle 3D Float** button to enable/disable floating animation
- The preview shows exactly how your QR code will look when exported

## Project Structure

```
qr-studio/
├── src/
│   ├── app/
│   │   ├── globals.css      # Retro styling, 3D effects
│   │   ├── layout.tsx       # Fonts, metadata
│   │   └── page.tsx         # Minimal landing page
│   └── components/
│       └── QRCodeGenerator.tsx  # Main generator component
├── public/
├── tailwind.config.ts       # 50's color palette
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

- Design inspiration from 1950s mid-century modern aesthetics
- [qr-code-styling](https://github.com/nicklasoverby/qr-code-styling) for QR generation
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## Changelog

### v3.0.0 (January 23, 2026)
- Complete minimalist redesign with 1950s aesthetic
- Introduced 3D Logo Fusion technology
- New floating QR code preview with perspective effects
- Added 6 retro color presets (Mint, Coral, Turquoise, Mustard, Charcoal, Classic)
- Collapsible accordion-style control panels
- New typography with Space Grotesk display font
- Retro form styling with offset shadows
- Interactive 3D hover effects
- Streamlined UI with ultra-minimal approach

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
