"use client";

import Link from "next/link";
import { useMemo } from "react";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import EventCard from "@/components/events/EventCard";
import type { ClubEvent } from "@/types";
import type { StageSnapshot } from "@/lib/digital-stage/types";
import AgeGate from "./AgeGate";
import NowPerforming from "./NowPerforming";
import StagePlayer from "./StagePlayer";
import VenueInfo from "./VenueInfo";
import { useStageSnapshot } from "./useStageSnapshot";

interface DigitalStageProps {
  initial: StageSnapshot;
  events: ClubEvent[];
  visitNote: string;
  hours: { days: string; open: string; close: string }[];
  phone: string;
}

/**
 * The public Digital Stage. The player is rendered once with stable props so
 * performer changes (which only touch the panels around it) never remount
 * or reload the video.
 */
export default function DigitalStage({ initial, events, visitNote, hours, phone }: DigitalStageProps) {
  const { snapshot, error } = useStageSnapshot(initial);
  const { venue, stage, active, next, entertainers, stream, playback, mode } = snapshot;

  const queue = useMemo(
    () => stage.rotationQueue.map((id) => entertainers.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => Boolean(e)),
    [stage.rotationQueue, entertainers],
  );
  const featured = useMemo(() => entertainers.filter((e) => e.featuredTonight && e.consentGiven), [entertainers]);

  return (
    <div className="space-y-6">
      {mode === "demo" ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-xs text-gold">
          <strong>Demo mode.</strong> The video is simulated and performer data is sample data. Open the{" "}
          <Link href="/dashboard/digital-stage" className="underline">broadcaster dashboard</Link> in another tab to rotate performers and watch this page update.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-5">
          <AgeGate minAge={venue.ageRestriction} venueName={venue.name}>
            <StagePlayer
              playbackUrl={playback.url}
              simulated={playback.simulated}
              stageLive={stage.isLive}
              streamState={stream.state}
              label={active ? `Live now: ${active.stageName}` : venue.name}
              hue={active?.hue ?? 42}
            />
          </AgeGate>

          <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted">
            <span>
              {stream.source === "ivs" && stream.viewerCount !== null ? `${stream.viewerCount} watching · ` : ""}
              {stage.isLive ? "The stage is live" : "The stage is offline"}
              {stream.source === "ivs" && stage.isLive && stream.state === "offline" ? " · waiting for the camera feed" : ""}
            </span>
            {error ? <span className="text-blood">{error}</span> : null}
          </div>

          <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
            <div>
              <p className="font-display text-xl text-bone">Like what you see?</p>
              <p className="mt-1 text-xs text-muted">Tables go fast on show nights. Lock yours in before you head out.</p>
            </div>
            <div className="flex gap-3">
              <Button href="/reserve">Reserve a VIP Table</Button>
              <Button href="/girls" variant="outline">All Entertainers</Button>
            </div>
          </div>
        </div>

        <NowPerforming active={active} next={next} queue={queue} stageLive={stage.isLive} />
      </div>

      <VenueInfo venue={venue} featured={featured} visitNote={visitNote} hours={hours} phone={phone} />

      {events.length > 0 ? (
        <section className="pt-4">
          <SectionHeader eyebrow="Plan your night" title="Upcoming Events" href="/events" linkLabel="All events" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
