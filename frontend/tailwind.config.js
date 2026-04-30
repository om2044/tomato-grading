/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 C'est cette ligne qui change tout !
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}