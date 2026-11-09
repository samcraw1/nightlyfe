import { Big_Shoulders, Bodoni_Moda, Great_Vibes, Inter, Manrope, Outfit, Playfair_Display, Sora, Syncopate, Yellowtail } from "next/font/google";
import type { FontPreset } from "@/clubs/types";

/*
 * next/font needs every font declared statically at module scope, so each
 * preset's faces are declared here and a club picks a preset by name.
 * Only the chosen preset's class names are applied to <html>, and
 * non-default presets skip preloading, so unused faces are never fetched.
 *
 * Each preset maps three roles onto CSS variables used in globals.css:
 *   --club-display  headings      --club-sans  body      --club-script  wordmark
 */

const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", style: ["normal", "italic"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

const bigShoulders = Big_Shoulders({ subsets: ["latin"], variable: "--font-big-shoulders", preload: false });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", preload: false });
const yellowtail = Yellowtail({ subsets: ["latin"], weight: "400", variable: "--font-yellowtail", preload: false });

const syncopate = Syncopate({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-syncopate", preload: false });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", preload: false });

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", style: ["normal", "italic"], preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: false });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes", preload: false });

interface PresetDef {
  className: string;
  vars: Record<string, string>;
}

const presets: Record<FontPreset, PresetDef> = {
  classic: {
    className: `${bodoni.variable} ${manrope.variable}`,
    vars: {
      "--club-display": "var(--font-bodoni)",
      "--club-sans": "var(--font-manrope)",
      "--club-script": "var(--font-bodoni)",
    },
  },
  "neon-pinup": {
    className: `${bigShoulders.variable} ${outfit.variable} ${yellowtail.variable}`,
    vars: {
      "--club-display": "var(--font-big-shoulders)",
      "--club-sans": "var(--font-outfit)",
      "--club-script": "var(--font-yellowtail)",
    },
  },
  vivide: {
    className: `${syncopate.variable} ${sora.variable}`,
    vars: {
      "--club-display": "var(--font-sora)",
      "--club-sans": "var(--font-sora)",
      "--club-script": "var(--font-syncopate)",
    },
  },
  pinkhouse: {
    className: `${playfair.variable} ${inter.variable} ${greatVibes.variable}`,
    vars: {
      "--club-display": "var(--font-playfair)",
      "--club-sans": "var(--font-inter)",
      "--club-script": "var(--font-great-vibes)",
    },
  },
};

export function fontPreset(name: FontPreset): PresetDef {
  return presets[name];
}
