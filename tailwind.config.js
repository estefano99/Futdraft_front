/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sbc-blue': '#0339A6',
        'sbc-yellow': '#F2CB05',
        'sbc-login': '#094799',
      },
    },
  },
  plugins: [],
});
