import type { Entertainer } from "@/types";
import {
  InstagramIcon,
  TikTokIcon,
  XIcon,
} from "@/components/layout/icons";

type Platform = keyof NonNullable<Entertainer["socials"]>;

/**
 * Each platform owns its display name, icon, and URL shape — the data only
 * stores a bare handle. To support another network, add an entry here and a
 * matching key on Entertainer["socials"]; nothing else changes.
 */
const platforms: Record<
  Platform,
  { label: string; Icon: typeof XIcon; url: (handle: string) => string }
> = {
  instagram: {
    label: "Instagram",
    Icon: InstagramIcon,
    url: (h) => `https://instagram.com/${h}`,
  },
  twitter: {
    label: "X",
    Icon: XIcon,
    url: (h) => `https://x.com/${h}`,
  },
  tiktok: {
    label: "TikTok",
    Icon: TikTokIcon,
    url: (h) => `https://tiktok.com/@${h}`,
  },
};

/** Fixed display order, independent of key order in the data. */
const order: Platform[] = ["instagram", "twitter", "tiktok"];

interface SocialLinksProps {
  socials: Entertainer["socials"];
  /** Used in the link labels so screen readers get "Sapphire on Instagram". */
  name: string;
  /**
   * "horizontal" (default) is a row of icon-only buttons for tight spots
   * under a headline. "vertical" is a divider list — platform on the left,
   * handle on the right — matching the Schedule card.
   */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function SocialLinks({
  socials,
  name,
  orientation = "horizontal",
  className = "",
}: SocialLinksProps) {
  if (!socials) return null;

  const links = order
    .map((platform) => ({ platform, handle: socials[platform]?.replace(/^@/, "") }))
    .filter((l): l is { platform: Platform; handle: string } => !!l.handle);

  if (links.length === 0) return null;

  if (orientation === "vertical") {
    return (
      <ul className={`space-y-2.5 text-sm ${className}`}>
        {links.map(({ platform, handle }) => {
          const { label, Icon, url } = platforms[platform];
          return (
            <li
              key={platform}
              className="border-b border-white/5 pb-2.5 last:border-0 last:pb-0"
            >
              <a
                href={url(handle)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${label} — @${handle}`}
                className="flex items-center justify-between gap-3 transition hover:opacity-80"
              >
                <span className="flex items-center gap-2.5 text-bone/80">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </span>
                <span className="truncate font-semibold text-gold">
                  @{handle}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ platform, handle }) => {
        const { label, Icon, url } = platforms[platform];
        return (
          <li key={platform}>
            <a
              href={url(handle)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on ${label} — @${handle}`}
              title={`@${handle}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-bone/70 transition hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
