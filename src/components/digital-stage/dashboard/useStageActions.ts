"use client";

import { useCallback, useState } from "react";
import type { RotationUpdate, StageSnapshot } from "@/lib/digital-stage/types";

interface ApiError {
  error?: string;
}

/**
 * Thin client for the staff mutation routes. Every call returns the fresh
 * server snapshot so the dashboard never guesses at state.
 */
export function useStageActions(venueSlug: string, apply: (snapshot: StageSnapshot) => void) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(
    async (label: string, path: string, body: unknown) => {
      setBusy(label);
      setError(null);
      try {
        const res = await fetch(`/api/digital-stage/${venueSlug}/${path}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = (await res.json().catch(() => ({}))) as StageSnapshot | ApiError;
        if (!res.ok) {
          setError((json as ApiError).error ?? `Request failed (${res.status})`);
          return null;
        }
        apply(json as StageSnapshot);
        return json as StageSnapshot;
      } catch {
        setError("Could not reach the server.");
        return null;
      } finally {
        setBusy(null);
      }
    },
    [venueSlug, apply],
  );

  return {
    busy,
    error,
    clearError: () => setError(null),
    setRotation: (update: RotationUpdate) => call("rotation", "rotation", update),
    startBroadcast: (entertainerId: string | null) => call("start", "broadcast", { action: "start", entertainerId }),
    endBroadcast: () => call("end", "broadcast", { action: "end" }),
  };
}
