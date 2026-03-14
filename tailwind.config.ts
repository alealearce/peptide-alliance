/**
 * tailwind.config.ts — The Peptide Alliance
 *
 * Brand colors must stay in sync with COLORS in lib/config/site.ts.
 */
import type { Config } from "tailwindcss";

// ── Brand colors ────────────────────────────────────────────────────────────
const PRIMARY      = "#0A1F44"  // Navy — buttons, links, nav
const PRIMARY_DARK = "#061430"  // Hover state
const ACCENT       = "#98EBCF"  // Mint green — badges, verified
const BG           = "#F8FAFB"  // Light clinical background
const CARD         = "#FFFFFF"  // Card background — pure white
const TEXT         = "#1C1C1C"  // Body text
const MUTED        = "#6F727A"  // Secondary text
const GOLD         = "#C9A05D"  // Premium / trust elements
const SKY          = "#73C2FB"  // Secondary accent

// ── Brand fonts ─────────────────────────────────────────────────────────────
const FONT_HEADING = "Inter"    // Clean, clinical headings
const FONT_BODY    = "Inter"    // Body text

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: PRIMARY,
          dark:    PRIMARY_DARK,
        },
        bg:     BG,
        card:   CARD,
        accent: ACCENT,
        text:   TEXT,
        muted:  MUTED,
        gold:   GOLD,
        sky:    SKY,
      },
      fontFamily: {
        heading: [FONT_HEADING, "sans-serif"],
        body:    [FONT_BODY,    "sans-serif"],
      },
      borderRadius: {
        xl:  "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
