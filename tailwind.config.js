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
      fontFamily: {
        display: ['"Clash Display"', '-apple-system', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: {
          base: "#090a0d",
          card: "#111318",
          surface: "#171a22",
          elevated: "#1e222d",
        },
        brand: {
          vermilion: "#ff4625",
          "vermilion-hover": "#ff5c3d",
          "vermilion-dark": "#d93516",
          bone: "#f5f4ef",
          ochre: "#e5a93c",
          steel: "#2b303c",
        },
        nuvio: {
          purple: {
            400: "#ff6a4f",
            500: "#ff4625",
            600: "#d93516",
          },
          green: "#10b981",
          orange: "#f97316",
          blue: "#3b82f6",
          red: "#ef4444",
          yellow: "#e5a93c",
          cyan: "#06b6d4",
          pink: "#ff4625",
        },
        text: {
          primary: "#f5f4ef",
          secondary: "#949baa",
          muted: "#5b6272",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
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
