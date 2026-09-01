import type { Conversation, Message } from "@/types";

/** Cost in credits to send one message. */
export const MESSAGE_COST = 5;

/** Preset tip amounts in credits. */
export const TIP_AMOUNTS = [10, 25, 50];

/** Starting demo balance for new visitors. */
export const STARTING_CREDITS = 75;

export const creditPackages = [
  { id: "starter", credits: 100, price: 20 },
  { id: "regular", credits: 300, price: 50, popular: true },
  { id: "vip", credits: 700, price: 100 },
];

export const conversations: Conversation[] = [
  {
    id: "conv-sapphire",
    entertainerId: "sapphire",
    lastMessage: "See you at the midnight showcase? 🖤",
    lastMessageAt: "2026-08-31T20:45:00",
    unread: 2,
    paid: true,
  },
  {
    id: "conv-goldie",
    entertainerId: "goldie",
    lastMessage: "Thank you for the tip! You're the best 💛",
    lastMessageAt: "2026-08-31T18:12:00",
    unread: 1,
    paid: true,
  },
  {
    id: "conv-jade",
    entertainerId: "jade",
    lastMessage: "New routine drops Friday. Front row?",
    lastMessageAt: "2026-08-30T23:30:00",
    unread: 0,
    paid: true,
  },
  {
    id: "conv-luna",
    entertainerId: "luna",
    lastMessage: "I'm on late shift tonight, come through after 12",
    lastMessageAt: "2026-08-29T21:05:00",
    unread: 0,
    paid: false,
  },
];

export const seedMessages: Message[] = [
  // Sapphire
  { id: "m1", conversationId: "conv-sapphire", from: "user", text: "Are you performing tonight?", sentAt: "2026-08-31T19:58:00" },
  { id: "m2", conversationId: "conv-sapphire", from: "entertainer", text: "I'm on at 10 and closing the midnight showcase ✨", sentAt: "2026-08-31T20:10:00" },
  { id: "m3", conversationId: "conv-sapphire", from: "user", text: "Saving you a seat at my table then", sentAt: "2026-08-31T20:31:00" },
  { id: "m4", conversationId: "conv-sapphire", from: "entertainer", text: "See you at the midnight showcase? 🖤", sentAt: "2026-08-31T20:45:00" },
  // Goldie
  { id: "m5", conversationId: "conv-goldie", from: "user", text: "That set last night was incredible", sentAt: "2026-08-31T17:40:00" },
  { id: "m6", conversationId: "conv-goldie", from: "user", text: "Sent a little something 🥂", sentAt: "2026-08-31T17:41:00", isTip: true, tipAmount: 25 },
  { id: "m7", conversationId: "conv-goldie", from: "entertainer", text: "Thank you for the tip! You're the best 💛", sentAt: "2026-08-31T18:12:00" },
  // Jade
  { id: "m8", conversationId: "conv-jade", from: "entertainer", text: "New routine drops Friday. Front row?", sentAt: "2026-08-30T23:30:00" },
  // Luna
  { id: "m9", conversationId: "conv-luna", from: "entertainer", text: "I'm on late shift tonight, come through after 12", sentAt: "2026-08-29T21:05:00" },
];

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
