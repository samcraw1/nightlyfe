"use client";

import { venue } from "@/config/venue";
import { reservationPackages, tableOptions } from "@/data/reserve";
import { formatMoney } from "@/lib/format";
import Button from "@/components/ui/Button";
import DemoBadge from "@/components/ui/DemoBadge";
import { applyPackages, applyTables, useClubOverrides } from "@/lib/club-overrides";

/** VIP sections + packages with sample pricing, and the club's real VIP line. */
export default function VipShowcase() {
  const { overrides } = useClubOverrides();
  const tables = applyTables(tableOptions, overrides);
  const packages = applyPackages(reservationPackages, overrides).filter((p) => p.price > 0);

  return (
    <section className="glass-strong relative overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 80% at 100% 0%, color-mix(in srgb, var(--accent-2) 14%, transparent), transparent 65%), radial-gradient(50% 70% at 0% 100%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 65%)",
        }}
      />
      <div className="relative grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div>
          <p className="eyebrow mb-3">{venue.home.reserveBanner.eyebrow}</p>
          <h2 className="chrome-text font-display text-4xl font-semibold leading-none sm:text-6xl">
            {venue.home.reserveBanner.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/70">{venue.home.reserveBanner.body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/reserve" size="lg">
              Reserve a Section
            </Button>
            <Button href="/bookings" variant="outline" size="lg">
              Plan a Celebration
            </Button>
          </div>
          {venue.vip?.phone ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">How VIP works today</p>
              <p className="mt-2 text-sm text-bone/80">
                Call{" "}
                <a href={`tel:${venue.vip.phone.replace(/[^\d+]/g, "")}`} className="font-semibold text-gold hover:text-gold-bright">
                  {venue.vip.phone}
                </a>
                {venue.vip.promoter ? (
                  <>
                    {" "}
                    ·{" "}
                    <a href={venue.vip.promoterUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-bright">
                      {venue.vip.promoter}
                    </a>
                  </>
                ) : null}
              </p>
              <p className="mt-1 text-[11px] text-muted">
                {venue.vip.note} The flow above shows how guests could book 24/7 instead.
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Sections</p>
              <DemoBadge kind="sample" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {tables.map((t, i) => (
                <div
                  key={t.id}
                  className={`cine-card rounded-2xl border p-4 ${i === 1 ? "border-gold/50 bg-gold/[0.06]" : "border-white/10 bg-white/[0.02]"}`}
                >
                  {i === 1 ? (
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-gold">Most booked</p>
                  ) : null}
                  <p className="font-display text-lg font-semibold text-bone">{t.name}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-bone/60">{t.description}</p>
                  <p className="mt-3 text-xs text-muted">
                    Min. <span className="font-semibold text-gold">{formatMoney(t.minimumSpend)}</span> · {t.seats} guests
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Packages</p>
            <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
              {packages.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-wide text-xs font-bold uppercase tracking-[0.2em] text-bone">{p.name}</p>
                    <p className="mt-1 text-[11px] text-bone/60">{p.description}</p>
                  </div>
                  <span className="font-display text-xl font-semibold text-gold">{formatMoney(p.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
