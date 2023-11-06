/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sf-pro": ["SF-Pro"],
      },
      keyframes: {
        playmusic: {
          "0%, 100%": { height: "10px" },
          "50%": { height: "40%" },
        },
      },
      animation: {
        playmusic: "1s infinite",
      },
    },
  },
  plugins: [],
  mode: "jit",
};
