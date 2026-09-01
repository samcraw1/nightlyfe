import type { Metadata } from "next";
import { venue } from "@/config/venue";
import { liveRooms } from "@/data/liveRooms";
import { entertainers, getEntertainer } from "@/data/entertainers";
import LivePlayer from "@/components/live/LivePlayer";
import LiveChat from "@/components/live/LiveChat";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import LiveRoomCard from "@/components/live/LiveRoomCard";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Live" };

// The official venue stream — separate from entertainer rooms in /webcams.
const venueStream = { live: true, viewers: 1284, hue: 42 };

export default function LivePage() {
  if (!venue.features.liveStream) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-bone">
          The main stage stream isn't available at this venue.
        </p>
      </div>
    );
  }

  const tonight = entertainers.filter((e) => e.workingTonight);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Streaming now"
        title="Live from the Floor"
        description={`The ${venue.name} main stage, live every night. Full webcam grid available for every room in the building.`}
      />

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <LivePlayer
            title="Main Stage — Saturday Night Live Set"
            subtitle={`DJ Smooth · ${tonight.length} entertainers on tonight`}
            live={venueStream.live}
            viewers={venueStream.viewers}
            hue={venueStream.hue}
          />

          <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
            <div>
              <p className="font-display text-xl text-bone">
                Tonight at {venue.name}
              </p>
              <p className="mt-1 text-xs text-muted">
                {tonight.map((e) => e.name).join(" · ")}
              </p>
            </div>
            <div className="flex gap-3">
              {venue.features.webcams ? (
                <Button href="/webcams" variant="outline">
                  All Webcams
                </Button>
              ) : null}
              <Button href="/reserve">Reserve a Table</Button>
            </div>
          </div>
        </div>

        {/* chat: below player on mobile, sidebar on desktop */}
        <LiveChat className="h-96 lg:h-auto" />
      </div>

      {venue.features.webcams ? (
        <section className="mt-16">
          <SectionHeader
            eyebrow="The girls, streaming"
            title="Live Entertainer Rooms"
            href="/webcams"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {liveRooms
              .filter((r) => r.isLive)
              .slice(0, 3)
              .map((room) => {
                const girl = getEntertainer(room.entertainerId);
                return girl ? (
                  <LiveRoomCard key={room.id} room={room} girl={girl} />
                ) : null;
              })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
