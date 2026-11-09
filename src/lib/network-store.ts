"use client";

/**
 * Demo state for multi-location ("network") clubs.
 *
 * The /admin-demo dashboard writes here, and public pages read through the
 * hooks below. That way management can watch an edit (hours, a new event, a
 * performer's club) show up on the site straight away. Everything lives in
 * this browser's localStorage, namespaced by club. A production build would
 * persist the same shape to a database scoped by `venue_id` and location.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { content, venue } from "@/config/venue";
import type { ClubLocation, NetworkDemoData } from "@/clubs/types";
import type { ClubEvent, Entertainer } from "@/types";

export type InquiryStatus = "new" | "contacted" | "confirmed" | "declined";
export type StoredInquiry = NetworkDemoData["seedInquiries"][number] & {
  email?: string;
  phone?: string;
  /** Submitted through the public site in this browser (vs. seeded). */
  fromSite?: boolean;
};

type LocationEdit = Partial<Pick<ClubLocation, "summary" | "tagline" | "hours" | "hoursNote" | "phone">> & {
  description?: string[];
};

export interface NetworkState {
  locations?: Record<string, LocationEdit>;
  /** Events created in the admin. */
  events?: ClubEvent[];
  eventEdits?: Record<string, { hidden?: boolean; featured?: boolean; locationSlug?: string }>;
  /** Performer profiles added in the admin. */
  performers?: Entertainer[];
  performerEdits?: Record<string, { locationSlug?: string; featured?: boolean; hidden?: boolean }>;
  /** Inquiries submitted through the public site in this browser. */
  inquiries?: StoredInquiry[];
  inquiryStatus?: Record<string, InquiryStatus>;
}

const KEY = `${venue.slug}-network-demo-v1`;
const EVENT = "network-store-change";
const EMPTY: NetworkState = {};

let cacheRaw: string | null = null;
let cacheValue: NetworkState = EMPTY;

function read(): NetworkState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cacheRaw) return cacheValue;
    cacheRaw = raw;
    cacheValue = raw ? (JSON.parse(raw) as NetworkState) : EMPTY;
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

function write(next: NetworkState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable: edits just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Append a simulated inquiry (called by lib/inquiries in network mode). */
export function recordInquiry(inquiry: StoredInquiry) {
  const prev = read();
  write({ ...prev, inquiries: [inquiry, ...(prev.inquiries ?? [])] });
}

export function useNetworkStore() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);
  const update = useCallback((fn: (prev: NetworkState) => NetworkState) => write(fn(read())), []);
  const reset = useCallback(() => write({}), []);
  return { state, update, reset };
}

/* ---- merged views: seed content + this browser's demo edits ---- */

export function mergeLocations(list: ClubLocation[], s: NetworkState): ClubLocation[] {
  return list.map((l) => ({ ...l, ...s.locations?.[l.slug] }));
}

export function mergeEvents(list: ClubEvent[], s: NetworkState): (ClubEvent & { hidden?: boolean })[] {
  return [...(s.events ?? []), ...list]
    .map((e) => ({ ...e, ...s.eventEdits?.[e.id] }))
    .sort((a, b) => (a.recurring ? -1 : 0) - (b.recurring ? -1 : 0) || a.date.localeCompare(b.date));
}

export function mergePerformers(list: Entertainer[], s: NetworkState): (Entertainer & { hidden?: boolean })[] {
  return [...list, ...(s.performers ?? [])].map((e) => ({ ...e, ...s.performerEdits?.[e.id] }));
}

export function mergeInquiries(seed: StoredInquiry[], s: NetworkState): StoredInquiry[] {
  return [...(s.inquiries ?? []), ...seed].map((i) => ({ ...i, status: s.inquiryStatus?.[i.id] ?? i.status }));
}

/** Locations with demo edits applied. */
export function useLocations(): ClubLocation[] {
  const { state } = useNetworkStore();
  return useMemo(() => mergeLocations(venue.locations ?? [], state), [state]);
}

export function useLocation(slug: string): ClubLocation | undefined {
  return useLocations().find((l) => l.slug === slug);
}

/** Visible events (seed + admin-created), recurring promos first. */
export function useNetworkEvents() {
  const { state } = useNetworkStore();
  return useMemo(() => mergeEvents(content.events, state).filter((e) => !e.hidden), [state]);
}

export function useNetworkPerformers() {
  const { state } = useNetworkStore();
  return useMemo(() => mergePerformers(content.entertainers, state).filter((e) => !e.hidden), [state]);
}

/** Location name lookup that works on the server too (seed data only). */
export function locationName(slug?: string): string {
  if (!slug) return "All locations";
  return venue.locations?.find((l) => l.slug === slug)?.name ?? slug;
}
