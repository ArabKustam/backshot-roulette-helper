/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rusty-orange': '#c2410c',
        'dirty-white': '#e5e5e5',
        'deep-black': '#111111',
        'dark-gray': '#1a1a1a',
        'crt-green': '#33ff33',
      },
      fontFamily: {
        mono: ['"VT323"', 'monospace'],
      },
      backgroundImage: {
        'scanlines': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      },
    },
  },
  plugins: [],
}
