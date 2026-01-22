# Claude Code Instructions for QR Code Generator

This document provides guidance for Claude Code when working with this QR code generator project.

## Project Overview

This is a modern QR code generator application built with:
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5.7**
- **Tailwind CSS 3.4**
- **qr-code-styling** library

**Originally Created**: December 5, 2024
**Major Upgrade**: January 22, 2026

## Architecture

### Directory Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles + Tailwind directives
│   ├── layout.tsx      # Root layout with metadata
│   └── page.tsx        # Home page with QR generator
└── components/
    └── QRCodeGenerator.tsx  # Main QR code component
```

### Key Components

#### QRCodeGenerator (`src/components/QRCodeGenerator.tsx`)
The main component handling all QR code generation logic:
- Uses `qr-code-styling` library for QR code rendering
- Supports 7 QR code types: URL, Text, WiFi, Email, Phone, Location, Event
- Real-time preview with live updates
- Export to PNG, SVG, JPEG formats

## Development Guidelines

### Running the Project
```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run type-check   # TypeScript validation
```

### Code Style
- Use TypeScript for all new code
- Follow React 19 patterns (hooks, functional components)
- Use Tailwind CSS for styling (no CSS modules)
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names

### Adding New QR Types
1. Add type to `QRType` union in `QRCodeGenerator.tsx`
2. Add entry to `QR_TYPES` array with icon
3. Create state for new type's data
4. Add case to `generateQRData()` function
5. Add form inputs in `renderDataInput()`

### Styling Customization
The QR code styling is handled by `qr-code-styling` library:
- Dot types: square, dots, rounded, extra-rounded, classy, classy-rounded
- Corner square types: square, dot, extra-rounded
- Corner dot types: square, dot
- Error correction: L (7%), M (15%), Q (25%), H (30%)

## Common Tasks

### Add a New Export Format
1. Update `downloadQRCode` function
2. Add new button in the download section
3. The `qr-code-styling` library supports: png, svg, jpeg, webp

### Modify QR Code Defaults
Look for state initializations in `QRCodeGenerator.tsx`:
```typescript
const [size, setSize] = useState(300);
const [dotColor, setDotColor] = useState('#000000');
// etc.
```

### Update Metadata
Edit `src/app/layout.tsx` for SEO metadata changes.

## Testing

When making changes:
1. Verify QR codes scan correctly with a mobile device
2. Test all 7 QR code types
3. Test logo upload/removal
4. Test all export formats
5. Check dark mode appearance
6. Verify responsive design on mobile

## Dependencies

Key packages:
- `qr-code-styling`: QR code generation with styling
- `lucide-react`: Icon library
- `next`: React framework
- `tailwindcss`: Utility CSS

## Troubleshooting

### QR Code Not Updating
- Check that `useEffect` dependencies include all relevant state
- Verify `qrCode.current.update()` is being called

### Logo Not Appearing
- Ensure error correction is set to Q or H for logo support
- Check logo file is valid image format
- Verify `crossOrigin: 'anonymous'` in image options

### Build Errors
- Run `npm run type-check` for TypeScript issues
- Check for missing dependencies with `npm install`

## Performance Notes

- QR code regeneration is debounced via React's state batching
- Logo images are converted to base64 data URLs
- SVG export produces smallest file sizes
- Consider lazy loading the QR component for initial page load

---

*This file is maintained for Claude Code AI assistance. Last updated: January 22, 2026*
