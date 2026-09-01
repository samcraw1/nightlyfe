"use client";

import Link from "next/link";
import { getEntertainer } from "@/data/entertainers";
import { MOCK_DANCER_ID } from "@/data/liveRooms";
import BroadcasterControls from "@/components/live/BroadcasterControls";
import { useApp } from "@/lib/store";

/** Go-live flow for the logged-in performer (mocked as MOCK_DANCER_ID). */
export default function DancerLivePage() {
  const { liveRooms } = useApp();
  const girl = getEntertainer(MOCK_DANCER_ID)!;
  const room = liveRooms.find((r) => r.entertainerId === girl.id)!;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="fade-up mb-8 pt-8 sm:pt-12">
        <Link
          href="/dancer"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright"
        >
          ← Dashboard
        </Link>
        <h1 className="gold-text mt-3 font-display text-4xl sm:text-5xl">
          Your Stream
        </h1>
      </header>
      <BroadcasterControls girl={girl} room={room} />
    </div>
  );
}
