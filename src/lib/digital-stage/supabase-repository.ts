import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, DigitalStageRow, EntertainerRow, VenuePublicRow } from "@/types/database";
import { getAnonSupabase, getServerSupabase } from "@/lib/supabase/server";
import { getCapabilities } from "./mode";
import { getLiveVideoService } from "./video";
import {
  StageError,
  type AuditEntry,
  type DigitalStageState,
  type StageEntertainer,
  type StageRepository,
  type StageSnapshot,
  type StageVenue,
  type StreamSession,
  type StreamStatus,
} from "./types";

/**
 * PRODUCTION repository backed by Supabase.
 *
 * Reads use the anon client and the public view/policies, so the snapshot
 * never contains more than a visitor is allowed to see. Mutations use the
 * caller's session client and go through the SQL functions, where the
 * staff/venue/consent rules and audit logging are enforced by Postgres.
 */

const toVenue = (v: VenuePublicRow): StageVenue => ({
  id: v.id,
  slug: v.slug,
  name: v.name,
  city: v.city,
  address: v.address,
  logoUrl: v.logo_url,
  primaryColor: v.primary_color,
  secondaryColor: v.secondary_color,
  playbackUrl: v.aws_ivs_playback_url,
  ageRestriction: v.age_restriction,
});

const toEntertainer = (e: EntertainerRow): StageEntertainer => ({
  id: e.id,
  slug: e.slug,
  stageName: e.stage_name,
  bio: e.bio,
  profileImageUrl: e.profile_image_url,
  hue: e.placeholder_hue,
  isActive: e.is_active,
  consentGiven: e.broadcast_consent_at !== null,
  featuredTonight: e.featured_tonight,
});

const toStage = (s: DigitalStageRow): DigitalStageState => ({
  id: s.id,
  venueId: s.venue_id,
  isLive: s.is_live,
  activeEntertainerId: s.active_entertainer_id,
  nextEntertainerId: s.next_entertainer_id,
  rotationQueue: s.rotation_queue ?? [],
  streamStartedAt: s.stream_started_at,
  streamEndedAt: s.stream_ended_at,
  updatedAt: s.updated_at,
});

function translateRpcError(error: { code?: string; message: string }): never {
  if (error.code === "42501") throw new StageError("You are not staff of this venue.", 403);
  if (error.code === "P0002") throw new StageError(error.message, 404);
  if (error.code === "P0001") throw new StageError(error.message, 409);
  console.error("[digital-stage] rpc failed", error);
  throw new StageError("The stage could not be updated.", 503);
}

async function requireAnon(): Promise<SupabaseClient<Database>> {
  const client = getAnonSupabase();
  if (!client) throw new StageError("Supabase is not configured.", 503);
  return client;
}

async function requireSession(): Promise<SupabaseClient<Database>> {
  const client = await getServerSupabase();
  if (!client) throw new StageError("Supabase is not configured.", 503);
  return client;
}

async function loadVenue(client: SupabaseClient<Database>, slug: string): Promise<VenuePublicRow | null> {
  const { data } = await client.from("venues_public").select("*").eq("slug", slug).maybeSingle();
  return data ?? null;
}

async function loadStageId(client: SupabaseClient<Database>, slug: string): Promise<string> {
  const venue = await loadVenue(client, slug);
  if (!venue) throw new StageError("Venue not found.", 404);
  const { data } = await client.from("digital_stages").select("id").eq("venue_id", venue.id).maybeSingle();
  if (!data) throw new StageError("This venue has no Digital Stage yet.", 404);
  return data.id;
}

/** Channel ARN is staff-only data; the server reads it with the caller's session. */
async function loadChannelArn(slug: string): Promise<string | null> {
  const session = await getServerSupabase();
  if (session) {
    const { data } = await session.from("venues").select("aws_ivs_channel_arn").eq("slug", slug).maybeSingle();
    if (data?.aws_ivs_channel_arn) return data.aws_ivs_channel_arn;
  }
  // Fallback for the default venue when the table has no ARN yet.
  return process.env.AWS_IVS_CHANNEL_ARN || null;
}

async function liveStatus(stage: DigitalStageState, channelArn: string | null): Promise<StreamStatus> {
  const checkedAt = new Date().toISOString();
  const video = getLiveVideoService();
  if (!video.configured || !channelArn) {
    return { state: "unknown", source: "unavailable", viewerCount: null, health: null, startedAt: stage.streamStartedAt, checkedAt };
  }
  try {
    const status = await video.getStreamStatus(channelArn);
    return { state: status.state, source: "ivs", viewerCount: status.viewerCount, health: status.health, startedAt: status.startedAt, checkedAt };
  } catch (error) {
    console.error("[digital-stage] IVS status check failed", error);
    return { state: "unknown", source: "unavailable", viewerCount: null, health: null, startedAt: stage.streamStartedAt, checkedAt };
  }
}

