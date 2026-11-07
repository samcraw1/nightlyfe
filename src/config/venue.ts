/**
 * Active venue configuration.
 *
 * The platform is multi-tenant: each club lives in `src/clubs/<slug>/` and a
 * build serves the one named by `NEXT_PUBLIC_CLUB` (default "onyx"). This
 * module is the single import point for venue settings; see
 * docs/NEW_CLUB.md to add a club.
 */
import club from "@club";

export type {
  ClubContent,
  ClubDefinition,
  DigitalStageConfig,
  VenueConfig,
  VenueFeatures,
  WeeklySpecial,
} from "@/clubs/types";

export const venue = club.venue;
export const content = club.content;

/** True when any credit-based feature (paid messages, webcam tips) is on. */
export const creditsEnabled = venue.features.messaging || venue.features.webcams;

/** CSS custom properties derived from venue colors, applied on <html>. */
export function venueCssVars(): Record<string, string> {
  const c = venue.colors;
  return {
    "--ink": c.ink,
    "--ink-2": c.ink2,
    "--ink-3": c.ink3,
    "--bone": c.bone,
    "--muted": c.muted,
    "--gold": c.gold,
    "--gold-bright": c.goldBright,
    "--gold-deep": c.goldDeep,
    "--blood": c.blood,
    "--accent-2": c.accent2,
  };
}
