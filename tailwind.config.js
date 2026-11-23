/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#101412',
        ink: '#0e1311',
        panel: '#17211c',
        panel2: '#1e2a24',
        line: '#314038',
        olive: '#9aa56d',
        lime: '#c6e070',
        fog: '#e7ece4',
        mute: '#93a096',
        warn: '#e0b15a',
        alert: '#d97862',
        sea: '#8fbfa8',
      },
      fontFamily: {
        display: ['Rajdhani', 'Segoe UI', 'sans-serif'],
        sans: ['IBM Plex Sans', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
