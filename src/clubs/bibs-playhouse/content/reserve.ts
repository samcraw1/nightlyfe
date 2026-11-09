import type { ReservationPackage, TableOption } from "@/types";

/*
 * SAMPLE section options for the generic /reserve flow. "Sections available"
 * is promoted for Bibs nights; names and sizes here are placeholders and
 * `demo.hidePrices` renders every amount as "TBA".
 */
export const tableOptions: TableOption[] = [
  { id: "section", name: "Reserved Section", description: "A section for your group with a host.", minimumSpend: 0, seats: 8 },
  { id: "celebration", name: "Celebration Section", description: "Birthdays and special occasions.", minimumSpend: 0, seats: 12 },
];

export const reservationPackages: ReservationPackage[] = [
  { id: "none", name: "Section Only", description: "Discuss extras with your host.", price: 0 },
];

export const arrivalTimes = ["TBA — confirmed by your host"];
