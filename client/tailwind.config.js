/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2F5F8',
        ink: '#13202E',
        mute: '#5A6B7D',
        line: '#D8E0E8',
        signal: { DEFAULT: '#2246FF', dark: '#1733C7', soft: '#E7ECFF' },
        flash: '#FFD93D',
        alert: '#C8302B',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
