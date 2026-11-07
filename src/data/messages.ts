import { content } from "@/config/venue";
import type { Conversation } from "@/types";

/** Cost in credits to send one message. */
export const MESSAGE_COST = content.messaging.messageCost;
/** Preset tip amounts in credits. */
export const TIP_AMOUNTS = content.messaging.tipAmounts;
/** Starting demo balance for new visitors. */
export const STARTING_CREDITS = content.messaging.startingCredits;
export const creditPackages = content.messaging.creditPackages;

export const conversations: Conversation[] = content.conversations;
export const seedMessages = content.seedMessages;

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-08-31T22:00:00");
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
