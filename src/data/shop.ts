import type { Product } from "@/types";

const APPAREL_SIZES = ["S", "M", "L", "XL"];
const ONE_SIZE = ["One Size"];

export const products: Product[] = [
  { id: "logo-tee-black", name: "ONYX Logo Tee", description: "Heavyweight black tee, gold foil crest.", price: 35, category: "Shirts", hue: 42, sizes: APPAREL_SIZES },
  { id: "after-dark-tee", name: "After Dark Tee", description: "Tonal print, oversized fit.", price: 38, category: "Shirts", hue: 270, sizes: APPAREL_SIZES },
  { id: "snapback", name: "Gold Crest Snapback", description: "Black snapback with embroidered gold crest.", price: 30, category: "Hats", hue: 38, sizes: ONE_SIZE },
  { id: "dad-hat", name: "After Dark Dad Hat", description: "Washed black, low profile, red under-brim.", price: 28, category: "Hats", hue: 352, sizes: ONE_SIZE },
  { id: "club-hoodie", name: "ONYX Club Hoodie", description: "14oz fleece, gold drawcords, back print.", price: 65, category: "Hoodies", hue: 45, sizes: APPAREL_SIZES },
  { id: "midnight-hoodie", name: "Midnight Zip Hoodie", description: "Full zip, minimal chest hit, deep hood.", price: 70, category: "Hoodies", hue: 230, sizes: APPAREL_SIZES },
];
