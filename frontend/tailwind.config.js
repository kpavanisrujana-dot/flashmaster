/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d3b66",
        accent: "#f95738",
        soft: "#f4f9ff",
      },
    },
  },
  plugins: [],
};
