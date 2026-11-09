"use client";

import { useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import type { BookingCategory, PlayhouseBooking } from "@/clubs/types";
import { mergeBookings, useVenueDashboard } from "@/lib/venue-dashboard-store";
import { Panel, inputCls } from "../ui";
import { CATEGORY_LABEL, STATUSES, TONE } from "./labels";

const fmtDate = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
};

/** Booking inbox: filter by category and status, update status, expand for details. */
export default function BookingsPanel() {
  const { state, update } = useVenueDashboard();
  const [category, setCategory] = useState<"all" | BookingCategory>("all");
  const [status, setStatus] = useState<"all" | PlayhouseBooking["status"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const all = mergeBookings(state);
  const list = all.filter((b) => (category === "all" || b.category === category) && (status === "all" || b.status === status));
  const counts = STATUSES.map((s) => [s, all.filter((b) => b.status === s).length] as const);

  const setStatusFor = (id: string, s: PlayhouseBooking["status"]) => update((st) => ({ ...st, bookingStatus: { ...st.bookingStatus, [id]: s } }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map(([s, n]) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(status === s ? "all" : s)}
            aria-pressed={status === s}
            className={`rounded-2xl border p-4 text-left transition ${status === s ? "border-gold/60 bg-gold/[0.06]" : "border-white/10 bg-ink-2/80 hover:border-white/25"}`}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-bone/50 capitalize">{s}</p>
            <p className="mt-1 text-2xl font-semibold text-bone">{n}</p>
          </button>
        ))}
      </div>

      <Panel
        title={`Booking inquiries (${list.length})`}
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <select aria-label="Filter by category" className={`${inputCls} w-auto py-1.5 text-xs`} value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              <option value="all">All categories</option>
              {(Object.keys(CATEGORY_LABEL) as BookingCategory[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
            <select aria-label="Filter by status" className={`${inputCls} w-auto py-1.5 text-xs capitalize`} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
              <option value="all">Any status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <ul className="-mx-5 -my-5 divide-y divide-white/5">
          {list.map((b) => {
            const expanded = open === b.id;
            return (
              <li key={b.id}>
                <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <button type="button" onClick={() => setOpen(expanded ? null : b.id)} aria-expanded={expanded} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <ChevronDown className={`h-4 w-4 flex-shrink-0 text-bone/40 transition ${expanded ? "rotate-180" : ""}`} aria-hidden />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-bone">{b.name}</span>
                        {b.fromSite ? <span className="rounded-full bg-accent-2/30 px-2 py-0.5 text-[10px] font-semibold text-bone">From site</span> : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-bone/50">
                        {CATEGORY_LABEL[b.category]} · {fmtDate(b.date)} · {b.guests} guests
                      </span>
                    </span>
                  </button>
                  <span className="hidden text-xs text-bone/40 sm:block">{fmtAgo(b.receivedAt)}</span>
                  <select
                    aria-label={`Status for ${b.name}`}
                    value={b.status}
                    onChange={(e) => setStatusFor(b.id, e.target.value as PlayhouseBooking["status"])}
                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-gold/50 ${TONE[b.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-ink-2 text-bone">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {expanded ? (
                  <div className="grid gap-4 border-t border-white/5 bg-black/20 px-5 py-4 text-sm sm:grid-cols-[1fr_16rem]">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-bone/40">Details</p>
                      <p className="mt-1 text-bone/80">{b.details}</p>
                      {b.requests ? (
                        <>
                          <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-bone/40">Special requests</p>
                          <p className="mt-1 text-bone/80">{b.requests}</p>
                        </>
                      ) : null}
                    </div>
                    <div className="space-y-2 text-xs text-bone/70">
                      <p className="font-mono text-bone/40">{b.id}</p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gold" aria-hidden />
                        {b.phone}
                      </p>
                      <p className="flex items-center gap-2 break-all">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0 text-gold" aria-hidden />
                        {b.email}
                      </p>
                      <p className="pt-1 text-[10px] text-bone/35">Demo: contact actions are disabled.</p>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
          {list.length === 0 ? <li className="px-5 py-10 text-center text-sm text-bone/45">No inquiries match these filters.</li> : null}
        </ul>
      </Panel>
    </div>
  );
}
