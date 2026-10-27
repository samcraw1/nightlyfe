import { NextResponse } from "next/server";
import { getStageRepository } from "@/lib/digital-stage/repository";
import { staffRoute } from "@/lib/digital-stage/http";
import { StageError, type RotationUpdate } from "@/lib/digital-stage/types";
import { isEntityId, isIdList, readJson } from "@/lib/digital-stage/validate";

/**
 * Staff: change who is on stage / up next without touching the stream.
 * Body: { activeEntertainerId?: id|null, nextEntertainerId?: id|null, rotationQueue?: id[] }
 */
export const POST = staffRoute(async ({ request, venue, actor }) => {
  const body = await readJson(request);
  const update: RotationUpdate = {};

  if ("activeEntertainerId" in body) {
    if (body.activeEntertainerId !== null && !isEntityId(body.activeEntertainerId)) throw new StageError("Invalid active entertainer.");
    update.activeEntertainerId = body.activeEntertainerId as string | null;
  }
  if ("nextEntertainerId" in body) {
    if (body.nextEntertainerId !== null && !isEntityId(body.nextEntertainerId)) throw new StageError("Invalid next entertainer.");
    update.nextEntertainerId = body.nextEntertainerId as string | null;
  }
  if ("rotationQueue" in body) {
    if (!isIdList(body.rotationQueue)) throw new StageError("Invalid rotation queue.");
    update.rotationQueue = body.rotationQueue;
  }
  if (Object.keys(update).length === 0) throw new StageError("Nothing to update.");

  const snapshot = await getStageRepository().setRotation(venue, update, actor);
  return NextResponse.json(snapshot);
});
