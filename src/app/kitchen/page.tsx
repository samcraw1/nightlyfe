"use client";

import { useState } from "react";
import { menuCategories, menuItems, getMenuItem } from "@/data/menu";
import type { MenuCategory } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import MenuItemCard from "@/components/kitchen/MenuItemCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function KitchenPage() {
  const { cart, clearCart, hydrated } = useApp();
  const [category, setCategory] = useState<MenuCategory>("Wings");
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState<number | null>(null);

  const items = menuItems.filter((m) => m.category === category);
  const cartDetails = hydrated
    ? cart
        .map((c) => ({ ...c, item: getMenuItem(c.id) }))
        .filter((c) => c.item)
    : [];
  const cartCount = cartDetails.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cartDetails.reduce(
    (sum, c) => sum + c.qty * (c.item?.price ?? 0),
    0
  );

  const checkout = () => {
    setOrdered(cartTotal);
    clearCart();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
      <PageHeader
        eyebrow="Open until 2:30AM"
        title="The Kitchen"
        description="Late-night food done right. Order to your table or the bar."
      />

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {menuCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition ${
              category === c
                ? "bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink"
                : "border border-white/10 text-bone/60 hover:border-gold/40 hover:text-gold"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* floating cart bar */}
      {cartCount > 0 ? (
        <div className="fixed inset-x-4 bottom-20 z-40 mx-auto max-w-md md:bottom-6">
          <button
            onClick={() => setCartOpen(true)}
            className="glass-strong flex w-full items-center justify-between rounded-full px-6 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition hover:border-gold/50"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-bone">
              View order · {cartCount} item{cartCount > 1 ? "s" : ""}
            </span>
            <span className="font-display text-xl text-gold">
              {formatMoney(cartTotal)}
            </span>
          </button>
        </div>
      ) : null}

      {/* cart modal */}
      <Modal
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          setOrdered(null);
        }}
        title={ordered !== null ? "Order confirmed" : "Your Order"}
      >
        {ordered !== null ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
              🍽️
            </div>
            <p className="font-display text-2xl text-bone">
              {formatMoney(ordered)} — on the way
            </p>
            <p className="mt-2 text-sm text-muted">
              A server will bring your order to your table.
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
                    {c.qty}× {c.item!.name}
                  </span>
                  <span className="font-semibold text-gold">
                    {formatMoney(c.qty * c.item!.price)}
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
              Place Order
            </Button>
            <button
              onClick={clearCart}
              className="mt-3 w-full text-center text-xs uppercase tracking-wider text-muted transition hover:text-blood"
            >
              Clear order
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
