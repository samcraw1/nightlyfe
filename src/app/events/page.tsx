import type { Metadata } from "next";
import { events } from "@/data/events";
import { venue } from "@/config/venue";
import PageHeader from "@/components/ui/PageHeader";
import EventCard from "@/components/events/EventCard";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="The calendar"
        title="Events & Parking"
        description={
          venue.features.parking
            ? "Guest DJs, showcases, and holiday takeovers. Grab tickets and pre-paid parking in one checkout."
            : "Guest DJs, showcases, and holiday takeovers."
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
