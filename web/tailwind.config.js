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
        brand: {
          gold: '#FFC700',
          'gold-hover': '#F0B800',
          'gold-light': '#FFF085',
          'gold-dark': '#C99300',
          black: '#0A0B0E',
          surface: '#12141C',
          card: '#161924',
          'card-hover': '#1C2030',
          border: '#23283A',
          muted: '#8A92A6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(255, 199, 0, 0.25)',
        'gold-sm': '0 0 12px -2px rgba(255, 199, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
