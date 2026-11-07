"use client";

import Link from "next/link";
import { venue } from "@/config/venue";
import { weeklySpecials } from "@/data/events";
import MockImage from "@/components/ui/MockImage";
import DemoBadge from "@/components/ui/DemoBadge";
import { applySpecials, useClubOverrides } from "@/lib/club-overrides";
import { atlantaParts, SHORT_DAYS, useNow, weekdayOf } from "./time";

/** The club's named nights as a Monday→Sunday rail, with tonight lit up. */
export default function NightRail() {
  const { overrides } = useClubOverrides();
  const now = useNow();
  const today = now ? atlantaParts(now).weekday : -1;
  const specials = applySpecials(weeklySpecials, overrides).filter((s) => !s.hidden);
  if (!specials.length) return null;
  const ordered = [...specials].sort((a, b) => ((weekdayOf(a) + 6) % 7) - ((weekdayOf(b) + 6) % 7));

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Every night has a name</p>
          <h2 className="font-display text-3xl font-semibold text-bone sm:text-5xl">The Week at {venue.shortName}</h2>
          <p className="mt-3 max-w-lg text-sm text-muted">
            Night names as promoted on @{venue.instagram?.handle ?? venue.slug}. Schedules shown are samples to confirm with the club.
          </p>
        </div>
        <Link href="/events" className="text-xs font-semibold uppercase tracking-[0.2em] text-gold hover:text-gold-bright">
          All events →
        </Link>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-6 lg:overflow-visible">
        {ordered.map((s) => {
          const wd = weekdayOf(s);
          const isToday = wd === today;
          return (
            <Link
              key={s.id}
              href="/events"
              className={`cine-card glass relative flex w-56 flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl lg:w-auto ${
                isToday ? "border-gold/60" : ""
              }`}
            >
              <div className="relative overflow-hidden">
                <MockImage hue={s.hue} label={s.title} className="cine-zoom aspect-[4/5] w-full" />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="font-wide rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-bone backdrop-blur">
                    {wd >= 0 ? SHORT_DAYS[wd] : s.when}
                  </span>
                  {isToday ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ink">
                      Tonight
                    </span>
                  ) : null}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-xl font-semibold leading-tight text-bone">{s.title}</h3>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-[11px] leading-relaxed text-bone/65">{s.description}</p>
                <DemoBadge kind="sample" className="mt-auto w-fit" />
              </div>
              {isToday ? <span className="cine-progress absolute inset-x-0 bottom-0 h-0.5" /> : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
