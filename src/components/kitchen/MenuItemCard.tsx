"use client";

import type { MenuItem } from "@/types";
import MockImage from "@/components/ui/MockImage";
import { formatMoney } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { cart, addToCart, removeFromCart, hydrated } = useApp();
  const qty = hydrated ? cart.find((c) => c.id === item.id)?.qty ?? 0 : 0;

  return (
    <article className="glass flex gap-4 rounded-3xl p-4 transition hover:border-gold/40">
      <MockImage
        hue={item.hue}
        label={item.name}
        className="h-20 w-20 flex-shrink-0 rounded-2xl"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-bold text-bone">{item.name}</h3>
          <span className="flex-shrink-0 font-display text-lg text-gold">
            {formatMoney(item.price)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
          {item.description}
        </p>
        <div className="mt-2.5 flex items-center justify-end gap-2">
          {qty > 0 ? (
            <>
              <button
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove one ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/10"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-bold text-bone">
                {qty}
              </span>
            </>
          ) : null}
          <button
            onClick={() => addToCart(item.id)}
            aria-label={`Add ${item.name} to order`}
            className={`flex h-8 items-center justify-center rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
              qty > 0
                ? "w-8 border border-gold/40 text-gold hover:bg-gold/10"
                : "bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-4 text-ink hover:brightness-110"
            }`}
          >
            {qty > 0 ? "+" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
