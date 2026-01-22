# QR Code Generator

A modern, feature-rich QR code generator built with Next.js 15, React 19, and TypeScript. Create beautiful, customizable QR codes with logo embedding, custom colors, gradients, and multiple dot styles.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black)
![React](https://img.shields.io/badge/React-19.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)

## Features

- **Multiple QR Code Types**
  - URL links
  - Plain text
  - WiFi credentials (auto-connect)
  - Email with subject and body
  - Phone numbers
  - Geographic locations
  - Calendar events (vCalendar)

- **Advanced Styling Options**
  - Custom dot colors and styles (square, dots, rounded, classy, etc.)
  - Custom corner square and corner dot styles
  - Background color customization
  - Adjustable size and margin
  - 6 different dot patterns

- **Logo Embedding**
  - Upload custom logos/images
  - Adjustable logo size (10-50%)
  - Logo margin control
  - Works with error correction

- **Error Correction Levels**
  - Low (7%) - Smallest QR code
  - Medium (15%) - Balanced
  - Quartile (25%) - Good for logos
  - High (30%) - Best for logos

- **Export Options**
  - PNG (raster, web-optimized)
  - SVG (vector, print-quality)
  - JPEG (compressed)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **QR Engine**: [qr-code-styling](https://www.npmjs.com/package/qr-code-styling)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sergiopesch/qr-code-generator.git
cd qr-code-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

### Basic QR Code

1. Select the QR code type (URL, Text, WiFi, etc.)
2. Enter your content
3. Click download to export

### Custom Styling

1. Adjust size and margin using the sliders
2. Pick custom colors for dots, background, and corners
3. Select dot style and corner styles
4. Choose error correction level

### Adding a Logo

1. Click "Upload Logo" and select an image
2. Adjust logo size (recommended: 20-40%)
3. Set logo margin for padding
4. Use "High" error correction for best results

### WiFi QR Codes

1. Select "WiFi" type
2. Enter network name (SSID)
3. Enter password
4. Select encryption type (WPA/WPA2, WEP, or None)
5. Check "Hidden Network" if applicable

## Project Structure

```
qr-code-generator/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles and Tailwind
│   │   ├── layout.tsx       # Root layout with metadata
│   │   └── page.tsx         # Main page component
│   └── components/
│       └── QRCodeGenerator.tsx  # QR code generator component
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [qr-code-styling](https://github.com/nicklasoverby/qr-code-styling) - The powerful QR code generation library
- [Lucide](https://lucide.dev/) - Beautiful open-source icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Changelog

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

**Originally Created**: December 5, 2024
**Last Updated**: January 22, 2026
**Author**: Sergio Peschiera ([@sergiopesch](https://github.com/sergiopesch))
