"use client";

import Link from "next/link";
import { conversations, formatMessageTime } from "@/data/messages";
import { getEntertainer } from "@/data/entertainers";
import PageHeader from "@/components/ui/PageHeader";
import MockImage from "@/components/ui/MockImage";
import { CoinIcon } from "@/components/layout/icons";
import { useApp } from "@/lib/store";

export default function MessagesPage() {
  const { credits, hydrated, setBuyCreditsOpen } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Direct line"
        title="Messages"
        description="Talk directly with your favorite entertainers. Messages and tips use credits."
      >
        <button
          onClick={() => setBuyCreditsOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10"
        >
          <CoinIcon className="h-4 w-4" />
          Balance:{" "}
          <span suppressHydrationWarning>{hydrated ? credits : "—"}</span>{" "}
          credits · Buy more
        </button>
      </PageHeader>

      <div className="space-y-3">
        {conversations.map((conv) => {
          const girl = getEntertainer(conv.entertainerId);
          if (!girl) return null;
          return (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="glass flex items-center gap-4 rounded-3xl p-4 transition hover:border-gold/40"
            >
              <div className="relative flex-shrink-0">
                <MockImage
                  hue={girl.hue}
                  label={girl.name}
                  className="h-14 w-14 rounded-full"
                />
                {girl.workingTonight ? (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-gold" title="Working tonight" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-lg text-bone">{girl.name}</p>
                  <span className="flex-shrink-0 text-[10px] uppercase tracking-wider text-muted">
                    {formatMessageTime(conv.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`truncate text-xs ${
                      conv.unread > 0 ? "font-semibold text-bone/90" : "text-muted"
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                  <span className="flex flex-shrink-0 items-center gap-1.5">
                    {conv.paid ? (
                      <span
                        className="rounded-full bg-gold/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold"
                        title="Paid conversation"
                      >
                        Paid
                      </span>
                    ) : null}
                    {conv.unread > 0 ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blood px-1.5 text-[10px] font-bold text-white">
                        {conv.unread}
                      </span>
                    ) : null}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Want to start a new conversation?{" "}
        <Link href="/girls" className="font-semibold text-gold hover:text-gold-bright">
          Browse the roster →
        </Link>
      </p>
    </div>
  );
}
