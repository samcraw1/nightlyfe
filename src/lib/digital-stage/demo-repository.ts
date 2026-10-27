import "server-only";
import { venue as venueConfig } from "@/config/venue";
import { entertainers as seedEntertainers } from "@/data/entertainers";
import {
  StageError,
  type AuditEntry,
  type DigitalStageState,
  type StageActor,
  type StageEntertainer,
  type StageRepository,
  type StageSnapshot,
  type StageVenue,
  type StreamSession,
} from "./types";

/**
 * DEMO MODE repository.
 *
 * State lives in server memory (kept on globalThis so it survives hot
 * reloads in `next dev`). It is authoritative for every browser that talks to
 * this server, which is what makes the dashboard → viewer rotation demo work
 * across tabs and devices. It resets when the process restarts and is not
 * shared between serverless instances; production uses Supabase instead.
 *
 * Entertainers are derived from the existing mock roster so the demo links to
 * the same profile pages the rest of the site already has.
 */

interface DemoDb {
  venue: StageVenue;
  stage: DigitalStageState;
  entertainers: StageEntertainer[];
  sessions: StreamSession[];
  audit: AuditEntry[];
}

const DEMO_STAGE_ID = "demo-stage";
const DEMO_VENUE_ID = "demo-venue";

/** One performer is left without consent on file to show the gating rule. */
const NO_CONSENT_DEMO_SLUG = "raven";

function buildDb(): DemoDb {
  const now = new Date().toISOString();
  const entertainers: StageEntertainer[] = seedEntertainers
    .filter((e) => e.type !== "dj")
    .map((e) => ({
      id: e.id,
      slug: e.id,
      stageName: e.name,
      bio: e.tagline,
      profileImageUrl: null,
      hue: e.hue,
      isActive: true,
      consentGiven: e.id !== NO_CONSENT_DEMO_SLUG,
      featuredTonight: Boolean(e.workingTonight),
    }));
  // Tonight's rotation, with Goldie first so the demo matches the product story.
  const tonight = entertainers
    .filter((e) => e.featuredTonight && e.consentGiven)
    .sort((a, b) => (a.slug === "goldie" ? -1 : b.slug === "goldie" ? 1 : a.slug === "sapphire" ? -1 : b.slug === "sapphire" ? 1 : 0));
  return {
    venue: {
      id: DEMO_VENUE_ID,
      slug: venueConfig.slug,
      name: venueConfig.name,
      city: venueConfig.city,
      address: venueConfig.address,
      logoUrl: null,
      primaryColor: venueConfig.colors.gold,
      secondaryColor: venueConfig.colors.ink,
      playbackUrl: null,
      ageRestriction: venueConfig.digitalStage.ageRestriction,
    },
    stage: {
      id: DEMO_STAGE_ID,
      venueId: DEMO_VENUE_ID,
      isLive: false,
      activeEntertainerId: null,
      nextEntertainerId: tonight[0]?.id ?? null,
      rotationQueue: tonight.slice(1, 4).map((e) => e.id),
      streamStartedAt: null,
      streamEndedAt: null,
      updatedAt: now,
    },
    entertainers,
    sessions: [],
    audit: [],
  };
}

const g = globalThis as unknown as { __digitalStageDemoDb?: DemoDb };

function db(): DemoDb {
  return (g.__digitalStageDemoDb ??= buildDb());
}

function findEntertainer(state: DemoDb, id: string | null | undefined, forStage: boolean): StageEntertainer | null {
  if (!id) return null;
  const e = state.entertainers.find((x) => x.id === id);
  if (!e) throw new StageError("Entertainer not found for this venue.", 404);
  if (forStage && !e.isActive) throw new StageError(`${e.stageName} is not active.`, 409);
  if (forStage && !e.consentGiven) {
    throw new StageError(`${e.stageName} has no broadcast consent on file and cannot be put on stage.`, 409);
  }
  return e;
}

function audit(state: DemoDb, actor: StageActor, action: string, detail: Record<string, unknown>) {
  state.audit.unshift({
    id: `audit-${Date.now()}-${state.audit.length}`,
    action,
    actorLabel: actor.label,
    detail,
    createdAt: new Date().toISOString(),
  });
  state.audit.splice(200);
}

function touch(state: DemoDb) {
  state.stage.updatedAt = new Date().toISOString();
}

