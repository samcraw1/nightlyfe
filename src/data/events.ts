import { content } from "@/config/venue";
import type { ClubEvent } from "@/types";

export const events: ClubEvent[] = content.events;
export const weeklySpecials = content.weeklySpecials;

export function getEvent(id: string): ClubEvent | undefined {
  return events.find((e) => e.id === id);
}

export function formatEventDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
