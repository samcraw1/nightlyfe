/**
 * The tenant ("club") contract.
 *
 * Every club the platform serves is one folder under `src/clubs/<slug>/`
 * whose `index.ts` default-exports a `ClubDefinition`. A build serves exactly
 * one club, chosen with `NEXT_PUBLIC_CLUB`, and `next.config.ts` aliases
 * `@club` to that folder. Other tenants' configuration and content are never
 * compiled into the bundle, so a deploy cannot leak another club's data.
 *
 * Everything a club can customise lives here: identity, contact info, theme,
 * copy, navigation, feature flags, and its seed content. Components read it
 * through `@/config/venue` and `@/data/*` and never import a club directly.
 */

import type {
  ClubEvent,
  Conversation,
  CreditPackage,
  Entertainer,
  JobRole,
  LiveRoom,
  MenuCategory,
  MenuItem,
  Message,
  Product,
  ReservationPackage,
  TableOption,
} from "@/types";

export interface VenueFeatures {
  liveStream: boolean;
  webcams: boolean;
  messaging: boolean;
  kitchen: boolean;
  merch: boolean;
  parking: boolean;
  jobs: boolean;
  bookings: boolean;
  /** Demo admin dashboard at /admin (content editing preview). Off when omitted. */
  adminPreview?: boolean;
}

export interface DigitalStageConfig {
  /** Minimum age shown by the viewer age gate; null disables the gate. */
  ageRestriction: number | null;
  /** Shown on the stage page under the player (directions, dress code…). */
  visitNote: string;
  /** Demo-mode seeding of the in-memory stage (ignored in production). */
  demo?: {
    /** Entertainer ids that go to the front of tonight's rotation, in order. */
    openingOrder?: string[];
    /** One entertainer left without consent on file, to show the gating rule. */
    noConsentId?: string;
    /** Start the simulated stage live with the first performer on. */
    startLive?: boolean;
  };
}

export interface ThemeColors {
  ink: string;
  ink2: string;
  ink3: string;
  bone: string;
  muted: string;
  /** Primary accent. Named "gold" for historical reasons; any hue works. */
  gold: string;
  goldBright: string;
  goldDeep: string;
  /** Live / alert color. */
  blood: string;
  /** Secondary accent, used by the "neon" style for dual-tone glows. */
  accent2: string;
}

/** Font sets loaded in `src/config/fonts.ts`. */
export type FontPreset = "classic" | "neon-pinup" | "vivide" | "pinkhouse";

/**
 * Visual style. "classic" is the original gold/serif look; "neon" adds glow,
 * neon wordmark, an animated light-show hero, and scroll reveals.
 * "cinematic" is a monochrome luxury look: wide-tracked caps, chrome/foil
 * accents, slow camera-move hero plates, and scroll reveals.
 * "pinkhouse" is black + hot pink luxury: script neon wordmark, editorial
 * serif headlines, silver hairlines, photo-led sections.
 */
export type ThemeStyle = "classic" | "neon" | "cinematic" | "pinkhouse";

export interface WeeklySpecial {
  id: string;
  /** e.g. "Saturdays", "Every day" */
  when: string;
  title: string;
  description: string;
  hue: number;
}

export type MobileNavKey = "home" | "performers" | "live" | "messages" | "reserve" | "events" | "account";

export interface DemoSettings {
  /** Show the "unofficial concept demo" ribbon at the top of every page. */
  ribbon: boolean;
  ribbonText: string;
  /** Phone-width version of the ribbon. */
  ribbonTextShort?: string;
  /** Small print at the bottom of the footer. */
  footerNote: string;
  /** Badge every performer profile as fictional demo content. */
  fictionalPerformers: boolean;
  /** Badge events, specials, menus and prices as sample content. */
  sampleContent: boolean;
  /** Line shown on booking / checkout confirmations. */
  transactionNote?: string;
  /** Show "TBA" instead of any price (for clubs with no verified pricing). */
  hidePrices?: boolean;
}

/** One city in a multi-location brand. The first `primary` entry is this site's focus. */
export interface ClubLocation {
  slug: string;
  name: string;
  city: string;
  status: "open" | "coming-soon";
  /** Short status line, e.g. "Established location". */
  statusLabel: string;
  /** Only when verified. */
  address?: string;
  instagram?: { handle: string; url: string };
  /** Photo under /public. */
  image?: string;
  primary?: boolean;
}

