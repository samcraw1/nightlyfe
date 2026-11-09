"use client";

import { CalendarClock, CreditCard, Radio, Ticket, Bell, Users, Crown, BarChart3 } from "lucide-react";
import { content } from "@/config/venue";
import { mergeBookings, useVenueDashboard } from "@/lib/venue-dashboard-store";
import { Bar, DemoPill, Panel, Sparkline, Stat } from "../ui";
import { CATEGORY_LABEL } from "./labels";

const ROADMAP = [
  { Icon: CalendarClock, title: "Real booking management", blurb: "Inquiries saved to a database with staff accounts." },
  { Icon: CreditCard, title: "Payment deposits", blurb: "Hold dates with a deposit at confirmation." },
  { Icon: Ticket, title: "Event ticketing", blurb: "Sell entry for featured nights." },
  { Icon: Crown, title: "VIP reservations", blurb: "Section maps and live availability." },
  { Icon: Users, title: "Customer management", blurb: "Guest history, birthdays, repeat bookers." },
  { Icon: Bell, title: "Automated notifications", blurb: "Text and email updates for guests and staff." },
  { Icon: Radio, title: "Entertainment livestreaming", blurb: "The platform's Digital Stage, when approved." },
  { Icon: BarChart3, title: "Business analytics", blurb: "Real traffic and conversion reporting." },
];

const isThisWeek = (iso: string) => Date.now() - new Date(iso).getTime() < 7 * 864e5;

/** Fictional analytics plus the platform roadmap (copy only). */
export default function AnalyticsPanel() {
  const { state } = useVenueDashboard();
  const a = content.playhouse?.dashboard.analytics;
  const bookings = mergeBookings(state);
  if (!a) return null;
  const byCat = Object.entries(CATEGORY_LABEL).map(([id, label]) => ({ label, value: bookings.filter((b) => b.category === id).length }));
  const maxCat = Math.max(...byCat.map((c) => c.value), 1);
  const maxSvc = Math.max(...a.popularServices.map((s) => s.value));
  const maxEv = Math.max(...a.eventEngagement.map((s) => s.value));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-bone/50">
        <DemoPill /> Fictional numbers for demonstration. No tracking is installed.
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Website visits" value={a.visits30d.toLocaleString()} sub="Last 30 days" />
        <Stat label="Booking inquiries" value={String(bookings.length)} sub="Inbox total" />
        <Stat label="New this week" value={String(bookings.filter((b) => isThisWeek(b.receivedAt)).length)} />
        <Stat label="Inquiry rate" value={`${a.conversionRate}%`} sub="Visits → inquiry" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Daily visits (30 days)">
          <Sparkline values={a.visitsTrend} />
          <p className="mt-2 text-xs text-bone/40">Weekend peaks line up with event nights.</p>
        </Panel>
        <Panel title="Inquiries by category">
          <div className="space-y-3">
            {byCat.map((c) => (
              <Bar key={c.label} label={c.label} value={c.value} max={maxCat} color="var(--accent-2)" />
            ))}
          </div>
        </Panel>
        <Panel title="Popular services (page views)">
          <div className="space-y-3">
            {a.popularServices.map((s) => (
              <Bar key={s.label} label={s.label} value={s.value} max={maxSvc} />
            ))}
          </div>
        </Panel>
        <Panel title="Event engagement (views)">
          <div className="space-y-3">
            {a.eventEngagement.map((s) => (
              <Bar key={s.label} label={s.label} value={s.value} max={maxEv} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Traffic sources">
        <div className="flex h-3 overflow-hidden rounded-full">
          {a.trafficSources.map((t, i) => (
            <div key={t.label} style={{ width: `${t.value}%`, background: ["var(--gold)", "var(--accent-2)", "#8b8794", "#4b4752"][i % 4] }} />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-bone/60">
          {a.trafficSources.map((t) => (
            <li key={t.label}>
              {t.label} <span className="text-bone/40">{t.value}%</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Platform roadmap · next phase" action={<span className="text-[10px] uppercase tracking-[0.16em] text-bone/40">Not built in this demo</span>}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map(({ Icon, title, blurb }) => (
            <li key={title} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <Icon className="h-5 w-5 text-gold" aria-hidden />
              <p className="mt-3 text-sm font-medium text-bone">{title}</p>
              <p className="mt-1 text-xs text-bone/50">{blurb}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
