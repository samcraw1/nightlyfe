import type { Product } from "@/types";

/* SAMPLE merch concepts — not existing Pin Ups products. */
const APPAREL_SIZES = ["S", "M", "L", "XL", "2XL"];
const ONE_SIZE = ["One Size"];

export const products: Product[] = [
  { id: "neon-logo-tee", name: "Neon Script Tee", description: "Concept item. Black tee with the glowing Pin Ups script.", price: 35, category: "Shirts", hue: 325, sizes: APPAREL_SIZES },
  { id: "five-dollar-tee", name: "Home of $5 Dances Tee", description: "Concept item. Retro marquee print.", price: 35, category: "Shirts", hue: 290, sizes: APPAREL_SIZES },
  { id: "since-1991-tee", name: "Since 1991 Tee", description: "Concept item. Vintage-wash heritage tee.", price: 38, category: "Shirts", hue: 20, sizes: APPAREL_SIZES },
  { id: "neon-snapback", name: "Neon Snapback", description: "Concept item. Embroidered pink script.", price: 30, category: "Hats", hue: 330, sizes: ONE_SIZE },
  { id: "pinups-hoodie", name: "Pin Ups Hoodie", description: "Concept item. Heavy fleece, back print.", price: 65, category: "Hoodies", hue: 275, sizes: APPAREL_SIZES },
];