function snapshot(state: DemoDb): StageSnapshot {
  const byId = (id: string | null) => state.entertainers.find((e) => e.id === id) ?? null;
  return {
    mode: "demo",
    capabilities: { supabase: false, ivs: false },
    venue: state.venue,
    stage: { ...state.stage, rotationQueue: [...state.stage.rotationQueue] },
    entertainers: state.entertainers,
    active: byId(state.stage.activeEntertainerId),
    next: byId(state.stage.nextEntertainerId),
    stream: {
      state: state.stage.isLive ? "live" : "offline",
      source: "simulated",
      viewerCount: null,
      health: state.stage.isLive ? "SIMULATED" : null,
      startedAt: state.stage.streamStartedAt,
      checkedAt: new Date().toISOString(),
    },
    playback: { url: null, simulated: true },
    serverTime: new Date().toISOString(),
  };
}

function assertVenue(venueSlug: string): DemoDb {
  const state = db();
  if (venueSlug !== state.venue.slug) throw new StageError("Venue not found.", 404);
  return state;
}

/** Close the current performer's session and open one for the new performer. */
function rotateSession(state: DemoDb, entertainerId: string | null) {
  const now = new Date().toISOString();
  for (const s of state.sessions) if (s.status === "live") Object.assign(s, { status: "ended", endedAt: now });
  if (state.stage.isLive) {
    state.sessions.unshift({ id: `session-${Date.now()}`, entertainerId, startedAt: now, endedAt: null, status: "live" });
    state.sessions.splice(100);
  }
}

export const demoRepository: StageRepository = {
  async getSnapshot(venueSlug) {
    const state = db();
    return venueSlug === state.venue.slug ? snapshot(state) : null;
  },

  async setRotation(venueSlug, update, actor) {
    const state = assertVenue(venueSlug);
    const changes: Record<string, unknown> = {};

    if (update.activeEntertainerId !== undefined) {
      const e = findEntertainer(state, update.activeEntertainerId, true);
      if (state.stage.activeEntertainerId !== (e?.id ?? null)) {
        state.stage.activeEntertainerId = e?.id ?? null;
        rotateSession(state, e?.id ?? null);
        changes.active = e?.stageName ?? null;
      }
    }
    if (update.nextEntertainerId !== undefined) {
      const e = findEntertainer(state, update.nextEntertainerId, true);
      state.stage.nextEntertainerId = e?.id ?? null;
      changes.next = e?.stageName ?? null;
    }
    if (update.rotationQueue !== undefined) {
      state.stage.rotationQueue = update.rotationQueue.filter((id) => findEntertainer(state, id, true));
      changes.queue = state.stage.rotationQueue.length;
    }
    // Keep next and queue from pointing at whoever is on stage now.
    if (state.stage.nextEntertainerId && state.stage.nextEntertainerId === state.stage.activeEntertainerId) {
      state.stage.nextEntertainerId = state.stage.rotationQueue.shift() ?? null;
    }
    state.stage.rotationQueue = state.stage.rotationQueue.filter(
      (id) => id !== state.stage.activeEntertainerId && id !== state.stage.nextEntertainerId,
    );
    touch(state);
    audit(state, actor, "stage.rotation", changes);
    return snapshot(state);
  },

  async startBroadcast(venueSlug, entertainerId, actor) {
    const state = assertVenue(venueSlug);
    if (state.stage.isLive) throw new StageError("The stage is already live.", 409);
    const chosen = findEntertainer(state, entertainerId ?? state.stage.activeEntertainerId ?? state.stage.nextEntertainerId, true);
    state.stage.isLive = true;
    state.stage.streamStartedAt = new Date().toISOString();
    state.stage.streamEndedAt = null;
    state.stage.activeEntertainerId = chosen?.id ?? null;
    if (chosen && state.stage.nextEntertainerId === chosen.id) {
      state.stage.nextEntertainerId = state.stage.rotationQueue.shift() ?? null;
    }
    rotateSession(state, chosen?.id ?? null);
    touch(state);
    audit(state, actor, "stage.start", { active: chosen?.stageName ?? null });
    return snapshot(state);
  },

  async endBroadcast(venueSlug, actor) {
    const state = assertVenue(venueSlug);
    if (!state.stage.isLive) throw new StageError("The stage is not live.", 409);
    state.stage.isLive = false;
    state.stage.streamEndedAt = new Date().toISOString();
    state.stage.activeEntertainerId = null;
    rotateSession(state, null);
    touch(state);
    audit(state, actor, "stage.end", {});
    return snapshot(state);
  },

  async listSessions(venueSlug, limit = 20) {
    return assertVenue(venueSlug).sessions.slice(0, limit);
  },

  async listAudit(venueSlug, limit = 20) {
    return assertVenue(venueSlug).audit.slice(0, limit);
  },
};

/** Used by the simulated video service so "stream status" matches the stage. */
export function isDemoStageLive(): boolean {
  return db().stage.isLive;
}

/** Test/dev helper: forget all demo state. */
export function resetDemoState(): void {
  g.__digitalStageDemoDb = undefined;
}
