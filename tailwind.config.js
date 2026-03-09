/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink:    "#0A0A0F",
        paper:  "#F8F7F4",
        mist:   "#F0EEE9",
        slate:  "#6B6B7B",
        accent: "#1A1A2E",
        gold:   "#C9A84C",
        sage:   "#4A7C6F",
        coral:  "#E8614A",
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "fade-in":   "fadeIn 0.4s ease forwards",
        "slide-in":  "slideIn 0.5s ease forwards",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { opacity: 0, transform: "translateX(-20px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
      }
    },
  },
  plugins: [],
};
