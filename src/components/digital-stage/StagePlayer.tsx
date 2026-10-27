"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Badge from "@/components/ui/Badge";
import MockImage from "@/components/ui/MockImage";

/**
 * The venue's video surface.
 *
 * Production: Amazon IVS Player SDK (official build from player.live-video.net)
 * attached to a <video>. The element stays mounted while performers rotate;
 * only the overlay chrome re-renders.
 *
 * Simulated (demo mode or no playback URL yet): a clearly labelled
 * placeholder. No fake video is ever shown as if it were real.
 */

const PLAYER_VERSION = process.env.NEXT_PUBLIC_IVS_PLAYER_VERSION || "1.25.0";
const PLAYER_SRC = `https://player.live-video.net/${PLAYER_VERSION}/amazon-ivs-player.min.js`;

/** Raw SDK state; what the viewer sees is derived from this plus the stage flags. */
type PlayerPhase = "idle" | "playing" | "buffering" | "ended" | "stream-missing" | "error" | "unsupported";
type DisplayPhase = "offline" | "loading" | "playing" | "buffering" | "waiting-feed" | "error" | "unsupported";

interface IvsPlayerInstance {
  attachHTMLVideoElement(el: HTMLVideoElement): void;
  load(url: string): void;
  play(): void;
  pause(): void;
  setMuted(muted: boolean): void;
  setVolume(v: number): void;
  addEventListener(event: string, cb: (payload?: unknown) => void): void;
  removeEventListener(event: string, cb: (payload?: unknown) => void): void;
  delete(): void;
}
interface IvsPlayerSdk {
  isPlayerSupported: boolean;
  create(): IvsPlayerInstance;
  PlayerState: { IDLE: string; READY: string; BUFFERING: string; PLAYING: string; ENDED: string };
  PlayerEventType: { ERROR: string };
}
declare global {
  interface Window {
    IVSPlayer?: IvsPlayerSdk;
  }
}

interface StagePlayerProps {
  playbackUrl: string | null;
  simulated: boolean;
  /** Stage flag from the venue (staff said "we're live"). */
  stageLive: boolean;
  /** Provider flag (IVS says bytes are flowing), when known. */
  streamState: "live" | "offline" | "unknown";
  label: string;
  hue: number;
}

