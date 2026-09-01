import type { MenuCategory, MenuItem } from "@/types";

export const menuCategories: MenuCategory[] = [
  "Wings",
  "Burgers",
  "Entrees",
  "Sides",
  "Drinks",
];

export const menuItems: MenuItem[] = [
  // Wings
  { id: "lemon-pepper-wings", name: "Lemon Pepper Wet", description: "10 wings, Atlanta's finest, extra sauce on the side.", price: 16, category: "Wings", hue: 48 },
  { id: "honey-gold-wings", name: "Honey Gold Wings", description: "10 wings tossed in the house honey-gold glaze.", price: 16, category: "Wings", hue: 38 },
  { id: "buffalo-wings", name: "Classic Buffalo", description: "10 wings, ranch or blue cheese, celery.", price: 15, category: "Wings", hue: 10 },
  { id: "jerk-wings", name: "Jerk Wings", description: "10 smoked jerk wings with mango dip.", price: 17, category: "Wings", hue: 90 },
  // Burgers
  { id: "onyx-burger", name: "The ONYX Burger", description: "Double smash patty, gold sauce, brioche, applewood bacon.", price: 18, category: "Burgers", hue: 25 },
  { id: "midnight-melt", name: "Midnight Melt", description: "Patty melt on Texas toast with caramelized onions.", price: 16, category: "Burgers", hue: 32 },
  { id: "crispy-chicken", name: "Crispy Chicken Sandwich", description: "Buttermilk fried chicken, hot honey, pickles.", price: 15, category: "Burgers", hue: 40 },
  // Entrees
  { id: "lamb-chops", name: "Gold Dust Lamb Chops", description: "Four grilled chops with chimichurri and fries.", price: 34, category: "Entrees", hue: 15 },
  { id: "salmon", name: "Bourbon Glazed Salmon", description: "Pan-seared salmon over garlic mash.", price: 26, category: "Entrees", hue: 20 },
  { id: "shrimp-pasta", name: "Cajun Shrimp Pasta", description: "Blackened shrimp, creamy cajun alfredo.", price: 24, category: "Entrees", hue: 5 },
  { id: "steak-frites", name: "Late Night Steak Frites", description: "10oz NY strip, gold butter, truffle fries.", price: 38, category: "Entrees", hue: 355 },
  // Sides
  { id: "truffle-fries", name: "Truffle Parmesan Fries", description: "Hand cut, truffle oil, shaved parm.", price: 9, category: "Sides", hue: 45 },
  { id: "mac", name: "Five-Cheese Mac", description: "Baked with a toasted crust.", price: 10, category: "Sides", hue: 35 },
  { id: "fried-okra", name: "Fried Okra", description: "Cornmeal crusted with comeback sauce.", price: 8, category: "Sides", hue: 95 },
  { id: "loaded-tots", name: "Loaded Tots", description: "Bacon, cheddar, scallion, sour cream.", price: 11, category: "Sides", hue: 28 },
  // Drinks
  { id: "gold-fashioned", name: "Gold Fashioned", description: "House old fashioned with gold-leaf garnish.", price: 16, category: "Drinks", hue: 42 },
  { id: "peachtree-punch", name: "Peachtree Punch", description: "Georgia peach, rum, champagne float.", price: 14, category: "Drinks", hue: 22 },
  { id: "red-room", name: "Red Room", description: "Hibiscus, tequila, lime — served flaming.", price: 15, category: "Drinks", hue: 352 },
  { id: "club-water", name: "Still / Sparkling Water", description: "Because pacing yourself is premium too.", price: 5, category: "Drinks", hue: 200 },
];

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((m) => m.id === id);
}
