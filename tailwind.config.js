/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        // We can add more colors if needed, but we'll rely on the default tailwind colors for now.
        // We'll use violet and blue for primary, which are in the default tailwind palette.
      },
    },
  },
  plugins: [],
}
