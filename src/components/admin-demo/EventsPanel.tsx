"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { content } from "@/config/venue";
import { formatEventDate } from "@/data/events";
import { locationName, mergeEvents, useLocations, useNetworkStore } from "@/lib/network-store";
import type { ClubEvent } from "@/types";
import { Panel, Toggle, inputCls } from "./ui";

export default function EventsPanel() {
  const { state, update } = useNetworkStore();
  const locations = useLocations();
  const [club, setClub] = useState("all");
  const all = useMemo(() => mergeEvents(content.events, state), [state]);
  const list = all.filter((e) => club === "all" || e.locationSlug === club);

  const edit = (id: string, patch: { hidden?: boolean; featured?: boolean; locationSlug?: string }) =>
    update((s) => ({ ...s, eventEdits: { ...s.eventEdits, [id]: { ...s.eventEdits?.[id], ...patch } } }));

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
      <Panel
        title={`Events & promotions (${list.length})`}
        action={
          <select aria-label="Filter by club" className={`${inputCls} w-auto py-1.5 text-xs`} value={club} onChange={(e) => setClub(e.target.value)}>
            <option value="all">All clubs</option>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>{l.name}</option>
            ))}
          </select>
        }
      >
        <div className="-mx-5 -my-5 divide-y divide-white/5">
          {list.map((e) => (
            <div key={e.id} className={`flex flex-wrap items-center gap-4 px-5 py-4 ${e.hidden ? "opacity-45" : ""}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-bone">{e.title}</p>
                <p className="mt-0.5 text-xs text-bone/45">
                  {e.recurring ? e.recurring : formatEventDate(e.date)} ·{" "}
                  {e.source === "verified" ? <span className="text-emerald-300/80">From club website</span> : "Demo"}
                </p>
              </div>
              <select
                aria-label={`Club for ${e.title}`}
                className={`${inputCls} w-44 py-1.5 text-xs`}
                value={e.locationSlug ?? ""}
                onChange={(ev) => edit(e.id, { locationSlug: ev.target.value || undefined })}
              >
                <option value="">All locations</option>
                {locations.map((l) => (
                  <option key={l.slug} value={l.slug}>{l.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-bone/60">
                <Toggle checked={!!e.featured} onChange={(v) => edit(e.id, { featured: v })} label={`Feature ${e.title}`} /> Featured
              </label>
              <label className="flex items-center gap-2 text-xs text-bone/60">
                <Toggle checked={!e.hidden} onChange={(v) => edit(e.id, { hidden: !v })} label={`Publish ${e.title}`} /> Live
              </label>
            </div>
          ))}
        </div>
      </Panel>
      <CreateEvent />
    </div>
  );
}

function CreateEvent() {
  const { update } = useNetworkStore();
  const locations = useLocations();
  const [f, setF] = useState({ title: "", club: "", date: "", doors: "", description: "", recurring: "" });
  const [done, setDone] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.title.trim() || !f.date) return;
    const ev: ClubEvent = {
      id: `admin-${Date.now().toString(36)}`,
      title: f.title.trim(),
      locationSlug: f.club || undefined,
      date: f.date,
      doors: f.doors || "TBA",
      description: f.description.trim() || "Demo event created in the management dashboard.",
      recurring: f.recurring || undefined,
      source: "demo",
      featured: false,
      gaPrice: 0,
      vipFromPrice: 0,
      parkingPrice: 0,
      hue: 45,
    };
    update((s) => ({ ...s, events: [ev, ...(s.events ?? [])] }));
    setDone(`"${ev.title}" is live${f.club ? ` at ${locationName(f.club)}` : " network-wide"}.`);
    setF({ title: "", club: "", date: "", doors: "", description: "", recurring: "" });
  }

  return (
    <Panel title="Create event">
      <form onSubmit={submit} className="space-y-3">
        <input aria-label="Event title" required className={inputCls} placeholder="Event title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <select aria-label="Club" className={inputCls} value={f.club} onChange={(e) => setF({ ...f, club: e.target.value })}>
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l.slug} value={l.slug}>{l.name}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input aria-label="Date" required type="date" className={inputCls} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          <input aria-label="Time" className={inputCls} placeholder="Time (e.g. 9 PM)" value={f.doors} onChange={(e) => setF({ ...f, doors: e.target.value })} />
        </div>
        <input aria-label="Recurring label" className={inputCls} placeholder="Recurring? e.g. Every Thursday" value={f.recurring} onChange={(e) => setF({ ...f, recurring: e.target.value })} />
        <textarea aria-label="Description" rows={3} className={`${inputCls} resize-none`} placeholder="Description / promotion details" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink hover:brightness-110">
          <Plus className="h-4 w-4" aria-hidden /> Publish event
        </button>
        {done ? (
          <p role="status" className="text-xs text-emerald-300/85">
            {done} Check /events.
          </p>
        ) : null}
      </form>
    </Panel>
  );
}
