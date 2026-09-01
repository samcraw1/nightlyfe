"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { getEntertainer } from "@/data/entertainers";
import { getConversation } from "@/data/messages";
import MessageThread from "@/components/messages/MessageThread";

/**
 * Conversation ids follow "conv-<entertainerId>". Seeded conversations exist
 * in mock data; messaging a performer for the first time simply opens an
 * empty thread for them.
 */
export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const conversation = getConversation(id);
  const entertainerId = conversation?.entertainerId ?? id.replace(/^conv-/, "");
  const girl = getEntertainer(entertainerId);
  if (!girl) notFound();

  return <MessageThread conversationId={`conv-${girl.id}`} girl={girl} />;
}
