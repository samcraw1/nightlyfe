import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "@/lib/digital-stage/mode";

/**
 * Request-scoped client that carries the signed-in user's session (cookies).
 * Row Level Security applies to every query made through it.
 */
export async function getServerSupabase(): Promise<SupabaseClient<Database> | null> {
  const config = getSupabaseConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot set cookies; proxy.ts refreshes the session instead.
        }
      },
    },
  });
}

/** Anonymous (public) client for reads that must work for signed-out visitors. */
export function getAnonSupabase(): SupabaseClient<Database> | null {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient<Database>(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
