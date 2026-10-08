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
        forest: {
          50: '#f2f8f5',
          100: '#e1f0e8',
          500: '#2d6a4f',
          800: '#1b4332',
          900: '#081c15',
        },
        sage: {
          50: '#f4f8f6',
          100: '#e4eee8',
          400: '#74c69d',
          500: '#52b788',
          600: '#40916c',
        },
        cream: {
          50: '#fffefc',
          100: '#fdfbf7',
          200: '#f7f2e9',
          300: '#efe6d5',
        },
        sunrise: {
          400: '#f4a261',
          500: '#e76f51',
          600: '#d65a31',
        },
        botanical: {
          gold: '#e9c46a',
          earth: '#9c6644',
          sky: '#a8dede',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Fraunces', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'soft': '0 10px 30px -5px rgba(27, 67, 50, 0.08)',
        'lift': '0 20px 40px -15px rgba(27, 67, 50, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sway': 'sway 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
}
