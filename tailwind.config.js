/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8B5CF6", // violet-500
          dark: "#7C3AED",
          light: "#A78BFA"
        }
      },
      borderRadius: {
        xl: "1rem",
      }
    },
  },
  plugins: [],
}
