"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let cached: SupabaseClient<Database> | null | undefined;

/**
 * Browser client using the public anon key. Returns null in demo mode so
 * components can fall back to polling the API instead of Realtime.
 */
export function getBrowserSupabase(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && key ? createBrowserClient<Database>(url, key) : null;
  return cached;
}
