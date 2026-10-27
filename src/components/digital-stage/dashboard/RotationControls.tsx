"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { RotationUpdate, StageSnapshot } from "@/lib/digital-stage/types";
import PerformerAvatar from "../PerformerAvatar";

interface RotationControlsProps {
  snapshot: StageSnapshot;
  busy: string | null;
  onRotation: (update: RotationUpdate) => Promise<unknown>;
}

/**
 * Who is on stage and who is next. Changing either never touches the
 * stream: the encoder keeps sending video while the label swaps for viewers.
 */
export default function RotationControls({ snapshot, busy, onRotation }: RotationControlsProps) {
  const { stage, entertainers, active, next } = snapshot;
  const eligible = entertainers.filter((e) => e.isActive);
  const queue = stage.rotationQueue;

  const bringNextOn = () => {
    if (!next) return;
    void onRotation({ activeEntertainerId: next.id, nextEntertainerId: queue[0] ?? null, rotationQueue: queue.slice(1) });
  };

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <p className="eyebrow mb-4">Who&apos;s on stage</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">Performing now</span>
          <select
            value={stage.activeEntertainerId ?? ""}
            disabled={busy !== null}
            onChange={(e) => void onRotation({ activeEntertainerId: e.target.value || null })}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-base text-bone focus:border-gold/50 focus:outline-none"
          >
            <option value="">— Nobody / between sets —</option>
            {eligible.map((e) => (
              <option key={e.id} value={e.id} disabled={!e.consentGiven}>
                {e.stageName}{!e.consentGiven ? " (no consent on file)" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted">Up next</span>
          <select
            value={stage.nextEntertainerId ?? ""}
            disabled={busy !== null}
            onChange={(e) => void onRotation({ nextEntertainerId: e.target.value || null })}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-base text-bone focus:border-gold/50 focus:outline-none"
          >
            <option value="">— Not set —</option>
            {eligible
              .filter((e) => e.id !== stage.activeEntertainerId)
              .map((e) => (
                <option key={e.id} value={e.id} disabled={!e.consentGiven}>
                  {e.stageName}{!e.consentGiven ? " (no consent on file)" : ""}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {active ? (
          <div className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-3 text-sm text-bone">
            <PerformerAvatar entertainer={active} className="h-7 w-7 rounded-full" />
            {active.stageName}
            <Badge variant="live" pulse>On stage</Badge>
          </div>
        ) : null}
        <Button size="lg" onClick={bringNextOn} disabled={!next || busy !== null} className="flex-1 sm:flex-none">
          {next ? `Bring ${next.stageName} on →` : "Set who's up next"}
        </Button>
      </div>

      <div className="mt-5 border-t border-white/5 pt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">After that</p>
        {queue.length > 0 ? (
          <ol className="space-y-2">
            {queue.map((id, i) => {
              const e = entertainers.find((x) => x.id === id);
              if (!e) return null;
              return (
                <li key={id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-center text-xs font-bold text-gold">{i + 2}</span>
                  <PerformerAvatar entertainer={e} className="h-7 w-7 rounded-full" />
                  <span className="flex-1 text-bone">{e.stageName}</span>
                  <button
                    disabled={busy !== null}
                    onClick={() => void onRotation({ rotationQueue: queue.filter((x) => x !== id) })}
                    className="text-xs text-muted hover:text-blood"
                    aria-label={`Remove ${e.stageName} from the queue`}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-sm text-muted">Queue is empty.</p>
        )}
        <AddToQueue snapshot={snapshot} busy={busy} onRotation={onRotation} />
      </div>
    </section>
  );
}

function AddToQueue({ snapshot, busy, onRotation }: RotationControlsProps) {
  const { stage, entertainers } = snapshot;
  const taken = new Set([stage.activeEntertainerId, stage.nextEntertainerId, ...stage.rotationQueue]);
  const options = entertainers.filter((e) => e.isActive && e.consentGiven && !taken.has(e.id));
  if (options.length === 0) return null;
  return (
    <select
      value=""
      disabled={busy !== null}
      onChange={(e) => e.target.value && void onRotation({ rotationQueue: [...stage.rotationQueue, e.target.value] })}
      className="mt-3 w-full rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-3 text-sm text-muted focus:border-gold/50 focus:outline-none"
    >
      <option value="">+ Add to queue…</option>
      {options.map((e) => (
        <option key={e.id} value={e.id}>{e.stageName}</option>
      ))}
    </select>
  );
}
