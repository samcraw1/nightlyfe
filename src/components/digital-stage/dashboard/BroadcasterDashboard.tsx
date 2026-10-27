"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { StreamKeyReveal } from "@/lib/ivs/types";
import type { AuditEntry, StageActor, StageSnapshot, StreamSession } from "@/lib/digital-stage/types";
import { useStageSnapshot } from "../useStageSnapshot";
import { useStageActions } from "./useStageActions";
import RotationControls from "./RotationControls";
import ConnectionInstructions from "./ConnectionInstructions";
import CameraPreview from "./CameraPreview";
import BrowserBroadcast from "./BrowserBroadcast";

interface BroadcasterDashboardProps {
  initial: StageSnapshot;
  actor: StageActor;
}

/** Venue staff console: status, rotation, go live / end, connection help. */
export default function BroadcasterDashboard({ initial, actor }: BroadcasterDashboardProps) {
  const { snapshot, apply, refresh } = useStageSnapshot(initial, 5000);
  const actions = useStageActions(initial.venue.slug, apply);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [activity, setActivity] = useState<{ sessions: StreamSession[]; audit: AuditEntry[] } | null>(null);
  const { stage, stream, active, next, mode, capabilities, venue } = snapshot;

  const loadActivity = useCallback(async () => {
    try {
      const res = await fetch(`/api/digital-stage/${venue.slug}/activity`, { cache: "no-store" });
      if (res.ok) setActivity(await res.json());
    } catch {}
  }, [venue.slug]);

  // Re-fetch history whenever the stage changes. The fetch resolves later, so
  // the state update is not synchronous; the lint rule cannot tell.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadActivity();
  }, [loadActivity, stage.updatedAt]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const revealKey = useCallback(async (): Promise<StreamKeyReveal | null> => {
    const res = await fetch(`/api/digital-stage/${venue.slug}/stream-key`, { method: "POST" });
    if (!res.ok) return null;
    return (await res.json()) as StreamKeyReveal;
  }, [venue.slug]);

  const startLabel = active ? `Start broadcast with ${active.stageName}` : next ? `Start broadcast with ${next.stageName}` : "Start broadcast";
  const feedHint =
    stream.source === "ivs"
      ? stream.state === "live" ? "Camera feed connected" : "No camera feed yet: start your encoder"
      : stream.source === "simulated" ? "Simulated feed (demo)" : "Feed status unavailable (AWS not configured)";

  return (
    <div className="space-y-5">
      {mode === "demo" ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-xs text-gold">
          <strong>Demo mode.</strong> No sign-in, no AWS, no Supabase: state lives in this server&apos;s memory and resets on restart. Open <Link href="/live" className="underline">/live</Link> in another tab to see changes land.
        </p>
      ) : null}

      {/* status + primary action */}
      <section className="glass relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: stage.isLive
              ? "radial-gradient(80% 100% at 50% 0%, rgba(193,20,48,0.18), transparent 70%)"
              : "radial-gradient(80% 100% at 50% 0%, rgba(212,169,78,0.12), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow mb-1">{venue.name} · Digital Stage</p>
              <div className="flex flex-wrap items-center gap-2">
                {stage.isLive ? <Badge variant="live" pulse>Stage is live</Badge> : <Badge variant="muted">Stage offline</Badge>}
                <span className="text-xs text-muted">{feedHint}</span>
                {stream.source === "ivs" && stream.viewerCount !== null ? <span className="text-xs text-muted">· {stream.viewerCount} watching</span> : null}
              </div>
              {stage.isLive && active ? <p className="font-display mt-2 text-2xl text-bone">On stage: {active.stageName}</p> : null}
            </div>
            <div className="flex gap-2">
              {stage.isLive ? (
                <Button variant="blood" size="lg" onClick={() => void actions.endBroadcast()} disabled={actions.busy !== null}>
                  {actions.busy === "end" ? "Ending…" : "End broadcast"}
                </Button>
              ) : (
                <Button size="lg" onClick={() => void actions.startBroadcast(null)} disabled={actions.busy !== null || (!active && !next)}>
                  {actions.busy === "start" ? "Starting…" : startLabel}
                </Button>
              )}
            </div>
          </div>
          {actions.error ? (
            <p role="alert" className="mt-4 rounded-2xl border border-blood/40 bg-blood/10 px-4 py-2.5 text-sm text-bone">
              {actions.error}{" "}
              <button onClick={actions.clearError} className="ml-2 text-xs underline">dismiss</button>
            </p>
          ) : null}
          {!stage.isLive && !active && !next ? <p className="mt-3 text-xs text-muted">Pick who&apos;s performing or who&apos;s up next before starting.</p> : null}
        </div>
      </section>

      <RotationControls snapshot={snapshot} busy={actions.busy} onRotation={actions.setRotation} />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="glass rounded-3xl p-5 sm:p-6">
          <p className="eyebrow mb-3">Camera check</p>
          <CameraPreview onStream={setCameraStream} />
        </section>
        <ConnectionInstructions snapshot={snapshot} onReveal={revealKey} />
      </div>

      <BrowserBroadcast
        stream={cameraStream}
        enabled={mode === "production" && capabilities.ivs}
        disabledReason={mode === "demo" ? "Demo mode has no channel to send video to. The camera preview above is local only." : "AWS IVS is not configured on the server."}
        getStreamKey={revealKey}
      />

      <section className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Recent activity</p>
          <button onClick={() => void Promise.all([refresh(), loadActivity()])} className="text-xs text-gold hover:text-gold-bright">Refresh</button>
        </div>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">Performer sessions</p>
            <ul className="space-y-1.5 text-xs text-bone/85">
              {(activity?.sessions ?? []).map((s) => {
                const e = snapshot.entertainers.find((x) => x.id === s.entertainerId);
                return (
                  <li key={s.id} className="flex justify-between gap-3">
                    <span>{e?.stageName ?? "—"} <span className="text-muted">· {s.status}</span></span>
                    <span className="text-muted">{new Date(s.startedAt).toLocaleTimeString([], { timeStyle: "short" })}</span>
                  </li>
                );
              })}
              {activity && activity.sessions.length === 0 ? <li className="text-muted">No sessions yet.</li> : null}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">Audit log</p>
            <ul className="space-y-1.5 text-xs text-bone/85">
              {(activity?.audit ?? []).map((a) => (
                <li key={a.id} className="flex justify-between gap-3">
                  <span className="font-mono">{a.action} <span className="text-muted">· {a.actorLabel}</span></span>
                  <span className="text-muted">{new Date(a.createdAt).toLocaleTimeString([], { timeStyle: "short" })}</span>
                </li>
              ))}
              {activity && activity.audit.length === 0 ? <li className="text-muted">Nothing yet.</li> : null}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-muted">Signed in as {actor.label} ({actor.role}).</p>
      </section>
    </div>
  );
}
