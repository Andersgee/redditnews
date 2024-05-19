/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.75s cubic-bezier(0.4, 0, 0.6, 1) 1",
        "fade-in-out": "fade-in-out 5s forwards cubic-bezier(0.4, 0, 0.6, 1) 1",
        "pulse-twice": "pulse-twice 0.75s cubic-bezier(0.4, 0, 0.6, 1) 2",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-in-out": {
          "0%": { opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "pulse-twice": { "50%": { opacity: ".5" } },
      },
    },
  },
  plugins: [],
};
