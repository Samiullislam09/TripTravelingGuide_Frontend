import type { Config } from "tailwindcss";

/**
 * Design tokens — CGHEVEN-inspired teal brand (#277070) with a full light/dark
 * system. The neutral "ink" ramp + surface/line tokens are driven by CSS
 * variables (see globals.css) so EVERY component flips correctly in dark mode
 * without per-file edits. Brand teal + accent ramps are static (they read well
 * on both backgrounds), matching CGHEVEN which keeps --primary fixed.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Surfaces / lines — CSS-var driven, flip on `.dark`.
        base: "rgb(var(--bg) / <alpha-value>)",
        "base-soft": "rgb(var(--bg-soft) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",

        // Neutral text/border ramp — CSS-var driven, flips on `.dark`.
        ink: {
          50: "rgb(var(--ink-50) / <alpha-value>)",
          100: "rgb(var(--ink-100) / <alpha-value>)",
          400: "rgb(var(--ink-400) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
        },

        // Brand = the CGHEVEN orange→red (orange-500 #f97316 → red-500 #ef4444).
        // `teal`/`violet` are aliased to it so every legacy brand class reads
        // the same warm orange.
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // orange-500 — start of the brand gradient
          600: "#ea580c", // primary solid (deep orange, leans to red)
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        teal: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        violet: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // Warm secondary — the red end of the brand gradient (CTA/accent).
        coral: { 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
        // `pink` repurposed to the DaVinci add-on BLUE for accent variety.
        pink: { 400: "#38b6f0", 500: "#00a2e8", 600: "#0086c2" },

        // The 4 add-on brand colors (from the CGHEVEN add-ons popup) — used as
        // the accent palette across the site.
        addon: {
          blender: "#f97316", // orange (= brand start)
          davinci: "#00a2e8", // blue
          ae: "#9999ff",      // periwinkle (After Effects)
          premiere: "#c8a2ff", // violet (Premiere Pro)
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      boxShadow: {
        // Kept minimal — cards now use rings/borders, not drop shadows. These
        // remain only for the primary button glow.
        soft: "0 10px 40px -12px rgba(20, 16, 12, 0.15)",
        glow: "0 12px 40px -12px rgba(249, 115, 22, 0.4)",
        "glow-sm": "0 6px 20px -8px rgba(249, 115, 22, 0.38)",
      },
      backgroundImage: {
        // The CGHEVEN signature: orange → red.
        "brand-gradient":
          "linear-gradient(120deg, #f97316 0%, #f43f2e 55%, #ef4444 100%)",
        "brand-soft": "var(--brand-soft)",
        "warm-gradient": "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "blob-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.08)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
        float: "float 6s ease-in-out infinite",
        "blob-spin": "blob-spin 18s linear infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
