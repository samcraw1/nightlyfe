/**
 * The shared cart in store.tsx only holds `{ id, qty }`, so size variants are
 * encoded into the id itself ("logo-tee-black::M"). Plain ids (no "::") are
 * legacy entries with no size and still resolve to the base item.
 */

const SEPARATOR = "::";

export function toCartId(itemId: string, size?: string): string {
  return size ? `${itemId}${SEPARATOR}${size}` : itemId;
}

export function parseCartId(cartId: string): { itemId: string; size?: string } {
  const sep = cartId.indexOf(SEPARATOR);
  if (sep === -1) return { itemId: cartId };
  return { itemId: cartId.slice(0, sep), size: cartId.slice(sep + SEPARATOR.length) };
}
