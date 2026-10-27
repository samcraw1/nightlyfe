"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import type { StreamKeyReveal } from "@/lib/ivs/types";

/**
 * Broadcast straight from this device with the Amazon IVS Web Broadcast SDK
 * (WebRTC ingest to an IVS low-latency channel). Supported on current
 * Chrome, Edge and Safari; the SDK is loaded only when staff press Go.
 *
 * Trade-off, stated plainly: the SDK needs the channel's stream key on the
 * broadcasting device. We keep that to the authenticated staff browser, fetch
 * it over the audited route at the moment of going live, hold it in memory
 * only, and the dashboard never writes it to storage. If that is not
 * acceptable for a venue, use the OBS/RTMPS path instead.
 *
 * Not exercised against a real channel in this scaffold (no AWS credentials
 * were available); see DIGITAL_STAGE_SETUP.md, "Verification".
 */

interface BroadcastClientLike {
  attachPreview(canvas: HTMLCanvasElement): void;
  addVideoInputDevice(stream: MediaStream, name: string, position: { index: number }): Promise<void>;
  addAudioInputDevice(stream: MediaStream, name: string): Promise<void>;
  startBroadcast(streamKey: string, ingestEndpoint?: string): Promise<unknown>;
  stopBroadcast(): void;
  delete?: () => void;
}

interface BrowserBroadcastProps {
  stream: MediaStream | null;
  enabled: boolean;
  disabledReason?: string;
  getStreamKey: () => Promise<StreamKeyReveal | null>;
}

export default function BrowserBroadcast({ stream, enabled, disabledReason, getStreamKey }: BrowserBroadcastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clientRef = useRef<BroadcastClientLike | null>(null);
  const [state, setState] = useState<"idle" | "starting" | "live" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const stop = useCallback(() => {
    try {
      clientRef.current?.stopBroadcast();
      clientRef.current?.delete?.();
    } catch {}
    clientRef.current = null;
    setState("idle");
  }, []);

  useEffect(() => stop, [stop]);

  const start = async () => {
    if (!stream) {
      setMessage("Start the camera preview first.");
      return;
    }
    setState("starting");
    setMessage(null);
    try {
      const reveal = await getStreamKey();
      if (!reveal || reveal.simulated || !reveal.ingestEndpoint) {
        throw new Error("No real channel is available to broadcast to.");
      }
      const sdk = await import("amazon-ivs-web-broadcast");
      const IVSBroadcastClient = sdk.default;
      const client = IVSBroadcastClient.create({
        ingestEndpoint: reveal.ingestEndpoint,
        streamConfig: IVSBroadcastClient.STANDARD_LANDSCAPE,
      }) as unknown as BroadcastClientLike;
      if (canvasRef.current) client.attachPreview(canvasRef.current);
      await client.addVideoInputDevice(new MediaStream(stream.getVideoTracks()), "camera", { index: 0 });
      if (stream.getAudioTracks().length) {
        await client.addAudioInputDevice(new MediaStream(stream.getAudioTracks()), "mic");
      }
      clientRef.current = client;
      await client.startBroadcast(reveal.streamKey);
      setState("live");
    } catch (err) {
      console.error("[digital-stage] browser broadcast failed", err);
      setMessage(err instanceof Error ? err.message : "Broadcast could not start.");
      stop();
      setState("error");
    }
  };

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <p className="eyebrow mb-2">Broadcast from this device</p>
      <p className="mb-4 text-xs text-muted">
        Uses the Amazon IVS Web Broadcast SDK. Best on a phone or tablet on Wi-Fi, mounted on a tripod. For the most reliable picture use OBS (above).
      </p>
      {!enabled ? (
        <p className="rounded-2xl border border-white/10 px-4 py-2.5 text-xs text-muted">{disabledReason ?? "Not available."}</p>
      ) : (
        <>
          <canvas ref={canvasRef} className={`w-full rounded-2xl bg-black ${state === "live" || state === "starting" ? "aspect-video" : "hidden"}`} />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {state === "live" ? (
              <Button variant="blood" onClick={stop}>Stop broadcasting</Button>
            ) : (
              <Button onClick={start} disabled={state === "starting" || !stream}>
                {state === "starting" ? "Connecting…" : "Go live from this device"}
              </Button>
            )}
            {state === "live" ? <span className="text-xs font-bold uppercase tracking-wider text-blood">● Sending video</span> : null}
          </div>
          {message ? <p className="mt-3 text-xs text-blood">{message}</p> : null}
        </>
      )}
    </section>
  );
}
