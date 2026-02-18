/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "colors-grays-black": "var(--colors-grays-black)",
      },
    },
  },
  plugins: [],
};


