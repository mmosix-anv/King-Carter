/*
 * King & Carter — Curated Atlanta Experiences
 * Content source: king-carter-experiences brochure + client revision document.
 * Pricing figures are the client's real numbers.
 * Pickup language: "preferred location" (not limited to hotels/airports).
 * The Digital Experience Guide is included with every experience.
 *
 * NOTE: kingLegacy, carterLeadership and atlantaArts currently point at the
 * closest existing site photography. Swap in the commissioned location shots
 * (MLK Historic Park, The Carter Center, Atlanta galleries) when available.
 */
export const ASSETS = {
  hero: "/images/hero-escalade.webp",
  interior: "/images/experience-interior.jpg",
  celebration: "/images/events-diverse.webp",
  kingLegacy: "/images/about-hero.webp",
  carterLeadership: "/images/contact-concierge.webp",
  atlantaArts: "/images/about-theater.webp",
  nightOut: "/images/about-lifestyle.webp",
} as const;

export const LINKS = {
  reserve: "/reservations",
  concierge: "/contact",
  brochureSite: "https://brochure.kingandcarter.com",
  email: "mailto:info@kingandcarter.com",
} as const;

export interface Experience {
  id: string;
  numeral: string;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
  overview: string;
  whyUnique: string;
  itineraryLabel: string;
  itinerary: string[];
  duration: string;
  pickup: string;
  guests: string;
  included: string[];
  notIncluded: string[];
  investment: string;
  investmentNote?: string;
  enhancements: string[];
  enhancementNote: string;
}

const ENHANCEMENT_NOTE =
  "Optional concierge enhancements and premium experiences are available upon request. Additional fees may apply depending on selections.";

const PICKUP =
  "Complimentary pickup from your designated location within the Atlanta service area";

