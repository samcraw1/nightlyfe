"use client";

import { useState } from "react";
import type { ClubEvent, TicketOrder } from "@/types";
import Button from "@/components/ui/Button";
import { venue } from "@/config/venue";
import { formatMoney, newId } from "@/lib/format";
import { useApp } from "@/lib/store";

type Selection = "tickets" | "parking" | "both";

export default function TicketCheckout({ event }: { event: ClubEvent }) {
  const { addTicketOrder } = useApp();
  const parkingAvailable = venue.features.parking;
  const [selection, setSelection] = useState<Selection>("tickets");
  const [qty, setQty] = useState(2);
  const [done, setDone] = useState<TicketOrder | null>(null);

  const wantsTickets = selection !== "parking";
  const wantsParking = parkingAvailable && selection !== "tickets";
  const total =
    (wantsTickets ? event.gaPrice * qty : 0) +
    (wantsParking ? event.parkingPrice : 0);

  const options: { id: Selection; label: string; detail: string }[] = [
    { id: "tickets", label: "Tickets", detail: `GA · ${formatMoney(event.gaPrice)} each` },
    { id: "parking", label: "Parking", detail: `Pre-paid lot · ${formatMoney(event.parkingPrice)}` },
    { id: "both", label: "Both", detail: "Tickets + parking together" },
  ];

  const checkout = () => {
    const order: TicketOrder = {
      id: newId("tix"),
      eventId: event.id,
      eventTitle: event.title,
      tickets: wantsTickets ? qty : 0,
      parking: wantsParking,
      total,
      createdAt: new Date().toISOString(),
    };
    addTicketOrder(order);
    setDone(order);
  };

  if (done) {
    return (
      <div className="glass fade-up rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
          🎟️
        </div>
        <p className="eyebrow mb-2">Order confirmed</p>
        <h3 className="font-display text-2xl text-bone">{done.eventTitle}</h3>
        <p className="mt-3 text-sm text-muted">
          {done.tickets > 0 ? `${done.tickets} GA ticket${done.tickets > 1 ? "s" : ""}` : null}
          {done.tickets > 0 && done.parking ? " + " : null}
          {done.parking ? "1 parking pass" : null}
          {" · "}
          <span className="font-bold text-gold">{formatMoney(done.total)}</span>
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted">
          Demo checkout — nothing was charged
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/account" variant="outline">
            My Tickets
          </Button>
          <Button href="/events">More Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6">
      <p className="eyebrow mb-4">Get in</p>
      <div className="space-y-3">
        {options
          .filter((o) => parkingAvailable || o.id === "tickets")
          .map((o) => (
            <button
              key={o.id}
              onClick={() => setSelection(o.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                selection === o.id
                  ? "border-gold bg-gold/10"
                  : "border-white/10 hover:border-gold/40"
              }`}
            >
              <span className="text-sm font-bold text-bone">{o.label}</span>
              <span className="text-xs text-muted">{o.detail}</span>
            </button>
          ))}
      </div>

      {wantsTickets ? (
        <div className="mt-5 flex items-center justify-between">
          <span className="eyebrow">Tickets</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Fewer tickets"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone transition hover:border-gold/40"
            >
              −
            </button>
            <span className="font-display w-8 text-center text-2xl text-gold">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              aria-label="More tickets"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone transition hover:border-gold/40"
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-bone">
          Total
        </span>
        <span className="font-display text-2xl text-gold">
          {formatMoney(total)}
        </span>
      </div>
      <Button className="mt-4 w-full" size="lg" onClick={checkout}>
        Checkout
      </Button>
      <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-muted">
        Demo only — no real payment
      </p>
    </div>
  );
}
