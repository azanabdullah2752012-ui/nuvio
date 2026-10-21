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
        display: ['"Lora"', '"Newsreader"', 'Georgia', 'serif'],
        serif: ['"Newsreader"', '"Lora"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        clash: ['"Lora"', 'Georgia', 'serif'],
      },
      colors: {
        background: {
          base: "#fbfbfa",
          card: "#ffffff",
          surface: "#f5f3ec",
          elevated: "#ece8dc",
          dark: "#14251c",
        },
        brand: {
          forest: "#1b3b2b",
          "forest-hover": "#254e3a",
          "forest-dark": "#12281d",
          navy: "#162744",
          "navy-hover": "#22395d",
          amber: "#a46a29",
          "amber-light": "#faf3e8",
          parchment: "#f7f5ee",
          ink: "#1a1917",
          vermilion: "#1b3b2b", // remap legacy vermilion calls to deep forest green
          "vermilion-hover": "#254e3a",
          "vermilion-dark": "#12281d",
          bone: "#fbfbfa",
          ochre: "#a46a29",
          steel: "#4a4843",
        },
        nuvio: {
          purple: {
            400: "#1b3b2b",
            500: "#1b3b2b",
            600: "#12281d",
          },
          green: "#205739",
          orange: "#a46a29",
          blue: "#162744",
          red: "#8c2825",
          yellow: "#b57a26",
          cyan: "#1f485b",
          pink: "#1b3b2b",
        },
        text: {
          primary: "#1a1917",
          secondary: "#52504a",
          muted: "#827f76",
        },
        border: "#e5e1d5",
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "6px",
      },
      boxShadow: {
        'paper-sm': '0 1px 3px rgba(26, 25, 23, 0.05), 0 1px 2px rgba(26, 25, 23, 0.03)',
        'paper': '0 4px 16px -2px rgba(26, 25, 23, 0.06), 0 2px 6px -1px rgba(26, 25, 23, 0.04)',
        'paper-lg': '0 12px 32px -4px rgba(26, 25, 23, 0.08), 0 4px 12px -2px rgba(26, 25, 23, 0.04)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}