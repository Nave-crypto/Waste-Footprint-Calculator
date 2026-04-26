/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e', // green-500
        secondary: '#16a34a', // green-600
        accent: '#f0fdf4', // green-50
      },
    },
  },
  plugins: [],
}