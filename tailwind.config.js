/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        civic: {
          emerald: '#064E3B',    // Sovereign Emerald (Primary Trust)
          emeraldHover: '#043A2C',
          mint: '#059669',       // Action & Success
          mintLight: '#D1FAE5',
          gold: '#F59E0B',       // Pending / Locked Decimals
          goldLight: '#FEF3C7',
          crimson: '#E11D48',    // Fraud Block Alert
          crimsonLight: '#FFE4E6',
          dark: '#0F172A',       // Institutional Slate
          slateSubtle: '#F8FAFC',
        },
        bangla: {
          green: '#006a4e',
          red: '#f42a41',
          gold: '#f59e0b',
          darkgreen: '#004d38',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Hind Siliguri"', 'system-ui', '-apple-system', 'sans-serif'],
        bangla: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        ambient: '0 2px 12px -4px rgba(15, 23, 42, 0.08)',
        card: '0 10px 30px -5px rgba(6, 78, 59, 0.08)',
        glow: '0 0 20px -3px rgba(5, 150, 105, 0.35)',
        alertGlow: '0 0 24px -2px rgba(225, 29, 72, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
