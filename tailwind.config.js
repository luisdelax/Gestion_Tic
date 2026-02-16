/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00FF9F',
          'green-dark': '#00CC7F',
          'green-light': '#66FFBF',
        },
        slate: {
          850: '#1a2233',
          950: '#0a0f1a',
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 159, 0.3)',
        'neon-strong': '0 0 40px rgba(0, 255, 159, 0.5)',
      }
    },
  },
  plugins: [],
}
