import type { Metadata } from "next";
import { venue } from "@/config/venue";
import PageHeader from "@/components/ui/PageHeader";
import ClubShowcase from "@/components/network/ClubShowcase";

export const metadata: Metadata = {
  title: "Our Clubs",
  description: `All ${venue.locations?.length ?? 0} ${venue.name} locations across ${venue.city}.`,
};

export default function ClubsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <PageHeader eyebrow={venue.city} title="Our Clubs" description="Choose a club to see its atmosphere, events, VIP options, and how to find it." />
      <ClubShowcase heading={false} />
    </div>
  );
}
