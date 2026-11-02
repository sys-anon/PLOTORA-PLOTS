/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#0a2e1a',
        },
        dark: {
          DEFAULT: '#0d2b1d',
          800: '#1a3a28',
          700: '#1e4d33',
        },
        gold: {
          DEFAULT: '#d4a017',
          light: '#f0c040',
          dark:  '#b8860b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(13,43,29,0.85) 0%, rgba(13,43,29,0.4) 60%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

