"use client";

/**
 * Demo content overrides written by the /admin preview.
 *
 * Shows management that they can update their own site: edits are stored in
 * this browser's localStorage (namespaced by club) and layered over the
 * club's seed content wherever a component reads through these helpers.
 * A real build would persist the same shape to the database instead.
 */

import { useCallback, useSyncExternalStore } from "react";
import { venue } from "@/config/venue";
import type { WeeklySpecial } from "@/clubs/types";
import type { ClubEvent, Entertainer, JobRole, ReservationPackage, TableOption } from "@/types";

export interface ClubOverrides {
  heroHeadline?: string;
  heroBody?: string;
  /** Announcement bar shown on the home page. */
  announcement?: string;
  specials?: Record<string, Partial<Pick<WeeklySpecial, "title" | "description">> & { hidden?: boolean }>;
  lineup?: Record<string, { workingTonight?: boolean; featured?: boolean }>;
  events?: Record<string, { hidden?: boolean; featured?: boolean }>;
  tablePrices?: Record<string, number>;
  packagePrices?: Record<string, number>;
  jobs?: Record<string, { closed?: boolean }>;
}

const KEY = `${venue.slug}-admin-overrides-v1`;
const EVENT = "club-overrides-change";
const EMPTY: ClubOverrides = {};

let cacheRaw: string | null = null;
let cacheValue: ClubOverrides = EMPTY;

function read(): ClubOverrides {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cacheRaw) return cacheValue;
    cacheRaw = raw;
    cacheValue = raw ? (JSON.parse(raw) as ClubOverrides) : EMPTY;
    return cacheValue;
  } catch {
    return EMPTY;
  }
}

function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: ClubOverrides) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — edits just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Current overrides (empty on the server and before hydration). */
export function useClubOverrides() {
  const overrides = useSyncExternalStore(subscribe, read, () => EMPTY);
  const update = useCallback((fn: (prev: ClubOverrides) => ClubOverrides) => write(fn(read())), []);
  const reset = useCallback(() => write({}), []);
  return { overrides, update, reset };
}

/* ---- apply helpers: seed content + overrides ---- */

export function applySpecials(list: WeeklySpecial[], o: ClubOverrides): (WeeklySpecial & { hidden?: boolean })[] {
  return list.map((s) => ({ ...s, ...o.specials?.[s.id] }));
}

export function applyLineup(list: Entertainer[], o: ClubOverrides): Entertainer[] {
  return list.map((e) => ({ ...e, ...o.lineup?.[e.id] }));
}

export function applyEvents(list: ClubEvent[], o: ClubOverrides): (ClubEvent & { hidden?: boolean })[] {
  return list.map((e) => ({ ...e, ...o.events?.[e.id] }));
}

export function applyTables(list: TableOption[], o: ClubOverrides): TableOption[] {
  return list.map((t) => (o.tablePrices?.[t.id] != null ? { ...t, minimumSpend: o.tablePrices[t.id] } : t));
}

export function applyPackages(list: ReservationPackage[], o: ClubOverrides): ReservationPackage[] {
  return list.map((p) => (o.packagePrices?.[p.id] != null ? { ...p, price: o.packagePrices[p.id] } : p));
}

export function applyJobs(list: JobRole[], o: ClubOverrides): (JobRole & { closed?: boolean })[] {
  return list.map((j) => ({ ...j, ...o.jobs?.[j.id] }));
}
