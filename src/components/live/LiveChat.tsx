"use client";

import { useEffect, useRef, useState } from "react";
import { newId } from "@/lib/format";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  self?: boolean;
}

const seed: ChatMessage[] = [
  { id: "c1", user: "ATLnights", text: "Sapphire killing it tonight 🔥" },
  { id: "c2", user: "goldmember", text: "who's on after this set?" },
  { id: "c3", user: "vip_mike", text: "Jade at midnight, come thru" },
  { id: "c4", user: "peachtree404", text: "that lighting is crazy" },
  { id: "c5", user: "latenite", text: "kitchen still open?? 👀" },
];

const ambient: Omit<ChatMessage, "id">[] = [
  { user: "ATLnights", text: "🔥🔥🔥" },
  { user: "midtown_j", text: "just got a table for saturday" },
  { user: "goldmember", text: "DJ Smooth going crazy rn" },
  { user: "vip_mike", text: "🥂" },
  { user: "peachtree404", text: "front row is the only row" },
];

/** Lightweight demo chat — messages are local only. */
export default function LiveChat({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setMessages((prev) => [
        ...prev.slice(-40),
        { ...ambient[i % ambient.length], id: newId("chat") },
      ]);
      i++;
    }, 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: newId("chat"), user: "you", text, self: true },
    ]);
    setDraft("");
  };

  return (
    <div className={`glass flex flex-col rounded-3xl ${className}`}>
      <div className="border-b border-white/5 px-5 py-3.5">
        <p className="eyebrow">Live chat</p>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4"
      >
        {messages.map((m) => (
          <p key={m.id} className="text-xs leading-relaxed">
            <span
              className={`mr-1.5 font-bold ${
                m.self ? "text-gold" : "text-bone/50"
              }`}
            >
              {m.user}
            </span>
            <span className="text-bone/85">{m.text}</span>
          </p>
        ))}
      </div>
      <div className="flex gap-2 border-t border-white/5 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Say something…"
          aria-label="Chat message"
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-bone placeholder:text-muted focus:border-gold/50 focus:outline-none"
        />
        <button
          onClick={send}
          className="rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink transition hover:brightness-110"
        >
          Send
        </button>
      </div>
    </div>
  );
}