export default function StagePlayer({ playbackUrl, simulated, stageLive, streamState, label, hue }: StagePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<IvsPlayerInstance | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [phase, setPhase] = useState<PlayerPhase>("idle");
  const [muted, setMuted] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const useRealPlayer = !simulated && Boolean(playbackUrl);
  // Only try to play when the venue says it is live; otherwise we would hammer an offline URL.
  const shouldPlay = useRealPlayer && stageLive && streamState !== "offline";

  const onSdkReady = () => {
    if (window.IVSPlayer && !window.IVSPlayer.isPlayerSupported) setPhase("unsupported");
    setSdkReady(true);
  };

  useEffect(() => {
    if (!useRealPlayer || !sdkReady || !videoRef.current) return;
    const sdk = window.IVSPlayer;
    if (!sdk || !sdk.isPlayerSupported) return;
    const player = sdk.create();
    player.attachHTMLVideoElement(videoRef.current);
    player.setMuted(true);
    const onState = (state: string) => {
      if (state === sdk.PlayerState.PLAYING) setPhase("playing");
      else if (state === sdk.PlayerState.BUFFERING || state === sdk.PlayerState.READY) setPhase("buffering");
      else if (state === sdk.PlayerState.ENDED) setPhase("ended");
      else if (state === sdk.PlayerState.IDLE) setPhase((p) => (p === "playing" ? "ended" : p));
    };
    const stateEvents = [sdk.PlayerState.PLAYING, sdk.PlayerState.BUFFERING, sdk.PlayerState.READY, sdk.PlayerState.ENDED, sdk.PlayerState.IDLE];
    const handlers = stateEvents.map((ev) => {
      const cb = () => onState(ev);
      player.addEventListener(ev, cb);
      return [ev, cb] as const;
    });
    const onError = (err: unknown) => {
      // IVS reports "stream not found" (404) while the channel is offline.
      const code = (err as { code?: number })?.code;
      setPhase(code === 404 ? "stream-missing" : "error");
    };
    player.addEventListener(sdk.PlayerEventType.ERROR, onError);
    playerRef.current = player;
    return () => {
      handlers.forEach(([ev, cb]) => player.removeEventListener(ev, cb));
      player.removeEventListener(sdk.PlayerEventType.ERROR, onError);
      player.delete();
      playerRef.current = null;
    };
  }, [useRealPlayer, sdkReady]);

  // Drive the player from the stage flags; the SDK's own events update `phase`.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playbackUrl) return;
    if (shouldPlay) {
      player.load(playbackUrl);
      player.play();
    } else {
      player.pause();
    }
  }, [shouldPlay, playbackUrl, attempt, sdkReady]);

  useEffect(() => {
    playerRef.current?.setMuted(muted);
  }, [muted]);

  const display: DisplayPhase =
    phase === "unsupported" ? "unsupported"
    : !shouldPlay ? "offline"
    : phase === "error" ? "error"
    : phase === "stream-missing" || phase === "ended" ? "waiting-feed"
    : phase === "playing" ? "playing"
    : phase === "buffering" ? "buffering"
    : "loading";
  const retry = () => {
    setPhase("idle");
    setAttempt((a) => a + 1);
  };
  const showLiveBadge = stageLive && (simulated || display === "playing" || display === "buffering" || display === "loading");

  return (
    <div className="glass overflow-hidden rounded-3xl">
      {useRealPlayer ? <Script src={PLAYER_SRC} strategy="afterInteractive" onReady={onSdkReady} onError={() => setPhase("error")} /> : null}

      <div className="relative aspect-video w-full bg-black">
        {useRealPlayer ? (
          <video ref={videoRef} playsInline muted className="h-full w-full object-contain" />
        ) : (
          <MockImage hue={hue} className="drift h-full w-full" dim={!stageLive}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <span className="rounded-full border border-gold/40 bg-black/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-gold backdrop-blur">
                {simulated ? "Simulated stream · demo mode" : "No playback URL configured"}
              </span>
              <p className="text-sm uppercase tracking-[0.3em] text-bone/60">{stageLive ? label : "Stage offline"}</p>
            </div>
          </MockImage>
        )}

        {/* overlay chrome */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
          {showLiveBadge ? (
            <Badge variant="live" pulse>Live</Badge>
          ) : (
            <Badge variant="muted">Offline</Badge>
          )}
          {simulated ? (
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-bone/80 backdrop-blur">Demo</span>
          ) : null}
        </div>

        {useRealPlayer ? <PlayerOverlay phase={display} onRetry={retry} /> : null}

        {useRealPlayer && (display === "playing" || display === "buffering") ? (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => videoRef.current?.requestFullscreen?.()}
              aria-label="Fullscreen"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20"
            >
              ⛶
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PlayerOverlay({ phase, onRetry }: { phase: DisplayPhase; onRetry: () => void }) {
  if (phase === "playing") return null;
  const message =
    phase === "unsupported" ? "This browser cannot play the stream. Try Safari, Chrome or Edge."
    : phase === "error" ? "The stream could not be loaded."
    : phase === "loading" || phase === "buffering" ? "Connecting to the stage…"
    : phase === "waiting-feed" ? "The stage is live. Waiting for the video feed…"
    : "The stage is offline right now.";
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-center">
      {phase === "loading" || phase === "buffering" ? (
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" aria-hidden />
      ) : null}
      <p className="px-6 text-sm text-bone/80">{message}</p>
      {phase === "error" ? (
        <button onClick={onRetry} className="rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold hover:bg-gold/10">
          Try again
        </button>
      ) : null}
    </div>
  );
}
