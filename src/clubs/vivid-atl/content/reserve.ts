import type { ReservationPackage, TableOption } from "@/types";

/*
 * SAMPLE sections and pricing for the demo booking flow — not real Vivide
 * prices. Vivide's flyers route VIP sections through a phone line and a
 * promoter (see `vip` in ../index.ts); this flow shows the self-serve version.
 */

export const tableOptions: TableOption[] = [
  { id: "lounge", name: "Lounge Table", description: "Reserved table with a dedicated server.", minimumSpend: 250, seats: 4 },
  { id: "vip", name: "VIP Section", description: "Private section, bottle service, and a personal host.", minimumSpend: 500, seats: 8 },
  { id: "upstairs", name: "Upstairs Section", description: "Elevated section overlooking the main floor, premium bottle menu.", minimumSpend: 1000, seats: 12 },
];

export const reservationPackages: ReservationPackage[] = [
  { id: "none", name: "Section Only", description: "Order from the menu when you arrive.", price: 0 },
  { id: "black-label", name: "Black Label", description: "1 premium bottle, mixers, and a wings platter.", price: 300 },
  { id: "the-twist", name: "The Twist", description: "2 premium bottles, hookah for the table, and a sparkler presentation.", price: 650 },
  { id: "celebration", name: "Celebration", description: "3 bottles, hookah, food spread, and a hosted birthday entrance.", price: 1100 },
];

export const arrivalTimes = ["12:00 PM", "4:00 PM", "8:00 PM", "10:00 PM", "11:00 PM", "12:00 AM", "1:00 AM"];
