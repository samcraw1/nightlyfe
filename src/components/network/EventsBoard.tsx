"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, CalendarDays, Clock, Crown, Repeat } from "lucide-react";
import { formatEventDate } from "@/data/events";
import { locationName, useLocations, useNetworkEvents } from "@/lib/network-store";
import type { ClubEvent } from "@/types";
import { EASE } from "@/components/ui/motion";
import { DemoTag } from "./bits";

/**
 * Events across the network, with a club filter. Reused on the home page
 * (preview), /events (full), and club pages (locked to one club).
 */
export default function EventsBoard({
  club,
  limit,
  showFilter = true,
  vipHref = "#vip",
}: {
  /** Lock to one club (club pages). */
  club?: string;
  limit?: number;
  showFilter?: boolean;
  vipHref?: string;
}) {
  const locations = useLocations();
  const all = useNetworkEvents();
  const [filter, setFilter] = useState<string>(club ?? "all");

  const visible = useMemo(() => {
    const f = club ?? filter;
    return all.filter((e) => f === "all" || !e.locationSlug || e.locationSlug === f);
  }, [all, club, filter]);

  const weekly = visible.filter((e) => e.recurring);
  const upcoming = visible.filter((e) => !e.recurring);
  const shownUpcoming = limit ? upcoming.slice(0, limit) : upcoming;

  return (
    <div>
      {showFilter && !club ? (
        <div role="group" aria-label="Filter events by club" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: "all", name: "All clubs", accent: undefined as string | undefined }, ...locations].map((l) => {
            const active = filter === l.slug;
            return (
              <button
                key={l.slug}
                type="button"
                onClick={() => setFilter(l.slug)}
                aria-pressed={active}
                className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                  active ? "border-gold bg-gold text-ink" : "border-white/12 text-bone/65 hover:border-gold/50 hover:text-bone"
                }`}
              >
                {l.accent ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.accent }} aria-hidden /> : null}
                {l.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {weekly.length ? (
        <div className={showFilter && !club ? "mt-8" : ""}>
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Repeat className="h-3.5 w-3.5" aria-hidden /> Weekly promotions
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {weekly.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="glass flex items-start gap-4 rounded-2xl p-5"
                >
                  <span className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center rounded-xl border border-gold/30 text-gold">
                    <Repeat className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{e.recurring}</p>
                    <p className="mt-0.5 font-display text-xl text-bone">{e.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-bone/55">{e.description}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.16em] text-bone/45">
                      <span>{locationName(e.locationSlug)}</span>
                      {e.source === "verified" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-300/80">
                          <BadgeCheck className="h-3 w-3" aria-hidden /> From club website
                        </span>
                      ) : (
                        <span>Demo</span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10">
        <p className="eyebrow mb-4 flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden /> Upcoming
        </p>
        {shownUpcoming.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shownUpcoming.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <EventCardLuxe event={e} vipHref={vipHref} />
                </motion.div>
              ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 p-6 text-sm text-bone/55">No upcoming events for this club yet.</p>
        )}
      </div>
    </div>
  );
}

export function EventCardLuxe({ event: e, vipHref = "#vip" }: { event: ClubEvent; vipHref?: string }) {
  const loc = useLocations().find((l) => l.slug === e.locationSlug);
  return (
    <article className="lx-card group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/10 bg-ink-2" style={{ ["--loc-accent" as string]: loc?.accent ?? "var(--gold)" }}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <div
          className="absolute inset-0 transition duration-[1.2s] group-hover:scale-105"
          style={{
            background: loc?.image ? `url(${loc.image}) center/cover` : `radial-gradient(circle at 50% 0%, hsl(${e.hue} 60% 35%), #0b0b0b 70%)`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-black/40 to-black/10" />
        <div className="absolute left-4 top-4 flex gap-2">
          {e.featured ? <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink">Featured</span> : null}
          {e.source !== "verified" ? <DemoTag>Demo event</DemoTag> : null}
        </div>
        <div className="absolute bottom-4 left-4 rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-center backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{formatEventDate(e.date).split(",")[0]}</p>
          <p className="font-display text-lg leading-none text-bone">{formatEventDate(e.date).split(", ")[1]}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--loc-accent)" }}>
          {locationName(e.locationSlug)}
        </p>
        <h3 className="mt-1 font-display text-2xl text-bone">{e.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone/55">{e.description}</p>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-bone/45">
          <Clock className="h-3.5 w-3.5" aria-hidden /> {e.doors} {e.source !== "verified" ? "· sample date" : ""}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <a href={vipHref} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold hover:text-bone">
            <Crown className="h-3.5 w-3.5" aria-hidden /> VIP Inquiry
          </a>
          {e.locationSlug ? (
            <Link href={`/clubs/${e.locationSlug}`} className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone/55 hover:text-gold">
              Club <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
