import type { LiveRoom } from "@/types";

/**
 * Seed state for entertainer livestream rooms. Runtime changes (a dancer
 * going live from /dancer, viewer drift) live in the app store, which layers
 * its persisted overrides on top of these seeds.
 *
 * Every room here is mock-provider; when a real provider is wired up,
 * playbackId carries the provider's playback identifier.
 */
export const liveRooms: LiveRoom[] = [
  {
    id: "room-sapphire",
    entertainerId: "sapphire",
    title: "Come hang out with me",
    isLive: true,
    viewerCount: 238,
    startedAt: "2026-08-31T21:15:00",
    streamProvider: "mock",
  },
  {
    id: "room-jade",
    entertainerId: "jade",
    title: "Getting ready for tonight",
    isLive: true,
    viewerCount: 164,
    startedAt: "2026-08-31T21:40:00",
    streamProvider: "mock",
  },
  {
    id: "room-goldie",
    entertainerId: "goldie",
    title: "Gold everything, ask me anything",
    isLive: true,
    viewerCount: 412,
    startedAt: "2026-08-31T20:55:00",
    streamProvider: "mock",
  },
  {
    id: "room-luna",
    entertainerId: "luna",
    title: "Late Night with Luna",
    isLive: true,
    viewerCount: 97,
    startedAt: "2026-08-31T22:05:00",
    streamProvider: "mock",
  },
  {
    id: "room-amber-rose",
    entertainerId: "amber-rose",
    title: "Champagne hour",
    isLive: false,
    viewerCount: 0,
    streamProvider: "mock",
  },
  {
    id: "room-diamond",
    entertainerId: "diamond",
    title: "Diamond's room",
    isLive: false,
    viewerCount: 0,
    streamProvider: "mock",
  },
  {
    id: "room-phoenix",
    entertainerId: "phoenix",
    title: "Fire side chat",
    isLive: false,
    viewerCount: 0,
    streamProvider: "mock",
  },
  {
    id: "room-candy",
    entertainerId: "candy",
    title: "Candy's room",
    isLive: false,
    viewerCount: 0,
    streamProvider: "mock",
  },
];

/**
 * The entertainer "logged in" to the /dancer dashboard. Real auth replaces
 * this with the session's performer account.
 */
export const MOCK_DANCER_ID = "sapphire";

export function getLiveRoom(id: string): LiveRoom | undefined {
  return liveRooms.find((r) => r.id === id);
}

export function getRoomForEntertainer(
  entertainerId: string
): LiveRoom | undefined {
  return liveRooms.find((r) => r.entertainerId === entertainerId);
}
