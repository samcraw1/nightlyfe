"use client";

import type { Product } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatMoney } from "@/lib/format";
import { parseCartId } from "@/lib/cart";
import { useApp } from "@/lib/store";

export default function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const { cart, hydrated } = useApp();
  const qty = hydrated
    ? cart
        .filter((c) => parseCartId(c.id).itemId === product.id)
        .reduce((sum, c) => sum + c.qty, 0)
    : 0;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onClick={() => onSelect(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(product);
        }
      }}
      className="glass group cursor-pointer overflow-hidden rounded-3xl transition hover:border-gold/40 focus-visible:border-gold/60 focus-visible:outline-none"
    >
      <MockImage
        hue={product.hue}
        label={product.name}
        className="aspect-square w-full transition duration-500 group-hover:scale-[1.03]"
      >
        <div className="absolute left-3 top-3">
          <Badge variant="muted">{product.category}</Badge>
        </div>
        {qty > 0 ? (
          <span
            suppressHydrationWarning
            className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-1.5 text-xs font-bold text-ink"
          >
            {qty}
          </span>
        ) : null}
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
          <span className="flex h-8 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-4 text-[11px] font-bold uppercase tracking-wider text-ink transition group-hover:brightness-110">
            Add
          </span>
        </div>
      </div>
    </article>
  );
}
