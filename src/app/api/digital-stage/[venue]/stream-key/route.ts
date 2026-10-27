import { NextResponse } from "next/server";
import { staffRoute } from "@/lib/digital-stage/http";
import { getStageMode } from "@/lib/digital-stage/mode";
import { auditStreamKeyReveal, getVenueChannelArn } from "@/lib/digital-stage/supabase-repository";
import { getLiveVideoService } from "@/lib/digital-stage/video";
import { StageError } from "@/lib/digital-stage/types";

/**
 * Staff: reveal the venue's IVS ingest endpoint and stream key.
 *
 * The key is fetched from AWS on demand (never stored in our database),
 * returned once over this authenticated route, and every reveal is written
 * to the audit log. The dashboard shows it masked and never persists it.
 * Tight rate limit: a stream key is a credential.
 */
export const POST = staffRoute(async ({ venue }) => {
  const video = getLiveVideoService();

  if (getStageMode() === "demo") {
    const reveal = await video.revealStreamKey("demo");
    return NextResponse.json({ ...reveal, note: "Demo mode: placeholder values, no real channel." });
  }

  if (!video.configured) {
    throw new StageError("AWS IVS is not configured on this server. Add AWS_REGION and credentials.", 503);
  }
  const channelArn = await getVenueChannelArn(venue);
  if (!channelArn) throw new StageError("This venue has no IVS channel ARN yet.", 404);

  const reveal = await video.revealStreamKey(channelArn);
  await auditStreamKeyReveal(venue);
  return NextResponse.json(reveal, { headers: { "cache-control": "no-store" } });
}, { requests: 5, windowMs: 60_000 });
