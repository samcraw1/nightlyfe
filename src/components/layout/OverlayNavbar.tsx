"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { venue } from "@/config/venue";
import Wordmark from "./Wordmark";

type NavLink = { href: string; label: string; feature?: keyof typeof venue.features };

/**
 * Navigation for `nav.style: "overlay"` clubs. Transparent over the home
 * hero and solid once you scroll (or on any other page). A "Menu" button
 * opens a full-screen menu with large wide-tracked type.
 */
export default function OverlayNavbar({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu after navigating (adjust state during render, not in an effect).
  if (open && openedAt !== pathname) {
    setOpen(false);
    setOpenedAt(pathname);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || pathname !== "/" || open;
  const custom = venue.nav.links;
  const visible: NavLink[] = custom ?? links.filter((l) => !l.feature || venue.features[l.feature]);
  const cta = venue.nav.cta ?? { label: "VIP", href: "/reserve" };
  const menu = [
    { href: "/", label: "Home" },
    ...visible,
    ...(custom ? [] : [{ href: "/reserve", label: "VIP Reservations" }]),
    ...(venue.features.jobs ? [{ href: "/jobs", label: "Now Hiring" }] : []),
    ...(venue.features.adminPreview ? [{ href: "/admin", label: "Admin Preview" }] : []),
    ...(venue.features.network || venue.features.venueDashboard ? [{ href: "/admin-demo", label: "Management Demo" }] : []),
  ];

  return (
    <>
      <header
        data-overlay=""
        data-solid={solid ? "" : undefined}
        className="site-nav fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" className="flex items-center" aria-label={`${venue.name} home`}>
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {visible.map((l) => {
              const active = !l.href.includes("#") && (pathname === l.href || pathname.startsWith(l.href + "/"));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`font-wide px-3 py-2 text-[10px] font-bold uppercase tracking-[0.28em] transition ${
                    active ? "text-gold" : "text-bone/70 hover:text-bone"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={cta.href}
              className="font-wide hidden rounded-full border border-gold/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gold transition hover:bg-gold hover:text-ink sm:block"
            >
              {cta.label}
            </Link>
            <button
              onClick={() => {
                setOpenedAt(pathname);
                setOpen((o) => !o);
              }}
              aria-expanded={open}
              aria-controls="cine-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="font-wide flex items-center gap-3 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-bone transition hover:text-gold"
            >
              <span className="hidden sm:inline" aria-hidden>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-5" aria-hidden>
                <span className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px bg-current transition-all duration-500 ${open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="cine-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="cine-menu fixed inset-0 z-40 overflow-y-auto bg-ink/97 pt-28 backdrop-blur-2xl"
        >
          <div className="cine-grain" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-32 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
            <nav aria-label="Menu links">
              <ul className="space-y-1">
                {menu.map((l, i) => {
                  const active = l.href === "/" ? pathname === "/" : !l.href.includes("#") && pathname.startsWith(l.href);
                  return (
                    <li key={l.href + l.label} className="cine-menu-item" style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-baseline gap-4 py-1.5 font-display text-3xl font-semibold tracking-tight transition sm:text-5xl ${
                          active ? "text-gold" : "text-bone hover:text-gold-bright"
                        }`}
                      >
                        <span className="font-wide w-8 text-[10px] font-bold tracking-[0.2em] text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="transition group-hover:translate-x-2">{l.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="cine-menu-item space-y-6 text-sm text-bone/70" style={{ animationDelay: "0.4s" }}>
              <div>
                <p className="eyebrow mb-2">Find us</p>
                <p>{venue.address}</p>
                {venue.directionsUrl ? (
                  <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-gold">
                    Directions →
                  </a>
                ) : null}
              </div>
              {venue.vip?.phone ? (
                <div>
                  <p className="eyebrow mb-2">VIP line</p>
                  <a href={`tel:${venue.vip.phone.replace(/[^\d+]/g, "")}`} className="text-bone hover:text-gold">
                    {venue.vip.phone}
                  </a>
                </div>
              ) : null}
              <div>
                <p className="eyebrow mb-2">Follow</p>
                <ul className="space-y-1">
                  {venue.socialLinks.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{venue.demo.footerNote.split(".")[0]}.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
