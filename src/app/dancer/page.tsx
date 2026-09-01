"use client";

import { useState } from "react";
import Link from "next/link";
import { getEntertainer } from "@/data/entertainers";
import { MOCK_DANCER_ID } from "@/data/liveRooms";
import { conversations } from "@/data/messages";
import PageHeader from "@/components/ui/PageHeader";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/store";

/**
 * Performer dashboard — represents a logged-in, approved entertainer.
 * Auth is mocked (MOCK_DANCER_ID); swap for a real performer session later.
 */
export default function DancerDashboardPage() {
  const { liveRooms, dancerEarnings, hydrated } = useApp();
  const [notifTips, setNotifTips] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);

  const girl = getEntertainer(MOCK_DANCER_ID)!;
  const room = liveRooms.find((r) => r.entertainerId === girl.id);
  const isLive = hydrated && !!room?.isLive;
  const unread = conversations.reduce((sum, c) => sum + c.unread, 0);
  // demo conversion for display only
  const earningsUsd = hydrated ? dancerEarnings * 0.2 : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Performer dashboard"
        title={`Hello, ${girl.name}`}
      />

      {/* status + go live */}
      <section className="glass relative mb-6 overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: isLive
              ? "radial-gradient(80% 100% at 50% 0%, rgba(193,20,48,0.18), transparent 70%)"
              : "radial-gradient(80% 100% at 50% 0%, rgba(212,169,78,0.12), transparent 70%)",
          }}
        />
        <div className="relative flex flex-wrap items-center gap-5">
          <MockImage
            hue={girl.hue}
            label={girl.name}
            className="h-16 w-16 rounded-full"
          />
          <div className="flex-1">
            <p className="eyebrow mb-1">Your stream</p>
            {isLive ? (
              <Badge variant="live" pulse>
                You&apos;re live
              </Badge>
            ) : (
              <Badge variant="muted">Offline</Badge>
            )}
          </div>
          <Button href="/dancer/live" size="lg" variant={isLive ? "blood" : "gold"}>
            {isLive ? "Manage Stream" : "Go Live"}
          </Button>
        </div>
      </section>

      {/* stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="glass rounded-3xl p-5 text-center">
          <p
            className="font-display text-3xl text-gold"
            suppressHydrationWarning
          >
            ${earningsUsd.toFixed(0)}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
            Today&apos;s earnings
          </p>
        </div>
        <div className="glass rounded-3xl p-5 text-center">
          <p
            className="font-display text-3xl text-gold"
            suppressHydrationWarning
          >
            {hydrated ? dancerEarnings : 0}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
            Tips (credits)
          </p>
        </div>
        <Link
          href="/messages"
          className="glass rounded-3xl p-5 text-center transition hover:border-gold/40"
        >
          <p className="font-display text-3xl text-gold">{unread}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
            Unread messages
          </p>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* schedule */}
        {girl.schedule?.length ? (
          <section className="glass rounded-3xl p-6">
            <p className="eyebrow mb-4">Your schedule</p>
            <ul className="space-y-2.5 text-sm">
              {girl.schedule?.map((s) => (
                <li
                  key={s.day}
                  className="flex justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0"
                >
                  <span className="text-bone/80">{s.day}</span>
                  <span className="font-semibold text-gold">{s.hours}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* settings */}
        <section className="glass rounded-3xl p-6">
          <p className="eyebrow mb-4">Settings</p>
          {[
            { label: "Notify followers when I go live", value: notifTips, toggle: () => setNotifTips((v) => !v) },
            { label: "New message alerts", value: notifMessages, toggle: () => setNotifMessages((v) => !v) },
          ].map((n) => (
            <button
              key={n.label}
              onClick={n.toggle}
              role="switch"
              aria-checked={n.value}
              className="flex w-full items-center justify-between border-b border-white/5 py-3 last:border-0"
            >
              <span className="text-left text-sm text-bone/85">{n.label}</span>
              <span
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
                  n.value ? "bg-gold" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-all ${
                    n.value ? "left-5.5" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          ))}
          <p className="mt-2 text-[10px] uppercase tracking-wider text-muted">
            Demo toggles — notifications not wired up
          </p>
        </section>
      </div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-muted">
        Demo performer login · payouts and auth are mocked
      </p>
    </div>
  );
}
