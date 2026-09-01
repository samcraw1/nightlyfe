"use client";

import { useState } from "react";
import type { Entertainer } from "@/types";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { HeartIcon } from "@/components/layout/icons";
import { TIP_AMOUNTS } from "@/data/messages";
import { useApp } from "@/lib/store";
import { newId } from "@/lib/format";

/** Follow/favorite, message, and tip controls for a performer profile. */
export default function GirlProfileActions({ girl }: { girl: Entertainer }) {
  const { isFavorite, toggleFavorite, hydrated, credits, spendCredits, addMessage, setBuyCreditsOpen } =
    useApp();
  const [tipOpen, setTipOpen] = useState(false);
  const [tipped, setTipped] = useState<number | null>(null);
  const fav = hydrated && isFavorite(girl.id);

  const sendTip = (amount: number) => {
    if (!spendCredits(amount)) {
      setTipOpen(false);
      setBuyCreditsOpen(true);
      return;
    }
    addMessage({
      id: newId("msg"),
      conversationId: `conv-${girl.id}`,
      from: "user",
      text: `Sent a tip 🥂`,
      sentAt: new Date().toISOString(),
      isTip: true,
      tipAmount: amount,
    });
    setTipped(amount);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant={fav ? "blood" : "outline"}
          onClick={() => toggleFavorite(girl.id)}
          aria-pressed={fav}
        >
          <HeartIcon className="h-4 w-4" filled={fav} />
          {fav ? "Following" : "Follow"}
        </Button>
        <Button href={`/messages/conv-${girl.id}`}>Message</Button>
        <Button
          variant="outline"
          onClick={() => {
            setTipped(null);
            setTipOpen(true);
          }}
        >
          Tip
        </Button>
      </div>

      <Modal
        open={tipOpen}
        onClose={() => setTipOpen(false)}
        title={`Tip ${girl.name}`}
      >
        {tipped !== null ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
              💛
            </div>
            <p className="font-display text-2xl text-bone">
              {tipped} credits sent
            </p>
            <p className="mt-2 text-sm text-muted">
              {girl.name} will see your tip in your conversation.
            </p>
            <Button className="mt-6 w-full" onClick={() => setTipOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">
              Balance: <span className="font-bold text-gold">{credits}</span>{" "}
              credits
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
            <button
              onClick={() => {
                setTipOpen(false);
                setBuyCreditsOpen(true);
              }}
              className="mt-4 w-full text-center text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-bright"
            >
              Need more credits? Buy a pack →
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
