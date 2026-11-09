import { img } from "./sources";

/* Production concepts. All "proposed": no production at Bibs is verified. */
export const production = {
  note: "Concept imagery. These are not productions filmed at Bibs Playhouse.",
  tiles: [
    { title: "Music Video Production", blurb: "A club-ready set with lighting, haze and an on-call crowd for performance scenes.", image: img("video-camera") },
    { title: "Photoshoot Sessions", blurb: "Neon walls, shadow and texture for editorials, cover art and brand content.", image: img("neon-portrait") },
    { title: "Venue Rental", blurb: "Daytime and off-night access for shoots, screenings, launches and rehearsals.", image: img("crew-dark") },
    { title: "Creative Collaborations", blurb: "Artists, photographers and brands partnering on nights and content.", image: img("studio") },
    { title: "Production Inquiries", blurb: "Tell us the concept, the crew size and the call time. We'll shape the room around it.", image: img("clapper") },
  ],
};

export const vip = {
  image: img("lounge"),
  tiles: [
    { title: "VIP Inquiries", blurb: "Reserved sections with a dedicated host. Sections are already promoted for Bibs nights." },
    { title: "Private Celebrations", blurb: "Your guest list, your music, your room." },
    { title: "Birthday Packages", blurb: "Section, signage and a moment at midnight." },
    { title: "Group Reservations", blurb: "One booking for the whole crew, arrivals handled." },
    { title: "Special Occasions", blurb: "Release parties, anniversaries, send-offs and more." },
  ],
};
