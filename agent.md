# Agent Instructions for QR Code Generator

This document provides instructions for AI agents working on this project.

## Project Summary

| Property | Value |
|----------|-------|
| **Name** | QR Code Generator |
| **Type** | Web Application |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Created** | December 5, 2024 |
| **Last Updated** | January 22, 2026 |

## Quick Start

```bash
npm install
npm run dev
```

The application runs at `http://localhost:3000`.

## Core Functionality

### QR Code Types Supported
1. **URL** - Website links
2. **Text** - Plain text content
3. **WiFi** - Network credentials (SSID, password, encryption)
4. **Email** - mailto: links with optional subject/body
5. **Phone** - tel: links for phone numbers
6. **Location** - geo: coordinates
7. **Event** - vCalendar format events

### Styling Features
- 6 dot styles (square, dots, rounded, extra-rounded, classy, classy-rounded)
- 3 corner square styles
- 2 corner dot styles
- Custom colors for all elements
- Logo embedding with size/margin control
- 4 error correction levels

### Export Formats
- PNG (raster)
- SVG (vector)
- JPEG (compressed)

## File Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main page component |
| `src/app/layout.tsx` | Root layout with metadata |
| `src/app/globals.css` | Global styles |
| `src/components/QRCodeGenerator.tsx` | QR generator component |
| `package.json` | Dependencies and scripts |
| `tailwind.config.ts` | Tailwind configuration |
| `tsconfig.json` | TypeScript configuration |
| `next.config.ts` | Next.js configuration |

## Key Library: qr-code-styling

The project uses [qr-code-styling](https://www.npmjs.com/package/qr-code-styling) v1.8.4 for QR code generation.

### Basic Usage Pattern
```typescript
import QRCodeStyling from 'qr-code-styling';

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  data: 'https://example.com',
  dotsOptions: {
    color: '#000000',
    type: 'rounded'
  }
});

qrCode.append(containerElement);
qrCode.download({ extension: 'png' });
```

## Agent Tasks

### When Adding Features
1. Check if the feature fits existing architecture
2. Update TypeScript types as needed
3. Add UI controls in the appropriate section
4. Test with real QR code scanner
5. Update documentation if significant

### When Fixing Bugs
1. Reproduce the issue first
2. Check browser console for errors
3. Verify qr-code-styling API usage
4. Test across different QR types
5. Ensure no regression in other features

### When Refactoring
1. Maintain backward compatibility
2. Keep component under 500 lines if possible
3. Extract reusable logic to hooks if needed
4. Run `npm run type-check` before committing

## Quality Checklist

Before completing any task:
- [ ] TypeScript compiles without errors
- [ ] All QR types generate valid codes
- [ ] QR codes scan correctly on mobile
- [ ] Logo embedding works with high error correction
- [ ] All export formats work
- [ ] UI is responsive (mobile/desktop)
- [ ] Dark mode works correctly

## Common Patterns

### Adding State
```typescript
const [newOption, setNewOption] = useState<Type>(defaultValue);

// Add to useEffect dependencies
useEffect(() => {
  qrCode.current?.update({ ...options, newOption });
}, [newOption, /* other deps */]);
```

### Adding QR Type
```typescript
// 1. Add to type union
type QRType = 'url' | 'text' | ... | 'newtype';

// 2. Add to QR_TYPES array
{ value: 'newtype', label: 'New Type', icon: <Icon /> }

// 3. Add state and handler
const [newTypeData, setNewTypeData] = useState({...});

// 4. Add to generateQRData switch
case 'newtype':
  return formatNewTypeData(newTypeData);

// 5. Add form in renderDataInput
case 'newtype':
  return <NewTypeForm ... />;
```

## Environment

- Node.js 18+ required
- No environment variables needed for basic operation
- Works entirely client-side (no server API calls)

## Contact

**Author**: Sergio Peschiera
**GitHub**: [@sergiopesch](https://github.com/sergiopesch)
**Repository**: [qr-code-generator](https://github.com/sergiopesch/qr-code-generator)

---

*Agent instructions document. Version 2.0 - January 22, 2026*
