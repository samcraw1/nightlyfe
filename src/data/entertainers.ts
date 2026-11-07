import { content } from "@/config/venue";
import type { Entertainer } from "@/types";

/** The active club's roster. */
export const entertainers: Entertainer[] = content.entertainers;

export function getEntertainer(id: string): Entertainer | undefined {
  return entertainers.find((e) => e.id === id);
}
