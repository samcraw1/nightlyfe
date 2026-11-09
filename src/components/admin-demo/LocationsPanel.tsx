"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check, Plus, Trash2 } from "lucide-react";
import { useLocations, useNetworkStore } from "@/lib/network-store";
import { VerificationBadge } from "@/components/network/bits";
import type { ClubLocation } from "@/clubs/types";
import { Panel, inputCls } from "./ui";

type Hours = NonNullable<ClubLocation["hours"]>;

export default function LocationsPanel() {
  const locations = useLocations();
  const [slug, setSlug] = useState(locations[0]?.slug ?? "");
  const l = locations.find((x) => x.slug === slug);

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <Panel title={`Locations (${locations.length})`}>
        <ul className="-m-2 space-y-1">
          {locations.map((x) => (
            <li key={x.slug}>
              <button
                type="button"
                onClick={() => setSlug(x.slug)}
                aria-current={x.slug === slug}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${x.slug === slug ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
              >
                <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: x.accent }} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-bone">{x.name}</span>
                  <span className="block text-[11px] text-bone/45">{x.city}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      {l ? <LocationEditor key={l.slug} l={l} /> : null}
    </div>
  );
}

function LocationEditor({ l }: { l: ClubLocation }) {
  const { update } = useNetworkStore();
  const [summary, setSummary] = useState(l.summary ?? "");
  const [description, setDescription] = useState((l.description ?? []).join("\n\n"));
  const [hours, setHours] = useState<Hours>(l.hours ?? []);
  const [hoursNote, setHoursNote] = useState(l.hoursNote ?? "");
  const [phone, setPhone] = useState(l.phone ?? "");
  const [saved, setSaved] = useState(false);

  function save() {
    update((s) => ({
      ...s,
      locations: {
        ...s.locations,
        [l.slug]: {
          summary,
          description: description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
          hours: hours.filter((h) => h.days.trim()),
          hoursNote,
          phone: phone || undefined,
        },
      },
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const setRow = (i: number, k: keyof Hours[number], v: string) => setHours((hs) => hs.map((h, j) => (j === i ? { ...h, [k]: v } : h)));

  return (
    <Panel
      title={l.name}
      action={
        <Link href={`/clubs/${l.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs text-gold hover:text-bone">
          View page <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-bone/55">
          <VerificationBadge level={l.verification} />
          <span>{l.address ?? "No address on file"}</span>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-bone/60">Card summary</span>
          <input className={inputCls} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-bone/60">About (blank line between paragraphs)</span>
          <textarea rows={5} className={`${inputCls} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-bone/60">Operating hours</span>
          <div className="space-y-2">
            {hours.map((h, i) => (
              <div key={i} className="grid grid-cols-[1fr_6rem_6rem_auto] gap-2">
                <input aria-label="Days" className={inputCls} value={h.days} placeholder="Days" onChange={(e) => setRow(i, "days", e.target.value)} />
                <input aria-label="Opens" className={inputCls} value={h.open} placeholder="Open" onChange={(e) => setRow(i, "open", e.target.value)} />
                <input aria-label="Closes" className={inputCls} value={h.close} placeholder="Close" onChange={(e) => setRow(i, "close", e.target.value)} />
                <button type="button" aria-label="Remove row" onClick={() => setHours((hs) => hs.filter((_, j) => j !== i))} className="rounded-lg border border-white/10 px-2.5 text-bone/50 hover:text-[#e0475a]">
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setHours((hs) => [...hs, { days: "", open: "", close: "" }])} className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-bone">
              <Plus className="h-3.5 w-3.5" aria-hidden /> Add hours row
            </button>
          </div>
          <input className={`${inputCls} mt-3`} value={hoursNote} placeholder="Note shown when no hours are listed" onChange={(e) => setHoursNote(e.target.value)} />
        </div>

        <label className="block max-w-xs">
          <span className="mb-1.5 block text-xs font-medium text-bone/60">Phone</span>
          <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Not on file" />
        </label>

        <div className="flex items-center gap-3 border-t border-white/5 pt-5">
          <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink hover:brightness-110">
            {saved ? <Check className="h-4 w-4" aria-hidden /> : null}
            {saved ? "Saved: live on the club page" : "Save changes"}
          </button>
          <span className="text-xs text-bone/40">Saved in this browser only.</span>
        </div>
      </div>
    </Panel>
  );
}
