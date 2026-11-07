"use client";

import { useSyncExternalStore } from "react";
import type { WeeklySpecial } from "@/clubs/types";

const TZ = "America/New_York";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function subscribe(cb: () => void) {
  const t = setInterval(cb, 15_000);
  return () => clearInterval(t);
}
const snapshot = () => Math.floor(Date.now() / 15_000);

/** Current time, refreshed every 15s. Null on the server / first render. */
export function useNow(): Date | null {
  const tick = useSyncExternalStore(subscribe, snapshot, () => null);
  return tick === null ? null : new Date(tick * 15_000);
}

/** Weekday (0 = Sunday) and hour in Atlanta for a given instant. */
export function atlantaParts(d: Date): { weekday: number; hour: number; label: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(d);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Sunday";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const label = d.toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
  return { weekday: DAY_NAMES.indexOf(wd), hour, label };
}

/** Day / evening / late-night phase name. Says nothing about whether the club is open. */
export function phaseOf(hour: number): string {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Daytime";
  if (hour >= 17 && hour < 22) return "Evening";
  return "Late night";
}

/** Map a weekly special's `when` ("Mondays") to a weekday index. */
export function weekdayOf(special: WeeklySpecial): number {
  const i = DAY_NAMES.findIndex((d) => special.when.toLowerCase().startsWith(d.toLowerCase()));
  return i;
}

export const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
