/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Baby blue primary palette
        baby: {
          50: "#f0f7ff",
          100: "#e0f0ff",
          200: "#c7e4ff",
          300: "#a2cffe", // Primary baby blue
          400: "#7bb8f0",
          500: "#5a9ee0",
          600: "#3d7fc4",
          700: "#2d62a0",
          800: "#1e4a7d",
          900: "#143660",
        },
        // Accent colours from the splash page
        accent: {
          yellow: "#fdfea2",
          pink: "#fea2fd",
          peach: "#fed0a2",
          purple: "#e7a2fe",
          green: "#a2fea2",
        },
      },
    },
  },
  plugins: [],
};
