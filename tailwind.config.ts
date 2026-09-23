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
        // --- Fire on the Bayou accent layer ---
        ink: "#060605", // deepest cinematic black (used for full-bleed bg)
        ember: "#E2452A", // ember red — primary heat accent
        flame: "#FF7A3C", // orange flame — secondary heat / hover glow
        "flame-light": "#FFA463",
        bayou: "#0B1512", // murky cypress green-black — alternate section bg
        "bayou-deep": "#070C0A",
        ash: "#6B655C", // warm muted gray for secondary text
      },
      fontFamily: {
        // Loaded via @import in globals.css (ecosystem convention)
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"DM Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest: "0.28em",
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
