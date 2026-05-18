/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'industrial-blue': '#4A90E2',
        'metal-silver': '#B8C5D6',
        'dark-gray': '#2C3E50',
        'light-blue': '#E8F4FC',
      },
    },
  },
  plugins: [],
}