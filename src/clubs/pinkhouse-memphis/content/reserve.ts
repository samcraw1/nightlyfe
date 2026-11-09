import type { ReservationPackage, TableOption } from "@/types";

/*
 * SAMPLE VIP options for the demo booking flow. No pricing has been
 * published, so `demo.hidePrices` renders every amount as "TBA".
 */

export const tableOptions: TableOption[] = [
  { id: "vip-section", name: "VIP Section", description: "Private section with dedicated service.", minimumSpend: 0, seats: 8 },
  { id: "premium-section", name: "Premium Section", description: "Larger section closer to the action.", minimumSpend: 0, seats: 12 },
  { id: "celebration", name: "Celebration Section", description: "Birthdays and special occasions, with a hosted presentation.", minimumSpend: 0, seats: 15 },
];

export const reservationPackages: ReservationPackage[] = [
  { id: "none", name: "Section Only", description: "Discuss bottles and extras with your host.", price: 0 },
];

export const arrivalTimes = ["TBA — confirmed by your host"];
