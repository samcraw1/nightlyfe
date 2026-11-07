"use client";

import { events } from "@/data/events";
import EventCard from "@/components/events/EventCard";
import { applyEvents, useClubOverrides } from "@/lib/club-overrides";

/** Events grid, minus any the admin preview has unpublished. */
export default function EventList() {
  const { overrides } = useClubOverrides();
  const list = applyEvents(events, overrides).filter((e) => !e.hidden);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {list.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
