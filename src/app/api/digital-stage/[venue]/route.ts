import { NextResponse } from "next/server";
import { getStageRepository } from "@/lib/digital-stage/repository";
import { errorResponse, venueFromContext } from "@/lib/digital-stage/http";

/** Public: the full viewer snapshot for a venue (no credentials inside). */
export async function GET(_request: Request, context: { params: Promise<{ venue: string }> }) {
  try {
    const venue = await venueFromContext(context);
    const snapshot = await getStageRepository().getSnapshot(venue);
    if (!snapshot) return NextResponse.json({ error: "Venue not found." }, { status: 404 });
    return NextResponse.json(snapshot, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
