export interface ScheduleEntry {
  day: string;
  hours: string;
}

export interface Entertainer {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  workingTonight: boolean;
  featured: boolean;
  followers: number;
  schedule: ScheduleEntry[];
  /** Number of gallery placeholder images to render on the profile. */
  galleryCount: number;
  /** Hue (0–360) used to generate this performer's placeholder art. */
  hue: number;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string; // ISO date
  doors: string;
  description: string;
  gaPrice: number;
  vipFromPrice: number;
  parkingPrice: number;
  featured: boolean;
  hue: number;
}

export interface Webcam {
  id: string;
  name: string;
  live: boolean;
  viewers: number;
  hue: number;
}

export interface Message {
  id: string;
  conversationId: string;
  from: "user" | "entertainer";
  text: string;
  sentAt: string; // ISO datetime
  isTip?: boolean;
  tipAmount?: number;
}

export interface Conversation {
  id: string;
  entertainerId: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  paid: boolean;
}

export interface TableOption {
  id: string;
  name: string;
  description: string;
  minimumSpend: number;
  seats: number;
}

export interface ReservationPackage {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Reservation {
  id: string;
  date: string;
  arrivalTime: string;
  partySize: number;
  tableId: string;
  tableName: string;
  packageId: string | null;
  packageName: string | null;
  total: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface TicketOrder {
  id: string;
  eventId: string;
  eventTitle: string;
  tickets: number;
  parking: boolean;
  total: number;
  createdAt: string;
}

export type MenuCategory = "Wings" | "Burgers" | "Entrees" | "Sides" | "Drinks";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  hue: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Shirts" | "Hats" | "Hoodies";
  hue: number;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export interface JobRole {
  id: string;
  title: string;
  blurb: string;
}
