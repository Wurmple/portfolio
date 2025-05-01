/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        k2d: ["K2D", "sans-serif"],
        jetbrains: ['"JetBrains Mono"', 'monospace'],
      },
      fontWeight: {
        regular: 400,
        bold: 700,
      }
    },
  },
  plugins: [],
}