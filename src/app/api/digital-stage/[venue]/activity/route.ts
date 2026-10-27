import { NextResponse } from "next/server";
import { getStageRepository } from "@/lib/digital-stage/repository";
import { staffRoute } from "@/lib/digital-stage/http";

/** Staff: recent performer sessions and audit entries for the dashboard. */
export const GET = staffRoute(async ({ venue }) => {
  const repo = getStageRepository();
  const [sessions, audit] = await Promise.all([repo.listSessions(venue, 15), repo.listAudit(venue, 15)]);
  return NextResponse.json({ sessions, audit }, { headers: { "cache-control": "no-store" } });
}, { requests: 60, windowMs: 60_000 });
