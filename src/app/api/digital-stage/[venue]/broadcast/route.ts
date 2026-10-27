import { NextResponse } from "next/server";
import { getStageRepository } from "@/lib/digital-stage/repository";
import { staffRoute } from "@/lib/digital-stage/http";
import { StageError } from "@/lib/digital-stage/types";
import { isEntityId, readJson } from "@/lib/digital-stage/validate";

/**
 * Staff: start or end the venue broadcast.
 * Body: { action: "start", entertainerId?: id } | { action: "end" }
 *
 * "start" marks the stage live and opens a session for the chosen performer.
 * The actual video comes from the encoder (OBS/RTMPS or the browser SDK)
 * connecting to the IVS channel; the viewer page reports the provider-side
 * state separately in `stream.state`.
 */
export const POST = staffRoute(async ({ request, venue, actor }) => {
  const body = await readJson(request);
  const repo = getStageRepository();

  if (body.action === "start") {
    const entertainerId = body.entertainerId === undefined || body.entertainerId === null ? null : body.entertainerId;
    if (entertainerId !== null && !isEntityId(entertainerId)) throw new StageError("Invalid entertainer.");
    return NextResponse.json(await repo.startBroadcast(venue, entertainerId, actor));
  }
  if (body.action === "end") {
    return NextResponse.json(await repo.endBroadcast(venue, actor));
  }
  throw new StageError('action must be "start" or "end".');
}, { requests: 10, windowMs: 60_000 });
