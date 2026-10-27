"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StageSnapshot } from "@/lib/digital-stage/types";
import { getBrowserSupabase } from "@/lib/supabase/client";

/**
 * Keeps a StageSnapshot current.
 *
 * - Always polls the public API (works in demo mode and as a safety net).
 * - In production also subscribes to Supabase Realtime on digital_stages so a
 *   performer swap reaches viewers within a second instead of a poll cycle.
 *
 * Callers can push a fresh snapshot (e.g. the dashboard after a mutation)
 * via `apply`.
 */
export function useStageSnapshot(initial: StageSnapshot, pollMs = 8000) {
  const [snapshot, setSnapshot] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const slug = initial.venue.slug;
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/digital-stage/${slug}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSnapshot((await res.json()) as StageSnapshot);
      setError(null);
    } catch {
      setError("Live status is temporarily unavailable.");
    } finally {
      inFlight.current = false;
    }
  }, [slug]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, pollMs);
    const onVisible = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh, pollMs]);

  useEffect(() => {
    if (initial.mode !== "production") return;
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel(`digital-stage:${initial.stage.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "digital_stages", filter: `id=eq.${initial.stage.id}` },
        () => void refresh(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [initial.mode, initial.stage.id, refresh]);

  return { snapshot, error, refresh, apply: setSnapshot };
}
