"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { venue } from "@/config/venue";
import { entertainers } from "@/data/entertainers";
import { conversations } from "@/data/messages";
import PageHeader from "@/components/ui/PageHeader";
import MockImage from "@/components/ui/MockImage";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CoinIcon } from "@/components/layout/icons";
import { useApp } from "@/lib/store";
import { formatMoney } from "@/lib/format";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/** Demo account — the "logged in" user is mocked. */
const mockUser = {
  name: "Sam C.",
  memberSince: "August 2026",
  tier: "Gold Member",
};

export default function AccountPage() {
  const {
    hydrated,
    credits,
    favorites,
    reservations,
    ticketOrders,
    setBuyCreditsOpen,
  } = useApp();
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      // one-time read of a browser API that isn't available during SSR
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInstalled(true);
    }
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const favGirls = entertainers.filter((e) => favorites.includes(e.id));
  const unread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <PageHeader eyebrow="Your night, saved" title="Account" />

      {/* profile */}
      <section className="glass mb-6 flex items-center gap-4 rounded-3xl p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep font-display text-2xl text-ink">
          {mockUser.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-display text-2xl text-bone">{mockUser.name}</p>
          <p className="text-xs text-muted">
            Member since {mockUser.memberSince}
          </p>
        </div>
        <Badge variant="gold">{mockUser.tier}</Badge>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* credits */}
        <section className="glass rounded-3xl p-6">
          <p className="eyebrow mb-3">Credit balance</p>
          <div className="flex items-center gap-3">
            <CoinIcon className="h-8 w-8 text-gold" />
            <span
              className="font-display text-4xl text-gold"
              suppressHydrationWarning
            >
              {hydrated ? credits : "—"}
            </span>
            <span className="text-xs uppercase tracking-wider text-muted">
              credits
            </span>
          </div>
          <div className="mt-4 flex gap-3">
            <Button size="sm" onClick={() => setBuyCreditsOpen(true)}>
              Buy Credits
            </Button>
            <Button size="sm" variant="outline" href="/messages">
              Messages{unread > 0 ? ` (${unread})` : ""}
            </Button>
          </div>
        </section>

        {/* notifications */}
        <section className="glass rounded-3xl p-6">
          <p className="eyebrow mb-4">Notifications</p>
          {[
            { label: "Event announcements", value: notifEvents, toggle: () => setNotifEvents((v) => !v) },
            { label: "New messages", value: notifMessages, toggle: () => setNotifMessages((v) => !v) },
          ].map((n) => (
            <button
              key={n.label}
              onClick={n.toggle}
              role="switch"
              aria-checked={n.value}
              className="flex w-full items-center justify-between border-b border-white/5 py-3 last:border-0"
            >
              <span className="text-sm text-bone/85">{n.label}</span>
              <span
                className={`relative h-6 w-11 rounded-full transition ${
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
            Demo toggles — push notifications not wired up
          </p>
        </section>
      </div>

      {/* favorites */}
      <section className="mt-6">
        <p className="eyebrow mb-4">Favorites</p>
        {hydrated && favGirls.length > 0 ? (
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {favGirls.map((girl) => (
              <Link
                key={girl.id}
                href={`/girls/${girl.id}`}
                className="glass w-36 flex-shrink-0 overflow-hidden rounded-3xl transition hover:border-gold/40"
              >
                <MockImage
                  hue={girl.hue}
                  label={girl.name}
                  className="aspect-square w-full"
                />
                <div className="p-3 text-center">
                  <p className="font-display text-sm text-bone">{girl.name}</p>
                  {girl.workingTonight ? (
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gold">
                      Tonight
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-6 text-center">
            <p className="text-sm text-muted">
              No favorites yet —{" "}
              <Link href="/girls" className="font-semibold text-gold">
                browse the roster
              </Link>{" "}
              and tap the heart.
            </p>
          </div>
        )}
      </section>

      {/* reservations + tickets */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="glass rounded-3xl p-6">
          <p className="eyebrow mb-4">Reservations</p>
          {hydrated && reservations.length > 0 ? (
            <ul className="space-y-3">
              {reservations.map((r) => (
                <li key={r.id} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-bone">{r.tableName}</p>
                    <span className="font-semibold text-gold">
                      {formatMoney(r.total)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(r.date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {r.arrivalTime} · {r.partySize} guests
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              Nothing booked.{" "}
              <Link href="/reserve" className="font-semibold text-gold">
                Reserve a table →
              </Link>
            </p>
          )}
        </section>

        <section className="glass rounded-3xl p-6">
          <p className="eyebrow mb-4">Tickets</p>
          {hydrated && ticketOrders.length > 0 ? (
            <ul className="space-y-3">
              {ticketOrders.map((t) => (
                <li key={t.id} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-bone">{t.eventTitle}</p>
                    <span className="font-semibold text-gold">
                      {formatMoney(t.total)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {t.tickets > 0 ? `${t.tickets} GA` : null}
                    {t.tickets > 0 && t.parking ? " + " : null}
                    {t.parking ? "parking" : null}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              No tickets yet.{" "}
              <Link href="/events" className="font-semibold text-gold">
                See what&apos;s coming →
              </Link>
            </p>
          )}
        </section>
      </div>

      {/* install */}
      <section className="glass mt-6 rounded-3xl p-6">
        <p className="eyebrow mb-3">Install the app</p>
        {installed ? (
          <p className="text-sm text-muted">
            You&apos;re running the installed app. Welcome home. 🖤
          </p>
        ) : (
          <>
            <p className="text-sm text-muted">
              Add {venue.name} to your home screen for the full-screen
              experience — live streams, messages, and reservations one tap
              away.
            </p>
            {installEvent ? (
              <Button
                className="mt-4"
                onClick={async () => {
                  await installEvent.prompt();
                  setInstallEvent(null);
                }}
              >
                Install {venue.name}
              </Button>
            ) : (
              <p className="mt-3 text-xs text-muted">
                On iPhone: tap <span className="text-bone">Share</span> →{" "}
                <span className="text-bone">Add to Home Screen</span>. On
                Android/desktop Chrome: use the install icon in the address
                bar.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
