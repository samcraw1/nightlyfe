"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { PlayhouseEvent } from "@/clubs/types";
import { content } from "@/config/venue";
import { mergeEvents, useVenueDashboard } from "@/lib/venue-dashboard-store";
import { Panel, Toggle, inputCls } from "../ui";

type Draft = Pick<PlayhouseEvent, "title" | "date" | "time" | "recurring" | "kind" | "description" | "image" | "featured">;

const BLANK: Draft = { title: "", date: "", time: "10 PM – Late", recurring: "", kind: "upcoming", description: "", image: "/clubs/bibs-playhouse/hero.webp", featured: false };
const KIND_LABEL: Record<PlayhouseEvent["kind"], string> = { upcoming: "Upcoming", weekly: "Weekly", promotion: "Promotion" };

/** Create, edit, hide, feature and delete events and promotions. */
export default function EventsPanel() {
  const { state, update } = useVenueDashboard();
  const events = mergeEvents(state);
  const images = Array.from(new Set((content.playhouse?.gallery ?? []).map((g) => g.src)));
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [error, setError] = useState("");

  const edit = (id: string, patch: Partial<PlayhouseEvent> & { deleted?: boolean }) =>
    update((s) => ({ ...s, eventEdits: { ...s.eventEdits, [id]: { ...s.eventEdits?.[id], ...patch } } }));

  const startEdit = (e?: PlayhouseEvent) => {
    setError("");
    if (!e) {
      setDraft(BLANK);
      setEditing("new");
      return;
    }
    setDraft({ title: e.title, date: e.date ?? "", time: e.time, recurring: e.recurring ?? "", kind: e.kind, description: e.description, image: e.image, featured: !!e.featured });
    setEditing(e.id);
  };

  const save = () => {
    if (draft.title.trim().length < 3) return setError("Add a title.");
    if (draft.kind === "upcoming" && !draft.date) return setError("Upcoming events need a date.");
    if (draft.kind !== "upcoming" && !draft.recurring?.trim()) return setError("Add a schedule label, e.g. “Every Friday”.");
    const clean: Draft = {
      ...draft,
      title: draft.title.trim(),
      date: draft.kind === "upcoming" ? draft.date : undefined,
      recurring: draft.kind === "upcoming" ? undefined : draft.recurring?.trim(),
    };
    if (editing === "new") {
      const ev: PlayhouseEvent = { ...clean, id: `admin-${Date.now().toString(36)}`, source: "sample" };
      update((s) => ({ ...s, events: [ev, ...(s.events ?? [])] }));
    } else if (editing) {
      edit(editing, clean);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      {editing ? (
        <Panel
          title={editing === "new" ? "New event or promotion" : "Edit event"}
          action={
            <button type="button" onClick={() => setEditing(null)} aria-label="Cancel" className="text-bone/50 hover:text-bone">
              <X className="h-4 w-4" />
            </button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-bone/60 sm:col-span-2">
              Title
              <input className={`${inputCls} mt-1`} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </label>
            <label className="text-xs text-bone/60">
              Type
              <select className={`${inputCls} mt-1`} value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as PlayhouseEvent["kind"] })}>
                {Object.entries(KIND_LABEL).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            {draft.kind === "upcoming" ? (
              <label className="text-xs text-bone/60">
                Date
                <input type="date" className={`${inputCls} mt-1`} value={draft.date ?? ""} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
              </label>
            ) : (
              <label className="text-xs text-bone/60">
                Schedule
                <input className={`${inputCls} mt-1`} placeholder="Every Friday" value={draft.recurring ?? ""} onChange={(e) => setDraft({ ...draft, recurring: e.target.value })} />
              </label>
            )}
            <label className="text-xs text-bone/60">
              Time
              <input className={`${inputCls} mt-1`} value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
            </label>
            <label className="text-xs text-bone/60">
              Image
              <select className={`${inputCls} mt-1`} value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })}>
                {images.map((src) => (
                  <option key={src} value={src}>
                    {src.split("/").pop()}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-bone/60 sm:col-span-2">
              Description
              <textarea rows={3} className={`${inputCls} mt-1 resize-none`} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </label>
            <div className="flex items-center gap-3 text-xs text-bone/70">
              <Toggle checked={!!draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} label="Featured" />
              Featured
            </div>
          </div>
          {error ? <p className="mt-3 text-xs text-blood">{error}</p> : null}
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-bone/60 hover:text-bone">
              Cancel
            </button>
            <button type="button" onClick={save} className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink hover:brightness-110">
              {editing === "new" ? "Publish to site" : "Save changes"}
            </button>
          </div>
        </Panel>
      ) : null}

      <Panel
        title={`Events & promotions (${events.length})`}
        action={
          <button type="button" onClick={() => startEdit()} className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-ink hover:brightness-110">
            <Plus className="h-3.5 w-3.5" aria-hidden /> New
          </button>
        }
      >
        <ul className="-mx-5 -my-5 divide-y divide-white/5">
          {events.map((e) => (
            <li key={e.id} className={`flex flex-wrap items-center gap-3 px-5 py-3.5 ${e.hidden ? "opacity-50" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.image} alt="" className="h-12 w-16 flex-shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-bone">
                  {e.title}
                  {e.source === "verified" ? <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">Promoter post</span> : <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-bone/50">Sample</span>}
                </p>
                <p className="mt-0.5 text-xs text-bone/45">
                  {KIND_LABEL[e.kind]} · {e.date ? new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : e.recurring} · {e.time}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-[11px] text-bone/55">
                  <Toggle checked={!!e.featured} onChange={(v) => edit(e.id, { featured: v })} label={`Feature ${e.title}`} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-[11px] text-bone/55">
                  <Toggle checked={!e.hidden} onChange={(v) => edit(e.id, { hidden: !v })} label={`Show ${e.title} on site`} />
                  Visible
                </label>
                <button type="button" onClick={() => startEdit(e)} aria-label={`Edit ${e.title}`} className="text-bone/50 hover:text-gold">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => edit(e.id, { deleted: true })} aria-label={`Delete ${e.title}`} className="text-bone/50 hover:text-blood">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
