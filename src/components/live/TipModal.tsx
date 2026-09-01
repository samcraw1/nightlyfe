"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { TIP_AMOUNTS } from "@/data/messages";
import { useApp } from "@/lib/store";

interface TipModalProps {
  open: boolean;
  onClose: () => void;
  entertainerName: string;
  /** Called after credits are spent; parent announces the tip in chat. */
  onTip: (amount: number) => void;
}

/** In-room tipping with preset and custom amounts. Demo credits only. */
export default function TipModal({
  open,
  onClose,
  entertainerName,
  onTip,
}: TipModalProps) {
  const { credits, spendCredits, addDancerEarnings, setBuyCreditsOpen } =
    useApp();
  const [custom, setCustom] = useState("");

  const sendTip = (amount: number) => {
    if (amount <= 0) return;
    if (!spendCredits(amount)) {
      onClose();
      setBuyCreditsOpen(true);
      return;
    }
    addDancerEarnings(amount);
    onTip(amount);
    setCustom("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Tip ${entertainerName}`}>
      <p className="mb-4 text-sm text-muted">
        Balance: <span className="font-bold text-gold">{credits}</span> credits
      </p>
      <div className="grid grid-cols-3 gap-3">
        {TIP_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => sendTip(amount)}
            className="glass rounded-2xl py-5 text-center transition hover:border-gold/50 hover:bg-gold/10"
          >
            <span className="font-display block text-2xl text-gold">
              {amount}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted">
              credits
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="number"
          min={1}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom amount"
          aria-label="Custom tip amount"
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-bone placeholder:text-muted focus:border-gold/50 focus:outline-none"
        />
        <Button
          onClick={() => sendTip(Math.floor(Number(custom)))}
          disabled={!custom || Number(custom) <= 0}
        >
          Tip
        </Button>
      </div>
      <button
        onClick={() => {
          onClose();
          setBuyCreditsOpen(true);
        }}
        className="mt-4 w-full text-center text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-bright"
      >
        Need more credits? Buy a pack →
      </button>
    </Modal>
  );
}
