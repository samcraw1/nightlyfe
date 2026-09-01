"use client";

import { useState } from "react";
import { products } from "@/data/shop";
import { venue } from "@/config/venue";
import type { Product } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/shop/ProductCard";
import ProductModal from "@/components/shop/ProductModal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import { parseCartId } from "@/lib/cart";
import { useApp } from "@/lib/store";

/**
 * Optional merch module — remove this route (and the "merch" feature flag
 * in src/config/venue.ts) to drop the shop entirely.
 */
export default function ShopPage() {
  const { cart, removeFromCart, hydrated } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState<number | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  // The cart is shared with the Kitchen — resolve ids through the products
  // list and drop anything that isn't merch, mirroring the Kitchen page.
  const cartDetails = hydrated
    ? cart
        .map((c) => {
          const { itemId, size } = parseCartId(c.id);
          return { ...c, size, product: products.find((p) => p.id === itemId) };
        })
        .filter((c) => c.product)
    : [];
  const cartCount = cartDetails.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cartDetails.reduce(
    (sum, c) => sum + c.qty * (c.product?.price ?? 0),
    0
  );

  // Only clear merch — the cart array is shared with the Kitchen, so a
  // shop checkout must leave any pending food order untouched.
  const clearShopItems = () => {
    for (const c of cartDetails) {
      for (let i = 0; i < c.qty; i++) removeFromCart(c.id);
    }
  };

  const checkout = () => {
    setOrdered(cartTotal);
    clearShopItems();
  };

  if (!venue.features.merch) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-bone">
          The shop isn&apos;t open at this venue.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <PageHeader
        eyebrow="Wear the crest"
        title="Shop"
        description={`Official ${venue.name} merch — printed in small runs, gone when it's gone.`}
      />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={setSelected} />
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        Demo shop — orders are pretend and nothing is ever charged.
      </p>

      {/* floating cart bar */}
      {cartCount > 0 ? (
        <div className="fixed inset-x-4 bottom-20 z-40 mx-auto max-w-md md:bottom-6">
          <button
            onClick={() => setCartOpen(true)}
            className="glass-strong flex w-full items-center justify-between rounded-full px-6 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition hover:border-gold/50"
          >
            <span
              suppressHydrationWarning
              className="text-xs font-bold uppercase tracking-wider text-bone"
            >
              View cart · {cartCount} item{cartCount > 1 ? "s" : ""}
            </span>
            <span suppressHydrationWarning className="font-display text-xl text-gold">
              {formatMoney(cartTotal)}
            </span>
          </button>
        </div>
      ) : null}

      {/* product detail / size chooser */}
      {selected ? (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}

      {/* cart modal */}
      <Modal
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          setOrdered(null);
        }}
        title={ordered !== null ? "Order confirmed" : "Your Cart"}
      >
        {ordered !== null ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
              🛍️
            </div>
            <p className="font-display text-2xl text-bone">
              {formatMoney(ordered)} — order placed
            </p>
            <p className="mt-2 text-sm text-muted">
              Pick up your merch at the door tonight.
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-muted">
              Demo order — nothing was charged
            </p>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                setCartOpen(false);
                setOrdered(null);
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-72 space-y-3 overflow-y-auto">
              {cartDetails.map((c) => (
                <div key={c.id} className="flex justify-between text-sm">
                  <span className="text-bone/85">
                    {c.qty}× {c.product!.name}
                    {c.size ? ` · ${c.size}` : ""}
                  </span>
                  <span className="font-semibold text-gold">
                    {formatMoney(c.qty * c.product!.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-bone">
                Total
              </span>
              <span className="font-display text-2xl text-gold">
                {formatMoney(cartTotal)}
              </span>
            </div>
            <Button className="mt-4 w-full" size="lg" onClick={checkout}>
              Check Out
            </Button>
            <button
              onClick={clearShopItems}
              className="mt-3 w-full text-center text-xs uppercase tracking-wider text-muted transition hover:text-blood"
            >
              Clear cart
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
