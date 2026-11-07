"use client";

import Link from "next/link";
import { venue } from "@/config/venue";
import { weeklySpecials } from "@/data/events";
import MockImage from "@/components/ui/MockImage";
import Button from "@/components/ui/Button";
import Monogram from "@/components/layout/Monogram";
import { useClubOverrides, applySpecials } from "@/lib/club-overrides";
import { atlantaParts, phaseOf, useNow, weekdayOf } from "./time";

/**
 * Full-viewport cinematic hero: three slow camera-move plates crossfading
 * under a light sweep, film grain, the drawn monogram, a tracked-out
 * wordmark, and a live "Atlanta right now" strip that names tonight's
 * themed night.
 */
export default function CinematicHero() {
  const { overrides } = useClubOverrides();
  const now = useNow();
  const atl = now ? atlantaParts(now) : null;
  const specials = applySpecials(weeklySpecials, overrides).filter((s) => !s.hidden);
  const tonight = atl ? specials.find((s) => weekdayOf(s) === atl.weekday) : undefined;
  const headline = overrides.heroHeadline || venue.home.headline || venue.name;
  const body = overrides.heroBody || venue.home.heroBody || venue.description;
  const primary = venue.home.primaryCta ?? { label: "Reserve VIP", href: "/reserve" };

  return (
    <section className="cine-hero relative -mt-16 flex min-h-[100svh] flex-col justify-end pt-16">
      <div className="absolute inset-0" aria-hidden>
        {[venue.theme.heroHue, 42, 222].map((hue, i) => (
          <MockImage key={i} hue={hue} className="cine-plate h-full w-full" />
        ))}
        <div className="cine-sweep" />
        <div className="cine-vignette" />
        <div className="cine-grain" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-12 pt-24 text-center sm:px-8 sm:pb-16">
        <Monogram draw className="h-16 w-16 text-bone sm:h-24 sm:w-24" title={`${venue.name} monogram`} />
        <p className="cine-wordmark font-wide mt-6 pl-[0.32em] text-3xl font-bold uppercase text-bone sm:text-6xl lg:text-7xl">
          {venue.theme.wordmark}
        </p>
        <p className="fade-up fade-up-3 font-wide mt-4 pl-[0.5em] text-[10px] font-bold uppercase tracking-[0.5em] text-gold sm:text-xs">
          {venue.tagline}
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8 sm:pb-14">
        {overrides.announcement ? (
          <p className="fade-up mx-auto mb-6 w-fit max-w-full rounded-full border border-gold/40 bg-black/60 px-4 py-2 text-center text-xs text-bone backdrop-blur">
            <span className="twist-dot mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle" />
            {overrides.announcement}
          </p>
        ) : null}
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow fade-up mb-3">{venue.home.eyebrow}</p>
            <h1 className="fade-up fade-up-1 chrome-text font-display text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
              {headline}
            </h1>
            <p className="fade-up fade-up-2 mt-4 max-w-xl text-sm leading-relaxed text-bone/75 sm:text-base">{body}</p>
            <div className="fade-up fade-up-3 mt-7 flex flex-wrap gap-3">
              <Button href={primary.href} size="lg">
                {primary.label}
              </Button>
              {venue.features.liveStream ? (
                <Button href="/live" variant="outline" size="lg">
                  <span className="twist-dot pulse-live inline-block h-2 w-2 rounded-full" />
                  Watch Live
                </Button>
              ) : null}
              <Button href="/events" variant="ghost" size="lg">
                This Week →
              </Button>
            </div>
          </div>

          {/* 15-hour signature: Atlanta right now + tonight's named night */}
          <Link
            href="/events"
            className="fade-up fade-up-3 glass group block rounded-3xl p-5 backdrop-blur-xl transition hover:border-gold/40 sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">Atlanta · right now</p>
              <span className="rounded-full border border-dashed border-bone/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-bone/60">
                Demo
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-bone tabular-nums" suppressHydrationWarning>
                {atl?.label ?? "—"}
              </span>
              <span className="font-wide text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                {atl ? phaseOf(atl.hour) : ""}
              </span>
            </div>
            <div className="mt-4 h-px w-full bg-white/10">
              <div
                className="cine-progress h-px transition-all duration-1000"
                style={{ width: atl ? `${Math.round(((atl.hour + 12) % 24) / 24 * 100)}%` : "0%" }}
              />
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Tonight</p>
            <p className="mt-1 font-display text-2xl font-semibold text-bone transition group-hover:text-gold-bright">
              {tonight?.title ?? "See the weekly lineup"}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              15 hours a day, per the club. Exact hours: confirm with management.
            </p>
          </Link>
        </div>

        <div className="mt-10 flex justify-center" aria-hidden>
          <span className="cine-scroll-cue flex flex-col items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-bone/60">
            Scroll
            <span className="h-8 w-px bg-gradient-to-b from-bone/70 to-transparent" />
          </span>
        </div>
      </div>
    </section>
  );
}
