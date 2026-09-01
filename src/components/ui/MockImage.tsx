import type { ReactNode } from "react";

interface MockImageProps {
  /** Hue 0–360 that tints this placeholder so each subject feels distinct. */
  hue: number;
  /** Text used for the ghosted monogram (first character is shown). */
  label?: string;
  className?: string;
  children?: ReactNode;
  /** Dim the artwork further, for use under text overlays. */
  dim?: boolean;
}

/**
 * Local, deterministic placeholder art — a lit-stage gradient in the venue
 * palette plus a ghosted monogram. No external image URLs, so nothing can
 * break offline. Swap for real photography per venue later.
 */
export default function MockImage({
  hue,
  label,
  className = "",
  children,
  dim = false,
}: MockImageProps) {
  const initial = label?.trim().charAt(0).toUpperCase();
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        background: [
          `radial-gradient(120% 90% at 50% -10%, hsl(${hue} 55% 38% / 0.55), transparent 60%)`,
          `radial-gradient(80% 60% at 80% 100%, hsl(${(hue + 40) % 360} 60% 25% / 0.35), transparent 65%)`,
          `radial-gradient(60% 50% at 15% 85%, hsl(${(hue + 320) % 360} 50% 20% / 0.3), transparent 60%)`,
          `linear-gradient(180deg, #16110d 0%, #0a0808 100%)`,
        ].join(","),
      }}
    >
      {/* spotlight beam */}
      <div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 195deg at 50% -20%, transparent 40%, hsl(${hue} 70% 70% / 0.14) 50%, transparent 60%)`,
        }}
      />
      {initial ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display italic leading-none"
            style={{
              fontSize: "min(38cqw, 9rem)",
              color: `hsl(${hue} 45% 72% / 0.16)`,
            }}
          >
            {initial}
          </span>
        </div>
      ) : null}
      {dim ? <div className="absolute inset-0 bg-black/40" /> : null}
      {/* bottom vignette so overlaid text stays readable */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      {children}
    </div>
  );
}
