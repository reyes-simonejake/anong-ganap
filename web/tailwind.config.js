/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    'theme-label--date',
    'theme-label--hangout',
    'theme-label--family',
    'theme-label--solo',
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: { extend: {} },
  plugins: []
}
