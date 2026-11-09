import type { CSSProperties } from "react";
import { BadgeCheck, CircleHelp, Info } from "lucide-react";
import type { ClubLocation } from "@/clubs/types";

/** Inline style that sets a club's accent color for `.lx-*` utilities. */
export function accentStyle(l?: Pick<ClubLocation, "accent">): CSSProperties {
  return { ["--loc-accent" as string]: l?.accent ?? "var(--gold)" } as CSSProperties;
}

const VERIFY = {
  official: { label: "Verified · club website", Icon: BadgeCheck, cls: "border-emerald-400/30 text-emerald-300/90 bg-emerald-400/5" },
  listing: { label: "Confirm with management", Icon: Info, cls: "border-gold/35 text-gold bg-gold/5" },
  unconfirmed: { label: "Details to be confirmed", Icon: CircleHelp, cls: "border-white/15 text-bone/60 bg-white/5" },
} as const;

/** Shows where a club's details come from (see content/locations.ts). */
export function VerificationBadge({ level, className = "" }: { level?: ClubLocation["verification"]; className?: string }) {
  if (!level) return null;
  const v = VERIFY[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur ${v.cls} ${className}`}
    >
      <v.Icon className="h-3 w-3" aria-hidden />
      {v.label}
    </span>
  );
}

/** "Demo" style badge for fictional content. */
export function DemoTag({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-bone/80 backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}
