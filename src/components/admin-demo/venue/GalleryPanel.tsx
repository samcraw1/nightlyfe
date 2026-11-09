"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { GalleryCategory, GalleryItem } from "@/clubs/types";
import { content } from "@/config/venue";
import { mergeGallery, useVenueDashboard } from "@/lib/venue-dashboard-store";
import { Panel, inputCls } from "../ui";
import { GALLERY_LABEL } from "./labels";

const CATS = Object.keys(GALLERY_LABEL) as GalleryCategory[];
const newId = () => `admin-${Date.now().toString(36)}`;

/** Add (bundled photo or image URL), remove, recategorize and reorder gallery photos. */
export default function GalleryPanel() {
  const { state, update } = useVenueDashboard();
  const photos = mergeGallery(state);
  const library = content.playhouse?.gallery ?? [];
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [src, setSrc] = useState(library[0]?.src ?? "");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("venue");
  const [error, setError] = useState("");
  const shown = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  const add = () => {
    const chosen = url.trim() || src;
    if (url.trim() && !/^https:\/\/\S+$/.test(url.trim())) return setError("Image URLs must start with https://");
    if (!chosen) return setError("Choose a photo.");
    const base = library.find((l) => l.src === chosen);
    const item: GalleryItem = {
      id: newId(),
      src: chosen,
      alt: alt.trim() || base?.alt || "Venue photo",
      category,
      w: base?.w ?? 1600,
      h: base?.h ?? 1067,
    };
    update((s) => ({ ...s, photos: [...(s.photos ?? []), item], photoOrder: [...(s.photoOrder ?? photos.map((p) => p.id)), item.id] }));
    setUrl("");
    setAlt("");
    setError("");
  };

  const move = (id: string, d: -1 | 1) => {
    const order = photos.map((p) => p.id);
    const i = order.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    update((s) => ({ ...s, photoOrder: order }));
  };

  const edit = (id: string, patch: { category?: GalleryCategory; removed?: boolean }) =>
    update((s) => ({ ...s, photoEdits: { ...s.photoEdits, [id]: { ...s.photoEdits?.[id], ...patch } } }));

  return (
    <div className="space-y-4">
      <Panel title="Add a photo">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs text-bone/60">
            From library
            <select className={`${inputCls} mt-1`} value={src} onChange={(e) => setSrc(e.target.value)} disabled={!!url.trim()}>
              {library.map((l) => (
                <option key={l.id} value={l.src}>
                  {l.src.split("/").pop()}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-bone/60">
            …or image URL
            <input className={`${inputCls} mt-1`} placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
          <label className="text-xs text-bone/60">
            Caption
            <input className={`${inputCls} mt-1`} value={alt} onChange={(e) => setAlt(e.target.value)} />
          </label>
          <label className="text-xs text-bone/60">
            Category
            <select className={`${inputCls} mt-1`} value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)}>
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {GALLERY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error ? <p className="mt-3 text-xs text-blood">{error}</p> : null}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[11px] text-bone/40">Only use photos the venue owns or is licensed to use.</p>
          <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink hover:brightness-110">
            <Plus className="h-4 w-4" aria-hidden /> Add to gallery
          </button>
        </div>
      </Panel>

      <Panel
        title={`Gallery (${shown.length})`}
        action={
          <select aria-label="Filter by category" className={`${inputCls} w-auto py-1.5 text-xs`} value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">All categories</option>
            {CATS.map((c) => (
              <option key={c} value={c}>
                {GALLERY_LABEL[c]}
              </option>
            ))}
          </select>
        }
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-2 p-2.5">
                <p className="truncate text-xs text-bone/70" title={p.alt}>
                  {p.alt}
                </p>
                <select aria-label={`Category for ${p.alt}`} className={`${inputCls} py-1 text-xs`} value={p.category} onChange={(e) => edit(p.id, { category: e.target.value as GalleryCategory })}>
                  {CATS.map((c) => (
                    <option key={c} value={c}>
                      {GALLERY_LABEL[c]}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(p.id, -1)} aria-label="Move earlier" className="rounded-md p-1.5 text-bone/50 hover:bg-white/5 hover:text-bone">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => move(p.id, 1)} aria-label="Move later" className="rounded-md p-1.5 text-bone/50 hover:bg-white/5 hover:text-bone">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button type="button" onClick={() => edit(p.id, { removed: true })} aria-label={`Remove ${p.alt}`} className="rounded-md p-1.5 text-bone/50 hover:bg-white/5 hover:text-blood">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
