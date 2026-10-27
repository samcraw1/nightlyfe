import "server-only";
import { NextResponse } from "next/server";
import { LiveVideoError } from "@/lib/ivs/types";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { requireStaff } from "./auth";
import { StageError, type StageActor } from "./types";
import { isVenueSlug } from "./validate";

type RouteContext = { params: Promise<{ venue: string }> };

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof StageError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof LiveVideoError) {
    const status = error.code === "not_configured" ? 503 : error.code === "not_found" ? 404 : error.code === "denied" ? 502 : 502;
    return NextResponse.json({ error: error.message, code: error.code }, { status });
  }
  console.error("[digital-stage] unexpected error", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

export async function venueFromContext(context: RouteContext): Promise<string> {
  const { venue } = await context.params;
  if (!isVenueSlug(venue)) throw new StageError("Venue not found.", 404);
  return venue;
}

/**
 * Wraps a staff-only mutation route: validates the venue slug, rate limits
 * by client, resolves the actor (401/403 in production) and maps errors.
 */
export function staffRoute(
  handler: (args: { request: Request; venue: string; actor: StageActor }) => Promise<NextResponse>,
  limit = { requests: 30, windowMs: 60_000 },
) {
  return async (request: Request, context: RouteContext): Promise<NextResponse> => {
    try {
      const venue = await venueFromContext(context);
      const gate = rateLimit(`${clientKey(request)}:${new URL(request.url).pathname}`, limit.requests, limit.windowMs);
      if (!gate.ok) {
        return NextResponse.json(
          { error: "Too many requests. Try again shortly." },
          { status: 429, headers: { "retry-after": String(gate.retryAfterSec) } },
        );
      }
      const actor = await requireStaff(venue);
      return await handler({ request, venue, actor });
    } catch (error) {
      return errorResponse(error);
    }
  };
}