export interface SeoConfig {
  /** Absolute or root-relative Open Graph image. */
  ogImage?: string;
  keywords?: string[];
  /** Keep pitch builds out of search indexes. */
  noindex?: boolean;
}

export interface PageCopy {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export interface VenueConfig {
  /** URL-safe id; must match `venues.slug` in Supabase for production mode. */
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  city: string;
  description: string;
  /** e.g. "Since 1991" */
  established?: string;
  address: string;
  phone: string;
  /** Empty array plus `hoursNote` renders a placeholder instead of a table. */
  hours: { days: string; open: string; close: string }[];
  hoursNote?: string;
  socialLinks: { label: string; href: string }[];
  /** Embedded map / directions link for the visit block. */
  directionsUrl?: string;
  colors: ThemeColors;
  theme: {
    style: ThemeStyle;
    fonts: FontPreset;
    /** Wordmark shown in the navbar/footer; `logoUrl` replaces it if set. */
    wordmark: string;
    logoUrl?: string;
    /** Base hue for hero art and generic placeholders. */
    heroHue: number;
  };
  labels: {
    /** Plural name for the roster ("The Girls", "Entertainers"…). */
    performers: string;
    /** Short form for the mobile tab bar. */
    performersShort: string;
    /** Nav label for /bookings (private events). Defaults to "Bookings". */
    bookings?: string;
  };
  nav: {
    mobile: MobileNavKey[];
    /** "overlay" = transparent over the hero with a full-screen menu. Default "bar". */
    style?: "bar" | "overlay";
  };
  home: {
    /** "cinematic" swaps in the full-screen cinematic home page. Default "standard". */
    layout?: "standard" | "cinematic" | "pinkhouse";
    eyebrow: string;
    /** Big hero line. Defaults to the venue name. */
    headline?: string;
    /** Rotating ticker; computed from live data when omitted. */
    ticker?: string[];
    /** Show the Digital Stage preview block on the home page. */
    livePreview: boolean;
    /** Show the location / hours block at the bottom of the home page. */
    visitBlock?: boolean;
    /** Hero primary button. Defaults to the performer roster. */
    primaryCta?: { label: string; href: string };
    /** Supporting line under the hero headline. Defaults to `description`. */
    heroBody?: string;
    reserveBanner: { eyebrow: string; title: string; body: string };
    modules: { href: string; title: string; blurb: string; hue: number; feature?: keyof VenueFeatures }[];
  };
  /** Optional per-page header copy overrides. */
  pages?: Partial<Record<"kitchen" | "shop" | "events", PageCopy>>;
  features: VenueFeatures;
  /** Instagram account, used by the feed preview and social CTAs. */
  instagram?: { handle: string; url: string };
  /** VIP booking contact as the club publishes it (e.g. on flyers). */
  vip?: { phone?: string; promoter?: string; promoterUrl?: string; note?: string };
  /** Signature offerings, e.g. the club's Instagram story highlights. */
  highlights?: { title: string; blurb: string; hue: number; href?: string }[];
  /** Brand locations (multi-city clubs). */
  locations?: ClubLocation[];
  seo?: SeoConfig;
  digitalStage: DigitalStageConfig;
  eventsBooking: {
    description: string;
  };
  demo: DemoSettings;
}

export interface ClubContent {
  entertainers: Entertainer[];
  events: ClubEvent[];
  weeklySpecials: WeeklySpecial[];
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  products: Product[];
  jobRoles: JobRole[];
  tableOptions: TableOption[];
  reservationPackages: ReservationPackage[];
  arrivalTimes: string[];
  liveRooms: LiveRoom[];
  /** Entertainer "signed in" to the /dancer demo dashboard. */
  mockDancerId: string;
  conversations: Conversation[];
  seedMessages: Message[];
  messaging: {
    messageCost: number;
    tipAmounts: number[];
    startingCredits: number;
    creditPackages: CreditPackage[];
  };
}

export interface ClubDefinition {
  venue: VenueConfig;
  content: ClubContent;
}
