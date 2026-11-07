import type { MenuCategory, MenuItem } from "@/types";

/*
 * SAMPLE menu. The club's site shows food and hookah; these items and prices
 * are placeholders to demonstrate ordering, not the real menu.
 */

export const menuCategories: MenuCategory[] = ["Wings", "Entrees", "Sides", "Hookah", "Drinks"];

export const menuItems: MenuItem[] = [
  { id: "lemon-pepper-wings", name: "Lemon Pepper Wings", description: "Sample item. Wet or dry, extra sauce on the side.", price: 15, category: "Wings", hue: 48, sizes: [{ label: "6 pc", price: 10 }, { label: "10 pc", price: 15 }, { label: "20 pc", price: 27 }] },
  { id: "hot-honey-wings", name: "Hot Honey Wings", description: "Sample item. Sweet heat, crispy skin.", price: 15, category: "Wings", hue: 30, sizes: [{ label: "6 pc", price: 10 }, { label: "10 pc", price: 15 }, { label: "20 pc", price: 27 }] },
  { id: "philly", name: "Philly Cheesesteak", description: "Sample item. Shaved steak, peppers, onions, melted provolone.", price: 16, category: "Entrees", hue: 25 },
  { id: "shrimp-basket", name: "Fried Shrimp Basket", description: "Sample item. Golden shrimp with fries and cocktail sauce.", price: 18, category: "Entrees", hue: 15 },
  { id: "chicken-tenders", name: "Chicken Tenders", description: "Sample item. Hand-breaded with your choice of sauce.", price: 13, category: "Entrees", hue: 38 },
  { id: "fries", name: "Seasoned Fries", description: "Sample item.", price: 6, category: "Sides", hue: 45, sizes: [{ label: "Regular", price: 6 }, { label: "Large", price: 9 }] },
  { id: "mozz-sticks", name: "Mozzarella Sticks", description: "Sample item. With marinara.", price: 9, category: "Sides", hue: 40 },
  { id: "hookah-classic", name: "Classic Hookah", description: "Sample item. Single flavor, served to your table.", price: 35, category: "Hookah", hue: 195 },
  { id: "hookah-signature", name: "Signature Mix Hookah", description: "Sample item. House flavor blend.", price: 45, category: "Hookah", hue: 280 },
  { id: "hookah-refill", name: "Hookah Refill", description: "Sample item. Fresh head, same flavor.", price: 20, category: "Hookah", hue: 210 },
  { id: "pink-lemonade", name: "Pink Neon Lemonade", description: "Sample item. Vodka, pink lemonade, a little sparkle.", price: 13, category: "Drinks", hue: 330 },
  { id: "peach-crown", name: "Georgia Peach Shot", description: "Sample item. Peach whiskey, chilled.", price: 10, category: "Drinks", hue: 25 },
  { id: "water", name: "Still / Sparkling Water", description: "Sample item.", price: 4, category: "Drinks", hue: 200 },
];
