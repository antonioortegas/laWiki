/** @type {import('tailwindcss').Config} */

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
      },
      fontFamily: {
        heading: ['Ubuntu', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
};
