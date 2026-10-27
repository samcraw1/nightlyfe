import "server-only";
import { getServerSupabase } from "@/lib/supabase/server";
import { getStageMode } from "./mode";
import { StageError, type StageActor } from "./types";

/**
 * Who is allowed to run a venue's stage.
 *
 * Production: a signed-in Supabase user with a venue_staff row for the venue.
 * Postgres re-checks this inside every mutation function, so this guard is
 * for routing and UX; it is not the only line of defence.
 *
 * Demo: there is no auth. The dashboard is open and says so on screen.
 */
export async function requireStaff(venueSlug: string): Promise<StageActor> {
  if (getStageMode() === "demo") {
    return { userId: null, label: "Demo staff", role: "demo" };
  }

  const supabase = await getServerSupabase();
  if (!supabase) throw new StageError("Supabase is not configured.", 503);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new StageError("Please sign in.", 401);

  const { data: venue } = await supabase.from("venues_public").select("id").eq("slug", venueSlug).maybeSingle();
  if (!venue) throw new StageError("Venue not found.", 404);

  const { data: role } = await supabase.rpc("my_venue_role", { p_venue: venue.id });
  if (!role) throw new StageError("You are not staff of this venue.", 403);

  return { userId: auth.user.id, label: auth.user.email ?? auth.user.id, role };
}
