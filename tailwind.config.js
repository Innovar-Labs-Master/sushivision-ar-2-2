/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        sushi: {
          dark: '#1a1a1a',
          red: '#ff6b6b',
          rice: '#fdfdfd',
          seaweed: '#2c3e50',
          gold: '#fbbf24'
        }
      }
    },
  },
  plugins: [],
}

