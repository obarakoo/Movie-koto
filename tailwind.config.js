/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#e50914',
        'dark-900': '#141414',
        'dark-800': '#181818',
        'dark-700': '#232323',
        'dark-600': '#2f2f2f',
        'netflix-red': '#e50914',
        'netflix-text': '#b3b3b3',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, #141414 30%, transparent 70%), linear-gradient(to top, #141414 10%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
