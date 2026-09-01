import type { Metadata } from "next";
import { products } from "@/data/shop";
import { venue } from "@/config/venue";
import PageHeader from "@/components/ui/PageHeader";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Shop" };

/**
 * Optional merch module — remove this route (and the "merch" feature flag
 * in src/config/venue.ts) to drop the shop entirely.
 */
export default function ShopPage() {
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Wear the crest"
        title="Shop"
        description={`Official ${venue.name} merch — printed in small runs, gone when it's gone.`}
      />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className="glass group overflow-hidden rounded-3xl transition hover:border-gold/40"
          >
            <MockImage
              hue={p.hue}
              label={p.name}
              className="aspect-square w-full transition duration-500 group-hover:scale-[1.03]"
            >
              <div className="absolute left-3 top-3">
                <Badge variant="muted">{p.category}</Badge>
              </div>
            </MockImage>
            <div className="p-4">
              <h3 className="text-sm font-bold text-bone">{p.name}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-muted">
                {p.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-xl text-gold">
                  {formatMoney(p.price)}
                </span>
                <span className="rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold transition group-hover:bg-gold/10">
                  Coming soon
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        Online checkout launches soon — merch is available at the door tonight.
      </p>
    </div>
  );
}
