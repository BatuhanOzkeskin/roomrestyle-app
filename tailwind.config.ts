import type { Config } from "tailwindcss";

// Renkler globals.css'teki R G B kanallarından okunur; böylece
// "bg-accent/15" gibi saydamlık kısaltmaları da çalışır.
const rgb = (name: string) => `rgb(var(--rr-${name}-rgb) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: rgb("bg"),
        surface: rgb("surface"),
        "surface-2": rgb("surface-2"),
        ink: {
          DEFAULT: rgb("ink"),
          muted: rgb("ink-muted"),
        },
        primary: {
          DEFAULT: "var(--rr-primary)",
          hover: "var(--rr-primary-h)",
        },
        accent: {
          DEFAULT: rgb("accent"),
          ink: rgb("accent-ink"),
        },
        "on-accent": rgb("on-accent"),
        line: "var(--rr-border-2)",
        muted: "var(--rr-muted)",
        success: rgb("success"),
        gold: rgb("gold"),
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        card: "20px",
        field: "12px",
      },
      boxShadow: {
        card: "var(--rr-shadow)",
        glow: "0 10px 30px -12px rgb(var(--rr-accent-rgb) / 0.55)",
        "glow-lg": "0 16px 40px -12px rgb(var(--rr-accent-rgb) / 0.7)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Üretim sırasında fotoğrafın üzerinden geçen tarama çizgisi
        scan: {
          "0%": { top: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 2.2s linear infinite",
        scan: "scan 2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
