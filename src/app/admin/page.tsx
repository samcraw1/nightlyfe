"use client";

import Link from "next/link";
import { useState } from "react";
import { venue } from "@/config/venue";
import { entertainers } from "@/data/entertainers";
import { events, formatEventDate, weeklySpecials } from "@/data/events";
import { reservationPackages, tableOptions } from "@/data/reserve";
import { jobRoles } from "@/data/jobs";
import { formatMoney } from "@/lib/format";
import { useApp } from "@/lib/store";
import {
  applyEvents,
  applyJobs,
  applyLineup,
  applyPackages,
  applySpecials,
  applyTables,
  useClubOverrides,
  type ClubOverrides,
} from "@/lib/club-overrides";
import Button from "@/components/ui/Button";
import MockImage from "@/components/ui/MockImage";

type Tab = "overview" | "homepage" | "nights" | "lineup" | "events" | "vip" | "hiring";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "homepage", label: "Homepage" },
  { id: "nights", label: "Weekly Nights" },
  { id: "lineup", label: "Lineup" },
  { id: "events", label: "Events" },
  { id: "vip", label: "VIP Pricing" },
  { id: "hiring", label: "Hiring" },
];

const input =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone/30 focus:border-gold/60 focus:outline-none";

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full border transition ${on ? "border-gold bg-gold/80" : "border-white/15 bg-white/5"}`}
    >
      <span className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-bone transition-all ${on ? "left-[1.4rem]" : "left-0.5"}`} />
    </button>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-semibold text-bone">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * Demo admin dashboard: shows management how they'd update their own site.
 * Edits are stored in this browser only (see lib/club-overrides.ts) and show
 * up immediately on the public pages.
 */
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { overrides, update, reset } = useClubOverrides();
  const { reservations, bookingRequests, hydrated } = useApp();
  const [saved, setSaved] = useState(false);

  const set = (fn: (o: ClubOverrides) => ClubOverrides) => {
    update(fn);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  };

  const specials = applySpecials(weeklySpecials, overrides);
  const lineup = applyLineup(entertainers, overrides);
  const eventList = applyEvents(events, overrides);
  const tables = applyTables(tableOptions, overrides);
  const packages = applyPackages(reservationPackages, overrides);
  const roles = applyJobs(jobRoles, overrides);
  const editCount = Object.values(overrides).filter((v) => v !== undefined && v !== "").length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-dashed border-gold/40 bg-gold/[0.06] p-4 text-sm text-bone/80 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-gold">Demo admin.</span> Changes are saved only in this browser and appear on the
          public pages right away. No accounts, no real data.
        </p>
        <button onClick={reset} className="text-xs font-semibold uppercase tracking-[0.18em] text-bone/60 hover:text-gold">
          Reset demo edits
        </button>
      </div>

      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">{venue.name} · Management</p>
          <h1 className="font-display text-4xl font-semibold text-bone sm:text-5xl">Content Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition ${saved ? "opacity-100" : "opacity-0"}`}
            aria-live="polite"
          >
            Saved · live on site
          </span>
          <Button href="/" variant="outline" size="sm">
            View site ↗
          </Button>
        </div>
      </header>

      <div role="tablist" aria-label="Admin sections" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              tab === t.id ? "bg-gold text-ink" : "border border-white/10 text-bone/70 hover:border-gold/40 hover:text-bone"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {tab === "overview" ? (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Demo VIP bookings", hydrated ? reservations.length : "—", "Made in this browser"],
                ["Celebration requests", hydrated ? bookingRequests.length : "—", "Made in this browser"],
                ["On tonight", lineup.filter((e) => e.workingTonight).length, "Entertainers"],
                ["Content edits", editCount, "Live on the site"],
              ].map(([label, value, sub]) => (
                <div key={label as string} className="glass rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-bone">{value}</p>
                  <p className="text-[11px] text-muted">{sub}</p>
                </div>
              ))}
            </div>
            <Card
              title="VIP booking inbox"
              action={
                <Link href="/reserve" className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  Make a test booking →
                </Link>
              }
            >
              {hydrated && reservations.length ? (
                <ul className="divide-y divide-white/10">
                  {[...reservations].reverse().map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                      <span className="text-bone">
                        {r.name} · {r.partySize} guests
                      </span>
                      <span className="text-muted">
                        {formatEventDate(r.date)} · {r.arrivalTime} · {r.tableName}
                        {r.packageName ? ` + ${r.packageName}` : ""}
                      </span>
                      <span className="font-semibold text-gold">{formatMoney(r.total)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">
                  No demo bookings yet. Book a section on the site and it lands here, the way real reservations would reach the
                  club&apos;s VIP host.
                </p>
              )}
            </Card>
            <div className="grid gap-5 md:grid-cols-2">
              <Card title="Digital Stage">
                <p className="text-sm text-muted">Choose who&apos;s on stage and who&apos;s next, go live, and end the stream.</p>
                <div className="mt-4">
                  <Button href="/dashboard/digital-stage" size="sm">
                    Open stage dashboard
                  </Button>
                </div>
              </Card>
              <Card title="What management controls">
                <ul className="space-y-1.5 text-sm text-bone/75">
                  <li>· Homepage headline and announcements</li>
                  <li>· Weekly nights and featured events</li>
                  <li>· Tonight&apos;s lineup and featured entertainers</li>
                  <li>· VIP section minimums and package prices</li>
                  <li>· Open roles on the hiring page</li>
                </ul>
              </Card>
            </div>
          </>
        ) : null}

        {tab === "homepage" ? (
          <Card title="Homepage hero">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Headline</span>
                <input
                  className={input}
                  value={overrides.heroHeadline ?? ""}
                  placeholder={venue.home.headline}
                  onChange={(e) => set((o) => ({ ...o, heroHeadline: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Intro</span>
                <textarea
                  rows={3}
                  className={input}
                  value={overrides.heroBody ?? ""}
                  placeholder={venue.home.heroBody}
                  onChange={(e) => set((o) => ({ ...o, heroBody: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Announcement bar (optional)
                </span>
                <input
                  className={input}
                  value={overrides.announcement ?? ""}
                  placeholder="e.g. Tonight: hosted night — sections almost gone"
                  onChange={(e) => set((o) => ({ ...o, announcement: e.target.value }))}
                />
              </label>
              <p className="text-xs text-muted">Leave a field empty to use the default. Open the home page in another tab to watch it update.</p>
            </div>
          </Card>
        ) : null}

        {tab === "nights" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {specials.map((s) => (
              <Card
                key={s.id}
                title={s.when}
                action={
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                    Visible
                    <Toggle
                      label={`Show ${s.title}`}
                      on={!s.hidden}
                      onChange={(v) =>
                        set((o) => ({ ...o, specials: { ...o.specials, [s.id]: { ...o.specials?.[s.id], hidden: !v } } }))
                      }
                    />
                  </span>
                }
              >
                <div className="space-y-3">
                  <input
                    className={input}
                    value={s.title}
                    aria-label={`${s.when} title`}
                    onChange={(e) =>
                      set((o) => ({ ...o, specials: { ...o.specials, [s.id]: { ...o.specials?.[s.id], title: e.target.value } } }))
                    }
                  />
                  <textarea
                    rows={2}
                    className={input}
                    value={s.description}
                    aria-label={`${s.when} description`}
                    onChange={(e) =>
                      set((o) => ({
                        ...o,
                        specials: { ...o.specials, [s.id]: { ...o.specials?.[s.id], description: e.target.value } },
                      }))
                    }
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        {tab === "lineup" ? (
          <Card title="Tonight's lineup">
            <ul className="divide-y divide-white/10">
              {lineup.map((e) => (
                <li key={e.id} className="flex items-center gap-4 py-3">
                  <MockImage hue={e.hue} label={e.name} className="h-12 w-12 flex-shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-bone">{e.name}</p>
                    <p className="truncate text-xs text-muted">{e.tagline}</p>
                  </div>
                  <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-muted sm:inline">Tonight</span>
                  <Toggle
                    label={`${e.name} working tonight`}
                    on={Boolean(e.workingTonight)}
                    onChange={(v) =>
                      set((o) => ({ ...o, lineup: { ...o.lineup, [e.id]: { ...o.lineup?.[e.id], workingTonight: v } } }))
                    }
                  />
                  <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-muted sm:inline">Featured</span>
                  <Toggle
                    label={`${e.name} featured`}
                    on={e.featured}
                    onChange={(v) =>
                      set((o) => ({ ...o, lineup: { ...o.lineup, [e.id]: { ...o.lineup?.[e.id], featured: v } } }))
                    }
                  />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">All profiles are fictional demo entertainers.</p>
          </Card>
        ) : null}

        {tab === "events" ? (
          <Card title="Events">
            <ul className="divide-y divide-white/10">
              {eventList.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-bone">{e.title}</p>
                    <p className="text-xs text-muted">
                      {formatEventDate(e.date)} · VIP from {formatMoney(e.vipFromPrice)} · sample
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Featured</span>
                  <Toggle
                    label={`Feature ${e.title}`}
                    on={e.featured}
                    onChange={(v) =>
                      set((o) => ({ ...o, events: { ...o.events, [e.id]: { ...o.events?.[e.id], featured: v } } }))
                    }
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Published</span>
                  <Toggle
                    label={`Publish ${e.title}`}
                    on={!e.hidden}
                    onChange={(v) =>
                      set((o) => ({ ...o, events: { ...o.events, [e.id]: { ...o.events?.[e.id], hidden: !v } } }))
                    }
                  />
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {tab === "vip" ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Card title="Section minimums">
              <div className="space-y-3">
                {tables.map((t) => (
                  <label key={t.id} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-bone">{t.name}</span>
                    <span className="flex items-center gap-1 text-sm text-muted">
                      $
                      <input
                        type="number"
                        min={0}
                        step={50}
                        className={`${input} w-28 text-right`}
                        value={t.minimumSpend}
                        onChange={(e) =>
                          set((o) => ({ ...o, tablePrices: { ...o.tablePrices, [t.id]: Math.max(0, Number(e.target.value) || 0) } }))
                        }
                      />
                    </span>
                  </label>
                ))}
              </div>
            </Card>
            <Card title="Packages">
              <div className="space-y-3">
                {packages
                  .filter((p) => p.id !== "none")
                  .map((p) => (
                    <label key={p.id} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-bone">{p.name}</span>
                      <span className="flex items-center gap-1 text-sm text-muted">
                        $
                        <input
                          type="number"
                          min={0}
                          step={25}
                          className={`${input} w-28 text-right`}
                          value={p.price}
                          onChange={(e) =>
                            set((o) => ({
                              ...o,
                              packagePrices: { ...o.packagePrices, [p.id]: Math.max(0, Number(e.target.value) || 0) },
                            }))
                          }
                        />
                      </span>
                    </label>
                  ))}
              </div>
            </Card>
            <p className="text-xs text-muted md:col-span-2">
              Sample pricing. New prices show on the home page VIP block and in the reservation flow.
            </p>
          </div>
        ) : null}

        {tab === "hiring" ? (
          <Card title="Open roles">
            <ul className="divide-y divide-white/10">
              {roles.map((r) => (
                <li key={r.id} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-bone">{r.title}</p>
                    <p className="text-xs text-muted">{r.blurb}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Hiring</span>
                  <Toggle
                    label={`Hiring for ${r.title}`}
                    on={!r.closed}
                    onChange={(v) => set((o) => ({ ...o, jobs: { ...o.jobs, [r.id]: { closed: !v } } }))}
                  />
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
