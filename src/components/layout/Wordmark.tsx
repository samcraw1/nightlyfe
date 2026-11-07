import { venue } from "@/config/venue";

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
