import { venue } from "@/config/venue";

/** Clubs with no verified pricing set `demo.hidePrices`, so every price reads "TBA". */
export function formatMoney(amount: number): string {
  if (venue.demo.hidePrices) return "TBA";
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
