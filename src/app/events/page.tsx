import type { Metadata } from "next";
import { venue } from "@/config/venue";
import PageHeader from "@/components/ui/PageHeader";
import EventList from "@/components/events/EventList";
import NightRail from "@/components/home/cinematic/NightRail";
import EventsBoard from "@/components/network/EventsBoard";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  if (venue.features.network) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <PageHeader
          eyebrow={venue.pages?.events?.eyebrow ?? "The calendar"}
          title={venue.pages?.events?.title ?? "Events"}
          description={venue.pages?.events?.description}
        />
        <EventsBoard vipHref="/#vip" />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow={venue.pages?.events?.eyebrow ?? "The calendar"}
        title={venue.pages?.events?.title ?? "Events & Parking"}
        description={
          venue.pages?.events?.description ??
          (venue.features.parking
            ? "Guest DJs, showcases, and holiday takeovers. Grab tickets and pre-paid parking in one checkout."
            : "Guest DJs, showcases, and holiday takeovers.")
        }
      />
      {venue.theme.style === "cinematic" ? (
        <div className="mb-16">
          <NightRail />
        </div>
      ) : null}
      <EventList />
    </div>
  );
}
