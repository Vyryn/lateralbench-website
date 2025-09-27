/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "Apple Color Emoji"]
      },
      colors: {
        bg: "#0b0f15",
        bgSoft: "#0f1621",
        card: "#111827",
        ink: "#e5e7eb",
        inkSoft: "#9ca3af",
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63"
        }
      },
      boxShadow: {
        glow: "0 10px 40px rgba(6,182,212,0.25)"
      }
    }
  },
  plugins: []
};