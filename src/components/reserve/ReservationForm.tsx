"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { arrivalTimes, reservationPackages, tableOptions } from "@/data/reserve";
import { venue } from "@/config/venue";
import { formatMoney, newId } from "@/lib/format";
import { useApp } from "@/lib/store";
import type { Reservation } from "@/types";

const steps = ["Night", "Table", "Contact", "Confirm"] as const;

export default function ReservationForm() {
  const { addReservation } = useApp();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Reservation | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState(arrivalTimes[1]);
  const [partySize, setPartySize] = useState(4);
  const [tableId, setTableId] = useState(tableOptions[1].id);
  const [packageId, setPackageId] = useState(reservationPackages[1].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const table = tableOptions.find((t) => t.id === tableId)!;
  const pack = reservationPackages.find((p) => p.id === packageId)!;
  const total = table.minimumSpend + pack.price;

  const canNext =
    step === 0 ? date !== "" : step === 2 ? name && phone && email : true;

  const submit = () => {
    const reservation: Reservation = {
      id: newId("res"),
      date,
      arrivalTime: time,
      partySize,
      tableId: table.id,
      tableName: table.name,
      packageId: pack.id === "none" ? null : pack.id,
      packageName: pack.id === "none" ? null : pack.name,
      total,
      name,
      phone,
      email,
      createdAt: new Date().toISOString(),
    };
    addReservation(reservation);
    setDone(reservation);
  };

  if (done) {
    return (
      <div className="glass fade-up rounded-3xl p-8 text-center sm:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-3xl">
          🥂
        </div>
        <p className="eyebrow mb-2">Reservation confirmed</p>
        <h2 className="gold-text font-display text-3xl sm:text-4xl">
          See you {new Date(done.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })} night
        </h2>
        <div className="mx-auto mt-6 max-w-sm space-y-2.5 text-left text-sm">
          {[
            ["Date", new Date(done.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })],
            ["Arrival", done.arrivalTime],
            ["Party", `${done.partySize} guests`],
            ["Table", done.tableName],
            ["Package", done.packageName ?? "None"],
            ["Minimum + package", formatMoney(done.total)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-white/5 pb-2.5">
              <span className="text-muted">{label}</span>
              <span className="font-semibold text-bone">{value}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted">
          A host will confirm by text at {done.phone}. Questions? Call{" "}
          {venue.phone}. (Demo — nothing was booked or charged.)
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button href="/account" variant="outline">
            View in Account
          </Button>
          <Button href="/">Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      {/* progress */}
      <ol className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={`h-1 w-full rounded-full transition ${
                i <= step ? "bg-gold" : "bg-white/10"
              }`}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                i === step ? "text-gold" : "text-muted"
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="space-y-5">
          <div>
            <label htmlFor="res-date" className="eyebrow mb-2 block">
              Date
            </label>
            <input
              id="res-date"
              type="date"
              value={date}
              min="2026-08-31"
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-bone focus:border-gold/50 focus:outline-none [color-scheme:dark]"
            />
          </div>
          <div>
            <span className="eyebrow mb-2 block">Arrival time</span>
            <div className="flex flex-wrap gap-2">
              {arrivalTimes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    time === t
                      ? "bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink"
                      : "border border-white/10 text-bone/70 hover:border-gold/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="eyebrow mb-2 block">Party size</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                aria-label="Fewer guests"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-xl text-bone transition hover:border-gold/40"
              >
                −
              </button>
              <span className="font-display w-16 text-center text-3xl text-gold">
                {partySize}
              </span>
              <button
                onClick={() => setPartySize((p) => Math.min(20, p + 1))}
                aria-label="More guests"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-xl text-bone transition hover:border-gold/40"
              >
                +
              </button>
              <span className="text-xs text-muted">guests</span>
            </div>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <div>
            <span className="eyebrow mb-3 block">Table / section</span>
            <div className="space-y-3">
              {tableOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTableId(t.id)}
                  className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                    tableId === t.id
                      ? "border-gold bg-gold/10"
                      : "border-white/10 hover:border-gold/40"
                  }`}
                >
                  <div>
                    <p className="font-display text-lg text-bone">{t.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {t.description}
                    </p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted">
                      Seats up to {t.seats}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{formatMoney(t.minimumSpend)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      minimum
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="eyebrow mb-3 block">Package</span>
            <div className="space-y-3">
              {reservationPackages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPackageId(p.id)}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                    packageId === p.id
                      ? "border-gold bg-gold/10"
                      : "border-white/10 hover:border-gold/40"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-bone">{p.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{p.description}</p>
                  </div>
                  <span className="font-bold text-gold">
                    {p.price === 0 ? "—" : `+${formatMoney(p.price)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          {[
            { id: "res-name", label: "Name", value: name, set: setName, type: "text", placeholder: "Full name" },
            { id: "res-phone", label: "Phone", value: phone, set: setPhone, type: "tel", placeholder: "(404) 555-0123" },
            { id: "res-email", label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@email.com" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="eyebrow mb-2 block">
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                value={f.value}
                placeholder={f.placeholder}
                onChange={(e) => f.set(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-gold/50 focus:outline-none"
              />
            </div>
          ))}
          <p className="text-xs text-muted">
            We only use this to confirm your reservation.
          </p>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3">
          <Badge variant="gold">Review your night</Badge>
          <div className="space-y-2.5 pt-2 text-sm">
            {[
              ["Date", date ? new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "—"],
              ["Arrival", time],
              ["Party", `${partySize} guests`],
              ["Table", `${table.name} (${formatMoney(table.minimumSpend)} min)`],
              ["Package", pack.price === 0 ? "None" : `${pack.name} (+${formatMoney(pack.price)})`],
              ["Contact", `${name} · ${phone}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-white/5 pb-2.5">
                <span className="text-muted">{label}</span>
                <span className="text-right font-semibold text-bone">{value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-1">
              <span className="font-bold uppercase tracking-wider text-bone">
                Estimated total
              </span>
              <span className="font-display text-2xl text-gold">
                {formatMoney(total)}
              </span>
            </div>
          </div>
          <p className="pt-1 text-xs text-muted">
            Minimum spend applies toward bottles and menu. No payment is taken
            now — this demo confirms instantly.
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
            ← Back
          </Button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
            Continue →
          </Button>
        ) : (
          <Button size="lg" onClick={submit}>
            Confirm Reservation
          </Button>
        )}
      </div>
    </div>
  );
}
