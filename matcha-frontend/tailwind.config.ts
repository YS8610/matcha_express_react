import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#61dafb",
        secondary: "#282c34",
      },
      keyframes: {
        'app-logo-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'app-logo-spin': 'app-logo-spin infinite 20s linear',
      }
    },
  },
  plugins: [],
};

export default config;
