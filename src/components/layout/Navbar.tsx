"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { venue } from "@/config/venue";
import { useApp } from "@/lib/store";
import { CoinIcon, UserIcon } from "./icons";

const links: { href: string; label: string; feature?: keyof typeof venue.features }[] = [
  { href: "/girls", label: "The Girls" },
  { href: "/live", label: "Live" },
  { href: "/webcams", label: "Webcams", feature: "webcams" },
  { href: "/events", label: "Events" },
  { href: "/kitchen", label: "Kitchen", feature: "kitchen" },
  { href: "/shop", label: "Shop", feature: "merch" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { credits, hydrated, setBuyCreditsOpen } = useApp();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="gold-text font-display text-2xl tracking-wide">
            {venue.name}
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted transition group-hover:text-gold sm:block">
            {venue.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links
            .filter((l) => !l.feature || venue.features[l.feature])
            .map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-gold/10 text-gold"
                      : "text-bone/70 hover:bg-white/5 hover:text-bone"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBuyCreditsOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-bold text-gold transition hover:bg-gold/10"
            title="Buy credits"
          >
            <CoinIcon className="h-4 w-4" />
            <span suppressHydrationWarning>{hydrated ? credits : "—"}</span>
          </button>
          <Link
            href="/reserve"
            className="hidden rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ink transition hover:brightness-110 sm:block"
          >
            Reserve
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className={`hidden h-9 w-9 items-center justify-center rounded-full border transition md:flex ${
              pathname.startsWith("/account")
                ? "border-gold text-gold"
                : "border-white/15 text-bone/70 hover:border-gold/50 hover:text-gold"
            }`}
          >
            <UserIcon className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
