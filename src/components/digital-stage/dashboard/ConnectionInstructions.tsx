"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { StreamKeyReveal } from "@/lib/ivs/types";
import type { StageSnapshot } from "@/lib/digital-stage/types";

/**
 * How to point an encoder at the venue's channel. The stream key is a
 * credential: it is fetched on demand over an authenticated route, shown
 * masked, auto-hidden after a minute, never stored, and every reveal is
 * audited server-side.
 */
export default function ConnectionInstructions({
  snapshot,
  onReveal,
}: {
  snapshot: StageSnapshot;
  onReveal: () => Promise<StreamKeyReveal | null>;
}) {
  const [reveal, setReveal] = useState<StreamKeyReveal | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mode, capabilities, playback } = snapshot;

  const fetchKey = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await onReveal();
      if (r) {
        setReveal(r);
        setShowKey(false);
        setTimeout(() => setReveal(null), 60_000);
      } else {
        setError("Could not fetch the stream key.");
      }
    } finally {
      setBusy(false);
    }
  };

  const copy = (value: string) => navigator.clipboard?.writeText(value).catch(() => {});

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <p className="eyebrow mb-3">Connect the camera</p>

      {mode === "demo" ? (
        <p className="mb-4 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-xs text-gold">
          Demo mode: there is no real channel. These steps describe the production flow.
        </p>
      ) : !capabilities.ivs ? (
        <p className="mb-4 rounded-2xl border border-blood/40 bg-blood/10 px-4 py-2.5 text-xs text-bone">
          AWS IVS is not configured on the server, so the stream key cannot be fetched. Add <code>AWS_REGION</code> and credentials (see DIGITAL_STAGE_SETUP.md).
        </p>
      ) : null}

      <ol className="space-y-3 text-sm text-bone/85">
        <li className="flex gap-3"><span className="font-bold text-gold">1.</span><span>Use a dedicated, consent-based broadcast device (a phone, tablet or laptop with OBS). Never a security camera.</span></li>
        <li className="flex gap-3"><span className="font-bold text-gold">2.</span><span>In OBS, Streamlabs or Larix: choose <em>Custom</em> service, paste the server URL and stream key below. Recommended: 1280×720, 30 fps, 2.5–4 Mbps, keyframe every 2 s.</span></li>
        <li className="flex gap-3"><span className="font-bold text-gold">3.</span><span>Press <strong>Start broadcast</strong> here, then start streaming in the encoder. Viewers see video within a few seconds.</span></li>
        <li className="flex gap-3"><span className="font-bold text-gold">4.</span><span>Swap performers with the controls above. Keep the encoder running between sets.</span></li>
      </ol>

      <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs">
        <Row label="Server (RTMPS)" value={reveal?.rtmpsUrl ?? (reveal?.simulated ? "rtmps://(demo: no channel)" : null)} onCopy={copy} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-muted">Stream key</span>
          <div className="flex items-center gap-2">
            {reveal ? (
              <>
                <code className="text-bone">{showKey ? reveal.streamKey : "•".repeat(Math.min(24, reveal.streamKey.length))}</code>
                <button onClick={() => setShowKey((s) => !s)} className="text-gold hover:text-gold-bright">{showKey ? "Hide" : "Show"}</button>
                <button onClick={() => copy(reveal.streamKey)} className="text-gold hover:text-gold-bright">Copy</button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={fetchKey} disabled={busy || (mode === "production" && !capabilities.ivs)}>
                {busy ? "Fetching…" : "Reveal stream key"}
              </Button>
            )}
          </div>
        </div>
        <Row label="Playback URL" value={playback.url ?? (playback.simulated ? "(demo: simulated)" : "(not configured)")} onCopy={copy} />
        {reveal ? <p className="text-[10px] text-muted">Shown for 60 seconds. This reveal has been recorded in the audit log.</p> : null}
        {error ? <p className="text-blood">{error}</p> : null}
      </div>
    </section>
  );
}

function Row({ label, value, onCopy }: { label: string; value: string | null; onCopy: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <code className="max-w-[60vw] truncate text-bone sm:max-w-xs">{value ?? "— reveal to see —"}</code>
        {value ? <button onClick={() => onCopy(value)} className="text-gold hover:text-gold-bright">Copy</button> : null}
      </div>
    </div>
  );
}
