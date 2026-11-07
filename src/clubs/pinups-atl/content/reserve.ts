import type { ReservationPackage, TableOption } from "@/types";

/* SAMPLE sections and pricing for the demo booking flow — not real Pin Ups prices. */

export const tableOptions: TableOption[] = [
  { id: "floor", name: "Floor Table", description: "Reserved table near the action with dedicated server.", minimumSpend: 150, seats: 4 },
  { id: "vip", name: "VIP Section", description: "Private section with bottle service and a personal host.", minimumSpend: 350, seats: 8 },
  { id: "stage-side", name: "Stage-Side Section", description: "Front-row seating on the main stage, premium bottle menu.", minimumSpend: 600, seats: 10 },
];

export const reservationPackages: ReservationPackage[] = [
  { id: "none", name: "Section Only", description: "Order from the menu when you arrive.", price: 0 },
  { id: "pink", name: "Pink Package", description: "1 premium bottle, mixers, and a wings platter.", price: 200 },
  { id: "neon", name: "Neon Package", description: "2 premium bottles, hookah for the table, and a food spread.", price: 425 },
];

export const arrivalTimes = ["1:00 PM", "4:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"];
