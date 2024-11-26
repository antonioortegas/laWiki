/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      colors: {
        text: '#000000',
        background: '#ffffff',
        primary: '#18c95a',
        secondary: '#a9a7a9',
        accent: '#00bfae',
        ...colors, // Include Tailwind's default colors
      },
      fontFamily: {
        heading: ['Ubuntu', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
};
