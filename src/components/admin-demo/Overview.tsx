"use client";

import { content } from "@/config/venue";
import { mergeInquiries, useLocations, useNetworkEvents, useNetworkStore } from "@/lib/network-store";
import { Bar, DemoPill, Panel, Sparkline, Stat } from "./ui";

export default function Overview() {
  const { state } = useNetworkStore();
  const locations = useLocations();
  const events = useNetworkEvents();
  const a = content.network?.analytics;
  const inquiries = mergeInquiries(content.network?.seedInquiries ?? [], state);
  const open = inquiries.filter((i) => i.status === "new" || i.status === "contacted").length;
  const views = a?.viewsByClub ?? {};
  const maxViews = Math.max(1, ...Object.values(views));
  const byClub = locations.map((l) => ({ l, n: inquiries.filter((i) => i.club === l.slug).length }));
  const maxInq = Math.max(1, ...byClub.map((x) => x.n));
  const maxEng = Math.max(1, ...(a?.eventEngagement ?? []).map((e) => e.value));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Website visitors · 30d" value={(a?.visitors30d ?? 0).toLocaleString()} sub="Demo data" />
        <Stat label="VIP inquiries" value={String(inquiries.length)} sub={`${open} open`} />
        <Stat label="Live events & promos" value={String(events.length)} sub="Across the network" />
        <Stat label="Locations" value={String(locations.length)} sub={`${locations.filter((l) => l.verification === "official").length} verified`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Visitors · last 14 days" action={<DemoPill />}>
          {a ? <Sparkline values={a.visitorsTrend} /> : null}
          <p className="mt-2 text-xs text-bone/45">Peaks line up with Friday and Saturday after-hours nights.</p>
        </Panel>
        <Panel title="Event engagement" action={<DemoPill />}>
          <div className="space-y-4">
            {(a?.eventEngagement ?? []).map((e) => (
              <Bar key={e.label} label={e.label} value={e.value} max={maxEng} color="var(--blood)" />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Most-viewed locations" action={<DemoPill />}>
          <div className="space-y-4">
            {[...locations]
              .sort((x, y) => (views[y.slug] ?? 0) - (views[x.slug] ?? 0))
              .map((l) => (
                <Bar key={l.slug} label={l.name} value={views[l.slug] ?? 0} max={maxViews} color={l.accent} />
              ))}
          </div>
        </Panel>
        <Panel title="VIP inquiries by club">
          <div className="space-y-4">
            {byClub.map(({ l, n }) => (
              <Bar key={l.slug} label={l.name} value={n} max={maxInq} color={l.accent} />
            ))}
          </div>
          <p className="mt-4 text-xs text-bone/45">Includes requests submitted on the public site in this browser.</p>
        </Panel>
      </div>
    </div>
  );
}
