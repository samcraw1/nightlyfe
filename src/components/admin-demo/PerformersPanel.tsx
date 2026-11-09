"use client";

import { useMemo, useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { content } from "@/config/venue";
import { mergePerformers, useLocations, useNetworkStore } from "@/lib/network-store";
import MockImage from "@/components/ui/MockImage";
import type { Entertainer } from "@/types";
import { Panel, Toggle, inputCls } from "./ui";

export default function PerformersPanel() {
  const { state, update } = useNetworkStore();
  const locations = useLocations();
  const list = useMemo(() => mergePerformers(content.entertainers, state), [state]);
  const [name, setName] = useState("");
  const [club, setClub] = useState(locations[0]?.slug ?? "");

  const edit = (id: string, patch: { locationSlug?: string; featured?: boolean; hidden?: boolean }) =>
    update((s) => ({ ...s, performerEdits: { ...s.performerEdits, [id]: { ...s.performerEdits?.[id], ...patch } } }));

  function add(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const p: Entertainer = {
      type: "performer",
      id: `admin-${Date.now().toString(36)}`,
      name: name.trim(),
      locationSlug: club,
      tagline: "Demo profile.",
      bio: "Demo profile added in the management dashboard.",
      featured: false,
      followers: 0,
      galleryCount: 0,
      hue: Math.floor(Math.random() * 360),
    };
    update((s) => ({ ...s, performers: [...(s.performers ?? []), p] }));
    setName("");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
      <Panel title={`Performer profiles (${list.length})`}>
        <div className="-mx-5 -my-5 divide-y divide-white/5">
          {list.map((e) => (
            <div key={e.id} className={`flex flex-wrap items-center gap-4 px-5 py-3.5 ${e.hidden ? "opacity-45" : ""}`}>
              <MockImage hue={e.hue} label={e.name} className="h-11 w-11 flex-shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-bone">{e.name}</p>
                <p className="text-xs text-bone/40">Demo profile{e.id.startsWith("admin-") ? " · added here" : ""}</p>
              </div>
              <select
                aria-label={`Club for ${e.name}`}
                className={`${inputCls} w-48 py-1.5 text-xs`}
                value={e.locationSlug ?? ""}
                onChange={(ev) => edit(e.id, { locationSlug: ev.target.value })}
              >
                {locations.map((l) => (
                  <option key={l.slug} value={l.slug}>{l.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-bone/60">
                <Toggle checked={!!e.featured} onChange={(v) => edit(e.id, { featured: v })} label={`Feature ${e.name}`} /> Featured
              </label>
              <label className="flex items-center gap-2 text-xs text-bone/60">
                <Toggle checked={!e.hidden} onChange={(v) => edit(e.id, { hidden: !v })} label={`Show ${e.name}`} /> Visible
              </label>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Add performer">
        <form onSubmit={add} className="space-y-3">
          <input aria-label="Stage name" className={inputCls} placeholder="Stage name" value={name} onChange={(e) => setName(e.target.value)} />
          <select aria-label="Club" className={inputCls} value={club} onChange={(e) => setClub(e.target.value)}>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>{l.name}</option>
            ))}
          </select>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink hover:brightness-110">
            <UserPlus className="h-4 w-4" aria-hidden /> Add profile
          </button>
          <p className="text-xs leading-relaxed text-bone/40">
            In production, profiles would only be published with the performer&rsquo;s consent and authorized photos.
          </p>
        </form>
      </Panel>
    </div>
  );
}
