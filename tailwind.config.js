/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#A2D149',
          dark: '#0D0D0D',
          muted: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
