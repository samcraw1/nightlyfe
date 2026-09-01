"use client";

import { useState } from "react";
import type { Product } from "@/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import MockImage from "@/components/ui/MockImage";
import { formatMoney } from "@/lib/format";
import { toCartId } from "@/lib/cart";
import { useApp } from "@/lib/store";

/** Render with key={product.id} so the size selection resets per product. */
export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { cart, addToCart, removeFromCart, hydrated } = useApp();
  const [size, setSize] = useState(product.sizes[0]);
  const cartId = toCartId(product.id, size);
  const qty = hydrated ? cart.find((c) => c.id === cartId)?.qty ?? 0 : 0;

  return (
    <Modal open onClose={onClose} title={product.name}>
      <MockImage
        hue={product.hue}
        label={product.name}
        className="aspect-[2/1] w-full rounded-2xl"
      >
        <div className="absolute left-3 top-3">
          <Badge variant="muted">{product.category}</Badge>
        </div>
      </MockImage>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {product.description}
      </p>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-bone">
        Size
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              size === s
                ? "bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink"
                : "border border-gold/40 text-gold hover:bg-gold/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-display text-2xl text-gold">
          {formatMoney(product.price)}
        </span>
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeFromCart(cartId)}
              aria-label={`Remove one ${product.name}, size ${size}`}
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
              aria-label={`Add one more ${product.name}, size ${size}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/10"
            >
              +
            </button>
          </div>
        ) : null}
      </div>
      <Button className="mt-4 w-full" size="lg" onClick={() => addToCart(cartId)}>
        Add to Cart · {size}
      </Button>
    </Modal>
  );
}
