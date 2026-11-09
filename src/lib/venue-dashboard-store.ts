"use client";

/**
 * Demo state for single-venue ("playhouse") clubs.
 *
 * The /admin-demo dashboard writes here and the public home page reads the
 * merged views below, so an event created or a photo removed in the admin
 * shows up on the site immediately. Everything stays in this browser's
 * localStorage, namespaced by club. A production build would persist the
 * same shape to a database scoped by `venue_id`.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { content, venue } from "@/config/venue";
import type { GalleryCategory, GalleryItem, PlayhouseBooking, PlayhouseEvent } from "@/clubs/types";

export type BookingStatus = PlayhouseBooking["status"];

export interface VenueDashboardState {
  /** Bookings submitted through the public site in this browser. */
  bookings?: PlayhouseBooking[];
  bookingStatus?: Record<string, BookingStatus>;
  /** Events created in the admin. */
  events?: PlayhouseEvent[];
  eventEdits?: Record<string, Partial<PlayhouseEvent> & { deleted?: boolean }>;
  /** Photos added in the admin. */
  photos?: GalleryItem[];
  photoEdits?: Record<string, { category?: GalleryCategory; removed?: boolean }>;
  /** Gallery order (ids); unknown ids fall to the end. */
  photoOrder?: string[];
}

const KEY = `${venue.slug}-venue-dashboard-v1`;
const EVENT = "venue-dashboard-change";
const EMPTY: VenueDashboardState = {};

let cacheRaw: string | null = null;
let cacheValue: VenueDashboardState = EMPTY;

function read(): VenueDashboardState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cacheRaw) return cacheValue;
    cacheRaw = raw;
    cacheValue = raw ? (JSON.parse(raw) as VenueDashboardState) : EMPTY;
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

function write(next: VenueDashboardState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable: edits just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Append a simulated booking inquiry (called by lib/inquiries). */
export function recordBooking(booking: PlayhouseBooking) {
  const prev = read();
  write({ ...prev, bookings: [booking, ...(prev.bookings ?? [])] });
}

export function useVenueDashboard() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);
  const update = useCallback((fn: (prev: VenueDashboardState) => VenueDashboardState) => write(fn(read())), []);
  const reset = useCallback(() => write({}), []);
  return { state, update, reset };
}

/* ---- merged views: seed content + this browser's demo edits ---- */

const seed = content.playhouse;

export function mergeBookings(s: VenueDashboardState): PlayhouseBooking[] {
  return [...(s.bookings ?? []), ...(seed?.dashboard.seedBookings ?? [])].map((b) => ({
    ...b,
    status: s.bookingStatus?.[b.id] ?? b.status,
  }));
}

export function mergeEvents(s: VenueDashboardState): PlayhouseEvent[] {
  return [...(s.events ?? []), ...(seed?.events ?? [])]
    .map((e) => ({ ...e, ...s.eventEdits?.[e.id] }))
    .filter((e) => !(e as { deleted?: boolean }).deleted);
}

export function mergeGallery(s: VenueDashboardState): GalleryItem[] {
  const all = [...(seed?.gallery ?? []), ...(s.photos ?? [])]
    .filter((p) => !s.photoEdits?.[p.id]?.removed)
    .map((p) => ({ ...p, category: s.photoEdits?.[p.id]?.category ?? p.category }));
  const order = s.photoOrder;
  if (!order) return all;
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...all].sort((a, b) => rank(a.id) - rank(b.id));
}

/** Public events (hidden ones filtered out). */
export function usePlayhouseEvents(): PlayhouseEvent[] {
  const { state } = useVenueDashboard();
  return useMemo(() => mergeEvents(state).filter((e) => !e.hidden), [state]);
}

export function usePlayhouseGallery(): GalleryItem[] {
  const { state } = useVenueDashboard();
  return useMemo(() => mergeGallery(state), [state]);
}
