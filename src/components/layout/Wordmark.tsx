import { venue } from "@/config/venue";
import Monogram from "./Monogram";

/**
 * The club's logo. Uses `theme.logoUrl` when a club supplies a logo file;
 * otherwise renders the text wordmark in the style the club's theme calls for
 * (gold serif for "classic", glowing script for "neon").
 */
export default function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const { logoUrl, wordmark, style } = venue.theme;
  const sizes = {
    md: style === "neon" ? "text-[1.9rem]" : "text-2xl",
    lg: style === "neon" ? "text-5xl" : "text-4xl",
    xl: style === "neon" ? "text-7xl sm:text-9xl" : "text-6xl sm:text-8xl",
  };

  if (logoUrl) {
    const h = { md: "h-8", lg: "h-14", xl: "h-24 sm:h-36" }[size];
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={venue.name} className={`${h} w-auto ${className}`} />;
  }

  if (style === "cinematic") {
    const cine = {
      md: { text: "text-[0.95rem]", mark: "h-6 w-6" },
      lg: { text: "text-2xl", mark: "h-10 w-10" },
      xl: { text: "text-3xl sm:text-6xl", mark: "h-14 w-14 sm:h-24 sm:w-24" },
    }[size];
    return (
      <span className={`inline-flex items-center gap-2.5 whitespace-nowrap leading-none text-bone ${className}`}>
        <Monogram className={`${cine.mark} flex-shrink-0`} />
        <span className={`font-wide font-bold uppercase tracking-[0.32em] ${cine.text}`}>{wordmark}</span>
      </span>
    );
  }

  if (style === "neon") {
    return (
      <span className={`neon-wordmark font-script whitespace-nowrap leading-none ${sizes[size]} ${className}`}>
        {wordmark}
      </span>
    );
  }
  return (
    <span className={`gold-text font-display tracking-wide ${sizes[size]} ${className}`}>{wordmark}</span>
  );
}
