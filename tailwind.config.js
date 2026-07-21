/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        card: {
          DEFAULT: '#FFFFFF',
          hover: '#F7F9F9',
        },
        border: '#EFF3F4',
        primary: {
          DEFAULT: '#1D9BF0',
          hover: '#1A8CD8',
          light: 'rgba(29, 155, 240, 0.1)',
        },
        text: {
          main: '#0F1419',
          muted: '#536471',
          subtle: '#8B98A5',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
