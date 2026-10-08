import type { Config } from "tailwindcss";

/**
 * Fire on the Bayou — Tailwind config
 *
 * Built on James Afflu's shared ecosystem tokens (studio-black / gold / cream / mist)
 * with a FIRE + BAYOU accent layer stacked on top — the same pattern Lil Squiggle uses
 * for its rasta palette. Keep the shared tokens intact; the ember/flame/bayou colors are
 * what make this site read hotter and more cinematic than midcitysound.com.
 */
const config: Config = {
  // Brand colours, fonts and semantic tokens come from the shared IN-FLU-ENTIAL preset.
  presets: [require("@flu-wop/design-system/tailwind-preset")],
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}", "./node_modules/@flu-wop/design-system/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        // Phones held sideways: wide but short. Used to tighten full-screen layouts.
        short: { raw: "(max-height: 540px)" },
      },
      colors: {
        // --- Fire on the Bayou: "Rolling" palette ---
        // Black and white like a monitor on set; the logo's crimson is the
        // only color, used for the REC light, buttons, and small accents.
        ink: "#000000", // page background
        ember: "#D01146", // logo crimson — fills (white text 5.4:1)
        flame: "#F0466F", // crimson lifted for small accent text (5.8:1)
        "flame-light": "#F7859F",
        bayou: "#121212", // raised panel
        "bayou-deep": "#0A0A0A", // alternate section bg
        ash: "#7A7A7A", // tertiary text
        cream: "#FFFFFF", // primary text
        mist: "#A3A3A3", // secondary text
        card: { DEFAULT: "#141414", foreground: "#FFFFFF" },
        border: "#2A2A2A",
      },
      fontFamily: {
        // Loaded via @import in globals.css (ecosystem convention)
        // One family, Archivo: condensed + heavy for display (see .font-display
        // in globals.css), normal width for everything else.
        display: ["var(--font-archivo)", "Archivo", "system-ui", "sans-serif"],
        sans: ["var(--font-archivo)", "Archivo", "system-ui", "sans-serif"],
        mono: ["var(--font-archivo)", "Archivo", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.04em",
      },
      maxWidth: {
        frame: "1680px", // cinematic content frame
      },
      transitionTimingFunction: {
        // Custom easing used across reveals + hovers for a weighted, filmic motion feel
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "ember-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "ember-pulse": "ember-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
