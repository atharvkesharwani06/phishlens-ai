/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070B14',
          card: '#0D1424',
          cardHover: '#131D33',
          border: '#1E293B',
          borderLight: '#334155',
          accent: '#06B6D4', // cyan-500
          accentGlow: '#00F0FF',
          blue: '#3B82F6',
          indigo: '#6366F1',
          critical: '#EF4444',
          high: '#F97316',
          medium: '#FBBF24',
          low: '#10B981',
          safe: '#22C55E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
