/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,jsx}', './components/**/*.{js,ts,jsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
