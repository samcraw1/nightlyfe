"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Entertainer } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { CoinIcon } from "@/components/layout/icons";
import { MESSAGE_COST, TIP_AMOUNTS } from "@/data/messages";
import { useApp } from "@/lib/store";
import { newId } from "@/lib/format";

interface MessageThreadProps {
  conversationId: string;
  girl: Entertainer;
}

const cannedReplies = [
  "Aww thank you! 💛",
  "You know I'll be looking for you tonight",
  "That just made my night ✨",
  "Come say hi at the stage later!",
];

export default function MessageThread({ conversationId, girl }: MessageThreadProps) {
  const {
    hydrated,
    credits,
    spendCredits,
    messages,
    addMessage,
    setBuyCreditsOpen,
  } = useApp();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const thread = messages.filter((m) => m.conversationId === conversationId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread.length]);

  const reply = () => {
    setTimeout(() => {
      addMessage({
        id: newId("msg"),
        conversationId,
        from: "entertainer",
        text: cannedReplies[Math.floor(Math.random() * cannedReplies.length)],
        sentAt: new Date().toISOString(),
      });
    }, 1400);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    if (!spendCredits(MESSAGE_COST)) {
      setBuyCreditsOpen(true);
      return;
    }
    addMessage({
      id: newId("msg"),
      conversationId,
      from: "user",
      text,
      sentAt: new Date().toISOString(),
    });
    setDraft("");
    reply();
  };

  const tip = (amount: number) => {
    if (!spendCredits(amount)) {
      setBuyCreditsOpen(true);
      return;
    }
    addMessage({
      id: newId("msg"),
      conversationId,
      from: "user",
      text: "Sent a tip 🥂",
      sentAt: new Date().toISOString(),
      isTip: true,
      tipAmount: amount,
    });
    reply();
  };

  return (
    <div className="flex h-[calc(100svh-4rem)] flex-col md:h-[calc(100svh-4rem)]">
      {/* thread header */}
      <div className="border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/messages"
            aria-label="Back to messages"
            className="mr-1 text-gold hover:text-gold-bright"
          >
            ←
          </Link>
          <Link href={`/girls/${girl.id}`} className="flex items-center gap-3">
            <MockImage
              hue={girl.hue}
              label={girl.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-display text-lg leading-tight text-bone">
                {girl.name}
              </p>
              {girl.workingTonight ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  ● Working tonight
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider text-muted">
                  Off tonight
                </span>
              )}
            </div>
          </Link>
          <button
            onClick={() => setBuyCreditsOpen(true)}
            className="ml-auto flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-bold text-gold transition hover:bg-gold/10"
          >
            <CoinIcon className="h-3.5 w-3.5" />
            <span suppressHydrationWarning>{hydrated ? credits : "—"}</span>
          </button>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-6 sm:px-6">
          <div className="mb-6 text-center">
            <Badge variant="muted">
              Messages cost {MESSAGE_COST} credits · Demo only
            </Badge>
          </div>
          {thread.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.isTip ? (
                <div className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-center">
                  <p className="text-xs font-bold text-gold">
                    🥂 Tipped {m.tipAmount} credits
                  </p>
                </div>
              ) : (
                <div
                  className={`max-w-[78%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-lg bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink"
                      : "rounded-bl-lg bg-white/8 text-bone/90"
                  }`}
                >
                  {m.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* composer */}
      <div className="border-t border-line bg-ink/90 pb-20 backdrop-blur-xl md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted">
              Tip:
            </span>
            {TIP_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => tip(amount)}
                className="rounded-full border border-gold/30 px-3 py-1 text-[11px] font-bold text-gold transition hover:bg-gold/10"
              >
                {amount}
              </button>
            ))}
            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted">
              Send · {MESSAGE_COST} credits
            </span>
          </div>
          <div className="flex items-end gap-2">
            <button
              aria-label="Attach media (demo)"
              title="Media attachments coming soon"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-muted transition hover:border-gold/40 hover:text-gold"
            >
              +
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Message ${girl.name}…`}
              aria-label={`Message ${girl.name}`}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-bone placeholder:text-muted focus:border-gold/50 focus:outline-none"
            />
            <button
              onClick={send}
              className="rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:brightness-110"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
