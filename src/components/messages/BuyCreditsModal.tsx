"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { creditPackages } from "@/data/messages";
import { formatMoney } from "@/lib/format";
import { useApp } from "@/lib/store";

/**
 * Demo purchase flow — adds credits to local state only. Replace the
 * confirm handler with a real payment provider checkout later.
 */
export default function BuyCreditsModal() {
  const { buyCreditsOpen, setBuyCreditsOpen, addCredits, credits } = useApp();
  const [selected, setSelected] = useState(creditPackages[1].id);
  const [confirmed, setConfirmed] = useState<number | null>(null);

  const close = () => {
    setBuyCreditsOpen(false);
    setConfirmed(null);
  };

  const pack = creditPackages.find((p) => p.id === selected)!;

  return (
    <Modal open={buyCreditsOpen} onClose={close} title="Buy Credits">
      {confirmed !== null ? (
        <div className="py-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
            🥂
          </div>
          <p className="font-display text-2xl text-bone">
            +{confirmed} credits added
          </p>
          <p className="mt-2 text-sm text-muted">
            New balance: <span className="font-bold text-gold">{credits}</span>{" "}
            credits
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-wider text-muted">
            Demo purchase — no payment was processed
          </p>
          <Button className="mt-6 w-full" onClick={close}>
            Done
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">
            Credits unlock messages and tips. Current balance:{" "}
            <span className="font-bold text-gold">{credits}</span>
          </p>
          <div className="space-y-3">
            {creditPackages.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`relative flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  selected === p.id
                    ? "border-gold bg-gold/10"
                    : "border-white/10 hover:border-gold/40"
                }`}
              >
                <div>
                  <p className="font-display text-xl text-bone">
                    {p.credits} credits
                  </p>
                  {p.popular ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                      Most popular
                    </span>
                  ) : null}
                </div>
                <span className="text-lg font-bold text-gold">
                  {formatMoney(p.price)}
                </span>
              </button>
            ))}
          </div>
          <Button
            className="mt-5 w-full"
            size="lg"
            onClick={() => {
              addCredits(pack.credits);
              setConfirmed(pack.credits);
            }}
          >
            Buy {pack.credits} for {formatMoney(pack.price)}
          </Button>
          <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-muted">
            Demo only — no real payment
          </p>
        </>
      )}
    </Modal>
  );
}