export const experiences: Experience[] = [
  {
    id: "king-legacy",
    numeral: "No. I",
    title: "The King Legacy Experience",
    tagline:
      "Walk in the footsteps of Dr. Martin Luther King Jr. through the landmarks that shaped a movement.",
    image: ASSETS.kingLegacy,
    imageAlt: "Atlanta at golden hour, the city that shaped a movement",
    overview:
      "Walk in the footsteps of Dr. Martin Luther King Jr. through the neighborhoods that shaped a movement. A deeply moving journey through Atlanta's most sacred civil rights landmarks, guided with reverence, comfort, and grace.",
    whyUnique:
      "This is not a tour. It is a pilgrimage conducted at your pace. Your private chauffeur carries you between hallowed sites while your concierge arranges timed entries and reservations, so every moment is given to reflection rather than logistics.",
    itineraryLabel: "Experience Highlights",
    itinerary: [
      "Pickup from guest's preferred location",
      "Martin Luther King Jr. National Historic Park",
      "Martin Luther King Jr.'s Birth Home",
      "Ebenezer Baptist Church",
      "The King Center",
      "Optional lunch or dinner reservation",
      "Chauffeur return to guest's preferred location",
    ],
    duration: "Approximately 4 Hours",
    pickup: PICKUP,
    guests: "1 to 6 guests, larger parties by arrangement",
    included: [
      "Private luxury SUV and professional chauffeur",
      "Concierge itinerary coordination",
      "Digital King & Carter Experience Guide",
      "Complimentary bottled water",
      "Flexible pacing at every stop",
    ],
    notIncluded: ["Museum admission fees", "Meals and gratuities for dining"],
    investment: "Starting at $600",
    enhancements: [
      "Reserved dining at a celebrated Atlanta restaurant",
      "Private guide for deeper historical context",
      "Extended itinerary including Sweet Auburn district",
    ],
    enhancementNote: ENHANCEMENT_NOTE,
  },
  {
    id: "carter-leadership",
    numeral: "No. II",
    title: "The Carter Leadership Experience",
    tagline:
      "An inspiring half-day devoted to leadership, diplomacy, and a life of service.",
    image: ASSETS.carterLeadership,
    imageAlt: "A quiet club lounge, portraits and conversation over cocktails",
    overview:
      "An inspiring half-day devoted to leadership, diplomacy, and a life of service. Explore the legacy of President Jimmy Carter amid tranquil gardens and world-changing ideas, a graceful reflection on what it means to lead with purpose.",
    whyUnique:
      "Few experiences pair world history with such serenity. Between the Presidential Library and the gardens of The Carter Center, your chauffeur weaves a scenic drive through Atlanta's most graceful neighborhoods, unhurried, private, and quietly profound.",
    itineraryLabel: "Experience Highlights",
    itinerary: [
      "Pickup from guest's preferred location",
      "Jimmy Carter Presidential Library and Museum",
      "Scenic Atlanta drive",
      "Optional lunch reservation",
      "Chauffeur return to guest's preferred location",
    ],
    duration: "Approximately 4 Hours",
    pickup: PICKUP,
    guests: "1 to 6 guests, ideal for executives and delegations",
    included: [
      "Private luxury SUV and professional chauffeur",
      "Concierge itinerary coordination",
      "Digital King & Carter Experience Guide",
      "Complimentary bottled water",
      "Scenic route through historic Atlanta",
    ],
    notIncluded: ["Museum admission fees", "Meals and gratuities for dining"],
    investment: "Starting at $600",
    enhancements: [
      "Curated lunch reservation with garden views",
      "Corporate and leadership group itineraries",
      "Combined King and Carter full-day legacy journey",
    ],
    enhancementNote: ENHANCEMENT_NOTE,
  },
  {
    id: "atlanta-arts",
    numeral: "No. III",
    title: "The Atlanta Arts Experience",
    tagline:
      "A private passage through Atlanta's flourishing art scene, at a pace entirely your own.",
    image: ASSETS.atlantaArts,
    imageAlt: "A grand Atlanta hall beneath a crystal chandelier",
    overview:
      "A private passage through Atlanta's flourishing art scene, from refined Buckhead galleries to the creative pulse of West Midtown and Castleberry Hill. Discover works you will not find anywhere else, at a pace entirely your own.",
    whyUnique:
      "Your itinerary is composed around your taste, whether contemporary, classical, or collectible. Through our local partnerships, doors open to private studios and installations that the public rarely sees, with every gallery visit arranged in advance.",
    itineraryLabel: "Possible Stops",
    itinerary: [
      "Buckhead galleries",
      "West Midtown art district",
      "Castleberry Hill",
      "Private artist studios",
      "Sculpture installations",
    ],
    duration: "Tailored to you",
    pickup: PICKUP,
    guests: "1 to 4 guests, intimate by design",
    included: [
      "Private luxury SUV and professional chauffeur",
      "Gallery visits arranged in advance",
      "Concierge itinerary composed to your taste",
      "Digital King & Carter Experience Guide",
      "Complimentary bottled water",
    ],
    notIncluded: ["Artwork purchases", "Meals and refreshments"],
    investment: "$450 to $600",
    investmentNote:
      "Final investment is based on your customized itinerary, experience length, and selected destinations.",
    enhancements: [
      "Private curator accompaniment",
      "Art purchasing assistance",
      "A wine or coffee interlude between districts",
    ],
    enhancementNote: ENHANCEMENT_NOTE,
  },
  {
    id: "atlanta-night-out",
    numeral: "No. IV",
    title: "The Atlanta Night Out Experience",
    tagline:
      "An evening composed like a fine tasting menu. Atlanta after dark, entirely yours.",
    image: ASSETS.nightOut,
    imageAlt: "Candlelit fine dining in an Atlanta restaurant",
    overview:
      "An evening composed like a fine tasting menu. From celebrated dining rooms to hidden speakeasies and rooftop lounges above the glittering skyline, this is Atlanta after dark, elegant, indulgent, and entirely yours.",
    whyUnique:
      "The perfect date night or celebration. Every reservation is secured, every transition chauffeured, every venue chosen for the moment. You simply savor the evening while we hold the thread of the night together.",
    itineraryLabel: "The Evening Unfolds",
    itinerary: [
      "Pickup from guest's preferred location",
      "Cocktails or lounge experience",
      "Fine dining reservation",
      "Dessert, rooftop lounge, or evening destination",
      "Chauffeur return",
    ],
    duration: "Approximately 4 to 5 Hours",
    pickup: PICKUP,
    guests: "1 to 6 guests",
    included: [
      "Private luxury SUV and professional chauffeur",
      "Priority reservations at each venue",
      "Concierge-designed evening itinerary",
      "Digital King & Carter Experience Guide",
      "Complimentary bottled water",
    ],
    notIncluded: ["Dining, beverages, and gratuities at venues"],
    investment: "$600 to $750",
    investmentNote:
      "Final pricing depends on the selected itinerary, reservations, and overall experience.",
    enhancements: [
      "Champagne welcome in the vehicle",
      "Anniversary and proposal arrangements",
      "Late-night skyline drive finale",
    ],
    enhancementNote: ENHANCEMENT_NOTE,
  },
];

export interface BespokeCard {
  title: string;
  description: string;
}

export const bespokeIdeas: BespokeCard[] = [
  {
    title: "Weekend Retreats",
    description:
      "Full weekend getaways, from vineyard tours to coastal escapes, with every mile chauffeured.",
  },
  {
    title: "Cultural Evenings",
    description:
      "Concerts, gallery openings, and theatre premieres with coordinated arrivals and seamless departures.",
  },
  {
    title: "Bespoke Celebrations",
    description:
      "Anniversary surprises, proposal logistics, and milestone moments designed around your vision.",
  },
];
