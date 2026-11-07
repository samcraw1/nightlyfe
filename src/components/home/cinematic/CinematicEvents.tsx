"use client";

import Link from "next/link";
import { events, formatEventDate } from "@/data/events";
import MockImage from "@/components/ui/MockImage";
import DemoBadge from "@/components/ui/DemoBadge";
import Badge from "@/components/ui/Badge";
import { formatMoney } from "@/lib/format";
import { applyEvents, useClubOverrides } from "@/lib/club-overrides";

/** Featured event as a wide cinematic card, then a compact upcoming list. */
export default function CinematicEvents() {
  const { overrides } = useClubOverrides();
  const list = applyEvents(events, overrides).filter((e) => !e.hidden);
  const featured = list.find((e) => e.featured) ?? list[0];
  if (!featured) return null;
  const rest = list.filter((e) => e.id !== featured.id).slice(0, 4);

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Coming up</p>
          <h2 className="font-display text-3xl font-semibold text-bone sm:text-5xl">Events &amp; Hosted Nights</h2>
        </div>
        <Link href="/events" className="text-xs font-semibold uppercase tracking-[0.2em] text-gold hover:text-gold-bright">
          Full calendar →
        </Link>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Link href={`/events/${featured.id}`} className="cine-card glass group relative block overflow-hidden rounded-[2rem]">
          <MockImage hue={featured.hue} label={featured.title} className="cine-zoom aspect-[16/10] w-full lg:aspect-auto lg:h-full lg:min-h-[26rem]" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="tonight">{formatEventDate(featured.date)}</Badge>
              <DemoBadge kind="sample" />
            </div>
            <h3 className="mt-4 font-display text-3xl font-semibold text-bone sm:text-5xl">{featured.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/70">{featured.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-bone/70">
              VIP from <span className="font-bold text-gold">{formatMoney(featured.vipFromPrice)}</span>
              <span className="ml-4 text-gold transition group-hover:text-gold-bright">Details →</span>
            </p>
          </div>
        </Link>
        <ul className="flex min-w-0 flex-col gap-3">
          {rest.map((e) => (
            <li key={e.id}>
              <Link
                href={`/events/${e.id}`}
                className="cine-card glass group flex items-center gap-4 overflow-hidden rounded-2xl p-3"
              >
                <MockImage hue={e.hue} label={e.title} className="aspect-square w-20 flex-shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="font-wide text-[9px] font-bold uppercase tracking-[0.25em] text-gold">{formatEventDate(e.date)}</p>
                  <p className="mt-1 truncate font-display text-lg font-semibold text-bone">{e.title}</p>
                  <p className="text-[11px] text-muted">VIP from {formatMoney(e.vipFromPrice)} · sample</p>
                </div>
                <span className="pr-2 text-gold transition group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
