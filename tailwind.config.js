/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          base: "#0d0d14",
          card: "#16161f",
          surface: "#1e1e2a",
        },
        nuvio: {
          purple: {
            400: "#a78bfa",
            500: "#8b5cf6",
            600: "#7c3aed",
          },
          green: "#22c55e",
          orange: "#f97316",
          blue: "#3b82f6",
          red: "#ef4444",
          yellow: "#eab308",
        },
        text: {
          primary: "#f8f8ff",
          secondary: "#a0a0b8",
          muted: "#52526a",
        },
        border: "rgba(255,255,255,0.06)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
