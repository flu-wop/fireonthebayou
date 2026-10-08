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
      colors: {
        // --- Fire on the Bayou: "Blue Note" palette ---
        // Midnight blue-black and silver, after Herman Leonard's smoke-and-
        // shadow jazz photographs; the logo's crimson is the only warm color.
        ink: "#0E131A", // midnight — page background
        ember: "#C40F42", // logo crimson, deepened for fills (cream text 5:1)
        flame: "#EC5A80", // crimson lifted for small accent text on midnight
        "flame-light": "#F48AA6",
        bayou: "#151C25", // raised panel
        "bayou-deep": "#111821", // alternate section bg
        ash: "#737D8A", // tertiary text
        cream: "#ECE8E0", // silver-white body + headline text
        mist: "#97A0AC", // smoke — secondary text
        card: { DEFAULT: "#161D27", foreground: "#ECE8E0" },
        border: "#26303C",
      },
      fontFamily: {
        // Loaded via @import in globals.css (ecosystem convention)
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter Tight"', "system-ui", "sans-serif"],
        // Small labels use the sans too — no monospace in this palette.
        mono: ['"Inter Tight"', "system-ui", "sans-serif"],
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
