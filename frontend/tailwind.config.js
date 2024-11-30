/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        text: '#000000',
        background: '#ffffff',
        primary: '#18c95a',
        secondary: '#a9a7a9',
        accent: '#00bfae',
        lightBlue: undefined,
        warmGray: undefined,
        trueGray: undefined,
        coolGray: undefined,
        blueGray: undefined,
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
