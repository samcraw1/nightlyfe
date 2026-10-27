import "server-only";
import type { StageCapabilities, StageMode } from "./types";

/**
 * Runtime mode is decided on the server from environment variables only.
 *
 *   demo        no Supabase configured (or DIGITAL_STAGE_MODE=demo). State
 *               lives in server memory; video is a labelled placeholder.
 *   production  Supabase configured: authoritative state in Postgres. IVS is
 *               optional on top (playback works from the stored URL; live
 *               status checks and stream-key reveal need AWS credentials).
 */

export const DEFAULT_VENUE_SLUG = process.env.NEXT_PUBLIC_DEFAULT_VENUE_SLUG || "onyx";

export function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? { url, anonKey } : null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export function isIvsConfigured(): boolean {
  if (!process.env.AWS_REGION) return false;
  if (process.env.AWS_USE_DEFAULT_CREDENTIAL_CHAIN === "true") return true;
  return Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

export function getCapabilities(): StageCapabilities {
  const forcedDemo = process.env.DIGITAL_STAGE_MODE === "demo";
  return {
    supabase: !forcedDemo && isSupabaseConfigured(),
    ivs: !forcedDemo && isIvsConfigured(),
  };
}

export function getStageMode(): StageMode {
  return getCapabilities().supabase ? "production" : "demo";
}
