import type { PlayhouseBooking } from "@/clubs/types";

/** FICTIONAL inquiries and analytics for the /admin-demo dashboard. */
function daysAgo(n: number, h = 14): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
}
function inDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const seedBookings: PlayhouseBooking[] = [
  { id: "BK-7Q2LM", category: "music-video", name: "Jordan Example", phone: "(501) 555-0141", email: "jordan@example.com", date: inDays(9), guests: "11–25", details: "Performance scenes for a single. Need haze and a crowd for 2 hours.", requests: "Load-in at 6 PM", status: "new", receivedAt: daysAgo(0, 10) },
  { id: "BK-3MD8A", category: "private-event", name: "Taylor Sample", phone: "(501) 555-0188", email: "taylor@example.com", date: inDays(16), guests: "26–50", details: "30th birthday, would like two sections.", status: "contacted", receivedAt: daysAgo(1) },
  { id: "BK-K91XZ", category: "photoshoot", name: "Avery Demo", phone: "(501) 555-0102", email: "avery@example.com", date: inDays(4), guests: "1–10", details: "Album cover shoot, neon look.", status: "confirmed", receivedAt: daysAgo(2) },
  { id: "BK-P0VW4", category: "venue-rental", name: "Morgan Placeholder", phone: "(501) 555-0163", email: "morgan@example.com", date: inDays(22), guests: "51–100", details: "Brand launch, daytime rental.", status: "new", receivedAt: daysAgo(3) },
  { id: "BK-ZZ19C", category: "general", name: "Casey Fictional", phone: "(501) 555-0177", email: "casey@example.com", date: inDays(2), guests: "11–25", details: "Section for Saturday?", status: "declined", receivedAt: daysAgo(4) },
  { id: "BK-H44RE", category: "private-event", name: "Riley Example", phone: "(501) 555-0119", email: "riley@example.com", date: inDays(30), guests: "51–100", details: "Company holiday party buyout.", status: "contacted", receivedAt: daysAgo(6) },
  { id: "BK-M2T7N", category: "music-video", name: "Quinn Sample", phone: "(501) 555-0150", email: "quinn@example.com", date: inDays(13), guests: "1–10", details: "Small crew, 3 setups, overnight.", status: "new", receivedAt: daysAgo(7) },
];

export const analytics = {
  visits30d: 18420,
  visitsTrend: [420, 480, 455, 510, 620, 890, 940, 470, 500, 530, 560, 700, 980, 1010, 520, 540, 610, 590, 760, 1120, 1180, 560, 600, 640, 650, 820, 1230, 1290, 610, 680],
  conversionRate: 2.4,
  popularServices: [
    { label: "Private Events", value: 142 },
    { label: "General / Sections", value: 118 },
    { label: "Music Video Shoots", value: 64 },
    { label: "Photoshoots", value: 51 },
    { label: "Venue Rental", value: 33 },
  ],
  eventEngagement: [
    { label: "Saturday Night Takeover", value: 3240 },
    { label: "Birthday Bash Night", value: 2110 },
    { label: "Special Guest Appearance", value: 1870 },
    { label: "Friday Night Playhouse", value: 1520 },
  ],
  trafficSources: [
    { label: "Instagram", value: 46 },
    { label: "Threads", value: 18 },
    { label: "Direct", value: 21 },
    { label: "Search", value: 15 },
  ],
};
