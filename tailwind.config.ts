import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--rr-bg)",
        surface: "var(--rr-surface)",
        "surface-2": "var(--rr-surface-2)",
        ink: {
          DEFAULT: "var(--rr-ink)",
          muted: "var(--rr-ink-muted)",
        },
        primary: {
          DEFAULT: "var(--rr-primary)",
          hover: "var(--rr-primary-h)",
        },
        accent: {
          DEFAULT: "var(--rr-accent)",
          ink: "var(--rr-accent-ink)",
        },
        line: "var(--rr-border-2)",
        muted: "var(--rr-muted)",
        success: "var(--rr-success)",
        gold: "var(--rr-gold)",
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
      },
    },
  },
  plugins: [],
};

export default config;
