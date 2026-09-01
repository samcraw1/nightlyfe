"use client";

import { useEffect, useRef, useState } from "react";
import type { Entertainer, LiveRoom } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LiveChat, { type ChatMessage } from "@/components/live/LiveChat";
import { useApp } from "@/lib/store";
import { newId } from "@/lib/format";

/**
 * Broadcaster experience: preflight → live → summary.
 *
 *   BroadcasterControls
 *       ↓
 *   mock startStream() / endStream()  (src/lib/store.tsx)
 *       ↓
 *   provider API later (LiveKit room / Mux live stream / IVS channel)
 *
 * The real integration publishes the device camera via the provider SDK;
 * here the "camera preview" is placeholder art and viewers/tips are simulated.
 */
export default function BroadcasterControls({
  girl,
  room,
}: {
  girl: Entertainer;
  room: LiveRoom;
}) {
  const { startStream, endStream, addDancerEarnings, hydrated } = useApp();
  const [title, setTitle] = useState(room.title || `Late Night with ${girl.name}`);
  const [viewers, setViewers] = useState(12);
  const peakViewers = useRef(12);
  // Tips received during this broadcast session (dashboard keeps the total).
  const [sessionTips, setSessionTips] = useState(0);
  const [chatEvents, setChatEvents] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<{
    minutes: number;
    peak: number;
    tips: number;
    followers: number;
  } | null>(null);

  const isLive = hydrated && room.isLive;

  // simulate audience + occasional tips while live
  useEffect(() => {
    if (!isLive) return;
    const viewerTick = setInterval(() => {
      setViewers((v) => {
        const next = Math.max(5, v + Math.floor(Math.random() * 21) - 7);
        peakViewers.current = Math.max(peakViewers.current, next);
        return next;
      });
    }, 3000);
    const tipTick = setInterval(() => {
      const amount = [10, 25, 50][Math.floor(Math.random() * 3)];
      addDancerEarnings(amount);
      setSessionTips((t) => t + amount);
      setChatEvents((prev) => [
        ...prev,
        {
          id: newId("tip"),
          user: "viewer",
          text: `A viewer tipped ${girl.name} ${amount} credits`,
          isTip: true,
        },
      ]);
    }, 18000);
    return () => {
      clearInterval(viewerTick);
      clearInterval(tipTick);
    };
  }, [isLive, addDancerEarnings, girl.name]);

  const goLive = () => {
    peakViewers.current = 12;
    setViewers(12);
    setSessionTips(0);
    setSummary(null);
    startStream(room.id, title.trim() || `Late Night with ${girl.name}`);
  };

  const stop = () => {
    const started = room.startedAt ? new Date(room.startedAt).getTime() : Date.now();
    const minutes = Math.max(1, Math.round((Date.now() - started) / 60000));
    setSummary({
      minutes,
      peak: peakViewers.current,
      tips: sessionTips,
      followers: 3 + Math.floor(Math.random() * 20),
    });
    setChatEvents([]);
    endStream(room.id);
  };

  /* ---- summary ---- */
  if (summary) {
    return (
      <div className="glass fade-up mx-auto max-w-lg rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
          ✨
        </div>
        <p className="eyebrow mb-2">Stream ended</p>
        <h2 className="gold-text font-display text-3xl">Great show, {girl.name}</h2>
        <div className="mx-auto mt-6 max-w-xs space-y-2.5 text-left text-sm">
          {[
            ["Duration", `${summary.minutes} min`],
            ["Peak viewers", String(summary.peak)],
            ["Tips", `${summary.tips} credits`],
            ["New followers", String(summary.followers)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-white/5 pb-2.5">
              <span className="text-muted">{label}</span>
              <span className="font-semibold text-bone">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 flex justify-center gap-3">
          <Button variant="outline" onClick={() => setSummary(null)}>
            Go Live Again
          </Button>
          <Button href="/dancer">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  /* ---- broadcasting ---- */
  if (isLive) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge variant="live" pulse>
                You&apos;re live
              </Badge>
              <span className="text-sm font-bold text-bone">{room.title}</span>
            </div>
            <Button variant="blood" onClick={stop}>
              End Stream
            </Button>
          </div>

          {/* camera preview — provider SDK publishes the real feed here */}
          <div className="glass overflow-hidden rounded-3xl">
            <MockImage
              hue={girl.hue}
              label={girl.name}
              className="drift aspect-video w-full"
            >
              <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                Camera preview
              </div>
            </MockImage>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-3xl p-5 text-center">
              <p className="font-display text-3xl text-gold">{viewers}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
                Watching now
              </p>
            </div>
            <div className="glass rounded-3xl p-5 text-center">
              <p className="font-display text-3xl text-gold">{sessionTips}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
                Tips this stream
              </p>
            </div>
          </div>
        </div>

        <LiveChat className="h-96 lg:h-auto" events={chatEvents} />
      </div>
    );
  }

  /* ---- preflight ---- */
  return (
    <div className="glass mx-auto max-w-lg rounded-3xl p-6 sm:p-8">
      <label htmlFor="room-title" className="eyebrow mb-2 block">
        Room title
      </label>
      <input
        id="room-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-gold/50 focus:outline-none"
      />

      <div className="mt-5 overflow-hidden rounded-2xl">
        <MockImage hue={girl.hue} label={girl.name} className="aspect-video w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
              Camera preview
            </span>
          </div>
        </MockImage>
      </div>

      <div className="mt-5 space-y-2.5">
        {[
          ["Camera", "Ready"],
          ["Microphone", "Ready"],
        ].map(([device, status]) => (
          <div
            key={device}
            className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm"
          >
            <span className="text-bone/80">{device}</span>
            <span className="flex items-center gap-2 font-semibold text-gold">
              <span className="h-2 w-2 rounded-full bg-gold" />
              {status}
            </span>
          </div>
        ))}
      </div>

      <Button className="mt-6 w-full" size="lg" onClick={goLive}>
        Go Live
      </Button>
      <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-muted">
        Demo broadcast — no real video is captured
      </p>
    </div>
  );
}
