import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 1950s Inspired Color Palette
        cream: {
          50: '#FFFEF7',
          100: '#FFFDF0',
          200: '#FFF9E0',
          300: '#FFF5D0',
          400: '#FFEFC0',
          500: '#F5E6C8',
          DEFAULT: '#F5E6C8',
        },
        mint: {
          50: '#F0FAF7',
          100: '#D4F0E7',
          200: '#A8E1CF',
          300: '#7DD2B7',
          400: '#52C39F',
          500: '#40A68A',
          600: '#338570',
          DEFAULT: '#7DD2B7',
        },
        coral: {
          50: '#FFF5F3',
          100: '#FFE8E3',
          200: '#FFD0C7',
          300: '#FFB4A8',
          400: '#FF9888',
          500: '#E8765C',
          600: '#D45A40',
          DEFAULT: '#E8765C',
        },
        turquoise: {
          50: '#F0FAFB',
          100: '#D4F0F4',
          200: '#A8E1E9',
          300: '#7DD2DE',
          400: '#52C3D3',
          500: '#3BA9B9',
          600: '#2F8795',
          DEFAULT: '#52C3D3',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#999999',
          400: '#666666',
          500: '#333333',
          600: '#1A1A1A',
          DEFAULT: '#333333',
        },
        mustard: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4A017',
          600: '#B8860B',
          DEFAULT: '#D4A017',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotateX(12deg) rotateY(-8deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(12deg) rotateY(-8deg)' },
        },
      },
      boxShadow: {
        'retro': '8px 8px 0px 0px rgba(51, 51, 51, 0.15)',
        'retro-lg': '12px 12px 0px 0px rgba(51, 51, 51, 0.15)',
        'retro-xl': '16px 16px 0px 0px rgba(51, 51, 51, 0.12)',
        '3d': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)',
        '3d-lg': '0 35px 60px -15px rgba(0, 0, 0, 0.3), 0 20px 40px -10px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
