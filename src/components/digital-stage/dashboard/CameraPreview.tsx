"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

/**
 * Local camera/microphone preview using getUserMedia. This is real device
 * capture (so staff can frame the shot), but on its own it sends nothing
 * anywhere. Browser broadcasting reuses the stream it produces.
 */
export default function CameraPreview({ onStream }: { onStream?: (stream: MediaStream | null) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<"idle" | "starting" | "on" | "denied" | "unsupported" | "error">("idle");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    onStream?.(null);
    setState("idle");
  }, [onStream]);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      setMessage("This browser does not support camera capture.");
      return;
    }
    setState("starting");
    setMessage(null);
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      const all = await navigator.mediaDevices.enumerateDevices();
      setDevices(all.filter((d) => d.kind === "videoinput"));
      onStream?.(stream);
      setState("on");
    } catch (err) {
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setState("denied");
        setMessage("Camera access was blocked. Allow camera and microphone for this site, then try again.");
      } else if (name === "NotFoundError") {
        setState("error");
        setMessage("No camera was found on this device.");
      } else {
        setState("error");
        setMessage("The camera could not be started.");
      }
    }
  }, [deviceId, onStream]);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
        {state !== "on" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center">
            <p className="text-sm text-bone/80">{message ?? "Preview the camera this device will broadcast from."}</p>
            <Button size="sm" onClick={start} disabled={state === "starting" || state === "unsupported"}>
              {state === "starting" ? "Starting…" : state === "denied" || state === "error" ? "Try again" : "Start preview"}
            </Button>
          </div>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            Local preview · not broadcasting
          </span>
        )}
      </div>
      {state === "on" ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {devices.length > 1 ? (
            <select
              value={deviceId}
              onChange={(e) => {
                setDeviceId(e.target.value);
                setTimeout(() => void start(), 0);
              }}
              className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-bone focus:border-gold/50 focus:outline-none"
            >
              {devices.map((d, i) => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>
              ))}
            </select>
          ) : null}
          <Button size="sm" variant="outline" onClick={stop}>Stop preview</Button>
        </div>
      ) : null}
    </div>
  );
}
