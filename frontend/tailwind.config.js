/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Warm Palette Tokens
        palette: {
          cream: "#EFE6D6",
          platinum: "#B8B8AC",
          bronze: "#CBA378",
          terracotta: "#C86D39",
          slate: "#2E4C63",
          charcoal: "#2C2927",
        },
        zenta: {
          bg: "#2C2927",
          card: "#1F2231",
          "card-light": "rgba(44, 41, 39, 0.92)",
          gold: "#CBA378",
          "gold-hover": "#EFE6D6",
          amber: "#C86D39",
          border: "rgba(203, 163, 120, 0.35)"
        },
        jupiter: {
          peach: "#EFE6D6",
          blue: "#2E4C63",
          "blue-hover": "#1E364A"
        }
      },
      boxShadow: {
        '3d-bronze': '0 4px 0 #9E7B4F, 0 6px 15px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        '3d-terracotta': '0 4px 0 #934C24, 0 6px 15px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        '3d-slate': '0 4px 0 #1A3041, 0 6px 15px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        'glow-bronze': '0 0 25px rgba(203, 163, 120, 0.75)',
        'glow-terracotta': '0 0 25px rgba(200, 109, 57, 0.75)',
        'glow-cream': '0 0 25px rgba(239, 230, 214, 0.85)',
        'glow-slate': '0 0 25px rgba(46, 76, 99, 0.85)',
        'gloss-card': '0 25px 60px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(239, 230, 214, 0.4)',
      }
    },
  },
  plugins: [],
}