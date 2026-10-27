"use client";

import { useEffect, useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";

const KEY = "digital-stage-age-ack";

/**
 * Simple age interstitial. The acknowledgement is a per-viewer convenience
 * kept in sessionStorage; it is not identity verification (see the setup
 * doc's compliance section).
 */
export default function AgeGate({ minAge, venueName, children }: { minAge: number | null; venueName: string; children: ReactNode }) {
  const [acknowledged, setAcknowledged] = useState<boolean | null>(minAge ? null : true);

  useEffect(() => {
    if (!minAge) return;
    let ok = false;
    try {
      ok = sessionStorage.getItem(KEY) === String(minAge);
    } catch {}
    // One-time read after mount keeps server and client markup identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAcknowledged(ok);
  }, [minAge]);

  const accept = () => {
    try {
      sessionStorage.setItem(KEY, String(minAge));
    } catch {}
    setAcknowledged(true);
  };

  if (acknowledged) return <>{children}</>;
  if (acknowledged === null) return <div className="aspect-video w-full rounded-3xl bg-black/40" aria-hidden />;

  return (
    <div className="glass flex aspect-video w-full flex-col items-center justify-center rounded-3xl p-8 text-center">
      <p className="eyebrow mb-2">Age restricted</p>
      <p className="font-display text-2xl text-bone">You must be {minAge}+ to watch the {venueName} stage</p>
      <p className="mt-2 max-w-sm text-sm text-muted">By continuing you confirm you are at least {minAge} years old and it is legal to view this content where you are.</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={accept}>I am {minAge} or older</Button>
        <Button href="/" variant="outline">Leave</Button>
      </div>
    </div>
  );
}