async function buildSnapshot(venueSlug: string): Promise<StageSnapshot | null> {
  const anon = await requireAnon();
  const venueRow = await loadVenue(anon, venueSlug);
  if (!venueRow) return null;
  const [{ data: stageRow }, { data: entertainerRows }] = await Promise.all([
    anon.from("digital_stages").select("*").eq("venue_id", venueRow.id).maybeSingle(),
    anon.from("entertainers").select("*").eq("venue_id", venueRow.id).order("stage_name"),
  ]);
  if (!stageRow) return null;

  const venue = toVenue(venueRow);
  const stage = toStage(stageRow);
  const entertainers = (entertainerRows ?? []).map(toEntertainer);
  const byId = (id: string | null) => entertainers.find((e) => e.id === id) ?? null;
  const playbackUrl = venue.playbackUrl || (venueSlug === (process.env.NEXT_PUBLIC_DEFAULT_VENUE_SLUG || "onyx") ? process.env.AWS_IVS_PLAYBACK_URL || null : null);

  return {
    mode: "production",
    capabilities: getCapabilities(),
    venue: { ...venue, playbackUrl },
    stage,
    entertainers,
    active: byId(stage.activeEntertainerId),
    next: byId(stage.nextEntertainerId),
    stream: await liveStatus(stage, await loadChannelArn(venueSlug)),
    playback: { url: playbackUrl, simulated: false },
    serverTime: new Date().toISOString(),
  };
}

async function afterMutation(venueSlug: string): Promise<StageSnapshot> {
  const snap = await buildSnapshot(venueSlug);
  if (!snap) throw new StageError("Venue not found.", 404);
  return snap;
}

export const supabaseRepository: StageRepository = {
  getSnapshot: buildSnapshot,

  async setRotation(venueSlug, update) {
    const session = await requireSession();
    const stageId = await loadStageId(session, venueSlug);
    // The function takes the full rotation, so merge with the current row.
    const { data: current } = await session.from("digital_stages").select("*").eq("id", stageId).single();
    if (!current) throw new StageError("Stage not found.", 404);
    // Postgres function args are nullable; the generated types cannot say so.
    const args = {
      p_stage: stageId,
      p_active: update.activeEntertainerId === undefined ? current.active_entertainer_id : update.activeEntertainerId,
      p_next: update.nextEntertainerId === undefined ? current.next_entertainer_id : update.nextEntertainerId,
      p_queue: update.rotationQueue === undefined ? current.rotation_queue : update.rotationQueue,
    } as Database["public"]["Functions"]["set_stage_rotation"]["Args"];
    const { error } = await session.rpc("set_stage_rotation", args);
    if (error) translateRpcError(error);
    return afterMutation(venueSlug);
  },

  async startBroadcast(venueSlug, entertainerId) {
    const session = await requireSession();
    const stageId = await loadStageId(session, venueSlug);
    const args = { p_stage: stageId, p_entertainer: entertainerId } as Database["public"]["Functions"]["start_stage_broadcast"]["Args"];
    const { error } = await session.rpc("start_stage_broadcast", args);
    if (error) translateRpcError(error);
    return afterMutation(venueSlug);
  },

  async endBroadcast(venueSlug) {
    const session = await requireSession();
    const stageId = await loadStageId(session, venueSlug);
    const { error } = await session.rpc("end_stage_broadcast", { p_stage: stageId });
    if (error) translateRpcError(error);
    // Best effort: also disconnect the encoder so the channel really goes dark.
    const arn = await loadChannelArn(venueSlug);
    const video = getLiveVideoService();
    if (arn && video.configured) {
      try {
        await video.stopStream(arn);
      } catch (e) {
        console.error("[digital-stage] stopStream failed", e);
      }
    }
    return afterMutation(venueSlug);
  },

  async listSessions(venueSlug, limit = 20): Promise<StreamSession[]> {
    const session = await requireSession();
    const stageId = await loadStageId(session, venueSlug);
    const { data } = await session
      .from("stream_sessions")
      .select("id, entertainer_id, started_at, ended_at, status")
      .eq("digital_stage_id", stageId)
      .order("started_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map((s) => ({ id: s.id, entertainerId: s.entertainer_id, startedAt: s.started_at, endedAt: s.ended_at, status: s.status }));
  },

  async listAudit(venueSlug, limit = 20): Promise<AuditEntry[]> {
    const session = await requireSession();
    const venue = await loadVenue(session, venueSlug);
    if (!venue) return [];
    const { data } = await session
      .from("stage_audit_log")
      .select("id, action, actor_id, detail, created_at")
      .eq("venue_id", venue.id)
      .order("id", { ascending: false })
      .limit(limit);
    return (data ?? []).map((a) => ({
      id: String(a.id),
      action: a.action,
      actorLabel: a.actor_id ? a.actor_id.slice(0, 8) : "system",
      detail: (a.detail && typeof a.detail === "object" && !Array.isArray(a.detail) ? a.detail : {}) as Record<string, unknown>,
      createdAt: a.created_at,
    }));
  },
};

/** Staff-only: channel ARN for the venue, used by the stream-key route. */
export async function getVenueChannelArn(venueSlug: string): Promise<string | null> {
  return loadChannelArn(venueSlug);
}

/** Staff-only: record a stream-key reveal in the venue's audit log. */
export async function auditStreamKeyReveal(venueSlug: string): Promise<void> {
  const session = await requireSession();
  const venue = await loadVenue(session, venueSlug);
  if (!venue) throw new StageError("Venue not found.", 404);
  const { error } = await session.rpc("log_stream_key_reveal", { p_venue: venue.id });
  if (error) translateRpcError(error);
}
