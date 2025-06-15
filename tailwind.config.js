/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4461F2',
        background: '#F6F6F6',
        textPrimary: '#1F1F39',
        textSecondary: '#B8B8D2',
      },
    },
  },
  plugins: [],
};
