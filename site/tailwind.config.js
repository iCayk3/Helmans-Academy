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
          black: '#070708',
          dark: '#0B0B0D',
          surface: '#131316',
          card: '#1A1A1F',
          cardHover: '#22222A',
          border: '#272730',
          borderLight: '#3F3F4E',
          gold: '#FACC15',
          goldDark: '#EAB308',
          goldLight: '#FEF08A',
          goldMuted: '#CA8A04',
          whatsapp: '#22C55E',
          whatsappHover: '#16A34A',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        display: [
          'Montserrat',
          'Inter',
          'sans-serif',
        ],
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(250, 204, 21, 0.15)',
        'gold': '0 0 25px rgba(250, 204, 21, 0.25)',
        'gold-lg': '0 0 40px rgba(250, 204, 21, 0.35)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FDE047 0%, #FACC15 50%, #CA8A04 100%)',
        'gold-metallic': 'linear-gradient(180deg, #FFFBEB 0%, #FACC15 50%, #92400E 100%)',
        'dark-gradient': 'linear-gradient(180deg, #131316 0%, #0B0B0D 100%)',
        'radial-glow': 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, rgba(11, 11, 13, 0) 70%)',
      },
    },
  },
  plugins: [],
};
