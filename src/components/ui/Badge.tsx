import type { ReactNode } from "react";

type Variant = "live" | "gold" | "muted" | "tonight";

const variants: Record<Variant, string> = {
  live: "bg-blood text-white",
  gold: "bg-gold/15 text-gold border border-gold/30",
  muted: "bg-white/5 text-muted border border-white/10",
  tonight: "bg-gold text-ink",
};

export default function Badge({
  variant = "gold",
  children,
  className = "",
  pulse = false,
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${variants[variant]} ${className}`}
    >
      {pulse ? (
        <span className="pulse-live inline-block h-1.5 w-1.5 rounded-full bg-current" />
      ) : null}
      {children}
    </span>
  );
}
