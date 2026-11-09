"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BarChart3, CalendarDays, ExternalLink, Images, Inbox, RotateCcw, type LucideIcon } from "lucide-react";
import { venue } from "@/config/venue";
import { mergeBookings, useVenueDashboard } from "@/lib/venue-dashboard-store";
import BookingsPanel from "./BookingsPanel";
import EventsPanel from "./EventsPanel";
import GalleryPanel from "./GalleryPanel";
import AnalyticsPanel from "./AnalyticsPanel";

const TABS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "bookings", label: "Bookings", Icon: Inbox },
  { id: "events", label: "Events & Promotions", Icon: CalendarDays },
  { id: "gallery", label: "Gallery", Icon: Images },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
];

/**
 * Single-venue management dashboard (frontend demo). Edits are stored in
 * this browser and reflected on the public home page. No backend, accounts,
 * or real customer data.
 */
export default function VenueAdminDemo() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { state, reset } = useVenueDashboard();
  const tab = TABS.some((t) => t.id === params.get("tab")) ? (params.get("tab") as string) : "bookings";
  const newCount = mergeBookings(state).filter((b) => b.status === "new").length;
  const go = (id: string) => router.replace(`${pathname}?tab=${id}`, { scroll: false });

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-xs text-bone/75">
        <p>
          <span className="font-semibold text-gold">Demonstration dashboard.</span> All people, inquiries and numbers are fictional or were entered in this browser. Changes save locally and appear on the public site right away. No accounts, no backend.
        </p>
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 font-semibold text-bone hover:border-gold hover:text-gold">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset demo
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div className="mb-4 hidden lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">{venue.name}</p>
            <p className="mt-1 text-lg font-semibold text-bone">Management</p>
            <p className="text-xs text-bone/45">{venue.city} · Manager view</p>
          </div>
          <nav aria-label="Dashboard sections" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`flex flex-shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${tab === id ? "bg-white/[0.08] text-bone" : "text-bone/55 hover:bg-white/[0.04] hover:text-bone"}`}
              >
                <Icon className={`h-4 w-4 ${tab === id ? "text-gold" : ""}`} aria-hidden />
                {label}
                {id === "bookings" && newCount ? <span className="ml-auto rounded-full bg-gold px-1.5 text-[10px] font-bold text-ink">{newCount}</span> : null}
              </button>
            ))}
          </nav>
          <Link href="/" target="_blank" className="mt-4 hidden items-center gap-1.5 px-3 text-xs text-bone/45 hover:text-gold lg:flex">
            View public site <ExternalLink className="h-3 w-3" aria-hidden />
          </Link>
        </aside>

        <div className="min-w-0">
          <h1 className="mb-5 text-2xl font-semibold tracking-tight text-bone">{TABS.find((t) => t.id === tab)?.label}</h1>
          {tab === "bookings" ? <BookingsPanel /> : null}
          {tab === "events" ? <EventsPanel /> : null}
          {tab === "gallery" ? <GalleryPanel /> : null}
          {tab === "analytics" ? <AnalyticsPanel /> : null}
        </div>
      </div>
    </div>
  );
}
