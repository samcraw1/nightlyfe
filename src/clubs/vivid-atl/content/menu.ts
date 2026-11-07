import type { MenuCategory, MenuItem } from "@/types";

/*
 * SAMPLE menu. Vivide's Instagram highlights confirm a Kitchen, a Bar, and
 * Hookah; these items and prices are placeholders to demonstrate ordering,
 * not the club's real menu.
 */

export const menuCategories: MenuCategory[] = ["Wings", "Entrees", "Sides", "Hookah", "Drinks"];

export const menuItems: MenuItem[] = [
  { id: "lemon-pepper-wings", name: "Lemon Pepper Wings", description: "Sample item. Wet or dry, extra sauce on the side.", price: 16, category: "Wings", hue: 48, sizes: [{ label: "6 pc", price: 11 }, { label: "10 pc", price: 16 }, { label: "20 pc", price: 29 }] },
  { id: "gold-wings", name: "Black Label Gold Wings", description: "Sample item. Honey-gold glaze, crispy finish.", price: 16, category: "Wings", hue: 40, sizes: [{ label: "6 pc", price: 11 }, { label: "10 pc", price: 16 }, { label: "20 pc", price: 29 }] },
  { id: "lamb-chops", name: "Lamb Chops", description: "Sample item. Grilled, served with a side.", price: 32, category: "Entrees", hue: 20 },
  { id: "salmon-bites", name: "Salmon Bites", description: "Sample item. Cajun-seasoned with dipping sauce.", price: 19, category: "Entrees", hue: 15 },
  { id: "tenders", name: "Chicken Tenders", description: "Sample item. Hand-breaded with your choice of sauce.", price: 14, category: "Entrees", hue: 38 },
  { id: "fries", name: "Seasoned Fries", description: "Sample item.", price: 7, category: "Sides", hue: 45, sizes: [{ label: "Regular", price: 7 }, { label: "Loaded", price: 12 }] },
  { id: "mac", name: "Mac & Cheese", description: "Sample item. Baked, three cheeses.", price: 9, category: "Sides", hue: 42 },
  { id: "hookah-classic", name: "Classic Hookah", description: "Sample item. Single flavor, served to your table.", price: 40, category: "Hookah", hue: 268 },
  { id: "hookah-signature", name: "Signature Twist Hookah", description: "Sample item. House flavor blend.", price: 50, category: "Hookah", hue: 285 },
  { id: "hookah-refill", name: "Hookah Refill", description: "Sample item. Fresh head, same flavor.", price: 20, category: "Hookah", hue: 250 },
  { id: "the-twist", name: "The Twist", description: "Sample item. Signature cocktail, ask your server.", price: 15, category: "Drinks", hue: 270 },
  { id: "champagne-pour", name: "Champagne by the Glass", description: "Sample item.", price: 18, category: "Drinks", hue: 48 },
  { id: "water", name: "Still / Sparkling Water", description: "Sample item.", price: 5, category: "Drinks", hue: 200 },
];
