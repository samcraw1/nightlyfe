"use client";

import type { Product } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatMoney } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, removeFromCart, hydrated } = useApp();
  const qty = hydrated ? cart.find((c) => c.id === product.id)?.qty ?? 0 : 0;

  return (
    <article className="glass group overflow-hidden rounded-3xl transition hover:border-gold/40">
      <MockImage
        hue={product.hue}
        label={product.name}
        className="aspect-square w-full transition duration-500 group-hover:scale-[1.03]"
      >
        <div className="absolute left-3 top-3">
          <Badge variant="muted">{product.category}</Badge>
        </div>
      </MockImage>
      <div className="p-4">
        <h3 className="text-sm font-bold text-bone">{product.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl text-gold">
            {formatMoney(product.price)}
          </span>
          <div className="flex items-center gap-2">
            {qty > 0 ? (
              <>
                <button
                  onClick={() => removeFromCart(product.id)}
                  aria-label={`Remove one ${product.name}`}
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
              </>
            ) : null}
            <button
              onClick={() => addToCart(product.id)}
              aria-label={`Add ${product.name} to cart`}
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
      </div>
    </article>
  );
}
