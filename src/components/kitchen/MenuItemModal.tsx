"use client";

import { useState } from "react";
import type { MenuItem } from "@/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import MockImage from "@/components/ui/MockImage";
import { formatMoney } from "@/lib/format";
import { toCartId } from "@/lib/cart";
import { useApp } from "@/lib/store";

/** Render with key={item.id} so the portion selection resets per item. */
export default function MenuItemModal({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const { cart, addToCart, removeFromCart, hydrated } = useApp();
  const [size, setSize] = useState(item.sizes?.[0]);
  const cartId = toCartId(item.id, size?.label);
  const price = size?.price ?? item.price;
  const qty = hydrated ? cart.find((c) => c.id === cartId)?.qty ?? 0 : 0;

  return (
    <Modal open onClose={onClose} title={item.name}>
      <MockImage
        hue={item.hue}
        label={item.name}
        className="aspect-[2/1] w-full rounded-2xl"
      />
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {item.description}
      </p>

      {item.sizes ? (
        <>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-bone">
            Size
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.sizes.map((s) => (
              <button
                key={s.label}
                onClick={() => setSize(s)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  size?.label === s.label
                    ? "bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink"
                    : "border border-gold/40 text-gold hover:bg-gold/10"
                }`}
              >
                {s.label} · {formatMoney(s.price)}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-display text-2xl text-gold">
          {formatMoney(price)}
        </span>
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeFromCart(cartId)}
              aria-label={`Remove one ${item.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/10"
            >
              −
            </button>
            <span
              suppressHydrationWarning
              className="w-5 text-center text-sm font-bold text-bone"
            >
              {qty}
            </span>
            <button
              onClick={() => addToCart(cartId)}
              aria-label={`Add one more ${item.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/10"
            >
              +
            </button>
          </div>
        ) : null}
      </div>
      <Button className="mt-4 w-full" size="lg" onClick={() => addToCart(cartId)}>
        Add to Order{size ? ` · ${size.label}` : ""}
      </Button>
    </Modal>
  );
}
