import type { ReservationPackage, TableOption } from "@/types";

export const tableOptions: TableOption[] = [
  {
    id: "standard",
    name: "Standard Table",
    description: "Reserved floor table for your group with dedicated cocktail service.",
    minimumSpend: 150,
    seats: 4,
  },
  {
    id: "vip",
    name: "VIP Section",
    description: "Elevated section overlooking the main stage. Bottle service included, personal host.",
    minimumSpend: 350,
    seats: 6,
  },
  {
    id: "premium",
    name: "Premium Section",
    description: "The best seats in the house — stage-side, private security, premium bottle menu.",
    minimumSpend: 750,
    seats: 10,
  },
];

export const reservationPackages: ReservationPackage[] = [
  {
    id: "none",
    name: "No Package",
    description: "Table only — order from the menu when you arrive.",
    price: 0,
  },
  {
    id: "gold",
    name: "Gold Package",
    description: "1 premium bottle, mixers, and a wings platter for the table.",
    price: 200,
  },
  {
    id: "platinum",
    name: "Platinum Package",
    description: "2 premium bottles, champagne toast, full appetizer spread, sparklers on arrival.",
    price: 450,
  },
];

export const arrivalTimes = [
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
  "12:00 AM",
];
