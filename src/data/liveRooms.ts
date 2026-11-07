import { content } from "@/config/venue";
import type { LiveRoom } from "@/types";

/**
 * Seed state for entertainer livestream rooms. Runtime changes (a dancer
 * going live from /dancer, viewer drift) live in the app store, which layers
 * its persisted overrides on top of these seeds.
 */
export const liveRooms: LiveRoom[] = content.liveRooms;

/**
 * The entertainer "logged in" to the /dancer dashboard. Real auth replaces
 * this with the session's performer account.
 */
export const MOCK_DANCER_ID = content.mockDancerId;

export function getLiveRoom(id: string): LiveRoom | undefined {
  return liveRooms.find((r) => r.id === id);
}

export function getRoomForEntertainer(
  entertainerId: string
): LiveRoom | undefined {
  return liveRooms.find((r) => r.entertainerId === entertainerId);
}
