/**
 * Digital Stage domain types.
 *
 * One venue owns ONE stage. Entertainers rotate through it; the stream
 * itself keeps running while the "active" performer changes. These types are
 * shared by the demo repository (in-memory) and the Supabase repository, so
 * the UI never needs to know which one is behind the API.
 */

export type StageMode = "demo" | "production";

/** Which backing services are configured on the server. */
export interface StageCapabilities {
  supabase: boolean;
  ivs: boolean;
}

export interface StageVenue {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  address: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  /** Public HLS playback URL (safe to expose). */
  playbackUrl: string | null;
  /** Minimum viewer age enforced by the age gate; null disables the gate. */
  ageRestriction: number | null;
}

export interface StageEntertainer {
  id: string;
  /** URL-safe handle; links to the existing /girls/[slug] profile page. */
  slug: string;
  stageName: string;
  bio: string | null;
  profileImageUrl: string | null;
  /** Placeholder-art hue used when no photo is set (matches MockImage). */
  hue: number | null;
  isActive: boolean;
  /** Entertainers may only be put on the stage after explicit opt-in. */
  consentGiven: boolean;
  featuredTonight: boolean;
}

/** Provider-reported state of the video feed (distinct from stage.isLive). */
export type StreamState = "offline" | "live" | "unknown";

export interface StreamStatus {
  state: StreamState;
  /** Where the status came from; "simulated" in demo mode. */
  source: "ivs" | "simulated" | "unavailable";
  viewerCount: number | null;
  health: string | null;
  startedAt: string | null;
  checkedAt: string;
}

export interface DigitalStageState {
  id: string;
  venueId: string;
  isLive: boolean;
  activeEntertainerId: string | null;
  nextEntertainerId: string | null;
  /** Ordered ids of who follows `next`. */
  rotationQueue: string[];
  streamStartedAt: string | null;
  streamEndedAt: string | null;
  updatedAt: string;
}

export interface StreamSession {
  id: string;
  entertainerId: string | null;
  startedAt: string;
  endedAt: string | null;
  status: "live" | "ended" | "cancelled";
}

/** Everything a viewer or dashboard needs, in one payload. */
export interface StageSnapshot {
  mode: StageMode;
  capabilities: StageCapabilities;
  venue: StageVenue;
  stage: DigitalStageState;
  entertainers: StageEntertainer[];
  active: StageEntertainer | null;
  next: StageEntertainer | null;
  stream: StreamStatus;
  playback: {
    url: string | null;
    /** True when there is no real video and the UI must say so. */
    simulated: boolean;
  };
  serverTime: string;
}

export interface StageActor {
  /** Supabase auth user id; null in demo mode. */
  userId: string | null;
  label: string;
  role: "owner" | "manager" | "broadcaster" | "demo";
}

export interface RotationUpdate {
  activeEntertainerId?: string | null;
  nextEntertainerId?: string | null;
  rotationQueue?: string[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actorLabel: string;
  detail: Record<string, unknown>;
  createdAt: string;
}

/**
 * Storage boundary. `demo` keeps state in server memory; `supabase` persists
 * it in Postgres behind Row Level Security. Mutations must be called with an
 * actor that has already been authorised for the venue (see auth.ts).
 */
export interface StageRepository {
  getSnapshot(venueSlug: string): Promise<StageSnapshot | null>;
  setRotation(venueSlug: string, update: RotationUpdate, actor: StageActor): Promise<StageSnapshot>;
  startBroadcast(venueSlug: string, entertainerId: string | null, actor: StageActor): Promise<StageSnapshot>;
  endBroadcast(venueSlug: string, actor: StageActor): Promise<StageSnapshot>;
  listSessions(venueSlug: string, limit?: number): Promise<StreamSession[]>;
  listAudit(venueSlug: string, limit?: number): Promise<AuditEntry[]>;
}

/** Thrown by repositories for expected, user-facing failures. */
export class StageError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 401 | 403 | 404 | 409 | 429 | 503 = 400,
  ) {
    super(message);
    this.name = "StageError";
  }
}
